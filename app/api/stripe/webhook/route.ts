import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe, stripeConfigured, getServiceSupabase, type PlanId } from '@/lib/stripe'

export const dynamic = 'force-dynamic'
// Webhook bodies must be read raw for signature verification.
export const runtime = 'nodejs'

/**
 * POST /api/stripe/webhook — Stripe → Supabase sync (source of truth).
 *
 * Secrets:
 *   - STRIPE_SECRET_KEY      (via getStripe) — to construct/verify the event
 *   - STRIPE_WEBHOOK_SECRET  — signing secret for constructEvent
 *
 * Idempotency: every event.id is inserted into public.stripe_events FIRST.
 * A unique-violation (Postgres 23505) means we've already processed this event,
 * so we return 200 { received, duplicate } without re-applying side effects.
 *
 * 400 on a bad/missing signature; 200 on handled (or intentionally ignored).
 */
export async function POST(req: Request) {
  if (!stripeConfigured()) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 503 })
  }
  const stripe = getStripe()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET // STRIPE_WEBHOOK_SECRET
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 503 })
  }

  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  // App Router: read the raw body as text for signature verification.
  const rawBody = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature'
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 })
  }

  const svc = getServiceSupabase()

  // Idempotency gate: claim the event id before doing any work.
  const { error: insertErr } = await svc
    .from('stripe_events')
    .insert({ id: event.id, type: event.type })
  if (insertErr) {
    // 23505 = unique_violation → already processed; ack without re-applying.
    if ((insertErr as { code?: string }).code === '23505') {
      return NextResponse.json({ received: true, duplicate: true })
    }
    return NextResponse.json({ error: insertErr.message }, { status: 500 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        await handleCheckoutCompleted(svc, stripe, event.data.object as Stripe.Checkout.Session)
        break
      }
      case 'customer.subscription.updated': {
        await handleSubscriptionUpdated(svc, event.data.object as Stripe.Subscription)
        break
      }
      case 'customer.subscription.deleted': {
        await handleSubscriptionDeleted(svc, event.data.object as Stripe.Subscription)
        break
      }
      case 'invoice.payment_failed': {
        await handlePaymentFailed(svc, event.data.object as Stripe.Invoice)
        break
      }
      default:
        // Unhandled types are still recorded in stripe_events; just ack.
        break
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook handler error'
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

type Svc = ReturnType<typeof getServiceSupabase>

/** Write an audit_log row for a handled Stripe event (best-effort). */
async function audit(svc: Svc, eventType: string, orgId: string | null) {
  await svc.from('audit_log').insert({
    org_id: orgId,
    action: `stripe:${eventType}`,
    target: orgId,
  })
}

/** Derive the plan id from a price's lookup_key prefix ('pro_monthly' → 'pro'). */
function planFromLookupKey(lookupKey: string | null | undefined): PlanId | null {
  if (!lookupKey) return null
  const prefix = lookupKey.split('_')[0]
  if (prefix === 'starter' || prefix === 'pro' || prefix === 'enterprise') return prefix
  return null
}

async function handleCheckoutCompleted(
  svc: Svc,
  stripe: Stripe,
  session: Stripe.Checkout.Session,
) {
  const orgId =
    session.client_reference_id || (session.metadata?.org_id as string | undefined) || null
  if (!orgId) return

  const plan = (session.metadata?.plan as PlanId | undefined) ?? undefined
  const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id
  const subscriptionId =
    typeof session.subscription === 'string' ? session.subscription : session.subscription?.id

  const patch: Record<string, string> = { status: 'active' }
  if (plan) patch.plan = plan
  if (customerId) patch.stripe_customer_id = customerId
  if (subscriptionId) patch.stripe_subscription_id = subscriptionId

  await svc.from('orgs').update(patch).eq('id', orgId)
  await audit(svc, 'checkout.session.completed', orgId)
  void stripe // reserved for future enrichment; keeps signature uniform
}

/** Map a Stripe subscription status to our orgs.status enum. */
function mapStatus(status: Stripe.Subscription.Status): string | null {
  switch (status) {
    case 'active':
      return 'active'
    case 'trialing':
      return 'trialing'
    case 'past_due':
    case 'unpaid':
      return 'past_due'
    case 'canceled':
      return 'canceled'
    default:
      return null
  }
}

async function handleSubscriptionUpdated(svc: Svc, sub: Stripe.Subscription) {
  const { data: org } = await svc
    .from('orgs')
    .select('id')
    .eq('stripe_subscription_id', sub.id)
    .maybeSingle()
  if (!org) return

  const patch: Record<string, string> = {}
  const mapped = mapStatus(sub.status)
  if (mapped) patch.status = mapped

  // Update plan from the licensed (non-metered) price's lookup_key prefix.
  const licensedItem = sub.items.data.find(
    (item) => item.price.recurring?.usage_type !== 'metered',
  )
  const plan = planFromLookupKey(licensedItem?.price.lookup_key)
  if (plan) patch.plan = plan

  if (Object.keys(patch).length > 0) {
    await svc.from('orgs').update(patch).eq('id', org.id)
  }
  await audit(svc, 'customer.subscription.updated', org.id as string)
}

async function handleSubscriptionDeleted(svc: Svc, sub: Stripe.Subscription) {
  const { data: org } = await svc
    .from('orgs')
    .select('id')
    .eq('stripe_subscription_id', sub.id)
    .maybeSingle()
  if (!org) return
  await svc.from('orgs').update({ status: 'canceled' }).eq('id', org.id)
  await audit(svc, 'customer.subscription.deleted', org.id as string)
}

async function handlePaymentFailed(svc: Svc, invoice: Stripe.Invoice) {
  const customerId =
    typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id
  if (!customerId) return
  const { data: org } = await svc
    .from('orgs')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .maybeSingle()
  if (!org) return
  await svc.from('orgs').update({ status: 'past_due' }).eq('id', org.id)
  await audit(svc, 'invoice.payment_failed', org.id as string)
}
