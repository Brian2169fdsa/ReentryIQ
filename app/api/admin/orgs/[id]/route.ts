import { NextResponse } from 'next/server'
import {
  configured, requireAdmin, serviceClient, currentPeriod,
  demoOrgById, DEMO_PLANS, mrrCents, countRevealsInPeriod,
  PLANS, STATUSES, AZ_COUNTIES, type PlanEntitlement,
} from '../../_lib'

export const dynamic = 'force-dynamic'

export interface OrgDetail {
  id: string
  name: string
  plan: string
  status: string
  scope_counties: string[]
  segment_verified: boolean
  interval: 'monthly' | 'annual'
  created_at: string
  mrr_cents: number
  reveals: number
  included: number
  usage_pct: number
  members: { id: string; email: string; role: string; created_at: string }[]
  reveal_history: { record_id: string; created_at: string }[]
  attestations: { id: string; use_case: string; fcra_ack: boolean; created_at: string }[]
  audit: { id: string; action: string; target: string | null; user: string | null; created_at: string }[]
}

/* ── GET (detail bundle) ────────────────────────────────────────── */

function demoDetail(id: string): OrgDetail | null {
  const o = demoOrgById(id)
  if (!o) return null
  const period = currentPeriod()
  const plan = DEMO_PLANS[o.plan]
  const reveals = countRevealsInPeriod(o.reveals, period)
  const included = plan?.included_records ?? 0
  return {
    id: o.id,
    name: o.name,
    plan: o.plan,
    status: o.status,
    scope_counties: o.scope_counties ?? [],
    segment_verified: o.segment_verified,
    interval: o.interval,
    created_at: o.created_at,
    mrr_cents: mrrCents(plan, o.status, o.interval),
    reveals,
    included,
    usage_pct: included > 0 ? Math.round((reveals / included) * 100) : 0,
    members: o.members,
    reveal_history: [...o.reveals]
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, 20)
      .map(r => ({ record_id: r.record_id, created_at: r.created_at })),
    attestations: o.attestations,
    audit: o.audit,
  }
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!configured()) {
    const detail = demoDetail(params.id)
    if (!detail) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ org: detail, source: 'demo' })
  }

  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const svc = await serviceClient()
  const id = params.id
  const period = currentPeriod()

  const { data: org, error } = await svc
    .from('orgs')
    .select('id, name, plan, status, scope_counties, segment_verified, settings, created_at')
    .eq('id', id)
    .single()
  if (error || !org) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const [planRes, membersRes, periodReveals, revealHistory, attestRes, auditRes] = await Promise.all([
    svc.from('plan_entitlements').select('plan, included_records, overage_price_cents, seats, features, price_monthly_cents, price_annual_cents').eq('plan', org.plan).maybeSingle(),
    svc.from('org_members').select('id, auth_user_id, role, created_at').eq('org_id', id),
    svc.from('record_reveals').select('record_id', { count: 'exact', head: true }).eq('org_id', id).eq('period', period),
    svc.from('record_reveals').select('record_id, created_at').eq('org_id', id).order('created_at', { ascending: false }).limit(20),
    svc.from('attestations').select('id, use_case, fcra_ack, created_at').eq('org_id', id).order('created_at', { ascending: false }),
    svc.from('audit_log').select('id, action, target, user_id, created_at').eq('org_id', id).order('created_at', { ascending: false }).limit(30),
  ])

  const plan = (planRes.data ?? undefined) as PlanEntitlement | undefined
  const interval = (org.settings as { interval?: string } | null)?.interval === 'annual' ? 'annual' : 'monthly'
  const reveals = periodReveals.count ?? 0
  const included = plan?.included_records ?? 0

  // Resolve member emails via auth admin API (service role).
  const members: OrgDetail['members'] = []
  for (const m of membersRes.data ?? []) {
    let email = m.auth_user_id as string
    try {
      const { data: u } = await svc.auth.admin.getUserById(m.auth_user_id)
      if (u?.user?.email) email = u.user.email
    } catch { /* fall back to id */ }
    members.push({ id: m.id, email, role: m.role, created_at: m.created_at })
  }

  const detail: OrgDetail = {
    id: org.id,
    name: org.name,
    plan: org.plan,
    status: org.status,
    scope_counties: org.scope_counties ?? [],
    segment_verified: org.segment_verified,
    interval,
    created_at: org.created_at,
    mrr_cents: mrrCents(plan, org.status, interval),
    reveals,
    included,
    usage_pct: included > 0 ? Math.round((reveals / included) * 100) : 0,
    members,
    reveal_history: (revealHistory.data ?? []).map(r => ({ record_id: r.record_id, created_at: r.created_at })),
    attestations: (attestRes.data ?? []).map(a => ({ id: a.id, use_case: a.use_case, fcra_ack: a.fcra_ack, created_at: a.created_at })),
    audit: (auditRes.data ?? []).map(a => ({ id: a.id, action: a.action, target: a.target, user: a.user_id, created_at: a.created_at })),
  }

  return NextResponse.json({ org: detail, source: 'live' })
}

/* ── PATCH (plan / status / scope / segment) ────────────────────── */

interface PatchBody {
  plan?: string
  status?: string
  scope_counties?: string[]
  segment_verified?: boolean
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const body = (await req.json()) as PatchBody

  // Validate inputs up front (applies to demo + live).
  const patch: Record<string, unknown> = {}
  const auditActions: { action: string; target: string }[] = []

  if (body.plan !== undefined) {
    if (!PLANS.includes(body.plan as (typeof PLANS)[number])) {
      return NextResponse.json({ error: `Invalid plan: ${body.plan}` }, { status: 400 })
    }
    patch.plan = body.plan
    auditActions.push({ action: 'admin:plan_override', target: id })
  }
  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status as (typeof STATUSES)[number])) {
      return NextResponse.json({ error: `Invalid status: ${body.status}` }, { status: 400 })
    }
    patch.status = body.status
    auditActions.push({ action: `admin:status_${body.status}`, target: id })
  }
  if (body.scope_counties !== undefined) {
    if (!Array.isArray(body.scope_counties) || body.scope_counties.some(c => !AZ_COUNTIES.includes(c as (typeof AZ_COUNTIES)[number]))) {
      return NextResponse.json({ error: 'Invalid scope_counties' }, { status: 400 })
    }
    // Empty selection = statewide → store null.
    patch.scope_counties = body.scope_counties.length ? body.scope_counties : null
    auditActions.push({ action: 'admin:scope_update', target: id })
  }
  if (body.segment_verified !== undefined) {
    if (typeof body.segment_verified !== 'boolean') {
      return NextResponse.json({ error: 'segment_verified must be boolean' }, { status: 400 })
    }
    patch.segment_verified = body.segment_verified
    auditActions.push({ action: 'admin:segment_verified', target: id })
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  if (!configured()) {
    // Demo mode: not persisted. Echo the applied patch so the UI can update locally.
    if (!demoOrgById(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ ok: true, persisted: false, applied: patch, source: 'demo' })
  }

  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const svc = await serviceClient()
  const { error } = await svc.from('orgs').update(patch).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Record each admin write in the audit log (service-side).
  if (auditActions.length) {
    await svc.from('audit_log').insert(
      auditActions.map(a => ({ org_id: id, user_id: admin.id, action: a.action, target: a.target })),
    )
  }

  return NextResponse.json({ ok: true, persisted: true, applied: patch, source: 'live' })
}
