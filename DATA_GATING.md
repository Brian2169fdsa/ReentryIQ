# Data Gating — sample vs. real

One server-side resolver decides every read: `lib/data-gate.ts → resolveAccess()`.
The client never chooses; hidden buttons are not a gate. RLS backs it up.

## Decision table

| Condition | Result |
|---|---|
| Supabase env unset / resolver error | SAMPLE (`supabase_not_configured` / `resolver_error`) |
| No authenticated user | SAMPLE (`unauthenticated`) |
| User has no org membership | SAMPLE (`no_org`) |
| org.status ∉ {active, comped} (free, trialing, past_due, paused, canceled) | SAMPLE (`status_*`) |
| No attestation row with fcra_ack = true for the org | SAMPLE (`no_attestation`) |
| status ∈ {active, comped} AND attested | **REAL**, clamped to `org.scope_counties` (null = statewide) |

Out-of-scope county requests return empty results — never an error that leaks
existence. An entitled org whose live tables are unreachable degrades to
sample, still labeled sample.

## Gated surfaces (all server-side)

- **Dashboard feed** `GET /api/data/releases` — the only release feed the UI
  reads (`lib/data-source.fetchReleases()` calls it; no client-side table
  access remains). Horizon/KPIs/insights compute from whichever set is returned.
  `mode: 'sample'` ⇒ the "Sample data" pill renders.
- **Record panel** `GET /api/records/[adc]` — sample mode serves ONLY
  `demoRecord()` (synthetic; probing a real ADC → 404). Real mode fetches live,
  enforces sentencing-county scope, then meters via `meterReveal()` →
  `record_reveals` upsert (PK org+record+period — the existing dedupe, reused
  not rebuilt) + `usage_events`. Re-views never re-meter; billing rollup reads
  the same table.
- **AI assistant** `POST /api/chat` — `query_releases` →
  `lib/release-query.ts` calls `resolveAccess()` itself; sample mode never
  touches live tables and the result carries
  `scope_note: "Sample data — org not yet entitled…"` which the model states.
  `reveal_record` uses the identical demo-only/real+meter branch as the panel.
  Inline tables/ramp charts in chat render from tool results in both modes.

## Free signup → sample (migration 0005)

`on_auth_user_created_org` trigger: every signup creates an org
(plan `free`, status `trialing` ⇒ sample), an owner membership, and an
attestation row when the signup attestation boxes were checked. No payment to
sign up and look around. Stripe `checkout.session.completed` webhook flips
status to `active` — with the attestation already on file the SAME resolver
starts returning real data automatically. Admin comp (`status=comped`) works
identically.

## Verification

- Fresh free signup → dashboard shows the pill; `/api/data/releases` returns
  `mode:'sample'`; `/api/records/<real-adc>` → 404; chat answers carry the
  sample scope_note.
- Seeded entitled org (Sanctuary Recovery: active + attested — migration 0005
  seeds the attestation): members see real rows, pill gone, first panel open
  inserts one `record_reveals` row; reopening inserts none.

## Env (Vercel)

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (client),
`SUPABASE_SERVICE_ROLE_KEY` (server only — resolver/metering),
`ANTHROPIC_API_KEY` (assistant), `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET`
(billing), `SCRAPER_BASE_URL` (mugshots/pipeline), `NEXT_PUBLIC_APP_URL`.
