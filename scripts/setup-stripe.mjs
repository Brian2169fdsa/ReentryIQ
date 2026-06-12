#!/usr/bin/env node
/**
 * scripts/setup-stripe.mjs — idempotent Stripe provisioning for ReentryIQ.
 *
 * Creates ONE product per plan (starter/pro/enterprise) and FOUR prices each,
 * keyed by lookup_key so re-runs never duplicate:
 *   {plan}_monthly  — licensed, recurring month  (price_monthly_cents)
 *   {plan}_annual   — licensed, recurring year   (price_annual_cents = 10× monthly)
 *   {plan}_overage  — metered,  recurring month  (overage_price_cents per record)
 *
 * Idempotency:
 *   - Products are matched by metadata.reentryiq_plan (search, list fallback).
 *   - Prices are matched by lookup_key (prices.list({ lookup_keys })) and skipped
 *     if they already exist.
 *
 * Env (server-side only):
 *   STRIPE_SECRET_KEY            (required) — exits 1 if missing
 *   NEXT_PUBLIC_SUPABASE_URL     (optional) — read plan_entitlements from DB
 *   SUPABASE_SERVICE_ROLE_KEY    (optional) — service-role key for the read
 * Falls back to hardcoded plans (mirrors migration 0004) when Supabase is unset.
 *
 * Run:  node scripts/setup-stripe.mjs
 */

import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const STRIPE_API_VERSION = '2025-02-24.acacia'

const FALLBACK_PLANS = [
  {
    plan: 'starter',
    included_records: 500,
    overage_price_cents: 100,
    seats: 3,
    price_monthly_cents: 9900,
    price_annual_cents: 99000,
  },
  {
    plan: 'pro',
    included_records: 2500,
    overage_price_cents: 75,
    seats: 10,
    price_monthly_cents: 29900,
    price_annual_cents: 299000,
  },
  {
    plan: 'enterprise',
    included_records: 10000,
    overage_price_cents: 50,
    seats: 50,
    price_monthly_cents: 84900,
    price_annual_cents: 849000,
  },
]

function fail(message) {
  console.error(`✗ ${message}`)
  process.exit(1)
}

async function loadPlans() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.log('• Supabase env not set — using hardcoded plan_entitlements.')
    return FALLBACK_PLANS
  }
  try {
    const supabase = createClient(url, key, { auth: { persistSession: false } })
    const { data, error } = await supabase
      .from('plan_entitlements')
      .select('plan, included_records, overage_price_cents, seats, price_monthly_cents, price_annual_cents')
    if (error || !data || data.length === 0) {
      console.log('• Could not read plan_entitlements — using hardcoded fallback.')
      return FALLBACK_PLANS
    }
    const order = { starter: 0, pro: 1, enterprise: 2 }
    return data
      .filter((p) => p.plan in order)
      .sort((a, b) => order[a.plan] - order[b.plan])
  } catch {
    console.log('• Supabase read threw — using hardcoded fallback.')
    return FALLBACK_PLANS
  }
}

/** Find an existing product for a plan via metadata.reentryiq_plan, else null. */
async function findProduct(stripe, plan) {
  // Prefer search (requires the Search API to be enabled on the account).
  try {
    const res = await stripe.products.search({
      query: `metadata['reentryiq_plan']:'${plan}'`,
      limit: 1,
    })
    if (res.data[0]) return res.data[0]
  } catch {
    // Search unavailable — fall through to list+filter.
  }
  // Fallback: list active products and filter by metadata.
  for await (const product of stripe.products.list({ active: true, limit: 100 })) {
    if (product.metadata?.reentryiq_plan === plan) return product
  }
  return null
}

async function ensureProduct(stripe, plan) {
  const existing = await findProduct(stripe, plan)
  if (existing) {
    console.log(`  product: reused ${existing.id}`)
    return existing
  }
  const created = await stripe.products.create({
    name: `ReentryIQ ${plan[0].toUpperCase()}${plan.slice(1)}`,
    metadata: { reentryiq_plan: plan },
  })
  console.log(`  product: created ${created.id}`)
  return created
}

/** Find an existing price by lookup_key, else null. */
async function findPrice(stripe, lookupKey) {
  const res = await stripe.prices.list({ lookup_keys: [lookupKey], limit: 1 })
  return res.data[0] ?? null
}

/**
 * Ensure a price with the given lookup_key exists. Stripe prices are immutable,
 * so when re-running we just reuse the existing price (we never mutate amounts).
 */
async function ensurePrice(stripe, productId, lookupKey, params) {
  const existing = await findPrice(stripe, lookupKey)
  if (existing) {
    console.log(`    ${lookupKey}: reused ${existing.id}`)
    return existing
  }
  const created = await stripe.prices.create({
    product: productId,
    lookup_key: lookupKey,
    ...params,
  })
  console.log(`    ${lookupKey}: created ${created.id}`)
  return created
}

async function main() {
  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) {
    fail('STRIPE_SECRET_KEY is not set. Export it before running scripts/setup-stripe.mjs.')
  }
  const stripe = new Stripe(secret, { apiVersion: STRIPE_API_VERSION })

  const plans = await loadPlans()
  const summary = []

  for (const p of plans) {
    console.log(`\nPlan: ${p.plan}`)
    const product = await ensureProduct(stripe, p.plan)

    const monthly = await ensurePrice(stripe, product.id, `${p.plan}_monthly`, {
      currency: 'usd',
      unit_amount: p.price_monthly_cents,
      recurring: { interval: 'month' },
    })
    const annual = await ensurePrice(stripe, product.id, `${p.plan}_annual`, {
      currency: 'usd',
      unit_amount: p.price_annual_cents, // 10× monthly = 2 months free
      recurring: { interval: 'year' },
    })
    const overage = await ensurePrice(stripe, product.id, `${p.plan}_overage`, {
      currency: 'usd',
      unit_amount: p.overage_price_cents,
      recurring: { interval: 'month', usage_type: 'metered' },
    })

    summary.push({
      plan: p.plan,
      monthly: monthly.id,
      annual: annual.id,
      overage: overage.id,
    })
  }

  console.log('\n─ Price summary ────────────────────────────────────────────')
  console.log(['plan', 'monthly', 'annual', 'overage'].join('\t'))
  for (const row of summary) {
    console.log([row.plan, row.monthly, row.annual, row.overage].join('\t'))
  }
  console.log('\n✓ Stripe provisioning complete (idempotent — safe to re-run).')
}

main().catch((err) => {
  fail(err?.message || String(err))
})
