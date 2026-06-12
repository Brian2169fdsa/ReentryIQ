import { NextResponse } from 'next/server'
import {
  configured, requireAdmin, serviceClient, currentPeriod,
  DEMO_ORGS, DEMO_PLANS, mrrCents, countRevealsInPeriod,
  type PlanEntitlement,
} from '../_lib'

export const dynamic = 'force-dynamic'

export interface OrgListRow {
  id: string
  name: string
  plan: string
  status: string
  mrr_cents: number
  reveals: number
  included: number
  usage_pct: number
  members: number
  created_at: string
}

function demoPayload() {
  const period = currentPeriod()
  const orgs: OrgListRow[] = DEMO_ORGS.map(o => {
    const plan = DEMO_PLANS[o.plan]
    const reveals = countRevealsInPeriod(o.reveals, period)
    const included = plan?.included_records ?? 0
    return {
      id: o.id,
      name: o.name,
      plan: o.plan,
      status: o.status,
      mrr_cents: mrrCents(plan, o.status, o.interval),
      reveals,
      included,
      usage_pct: included > 0 ? Math.round((reveals / included) * 100) : 0,
      members: o.members.length,
      created_at: o.created_at,
    }
  })
  return { orgs, period, source: 'demo' as const }
}

export async function GET() {
  if (!configured()) return NextResponse.json(demoPayload())

  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const svc = await serviceClient()
  const period = currentPeriod()

  const [orgsRes, plansRes, membersRes, revealsRes] = await Promise.all([
    svc.from('orgs').select('id, name, plan, status, settings, created_at'),
    svc.from('plan_entitlements').select('plan, included_records, overage_price_cents, seats, features, price_monthly_cents, price_annual_cents'),
    svc.from('org_members').select('org_id'),
    svc.from('record_reveals').select('org_id').eq('period', period),
  ])

  if (orgsRes.error) return NextResponse.json({ error: orgsRes.error.message }, { status: 500 })

  const plans = new Map<string, PlanEntitlement>()
  for (const p of plansRes.data ?? []) plans.set(p.plan, p as PlanEntitlement)

  const memberCount = new Map<string, number>()
  for (const m of membersRes.data ?? []) memberCount.set(m.org_id, (memberCount.get(m.org_id) ?? 0) + 1)

  const revealCount = new Map<string, number>()
  for (const r of revealsRes.data ?? []) revealCount.set(r.org_id, (revealCount.get(r.org_id) ?? 0) + 1)

  const orgs: OrgListRow[] = (orgsRes.data ?? []).map(o => {
    const plan = plans.get(o.plan)
    const interval = (o.settings as { interval?: string } | null)?.interval === 'annual' ? 'annual' : 'monthly'
    const reveals = revealCount.get(o.id) ?? 0
    const included = plan?.included_records ?? 0
    return {
      id: o.id,
      name: o.name,
      plan: o.plan,
      status: o.status,
      mrr_cents: mrrCents(plan, o.status, interval),
      reveals,
      included,
      usage_pct: included > 0 ? Math.round((reveals / included) * 100) : 0,
      members: memberCount.get(o.id) ?? 0,
      created_at: o.created_at,
    }
  })

  return NextResponse.json({ orgs, period, source: 'live' })
}
