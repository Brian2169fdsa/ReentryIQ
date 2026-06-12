-- Tenant + billing schema (additive — touches no inmate/scraper/reveal tables).
-- Run after 0003.

-- ── Platform admins (operator allowlist) ────────────────────────────────
create table if not exists public.platform_admins (
  auth_user_id uuid primary key references auth.users (id) on delete cascade,
  email        text not null,
  created_at   timestamptz not null default now()
);

create or replace function public.is_platform_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.platform_admins where auth_user_id = auth.uid())
      or exists (select 1 from auth.users u where u.id = auth.uid()
                   and lower(u.email) = 'brianreinhart3617@gmail.com')
$$;

-- Seed the operator account if it already exists in auth.users.
insert into public.platform_admins (auth_user_id, email)
select id, email from auth.users where lower(email) = 'brianreinhart3617@gmail.com'
on conflict (auth_user_id) do nothing;

-- ── Orgs & membership ───────────────────────────────────────────────────
create table if not exists public.orgs (
  id                     uuid primary key default gen_random_uuid(),
  name                   text not null,
  plan                   text not null default 'starter',
  status                 text not null default 'trialing'
    check (status in ('trialing','active','past_due','paused','comped','canceled')),
  stripe_customer_id     text,
  stripe_subscription_id text,
  scope_counties         text[],
  segment_verified       boolean not null default false,
  settings               jsonb not null default '{}'::jsonb,
  created_at             timestamptz not null default now()
);

create table if not exists public.org_members (
  id           uuid primary key default gen_random_uuid(),
  org_id       uuid not null references public.orgs (id) on delete cascade,
  auth_user_id uuid not null references auth.users (id) on delete cascade,
  role         text not null default 'member' check (role in ('owner','admin','member')),
  created_at   timestamptz not null default now(),
  unique (org_id, auth_user_id)
);

-- ── Plans ───────────────────────────────────────────────────────────────
create table if not exists public.plan_entitlements (
  plan                 text primary key,
  included_records     integer not null,
  overage_price_cents  integer not null,
  seats                integer not null,
  features             text[] not null default '{}',
  price_monthly_cents  integer not null,
  price_annual_cents   integer not null
);

insert into public.plan_entitlements
  (plan, included_records, overage_price_cents, seats, features, price_monthly_cents, price_annual_cents)
values
  ('starter',    500, 100,  3, array['search','alerts'],                                        9900,  99000),
  ('pro',       2500,  75, 10, array['search','alerts','connectors','saved_searches'],         29900, 299000),
  ('enterprise',10000, 50, 50, array['search','alerts','connectors','saved_searches','api','assistant'], 84900, 849000)
on conflict (plan) do update set
  included_records    = excluded.included_records,
  overage_price_cents = excluded.overage_price_cents,
  seats               = excluded.seats,
  features            = excluded.features,
  price_monthly_cents = excluded.price_monthly_cents,
  price_annual_cents  = excluded.price_annual_cents;

-- ── Usage, metering, compliance, audit ──────────────────────────────────
create table if not exists public.usage_events (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid not null references public.orgs (id) on delete cascade,
  user_id    uuid references auth.users (id) on delete set null,
  record_id  text,
  event_type text not null,
  created_at timestamptz not null default now()
);
create index if not exists usage_events_org_period_idx on public.usage_events (org_id, created_at);

-- Metering dedupe: one billable reveal per record per org per period.
create table if not exists public.record_reveals (
  org_id     uuid not null references public.orgs (id) on delete cascade,
  record_id  text not null,
  period     text not null,             -- e.g. '2026-06'
  created_at timestamptz not null default now(),
  primary key (org_id, record_id, period)
);

create table if not exists public.attestations (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid not null references public.orgs (id) on delete cascade,
  user_id    uuid references auth.users (id) on delete set null,
  use_case   text not null,
  fcra_ack   boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_log (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid references public.orgs (id) on delete set null,
  user_id    uuid references auth.users (id) on delete set null,
  action     text not null,
  target     text,
  created_at timestamptz not null default now()
);
create index if not exists audit_log_org_idx on public.audit_log (org_id, created_at desc);

-- Stripe webhook idempotency.
create table if not exists public.stripe_events (
  id         text primary key,          -- stripe event id
  type       text not null,
  created_at timestamptz not null default now()
);

-- ── RLS: members see their org; platform admins see all ────────────────
alter table public.orgs              enable row level security;
alter table public.org_members       enable row level security;
alter table public.plan_entitlements enable row level security;
alter table public.usage_events      enable row level security;
alter table public.record_reveals    enable row level security;
alter table public.attestations      enable row level security;
alter table public.audit_log         enable row level security;
alter table public.stripe_events     enable row level security;
alter table public.platform_admins   enable row level security;

create or replace function public.is_org_member(check_org uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.org_members m
                  where m.org_id = check_org and m.auth_user_id = auth.uid())
$$;

create policy "orgs member read"        on public.orgs        for select to authenticated using (public.is_org_member(id) or public.is_platform_admin());
create policy "orgs admin write"        on public.orgs        for update to authenticated using (public.is_platform_admin());
create policy "members read own org"    on public.org_members for select to authenticated using (public.is_org_member(org_id) or public.is_platform_admin());
create policy "plans readable"          on public.plan_entitlements for select to authenticated using (true);
create policy "usage member read"       on public.usage_events  for select to authenticated using (public.is_org_member(org_id) or public.is_platform_admin());
create policy "reveals member read"     on public.record_reveals for select to authenticated using (public.is_org_member(org_id) or public.is_platform_admin());
create policy "attest member read"      on public.attestations for select to authenticated using (public.is_org_member(org_id) or public.is_platform_admin());
create policy "audit admin read"        on public.audit_log    for select to authenticated using (public.is_platform_admin());
create policy "stripe events admin"     on public.stripe_events for select to authenticated using (public.is_platform_admin());
create policy "platform admins self"    on public.platform_admins for select to authenticated using (public.is_platform_admin());

-- ── Seed test orgs ──────────────────────────────────────────────────────
insert into public.orgs (name, plan, status, scope_counties, segment_verified)
select 'Sanctuary Recovery', 'pro', 'active', null, true
where not exists (select 1 from public.orgs where name = 'Sanctuary Recovery');

insert into public.orgs (name, plan, status, scope_counties, segment_verified)
select 'Desert Pathways', 'starter', 'trialing', array['Pima','Pinal'], false
where not exists (select 1 from public.orgs where name = 'Desert Pathways');
