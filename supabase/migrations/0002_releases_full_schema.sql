-- Extend releases to the full record shape used across the app.
-- Run after 0001_releases.sql.

alter table public.releases
  add column if not exists doc_number     text,
  add column if not exists unit           text,
  add column if not exists custody        text,         -- Minimum | Medium | Close
  add column if not exists supervision    text,         -- Community Supervision | Standard Probation | Absolute Discharge
  add column if not exists sentence_years numeric(5,2),
  add column if not exists age            integer check (age between 18 and 110);

create index if not exists releases_doc_number_idx  on public.releases (doc_number);
create index if not exists releases_match_score_idx on public.releases (match_score desc);
create index if not exists releases_facility_idx    on public.releases (facility);
