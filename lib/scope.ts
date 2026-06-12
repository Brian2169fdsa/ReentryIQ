// Entitlement / scope layer — THE single chokepoint for data access and
// metered reveals. Multi-tenant auth/RLS isn't wired yet, so this returns a
// single-org full-scope context; when orgs land, only this file changes and
// every consumer (record panel API, chat tools, future REST API) inherits it.

export interface ScopeContext {
  orgId: string
  orgName: string
  /** null = statewide (full scope). Otherwise the counties this org may see. */
  counties: string[] | null
  /** Metered record reveals included in the plan period. */
  revealsIncluded: number
}

export function getScope(): ScopeContext {
  // Hardcoded single-org full scope until auth/entitlements are wired.
  return {
    orgId: 'org_default',
    orgName: 'Sanctuary Recovery',
    counties: null,
    revealsIncluded: 2500,
  }
}

/** Clamp a county filter to the caller's scope. Returns the effective filter. */
export function scopeCounties(scope: ScopeContext, requested?: string | null): string[] | null {
  if (!scope.counties) return requested ? [requested] : null
  if (!requested) return scope.counties
  const ok = scope.counties.some(c => c.toLowerCase() === requested.toLowerCase())
  return ok ? [requested] : [] // out-of-scope request → empty, never leaked
}

/**
 * Metered reveal chokepoint. Every path that exposes an individual full
 * record (panel open, chat reveal, CRM push) MUST call this. Persistence of
 * the counter lands with billing; the gate and its call-sites are final.
 */
export async function recordReveal(scope: ScopeContext, adcNumber: string): Promise<{ allowed: boolean }> {
  console.log(`[reveal] org=${scope.orgId} adc=${adcNumber} at=${new Date().toISOString()}`)
  return { allowed: true }
}
