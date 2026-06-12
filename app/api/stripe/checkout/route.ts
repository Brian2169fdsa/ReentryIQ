import { NextResponse } from 'next/server'
import {
  getStripe,
  stripeConfigured,
  appUrl,
  loadPlans,
  subscriptionLookupKey,
  overageLookupKey,
  PLAN_IDS,
  type PlanId,
  type BillingInterval,
} from '@/lib/stripe'

export const dynamic = 'force-dynamic'

/**
 * POST /api/stripe/checkout
 * Body: { org_id, plan: 'starter'|'pro'|'enterprise', interval: 'monthly'|'annual' }
 *
 * Creates a subscription Checkout Session with two line items:
 *   - the licensed monthly/annual base price (quantity 1)
 *   - the metered overage price (no quantity — usage reported by cron)
 *
 * Secrets: STRIPE_SECRET_KEY (via getStripe). Returns { url }.
 * 503 when Stripe unset; 400 on bad plan/org/interval.
 */
export async function POST(req: Request) {
  if (!stripeConfigured()) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 503 })
  }
  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 503 })
  }

  let body: { org_id?: unknown; plan?: unknown; interval?: unknown }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const orgId = typeof body.org_id === 'string' ? body.org_id : ''
  const plan = body.plan as PlanId
  const interval = body.interval as BillingInterval

  if (!orgId) {
    return NextResponse.json({ error: 'org_id is required' }, { status: 400 })
  }
  if (!PLAN_IDS.includes(plan)) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }
  if (interval !== 'monthly' && interval !== 'annual') {
    return NextResponse.json({ error: 'Invalid interval' }, { status: 400 })
  }

  // Validate the plan exists in entitlements (DB-backed, hardcoded fallback).
  const plans = await loadPlans()
  if (!plans[plan]) {
    return NextResponse.json({ error: 'Unknown plan' }, { status: 400 })
  }

  const baseKey = subscriptionLookupKey(plan, interval)
  const overageKey = overageLookupKey(plan)

  try {
    // Resolve both prices by lookup_key — provisioned by scripts/setup-stripe.mjs.
    const [baseList, overageList] = await Promise.all([
      stripe.prices.list({ lookup_keys: [baseKey], active: true, limit: 1 }),
      stripe.prices.list({ lookup_keys: [overageKey], active: true, limit: 1 }),
    ])
    const basePrice = baseList.data[0]
    const overagePrice = overageList.data[0]

    if (!basePrice || !overagePrice) {
      return NextResponse.json(
        { error: 'Stripe prices are not provisioned — run scripts/setup-stripe.mjs' },
        { status: 503 },
      )
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        { price: basePrice.id, quantity: 1 },
        { price: overagePrice.id }, // metered — no quantity
      ],
      client_reference_id: orgId,
      metadata: { org_id: orgId, plan },
      subscription_data: { metadata: { org_id: orgId, plan } },
      success_url: `${appUrl()}/admin?billing=success`,
      cancel_url: `${appUrl()}/pricing`,
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Stripe did not return a checkout URL' }, { status: 502 })
    }
    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe checkout failed'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
