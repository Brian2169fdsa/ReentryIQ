import Stripe from 'stripe'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Stripe + service-role Supabase helpers.
 *
 * Secrets (server-side only — never expose to the client):
 *   - STRIPE_SECRET_KEY            → Stripe API key (sk_...)
 *   - SUPABASE_SERVICE_ROLE_KEY    → Supabase service-role key (bypasses RLS)
 *   - NEXT_PUBLIC_SUPABASE_URL     → Supabase project URL (safe to expose)
 *
 * Graceful degradation: every route calls getStripe()/stripeConfigured() and
 * returns a 503 { error: 'Stripe is not configured' } when the key is unset,
 * so an unconfigured deploy never crashes or breaks the build.
 */

// Pin the API version the SDK was generated against for deterministic behaviour.
const STRIPE_API_VERSION = '2025-02-24.acacia'

let stripeSingleton: Stripe | null = null

/** True when the Stripe secret key is present in the environment. */
export function stripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY
}

/**
 * Lazy Stripe singleton. Returns null (never throws) when STRIPE_SECRET_KEY is
 * unset so callers can degrade gracefully to a 503.
 */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY // STRIPE_SECRET_KEY
  if (!key) return null
  if (!stripeSingleton) {
    stripeSingleton = new Stripe(key, {
      apiVersion: STRIPE_API_VERSION,
      typescript: true,
    })
  }
  return stripeSingleton
}

let supabaseSingleton: SupabaseClient | null = null

/**
 * Service-role Supabase client (bypasses RLS — server-side only).
 * Uses NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 */
export function getServiceSupabase(): SupabaseClient {
  if (!supabaseSingleton) {
    supabaseSingleton = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!, // NEXT_PUBLIC_SUPABASE_URL
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // SUPABASE_SERVICE_ROLE_KEY
      { auth: { persistSession: false, autoRefreshToken: false } },
    )
  }
  return supabaseSingleton
}

/** True when the service-role Supabase client can be constructed. */
export function supabaseConfigured(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

/** Canonical app base URL for checkout success/cancel redirects. */
export function appUrl(): string {
  // NEXT_PUBLIC_APP_URL — defaults to the production Vercel deployment.
  return process.env.NEXT_PUBLIC_APP_URL || 'https://reentry-iq.vercel.app'
}

/** Plan ids we provision and bill. */
export type PlanId = 'starter' | 'pro' | 'enterprise'
export type BillingInterval = 'monthly' | 'annual'

export interface PlanEntitlement {
  plan: PlanId
  included_records: number
  overage_price_cents: number
  seats: number
  features: string[]
  price_monthly_cents: number
  price_annual_cents: number
}

/**
 * Hardcoded fallback that mirrors public.plan_entitlements (migration 0004),
 * used by routes/scripts when Supabase is unreachable or unconfigured.
 */
export const FALLBACK_PLANS: Record<PlanId, PlanEntitlement> = {
  starter: {
    plan: 'starter',
    included_records: 500,
    overage_price_cents: 100,
    seats: 3,
    features: ['search', 'alerts'],
    price_monthly_cents: 9900,
    price_annual_cents: 99000,
  },
  pro: {
    plan: 'pro',
    included_records: 2500,
    overage_price_cents: 75,
    seats: 10,
    features: ['search', 'alerts', 'connectors', 'saved_searches'],
    price_monthly_cents: 29900,
    price_annual_cents: 299000,
  },
  enterprise: {
    plan: 'enterprise',
    included_records: 10000,
    overage_price_cents: 50,
    seats: 50,
    features: ['search', 'alerts', 'connectors', 'saved_searches', 'api', 'assistant'],
    price_monthly_cents: 84900,
    price_annual_cents: 849000,
  },
}

export const PLAN_IDS: PlanId[] = ['starter', 'pro', 'enterprise']

/** Lookup-key scheme used for idempotent price provisioning + resolution. */
export function subscriptionLookupKey(plan: PlanId, interval: BillingInterval): string {
  return `${plan}_${interval}`
}
export function overageLookupKey(plan: PlanId): string {
  return `${plan}_overage`
}

/**
 * Reads plan_entitlements from Supabase, falling back to FALLBACK_PLANS for any
 * plan missing from the DB (or when Supabase is unconfigured). Always returns a
 * complete set keyed by plan id.
 */
export async function loadPlans(): Promise<Record<PlanId, PlanEntitlement>> {
  if (!supabaseConfigured()) return { ...FALLBACK_PLANS }
  try {
    const svc = getServiceSupabase()
    const { data, error } = await svc
      .from('plan_entitlements')
      .select(
        'plan, included_records, overage_price_cents, seats, features, price_monthly_cents, price_annual_cents',
      )
    if (error || !data) return { ...FALLBACK_PLANS }
    const merged: Record<PlanId, PlanEntitlement> = { ...FALLBACK_PLANS }
    for (const row of data as PlanEntitlement[]) {
      if (PLAN_IDS.includes(row.plan)) merged[row.plan] = row
    }
    return merged
  } catch {
    return { ...FALLBACK_PLANS }
  }
}
