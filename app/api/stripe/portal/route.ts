import { NextResponse } from 'next/server'
import { getStripe, stripeConfigured, getServiceSupabase, supabaseConfigured, appUrl } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

/**
 * POST /api/stripe/portal
 * Body: { org_id }
 *
 * Opens a Stripe Billing Portal session for the org's existing customer so they
 * can manage payment methods, invoices, and cancellation. Supabase is the source
 * of truth for the stripe_customer_id (set by the webhook on checkout completion).
 *
 * Secrets: STRIPE_SECRET_KEY (getStripe), SUPABASE_SERVICE_ROLE_KEY (service client).
 * Returns { url }. 503 when Stripe unset; 400 on bad org / no customer.
 */
export async function POST(req: Request) {
  if (!stripeConfigured()) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 503 })
  }
  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 503 })
  }
  if (!supabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase is not configured' }, { status: 503 })
  }

  let body: { org_id?: unknown }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const orgId = typeof body.org_id === 'string' ? body.org_id : ''
  if (!orgId) {
    return NextResponse.json({ error: 'org_id is required' }, { status: 400 })
  }

  const svc = getServiceSupabase()
  const { data: org, error } = await svc
    .from('orgs')
    .select('stripe_customer_id')
    .eq('id', orgId)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  const customerId = org?.stripe_customer_id as string | null | undefined
  if (!customerId) {
    return NextResponse.json({ error: 'Org has no Stripe customer' }, { status: 400 })
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appUrl()}/admin`,
    })
    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe portal failed'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
