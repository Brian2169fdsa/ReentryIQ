# Platform Admin + Stripe Billing — Implementation Notes

## Schema (supabase/migrations/0004_tenants_billing.sql — additive)

- `orgs` (plan, status: trialing|active|past_due|paused|comped|canceled,
  stripe_customer_id/subscription_id, scope_counties[], segment_verified, settings jsonb)
- `org_members` (org_id, auth_user_id, role owner|admin|member)
- `plan_entitlements` — seeded: starter $99 (500 records, $1.00 overage, 3 seats) ·
  pro $299 (2,500, $0.75, 10) · enterprise $849 (10,000, $0.50, 50); annual = 10× monthly
- `usage_events`, `record_reveals` (PK org+record+period = the metering dedupe),
  `attestations`, `audit_log`, `stripe_events` (webhook idempotency), `platform_admins`
- RLS everywhere: org members read their org; `is_platform_admin()` bypass
  (platform_admins table; brianreinhart3617@gmail.com seeded + email fallback).

## Stripe event handling (`/api/stripe/webhook`)

Raw-body signature verification (`STRIPE_WEBHOOK_SECRET`). Idempotency: the
event id is inserted into `stripe_events` BEFORE any side effect; a 23505
unique-violation short-circuits as a duplicate. Handled events — the DB is
updated ONLY here, never from the client:

| Event | Effect on `orgs` |
|---|---|
| `checkout.session.completed` | plan + status=active + customer/subscription ids (org from `client_reference_id`) |
| `customer.subscription.updated` | status remap (active/trialing/past_due/canceled), plan from price lookup_key |
| `customer.subscription.deleted` | status=canceled |
| `invoice.payment_failed` | status=past_due |

Each handled event writes an `audit_log` row.

Provisioning: `node scripts/setup-stripe.mjs` — idempotent via price
`lookup_keys` (`{plan}_monthly`, `{plan}_annual`, `{plan}_overage` metered) and
product `metadata.reentryiq_plan`. Checkout (`/api/stripe/checkout`) attaches
the licensed price + the metered overage price in one subscription;
`/api/stripe/portal` returns a self-serve Billing Portal session.

Metered rollup: `node scripts/report-usage.mjs` (daily cron) — per active org,
overage = max(0, count(record_reveals this period) − included_records),
reported with `action: 'set'` so re-runs never double-bill; the reveals PK
already dedupes re-views. Stripe SDK pinned to v17 (last line with
`subscriptionItems.createUsageRecord`).

Env (server-side only): `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
`NEXT_PUBLIC_APP_URL`, plus `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`.

## Platform-admin vs org-member boundary

- **Platform admin** (`/admin`, gated by `is_platform_admin()`): orgs list
  (plan/status/MRR/usage%/seats, sort+filter), org detail (plan override,
  scope-counties editor, nonprofit toggle, comp/pause, seats, usage + reveal
  history, attestations, audit log), billing overview (MRR, tiers, past-due,
  overage revenue), cross-tenant usage, pipeline health (scraper /health proxy).
  All writes audited. APIs: `/api/admin/orgs[/:id]`, `/billing`, `/usage`,
  `/pipeline` — service-role, 403 for non-admins, demo fallback when Supabase unset.
- **Org member** (`/dashboard`): the paywalled product — search, record panel,
  assistant. Reads only its own org under RLS; metering via the shared
  `record_reveals` dedupe. Built separately; shares this schema only.
