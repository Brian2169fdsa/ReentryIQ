# ReentryIQ

Arizona release intelligence for reentry & recovery programs. Search every upcoming
release, get alerted as dates land, and push matches into your CRM. Built by Manage AI.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind/CSS variables · Supabase
(database + auth) · Vercel AI SDK + Anthropic (AI data assistant) · Vercel (hosting)

## Routes

| Area | Routes |
|---|---|
| Marketing | `/` `/pricing` `/connectors` `/developers` `/about` `/mission` `/contact` `/careers` |
| Resources | `/data-sourcing` `/compliance` `/help` `/status` |
| Legal | `/terms` `/privacy` `/acceptable-use` `/fcra-notice` |
| App | `/dashboard` (search engine) `/agent` (AI data assistant) |
| Admin | `/admin` (users, attestations, data status — admin accounts only) |
| Auth | `/signin` `/signup` (with permitted-use attestation) `/auth/callback` |
| API | `POST /api/agent` (AI assistant) · `/api/admin/*` (admin, role-guarded) |

## Local development

```bash
npm install
cp .env.local.example .env.local   # fill in keys (optional — app runs in demo mode without)
npm run dev
```

Without env vars the entire app runs on a deterministic **demo dataset**
(fictional names; only facility/county names are real public reference data)
and labels itself "Sample data."

## Environment variables (Vercel → Settings → Environment Variables)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (client reads, RLS-guarded) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only; seeding/ingestion |
| `ANTHROPIC_API_KEY` | AI data assistant (`/agent`, dashboard Ask AI) |

## Connecting real data

1. **Create the schema** — run the files in the Supabase SQL editor, in order:
   - `supabase/migrations/0001_releases.sql`
   - `supabase/migrations/0002_releases_full_schema.sql`
   - `supabase/migrations/0003_profiles_admin.sql` (profiles, roles, signup trigger)
2. **Load rows** into `public.releases`. To verify the pipeline first, seed demo rows:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-demo-data.mjs
   ```
   Your real ADCRR importer should produce the same row shape (see the script).
3. That's it. `lib/data-source.ts` and the AI agent automatically switch from demo
   to live data whenever the table has rows; "Sample data" labels disappear.

## Admin

The platform admin is `brianreinhart3617@gmail.com` (allowlisted in `lib/admin.ts`
and `public.is_admin_email()` — keep the two in sync). Sign up with that email and
the signup trigger grants the admin role automatically. Admins get an **Admin**
link in the dashboard topbar and access to `/admin`: platform overview &
go-live checklist, user management (roles, suspensions, attestation audit), and
data status. The admin account cannot be demoted or suspended.

## Data & compliance posture

Records are sourced from public ADCRR data, refreshed daily; release dates can change
at the agency's discretion. ReentryIQ is **not a consumer reporting agency** — the data
must never be used for employment, tenant, credit, or insurance screening or any other
FCRA-covered purpose. Every account attests to permitted use at signup (`/signup` step 2).
