#!/usr/bin/env node
/**
 * scripts/report-usage.mjs — daily metered usage rollup for ReentryIQ.
 *
 * For each org with a stripe_subscription_id and status 'active':
 *   period   = current 'YYYY-MM' (UTC)
 *   billable = count of record_reveals for (org_id, period)
 *              — the table PK (org_id, record_id, period) dedupes re-views, so
 *                re-revealing a record never double-bills.
 *   overage  = max(0, billable - plan_entitlements.included_records)
 *
 * Reports overage to the subscription's metered item (price lookup_key
 * '{plan}_overage') with:
 *   stripe.subscriptionItems.createUsageRecord(itemId, {
 *     quantity, timestamp: 'now', action: 'set'
 *   })
 * 'set' (not 'increment') makes the daily run idempotent within the period:
 * re-running the same day overwrites rather than stacking the figure.
 *
 * Invocation (run once daily via cron / GitHub Action):
 *   node scripts/report-usage.mjs
 *
 *   # GitHub Action (.github/workflows/report-usage.yml):
 *   #   on: { schedule: [{ cron: '0 6 * * *' }] }   # 06:00 UTC daily
 *   #   env: STRIPE_SECRET_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 * Env (server-side only):
 *   STRIPE_SECRET_KEY          (required)
 *   NEXT_PUBLIC_SUPABASE_URL   (required)
 *   SUPABASE_SERVICE_ROLE_KEY  (required)
 * Exits cleanly (code 0) with a message when any of these is missing.
 */

import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const STRIPE_API_VERSION = '2025-02-24.acacia'

const INCLUDED_FALLBACK = { starter: 500, pro: 2500, enterprise: 10000 }

function currentPeriod() {
  const now = new Date()
  const y = now.getUTCFullYear()
  const m = String(now.getUTCMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

async function main() {
  const secret = process.env.STRIPE_SECRET_KEY
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!secret || !url || !key) {
    console.log(
      '• Missing env (STRIPE_SECRET_KEY / NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY). Nothing to do.',
    )
    process.exit(0)
  }

  const stripe = new Stripe(secret, { apiVersion: STRIPE_API_VERSION })
  const supabase = createClient(url, key, { auth: { persistSession: false } })
  const period = currentPeriod()

  // Build included-records lookup from plan_entitlements (fallback to hardcoded).
  const included = { ...INCLUDED_FALLBACK }
  const { data: plans } = await supabase
    .from('plan_entitlements')
    .select('plan, included_records')
  if (plans) {
    for (const p of plans) included[p.plan] = p.included_records
  }

  const { data: orgs, error: orgsErr } = await supabase
    .from('orgs')
    .select('id, name, plan, stripe_subscription_id, status')
    .eq('status', 'active')
    .not('stripe_subscription_id', 'is', null)
  if (orgsErr) {
    console.error(`✗ Failed to load orgs: ${orgsErr.message}`)
    process.exit(1)
  }
  if (!orgs || orgs.length === 0) {
    console.log('• No active orgs with a subscription. Nothing to report.')
    process.exit(0)
  }

  console.log(`Reporting usage for period ${period} (${orgs.length} org(s))\n`)

  for (const org of orgs) {
    const includedRecords = included[org.plan] ?? 0
    const overageKey = `${org.plan}_overage`

    // Count billable reveals for this org + period (head:true → count only).
    const { count, error: countErr } = await supabase
      .from('record_reveals')
      .select('record_id', { count: 'exact', head: true })
      .eq('org_id', org.id)
      .eq('period', period)
    if (countErr) {
      console.log(`  ${org.name} (${org.id}): SKIP — count error: ${countErr.message}`)
      continue
    }

    const billable = count ?? 0
    const overage = Math.max(0, billable - includedRecords)

    try {
      const sub = await stripe.subscriptions.retrieve(org.stripe_subscription_id)
      const meteredItem = sub.items.data.find(
        (item) =>
          item.price.lookup_key === overageKey ||
          item.price.recurring?.usage_type === 'metered',
      )
      if (!meteredItem) {
        console.log(`  ${org.name}: SKIP — no metered item on subscription`)
        continue
      }

      // 'set' overwrites the period total → idempotent across daily runs.
      await stripe.subscriptionItems.createUsageRecord(meteredItem.id, {
        quantity: overage,
        timestamp: 'now',
        action: 'set',
      })

      console.log(
        `  ${org.name} (${org.plan}): billable=${billable} included=${includedRecords} overage=${overage} → item ${meteredItem.id}`,
      )
    } catch (err) {
      const message = err?.message || String(err)
      console.log(`  ${org.name}: SKIP — Stripe error: ${message}`)
    }
  }

  console.log('\n✓ Usage rollup complete.')
}

main().catch((err) => {
  console.error(`✗ ${err?.message || String(err)}`)
  process.exit(1)
})
