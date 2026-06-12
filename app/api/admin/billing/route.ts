import { NextResponse } from 'next/server'
import {
  configured, requireAdmin, serviceClient, currentPeriod,
  DEMO_ORGS, DEMO_PLANS, mrrCents, countRevealsInPeriod,
  PLANS, type PlanEntitlement,
} from '../_lib'

export const dynamic = 'force-dynamic'

export interface BillingPayload {
  total_mrr_cents: number
  by_tier: { plan: string; subs: number; mrr_cents: number }[]
  past_due: { id: string; name: string; plan: string }[]
  past_due_count: number
  overage_revenue_cents: number
  period: string
  source: 'live' | 'demo'
}

function compute(
  orgs: { id: string; name: string; plan: string; status: string; interval: 'monthly' | 'annual' }[],
  plans: Map<string, PlanEntitlement>,
  revealCount: Map<string, number>,
  period: string,
  source: 'live' | 'demo',
): BillingPayload {
  let totalMrr = 0
  let overage = 0
  const tier = new Map<string, { subs: number; mrr: number }>()
  for (const p of PLANS) tier.set(p, { subs: 0, mrr: 0 })
  const pastDue: BillingPayload['past_due'] = []

  for (const o of orgs) {
    const plan = plans.get(o.plan)
    const mrr = mrrCents(plan, o.status, o.interval)
    totalMrr += mrr
    const t = tier.get(o.plan)
    if (t && (o.status === 'active' || o.status === 'trialing' || o.status === 'past_due')) {
      t.subs += 1
      t.mrr += mrr
    }
    if (o.status === 'past_due') pastDue.push({ id: o.id, name: o.name, plan: o.plan })

    const reveals = revealCount.get(o.id) ?? 0
    const included = plan?.included_records ?? 0
    const over = Math.max(0, reveals - included)
    overage += over * (plan?.overage_price_cents ?? 0)
  }

  return {
    total_mrr_cents: totalMrr,
    by_tier: PLANS.map(p => ({ plan: p, subs: tier.get(p)!.subs, mrr_cents: tier.get(p)!.mrr })),
    past_due: pastDue,
    past_due_count: pastDue.length,
    overage_revenue_cents: overage,
    period,
    source,
  }
}

export async function GET() {
  const period = currentPeriod()

  if (!configured()) {
    const plans = new Map(Object.entries(DEMO_PLANS))
    const revealCount = new Map(DEMO_ORGS.map(o => [o.id, countRevealsInPeriod(o.reveals, period)]))
    const orgs = DEMO_ORGS.map(o => ({ id: o.id, name: o.name, plan: o.plan, status: o.status, interval: o.interval }))
    return NextResponse.json(compute(orgs, plans, revealCount, period, 'demo'))
  }

  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const svc = await serviceClient()
  const [orgsRes, plansRes, revealsRes] = await Promise.all([
    svc.from('orgs').select('id, name, plan, status, settings'),
    svc.from('plan_entitlements').select('plan, included_records, overage_price_cents, seats, features, price_monthly_cents, price_annual_cents'),
    svc.from('record_reveals').select('org_id').eq('period', period),
  ])
  if (orgsRes.error) return NextResponse.json({ error: orgsRes.error.message }, { status: 500 })

  const plans = new Map<string, PlanEntitlement>()
  for (const p of plansRes.data ?? []) plans.set(p.plan, p as PlanEntitlement)
  const revealCount = new Map<string, number>()
  for (const r of revealsRes.data ?? []) revealCount.set(r.org_id, (revealCount.get(r.org_id) ?? 0) + 1)

  const orgs = (orgsRes.data ?? []).map(o => ({
    id: o.id,
    name: o.name,
    plan: o.plan,
    status: o.status,
    interval: ((o.settings as { interval?: string } | null)?.interval === 'annual' ? 'annual' : 'monthly') as 'monthly' | 'annual',
  }))

  return NextResponse.json(compute(orgs, plans, revealCount, period, 'live'))
}
