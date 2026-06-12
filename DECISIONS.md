# DECISIONS.md — ReentryIQ Next.js app

Autonomous decisions made while building, newest first.

## 2026-06-12 — Data gate (sample vs real)

- lib/data-gate.ts replaces lib/scope.ts as THE chokepoint (scope.ts retained
  but no longer imported by gated paths). Real data requires active|comped
  status + fcra_ack attestation + in-scope county; everything else is sample.
- fetchReleases() now calls /api/data/releases — no client-side release-table
  access remains anywhere; the "Sample data" pill is driven by the server's
  mode, not a UI flag.
- meterReveal() persists to record_reveals (existing PK dedupe, reused) +
  usage_events; metering failures never block reads (daily rollup reconciles).
- Sample-mode record lookups use demoRecord() directly — a sample caller
  probing a real ADC gets 404, not data.
- Migration 0005: signup trigger creates org (free/trialing = sample) + owner
  membership + attestation from signup metadata; Stripe webhook's status flip
  is the entitlement switch. Seeded Sanctuary Recovery attestation as the
  entitled test org.

## 2026-06-12 — Platform admin + Stripe billing

- Stripe SDK pinned to v17.7.0: the spec's metered rollup uses
  `subscriptionItems.createUsageRecord`, removed in SDK v18+. v17 is the newest
  line exposing it (apiVersion 2025-02-24.acacia).
- Webhook idempotency = claim-first insert into `stripe_events` (23505 → duplicate,
  200 immediately). Rollup idempotency = `action: 'set'` per period.
- Price identity via lookup_keys (`{plan}_{monthly|annual|overage}`); products
  matched by `metadata.reentryiq_plan` — setup script re-runs are no-ops.
- MRR rule in admin: annual interval ÷ 12; comped/paused/canceled count $0.
- Admin gate accepts: platform_admins table (via is_platform_admin RPC), the
  hardcoded operator email, or profiles.role='admin' (legacy) — in that order.
- All admin/billing routes degrade to deterministic demo data when Supabase env
  is unset; nothing crashes in an unconfigured deploy.

## 2026-06-12 — Record panel + AI chat + light dashboard redesign

- **Environment reality:** the scraper (FastAPI on 127.0.0.1:8000, report_html.py,
  its .env) does not exist in this cloud workspace. Built to the field layout
  specified in the brief (mirrors SECTION_SCHEMAS); mugshot proxy targets
  `SCRAPER_BASE_URL` env (default loopback :8000) so it works when deployed
  beside the scraper. `ANTHROPIC_API_KEY` must be set in Vercel — /api/chat
  returns a graceful 503 until then.
- **Demo fallback everywhere:** Supabase `inmates`/child tables/`records` view
  are read first; absent schema falls back to the deterministic demo dataset,
  including test record ADC 380700 (Vallene Smith, fictional) so the DONE-WHEN
  tests pass before live data lands. Live data wins automatically.
- **Dashboard shell:** rebuilt to the light design (per user screenshots) —
  light sidebar w/ plan card + integrations, top global search, persistent
  right Assistant rail, main Dashboard home (Horizon, KPI deltas, insight band,
  Releases Over Time, county donut, saved searches, alerts). The previously
  shipped KPI row + Visual/Table/Compact data area was kept (user request) as
  the **Search & Discover** view; FilterRail recolored navy → light tokens.
  Record clicks everywhere open the new 480px InmatePanel.
- **Scope chokepoint:** lib/scope.ts is the single entitlement gate (hardcoded
  single-org full scope for now). Panel API + both chat tools route through it;
  chat reveal_record meters via the same recordReveal() as panel opens.
- **Tokens:** added --po-warn/-danger/-slate (+washes/lines) to the token file;
  new components use tokens exclusively (no inline hex). KPI delta chips on the
  home view show static "vs prior 60 days" comparisons — the dataset only spans
  forward from today, so prior-period deltas are demo copy until history lands.
- Older components (navy Shell.tsx, RecordDrawer.tsx) are superseded by the new
  shell + InmatePanel and no longer imported.

## Earlier

- Brand: light surfaces, navy #0F172A, blue #4A90E2 accent, no shadows,
  radii ≤ 8px, Montserrat/Inter/IBM Plex Mono (see app/globals.css tokens).
- Supabase is source of truth; demo data only when unconfigured; "Sample data"
  labels surface whenever demo rows are shown.
- Admin: platform admin is brianreinhart3617@gmail.com (lib/admin.ts +
  public.is_admin_email() in migration 0003 — keep in sync).
