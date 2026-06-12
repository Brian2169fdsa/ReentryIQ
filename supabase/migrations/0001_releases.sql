-- ReentryIQ releases table
-- Run in Supabase: SQL Editor → paste → Run

create table if not exists public.releases (
  id            bigint generated always as identity primary key,
  first_name    text not null,
  last_name     text not null,
  county        text not null,
  facility      text,
  release_date  date not null,
  offense_class text,
  match_score   integer check (match_score between 0 and 100),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists releases_release_date_idx on public.releases (release_date);
create index if not exists releases_county_idx on public.releases (county);

-- Row Level Security: authenticated users can read; writes are service-role only
alter table public.releases enable row level security;

create policy "Authenticated read access"
  on public.releases for select
  to authenticated
  using (true);
