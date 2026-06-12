-- Profiles + admin role model.
-- Run after 0002. Creates a profile row automatically for every new signup,
-- copying the org/attestation metadata captured at /signup, and grants the
-- admin role to the designated admin email.

create table if not exists public.profiles (
  id                     uuid primary key references auth.users (id) on delete cascade,
  email                  text not null,
  org_name               text,
  org_type               text,
  role                   text not null default 'member' check (role in ('admin', 'member')),
  status                 text not null default 'active' check (status in ('active', 'suspended')),
  attested_permitted_use boolean not null default false,
  attested_at            timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- Designated platform admins, by email.
create or replace function public.is_admin_email(check_email text)
returns boolean
language sql immutable
as $$
  select lower(check_email) in ('brianreinhart3617@gmail.com')
$$;

-- Auto-create a profile on signup; admins recognized by email.
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, org_name, org_type, role, attested_permitted_use, attested_at)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'org_name',
    new.raw_user_meta_data ->> 'org_type',
    case when public.is_admin_email(new.email) then 'admin' else 'member' end,
    coalesce((new.raw_user_meta_data ->> 'attested_permitted_use')::boolean, false),
    nullif(new.raw_user_meta_data ->> 'attested_at', '')::timestamptz
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for any users that signed up before this migration.
insert into public.profiles (id, email, org_name, org_type, role, attested_permitted_use, attested_at)
select
  u.id,
  u.email,
  u.raw_user_meta_data ->> 'org_name',
  u.raw_user_meta_data ->> 'org_type',
  case when public.is_admin_email(u.email) then 'admin' else 'member' end,
  coalesce((u.raw_user_meta_data ->> 'attested_permitted_use')::boolean, false),
  nullif(u.raw_user_meta_data ->> 'attested_at', '')::timestamptz
from auth.users u
on conflict (id) do nothing;

-- Ensure the admin email holds the admin role even if it signed up earlier.
update public.profiles set role = 'admin' where public.is_admin_email(email);

-- RLS: users read their own profile; admins read and update all.
alter table public.profiles enable row level security;

create policy "Read own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Admins read all profiles"
  on public.profiles for select
  to authenticated
  using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

create policy "Admins update profiles"
  on public.profiles for update
  to authenticated
  using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));
