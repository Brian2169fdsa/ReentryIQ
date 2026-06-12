// Shared helpers for the platform-admin API routes.
// Service-role access, admin gating, and deterministic demo fallbacks.
// (Not a route file — Next.js only treats `route.ts` as an endpoint.)

import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/admin'
import type { SupabaseClient } from '@supabase/supabase-js'

/* ── Config ─────────────────────────────────────────────────────── */

export const configured = (): boolean =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !!process.env.SUPABASE_SERVICE_ROLE_KEY

/** The current billing period, e.g. '2026-06'. */
export function currentPeriod(d: Date = new Date()): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

/** Last N periods (oldest → newest), e.g. ['2026-01', …, '2026-06']. */
export function recentPeriods(n: number, from: Date = new Date()): string[] {
  const out: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() - i, 1))
    out.push(currentPeriod(d))
  }
  return out
}

/* ── Admin gate ─────────────────────────────────────────────────── */

interface AdminUser {
  id: string
  email: string | null
}

/**
 * Returns the caller if they are an authenticated platform admin, else null.
 * Accepts the email allowlist, a profiles.role === 'admin' row, or a
 * platform_admins membership via the is_platform_admin() RPC.
 */
export async function requireAdmin(): Promise<AdminUser | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  if (isAdminEmail(user.email)) return { id: user.id, email: user.email ?? null }

  // platform_admins membership (operator allowlist) via RPC under the user's session.
  const { data: isAdmin } = await supabase.rpc('is_platform_admin')
  if (isAdmin === true) return { id: user.id, email: user.email ?? null }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  return profile?.role === 'admin' ? { id: user.id, email: user.email ?? null } : null
}

export async function serviceClient(): Promise<SupabaseClient> {
  const { createClient: createServiceClient } = await import('@supabase/supabase-js')
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  )
}

/* ── Plans ──────────────────────────────────────────────────────── */

export interface PlanEntitlement {
  plan: string
  included_records: number
  overage_price_cents: number
  seats: number
  features: string[]
  price_monthly_cents: number
  price_annual_cents: number
}

// Mirrors the seed in 0004_tenants_billing.sql — used as the demo fallback.
export const DEMO_PLANS: Record<string, PlanEntitlement> = {
  starter: { plan: 'starter', included_records: 500, overage_price_cents: 100, seats: 3, features: ['search', 'alerts'], price_monthly_cents: 9900, price_annual_cents: 99000 },
  pro: { plan: 'pro', included_records: 2500, overage_price_cents: 75, seats: 10, features: ['search', 'alerts', 'connectors', 'saved_searches'], price_monthly_cents: 29900, price_annual_cents: 299000 },
  enterprise: { plan: 'enterprise', included_records: 10000, overage_price_cents: 50, seats: 50, features: ['search', 'alerts', 'connectors', 'saved_searches', 'api', 'assistant'], price_monthly_cents: 84900, price_annual_cents: 849000 },
}

/** MRR in cents for an org. Annual interval ÷12; comped/paused/canceled = $0. */
export function mrrCents(plan: PlanEntitlement | undefined, status: string, interval: 'monthly' | 'annual'): number {
  if (!plan) return 0
  if (status === 'comped' || status === 'paused' || status === 'canceled') return 0
  return interval === 'annual' ? Math.round(plan.price_annual_cents / 12) : plan.price_monthly_cents
}

/* ── Validation ─────────────────────────────────────────────────── */

export const PLANS = ['starter', 'pro', 'enterprise'] as const
export const STATUSES = ['trialing', 'active', 'past_due', 'paused', 'comped', 'canceled'] as const
export const AZ_COUNTIES = ['Maricopa', 'Pima', 'Pinal', 'Yuma', 'Cochise', 'Yavapai', 'Mohave', 'Navajo', 'Graham', 'Coconino'] as const

/* ── Demo dataset (deterministic) ──────────────────────────────── */

export interface DemoOrg {
  id: string
  name: string
  plan: string
  status: string
  scope_counties: string[] | null
  segment_verified: boolean
  interval: 'monthly' | 'annual'
  created_at: string
  members: { id: string; email: string; role: 'owner' | 'admin' | 'member'; created_at: string }[]
  reveals: { record_id: string; period: string; created_at: string }[]
  attestations: { id: string; use_case: string; fcra_ack: boolean; created_at: string }[]
  audit: { id: string; action: string; target: string | null; user: string | null; created_at: string }[]
}

function buildReveals(orgSeed: number, perPeriod: number[]): DemoOrg['reveals'] {
  const periods = recentPeriods(6)
  const out: DemoOrg['reveals'] = []
  periods.forEach((period, pi) => {
    const count = perPeriod[pi] ?? 0
    for (let i = 0; i < count; i++) {
      const day = ((orgSeed * 7 + i * 3) % 27) + 1
      out.push({
        record_id: `AZ-${String(orgSeed)}${String(pi)}${String(i).padStart(4, '0')}`,
        period,
        created_at: `${period}-${String(day).padStart(2, '0')}T14:0${i % 6}:00Z`,
      })
    }
  })
  return out
}

export const DEMO_ORGS: DemoOrg[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Sanctuary Recovery',
    plan: 'pro',
    status: 'active',
    scope_counties: null,
    segment_verified: true,
    interval: 'monthly',
    created_at: '2026-02-18T16:00:00Z',
    members: [
      { id: 'm1', email: 'team@sanctuaryrecovery.org', role: 'owner', created_at: '2026-02-18T16:00:00Z' },
      { id: 'm2', email: 'intake@sanctuaryrecovery.org', role: 'member', created_at: '2026-03-02T11:00:00Z' },
      { id: 'm3', email: 'cases@sanctuaryrecovery.org', role: 'member', created_at: '2026-04-15T09:30:00Z' },
    ],
    reveals: buildReveals(1, [820, 1180, 1740, 2090, 2630, 2210]),
    attestations: [
      { id: 'a1', use_case: 'Tenant screening for transitional housing', fcra_ack: true, created_at: '2026-02-18T16:05:00Z' },
      { id: 'a2', use_case: 'Employment eligibility for peer-support roles', fcra_ack: true, created_at: '2026-03-02T11:10:00Z' },
    ],
    audit: [
      { id: 'g1', action: 'admin:plan_override', target: 'Sanctuary Recovery', user: 'brianreinhart3617@gmail.com', created_at: '2026-03-01T18:22:00Z' },
      { id: 'g2', action: 'admin:segment_verified', target: 'Sanctuary Recovery', user: 'brianreinhart3617@gmail.com', created_at: '2026-02-18T16:02:00Z' },
    ],
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    name: 'Desert Pathways',
    plan: 'starter',
    status: 'trialing',
    scope_counties: ['Pima', 'Pinal'],
    segment_verified: false,
    interval: 'monthly',
    created_at: '2026-05-30T22:05:00Z',
    members: [
      { id: 'm4', email: 'intake@desertpathways.org', role: 'owner', created_at: '2026-05-30T22:05:00Z' },
      { id: 'm5', email: 'ops@desertpathways.org', role: 'admin', created_at: '2026-06-02T13:40:00Z' },
    ],
    reveals: buildReveals(2, [0, 0, 0, 0, 120, 410]),
    attestations: [
      { id: 'a3', use_case: 'Reentry case management intake', fcra_ack: true, created_at: '2026-05-30T22:08:00Z' },
    ],
    audit: [
      { id: 'g3', action: 'admin:create_org', target: 'Desert Pathways', user: 'brianreinhart3617@gmail.com', created_at: '2026-05-30T22:05:00Z' },
    ],
  },
]

export function demoOrgById(id: string): DemoOrg | undefined {
  return DEMO_ORGS.find(o => o.id === id)
}

/** Reveal count for an org in a given period. */
export function countRevealsInPeriod(reveals: { period: string }[], period: string): number {
  return reveals.filter(r => r.period === period).length
}
