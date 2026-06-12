// THE data-source gate. Every read in the dashboard, record panel, and AI
// assistant resolves through here, server-side. Hidden buttons are not a gate.
//
// REAL data only when ALL hold for the caller's org:
//   1. org.status ∈ { active, comped }
//   2. a completed FCRA attestation exists for the org (fcra_ack = true)
//   3. the requested scope is within org.scope_counties (null = statewide)
// Anything else — free signups, trials, past_due, unattested, anonymous,
// unconfigured env — resolves to SAMPLE and the UI shows the "Sample data" pill.

// Server-side only — import exclusively from route handlers / server code.

export interface Access {
  mode: 'real' | 'sample'
  orgId: string | null
  orgName: string | null
  /** null = statewide */
  counties: string[] | null
  reason: string
}

const SAMPLE = (reason: string): Access => ({ mode: 'sample', orgId: null, orgName: null, counties: null, reason })

const configured = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !!process.env.SUPABASE_SERVICE_ROLE_KEY

export async function resolveAccess(): Promise<Access> {
  if (!configured()) return SAMPLE('supabase_not_configured')

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return SAMPLE('unauthenticated')

    // Service role: membership/attestation checks must not depend on RLS quirks.
    const { createClient: svc } = await import('@supabase/supabase-js')
    const admin = svc(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false },
    })

    const { data: membership } = await admin
      .from('org_members')
      .select('org_id, orgs ( id, name, status, scope_counties )')
      .eq('auth_user_id', user.id)
      .limit(1)
      .maybeSingle()

    const org = (membership?.orgs ?? null) as
      | { id: string; name: string; status: string; scope_counties: string[] | null }
      | null
    if (!org) return SAMPLE('no_org')

    if (!['active', 'comped'].includes(org.status)) {
      return { mode: 'sample', orgId: org.id, orgName: org.name, counties: null, reason: `status_${org.status}` }
    }

    const { count } = await admin
      .from('attestations')
      .select('id', { count: 'exact', head: true })
      .eq('org_id', org.id)
      .eq('fcra_ack', true)
    if (!count) {
      return { mode: 'sample', orgId: org.id, orgName: org.name, counties: null, reason: 'no_attestation' }
    }

    return { mode: 'real', orgId: org.id, orgName: org.name, counties: org.scope_counties ?? null, reason: 'entitled' }
  } catch {
    return SAMPLE('resolver_error')
  }
}

/** Clamp a requested county to the org's scope. Out-of-scope → empty (never leaks). */
export function clampCounties(access: Access, requested?: string | null): string[] | null {
  if (!access.counties) return requested ? [requested] : null
  if (!requested) return access.counties
  return access.counties.some(c => c.toLowerCase() === requested.toLowerCase()) ? [requested] : []
}

/**
 * Metered reveal — persists to record_reveals (PK org+record+period dedupes
 * re-views) + usage_events. Sample-mode reveals are not billed.
 */
export async function meterReveal(access: Access, adc: string): Promise<void> {
  if (access.mode !== 'real' || !access.orgId || !configured()) return
  try {
    const { createClient: svc } = await import('@supabase/supabase-js')
    const admin = svc(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false },
    })
    const period = new Date().toISOString().slice(0, 7)
    await admin.from('record_reveals').upsert(
      { org_id: access.orgId, record_id: adc, period },
      { onConflict: 'org_id,record_id,period', ignoreDuplicates: true },
    )
    await admin.from('usage_events').insert({ org_id: access.orgId, record_id: adc, event_type: 'reveal' })
  } catch {
    // metering failure must never block the read; rollup reconciles daily
  }
}
