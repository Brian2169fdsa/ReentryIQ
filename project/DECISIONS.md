# DECISIONS.md — ReentryIQ rebrand + Visual data pattern

Autonomous decisions made while executing the rebrand brief. Logged here per instruction.

## Environment
- This work was applied to the **HTML design prototype** (`ReentryIQ Dashboard.html`),
  not the live Next.js repo (no repo is mounted in this environment). The prototype is the
  source of truth for the visual identity; the same tokens/components transfer to the app's
  theme layer. Backend logic, queries, metering, and entitlement gating were **not** touched.

## Brand / tokens
- **Surface = LIGHT (updated per Frontend Design Spec v1.0).** Earlier I shipped a dark-navy
  surface and flagged the open question here. The v1.0 spec resolved it: `--surface #FFFFFF`,
  content on `--surface-2 #F7F9FC`, with **navy reserved for the app shell/rail and the landing
  hero** only. Implemented as a light `:root` token set plus a `.po-shell-dark` sub-theme class
  on the topbar + rail (light-on-navy), so the chrome is navy and the canvas is light.
- Mono is **IBM Plex Mono** (v1.0 spec corrects the earlier JetBrains choice).
- Dashboard KPI #4 is **Usage** (used/included + progress bar that turns `--warn` at 80%,
  `--danger` at 100%), replacing the earlier "Best opportunity" card, per v1.0 §4.
- Blue accent text tuned legible on white (`--po-copper-bright` = `#2E6CB8`); accent tweak
  options stay within the blue family.
- Brand blue `#4A90E2` drives all primary actions, active states, and data emphasis.
- All emphasis flows through one token (`--po-copper*`, value = brand blue) so every
  component recolored with zero structural change. The **Accent** tweak is constrained to
  the on-brand blue family (brand / azure / sky / deep) — no off-brand hues offered.
- Type: **Montserrat** (display/headings), **Inter** (body/UI), **JetBrains Mono**
  (IDs, DOC #s, dates, counts) per the Vera guide.
- **No drop shadows anywhere.** Depth is borders + surface contrast only. Radii ≤ 8px.
- Charts + the Release Horizon use a **graduated blue ramp** (`--po-ramp-1..5`,
  `#1E3A5F → #93C0F2`); out-of-scope/statewide volume is faint slate. No green/orange/copper
  remains in any visualization.

## Naming
- Product renamed **Phoenix Oasis → ReentryIQ** everywhere (wordmark, `<title>`, OG tags,
  description, boot splash, footer, component folder `reentryiq/`). Wordmark = "Reentry"
  in Montserrat SemiBold + "IQ" in brand blue. Canonical/OG URLs → `reentryiq.com`.
- "Sanctuary Recovery" is the demo **customer org**, not the product — left as-is.

## Dashboard data area (Visual pattern)
- Restructured to: Release Horizon → spec KPI row → **Visual data area** with a **View
  toggle** (Visual / Table / Compact cards), persisted to `localStorage` (`reentryiq.viewMode`);
  Visual is the default for new users.
- **KPI cards (4):** Records in Scope · Scored/Pending (revealed vs awaiting review) ·
  Top Match Score (record name beneath) · Best Opportunity (strong matches ≤ 90 days).
  Interpreted "scored/pending" against the existing reveal model and "best opportunity"
  as high-score near-term volume — both defensible from the dataset.
- **View-switch pills** re-render the chart by 3 metrics derived from the data:
  Next 30 days · By county · By match score.
- **Bar chart:** horizontal-labeled, top ~8 by selected metric, graduated blue ramp only,
  labels truncated with full value on hover; bars click through to the record drawer.
- **Insight callout:** single bold sentence with a `#4A90E2` left-border accent,
  auto-generated from the active view's real numbers; regenerates on view switch.
- **Record cards:** score badge pill ("Score 80 · Strong"), masked title, meta line,
  large primary metric, small secondaries. Click opens the drawer — **reveal/metering
  logic unchanged**.
- View toggle switches presentation only; **no data refetch** (same in-memory rows).

## Pages built (HTML prototypes)
- `ReentryIQ Dashboard.html` — light app shell, Release Horizon, Visual/Table/Compact data
  area, record drawer, AI assistant, Tweaks.
- `ReentryIQ Landing.html` (v1.0 §1) — navy hero with a live aggregate-only Horizon demo
  (left-to-right stagger, reduced-motion safe), KPI strip, how-it-works, who-it's-for,
  compliance strip, footer. Nav links across pages.
- `ReentryIQ Pricing.html` (v1.0 §2) — grouped comparison table, Pro elevated + "Most popular",
  monthly/annual + nonprofit toggles (live price recompute), 5-item FAQ accordion.
- **Not yet built** (v1.0 §§3,6,7,8,9,10): Auth/Onboarding + attestation, Saved Searches & Alerts
  detail, Connectors + field mapper, Settings & Billing tabs, Platform Admin. The AI assistant
  and record drawer exist in the dashboard but not yet at full spec depth (e.g. keyboard nav,
  scope pill, push-to-CRM menu).

## Preserved
Layout intent, routing concept, copy (except product name), data queries, metering,
entitlement gating, the Release Horizon signature element, the record drawer reveal flow.
