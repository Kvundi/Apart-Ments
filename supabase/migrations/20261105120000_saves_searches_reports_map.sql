-- Saved homes, saved searches, listing reports, and map coordinates.
-- Run in the Supabase SQL editor AFTER 20261105000000_add_property_contact_name.sql.
--
-- Auth note: users sign in with Clerk, and the app sends Supabase a Clerk JWT
-- (the "supabase" JWT template). The Clerk user id is the token's `sub` claim,
-- which is what `auth.jwt() ->> 'sub'` reads in the policies below.

-- ── 1. Map coordinates on listings ─────────────────────────────────────────
alter table public.properties
  add column if not exists latitude  double precision,
  add column if not exists longitude double precision;

alter table public.properties
  drop constraint if exists properties_lat_lng_range;
alter table public.properties
  add constraint properties_lat_lng_range check (
    (latitude is null and longitude is null)
    or (latitude between -90 and 90 and longitude between -180 and 180)
  );

-- ── 2. Saved homes (synced across devices for signed-in users) ─────────────
create table if not exists public.saved_properties (
  user_id     text        not null,
  property_id uuid        not null references public.properties(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, property_id)
);

alter table public.saved_properties enable row level security;

drop policy if exists "saved_properties: owner reads"   on public.saved_properties;
drop policy if exists "saved_properties: owner inserts" on public.saved_properties;
drop policy if exists "saved_properties: owner deletes" on public.saved_properties;

create policy "saved_properties: owner reads" on public.saved_properties
  for select using ((auth.jwt() ->> 'sub') = user_id);
create policy "saved_properties: owner inserts" on public.saved_properties
  for insert with check ((auth.jwt() ->> 'sub') = user_id);
create policy "saved_properties: owner deletes" on public.saved_properties
  for delete using ((auth.jwt() ->> 'sub') = user_id);

-- ── 3. Saved searches + alert bookkeeping ──────────────────────────────────
create table if not exists public.saved_searches (
  id               uuid        primary key default gen_random_uuid(),
  user_id          text        not null,
  email            text,                          -- where alerts go (copied from Clerk at save time)
  label            text        not null,          -- e.g. "For Rent · Apartment · Kilimani"
  query            text        not null,          -- URL query string, e.g. "type=rent&location=Kilimani"
  frequency        text        not null default 'daily' check (frequency in ('instant', 'daily', 'weekly', 'off')),
  last_checked_at  timestamptz not null default now(),  -- listings newer than this are "new"
  last_notified_at timestamptz,
  created_at       timestamptz not null default now(),
  unique (user_id, query)
);

alter table public.saved_searches enable row level security;

drop policy if exists "saved_searches: owner reads"   on public.saved_searches;
drop policy if exists "saved_searches: owner inserts" on public.saved_searches;
drop policy if exists "saved_searches: owner updates" on public.saved_searches;
drop policy if exists "saved_searches: owner deletes" on public.saved_searches;

create policy "saved_searches: owner reads" on public.saved_searches
  for select using ((auth.jwt() ->> 'sub') = user_id);
create policy "saved_searches: owner inserts" on public.saved_searches
  for insert with check ((auth.jwt() ->> 'sub') = user_id);
create policy "saved_searches: owner updates" on public.saved_searches
  for update using ((auth.jwt() ->> 'sub') = user_id) with check ((auth.jwt() ->> 'sub') = user_id);
create policy "saved_searches: owner deletes" on public.saved_searches
  for delete using ((auth.jwt() ->> 'sub') = user_id);
-- The alerts job uses the service-role key, which bypasses RLS.

-- ── 4. Listing reports ("Report this listing") ─────────────────────────────
create table if not exists public.listing_reports (
  id               uuid        primary key default gen_random_uuid(),
  property_id      uuid        not null references public.properties(id) on delete cascade,
  reporter_user_id text,                          -- null for signed-out visitors
  reason           text        not null check (reason in (
                     'viewing_fee', 'fake', 'unavailable', 'wrong_details', 'scam', 'other')),
  details          text        check (char_length(details) <= 2000),
  reporter_contact text        check (char_length(reporter_contact) <= 100),
  status           text        not null default 'open' check (status in ('open', 'reviewed', 'actioned', 'dismissed')),
  created_at       timestamptz not null default now()
);

create index if not exists listing_reports_property_idx on public.listing_reports (property_id, created_at desc);
create index if not exists listing_reports_open_idx     on public.listing_reports (status) where status = 'open';

alter table public.listing_reports enable row level security;

drop policy if exists "listing_reports: anyone can report" on public.listing_reports;

-- Anyone (signed in or not) may file a report. Nobody can read reports through
-- the public API — review them in the Supabase dashboard (Table Editor).
-- A signed-in reporter can only attach their own user id.
create policy "listing_reports: anyone can report" on public.listing_reports
  for insert
  with check (
    status = 'open'
    and (reporter_user_id is null or reporter_user_id = (auth.jwt() ->> 'sub'))
  );

-- Handy view for the review queue: listings with the most open reports first.
create or replace view public.listing_report_queue
with (security_invoker = true) as
select p.id as property_id, p.title, p.location, p.verification_status,
       count(r.*) filter (where r.status = 'open') as open_reports,
       max(r.created_at) as last_reported_at
from public.listing_reports r
join public.properties p on p.id = r.property_id
group by p.id, p.title, p.location, p.verification_status
order by open_reports desc, last_reported_at desc;
