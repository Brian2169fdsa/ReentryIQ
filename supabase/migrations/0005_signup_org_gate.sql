-- Free signup → org in sample mode. Run after 0004.
-- Every new auth user gets an org (plan 'free', status 'trialing' = SAMPLE
-- mode per the data gate), an owner membership, and an attestation row from
-- the signup metadata. Paying via Stripe (webhook → status 'active') plus the
-- attestation is what flips the org to REAL data — no per-org code changes.

alter table public.orgs drop constraint if exists orgs_plan_check;

create or replace function public.handle_new_user_org()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  new_org uuid;
begin
  insert into public.orgs (name, plan, status)
  values (coalesce(nullif(new.raw_user_meta_data ->> 'org_name', ''), split_part(new.email, '@', 1)), 'free', 'trialing')
  returning id into new_org;

  insert into public.org_members (org_id, auth_user_id, role)
  values (new_org, new.id, 'owner')
  on conflict (org_id, auth_user_id) do nothing;

  if coalesce((new.raw_user_meta_data ->> 'attested_permitted_use')::boolean, false) then
    insert into public.attestations (org_id, user_id, use_case, fcra_ack)
    values (new_org, new.id, coalesce(new.raw_user_meta_data ->> 'org_type', 'unspecified'), true);
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_org on auth.users;
create trigger on_auth_user_created_org
  after insert on auth.users
  for each row execute function public.handle_new_user_org();

-- Test fixture for the gate: Sanctuary Recovery (active) gets an attestation
-- so a member of it sees REAL data; Desert Pathways (trialing) stays sample.
insert into public.attestations (org_id, user_id, use_case, fcra_ack)
select o.id, null, 'Treatment center', true
from public.orgs o
where o.name = 'Sanctuary Recovery'
  and not exists (select 1 from public.attestations a where a.org_id = o.id);
