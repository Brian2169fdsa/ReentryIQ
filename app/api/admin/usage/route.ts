import { NextResponse } from 'next/server'
import {
  configured, requireAdmin, serviceClient, currentPeriod, recentPeriods,
  DEMO_ORGS,
} from '../_lib'

export const dynamic = 'force-dynamic'

export interface UsagePayload {
  period: string
  periods: string[]                                  // last 6, oldest → newest
  top_orgs: { id: string; name: string; reveals: number }[]
  trend: { period: string; total: number }[]          // platform-wide totals per period
  by_org_trend: { id: string; name: string; points: number[] }[] // per-org series aligned to periods
  source: 'live' | 'demo'
}

export async function GET() {
  const period = currentPeriod()
  const periods = recentPeriods(6)

  if (!configured()) {
    const top = DEMO_ORGS
      .map(o => ({ id: o.id, name: o.name, reveals: o.reveals.filter(r => r.period === period).length }))
      .sort((a, b) => b.reveals - a.reveals)
      .slice(0, 10)
    const trend = periods.map(p => ({
      period: p,
      total: DEMO_ORGS.reduce((sum, o) => sum + o.reveals.filter(r => r.period === p).length, 0),
    }))
    const byOrg = DEMO_ORGS.map(o => ({
      id: o.id,
      name: o.name,
      points: periods.map(p => o.reveals.filter(r => r.period === p).length),
    }))
    return NextResponse.json({ period, periods, top_orgs: top, trend, by_org_trend: byOrg, source: 'demo' } satisfies UsagePayload)
  }

  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const svc = await serviceClient()
  const [orgsRes, revealsRes] = await Promise.all([
    svc.from('orgs').select('id, name'),
    svc.from('record_reveals').select('org_id, period').in('period', periods),
  ])
  if (orgsRes.error) return NextResponse.json({ error: orgsRes.error.message }, { status: 500 })

  const names = new Map<string, string>()
  for (const o of orgsRes.data ?? []) names.set(o.id, o.name)

  // org_id → period → count
  const grid = new Map<string, Map<string, number>>()
  for (const r of revealsRes.data ?? []) {
    if (!grid.has(r.org_id)) grid.set(r.org_id, new Map())
    const m = grid.get(r.org_id)!
    m.set(r.period, (m.get(r.period) ?? 0) + 1)
  }

  const top = Array.from(names.entries())
    .map(([id, name]) => ({ id, name, reveals: grid.get(id)?.get(period) ?? 0 }))
    .sort((a, b) => b.reveals - a.reveals)
    .slice(0, 10)

  const trend = periods.map(p => ({
    period: p,
    total: Array.from(grid.values()).reduce((sum, m) => sum + (m.get(p) ?? 0), 0),
  }))

  const byOrg = Array.from(names.entries()).map(([id, name]) => ({
    id,
    name,
    points: periods.map(p => grid.get(id)?.get(p) ?? 0),
  }))

  return NextResponse.json({ period, periods, top_orgs: top, trend, by_org_trend: byOrg, source: 'live' } satisfies UsagePayload)
}
