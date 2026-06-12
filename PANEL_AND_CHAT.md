# Record Slide-Out Panel + AI Chat — Implementation Notes

## Record panel (`components/dashboard/InmatePanel.tsx`)

480px right drawer, scrim, Esc/scrim close, body-scroll lock. Opens from any
record click in the dashboard (table rows, compact cards, Top Match Score KPI).

### Field map (mirrors the scraper's SECTION_SCHEMAS)

| Group | Fields |
|---|---|
| Header | mugshot, `last_name, first_name middle_initial`, `adc_number` (mono), status pill, `custody_class` |
| Release block (most prominent) | `prison_release_date` (display 26px), countdown chip when 0 ≤ days < 90 (warn tokens), `release_type`, `admission_date`, `projected_eligible_release_date` |
| Demographics | `gender`, `age`, `height`, `weight`, `hair`, `eye`, `ethnic_origin` |
| Custody & Location | `complex`, `unit`, `last_movement`, `as_of_date`, `status` |
| Collapsible tables (in order, with counts) | Commitment & Sentences · Disciplinary Infractions · Disciplinary Appeals · Profile Classification · Parole Actions · Work Programs · Detainers/Warrants |

Status pill tones: Active → brand blue wash · Released → blue-100/blue-900 ·
Inactive → slate · Hold/Deceased → danger. All from Vera tokens; zero inline hex.
Dates/IDs/cause numbers render in IBM Plex Mono (`po-mono`). Nulls always "—".

### Data path

`GET /api/records/[adc]` → `lib/scope.ts` (scope check + **metered reveal**)
→ `lib/inmate-record.ts`:
1. Supabase `inmates` row by `adc_number` + the seven child tables
   (`inmate_sentences`, `inmate_disciplinary`, `inmate_disciplinary_appeals`,
   `inmate_classifications`, `inmate_parole_actions`, `inmate_work_programs`,
   `inmate_detainers`) + `raw` jsonb.
2. Fallback: deterministic demo records (incl. test record **ADC 380700,
   Vallene Smith**, fictional) so the panel works before live data lands.
Child tables render generically from row keys, so promoted columns appear
without UI changes.

## Mugshot proxy (`/api/mugshot/[adc]`)

The scraper serves `GET /inmate/{adc}/mugshot.jpg` on loopback only — the
browser can never reach it. This route proxies server-side from
`SCRAPER_BASE_URL` (default `http://127.0.0.1:8000`), 4s timeout, response
cached (`max-age=86400, stale-while-revalidate`). Any failure returns a neutral
SVG silhouette (200, `X-Mugshot: fallback`, 5-min cache) so the panel never
shows a broken image.

## AI chat (`/api/chat`)

`claude-sonnet-4-6` via the AI SDK; `ANTHROPIC_API_KEY` is read server-side
only (route returns 503 with a friendly client notice if unset). The model
NEVER writes SQL — it gets exactly two tools:

### `query_releases` (lib/release-query.ts)
```jsonc
{
  "intent": "count | list | breakdown",
  "group_by": "county | complex | status | week | score_band", // breakdown only
  "county": "Maricopa", "complex": "Perryville", "status": "Active",
  "window_days_from": 0, "window_days_to": 180,   // clamped 0..730
  "min_score": 70, "limit": 10                     // list capped at 25
}
```
Whitelisted, parameterized reads over the `records` view (falls back to
`releases`, then demo). Results render in the dashboard's visual pattern:
blue-ramp horizontal bars + a one-line bold insight (the assistant's text).

### `reveal_record`
Returns one person's summary by ADC number — routed through the SAME
`recordReveal()` chokepoint as the panel, so a chat reveal meters identically
to a panel open. Summary fields only; the panel is the full record.

## Scope guard (`lib/scope.ts`)

Single chokepoint: `getScope()` (currently hardcoded single-org full scope),
`scopeCounties()` (clamps any county filter; out-of-scope requests return
empty, never leak), `recordReveal()` (metering). The record API, both chat
tools, and future REST endpoints all pass through here — multi-tenant
entitlements land by changing this one file.

## Surfaces

- Dashboard right rail: `ReentryIQ Assistant` (components/dashboard/AssistantRail.tsx)
- Standalone `/agent` page (components/agent/AgentChat.tsx) — same `/api/chat`
- Test queries: panel → ADC 380700 · chat → "releases into Maricopa county next 6 months"
