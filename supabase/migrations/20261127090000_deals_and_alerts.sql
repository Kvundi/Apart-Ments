-- Lead tracking + deal tracking (see docs/specs/leads-and-deals.md).
-- Additive only: two new tables and one trigger. Nothing existing changes.

-- ── 1. Deals ────────────────────────────────────────────────────────────────
-- A "possible" deal is created automatically when a lister marks a listing
-- Sold or Rented. Ken confirms it (with price + commission) or marks it lost.
create table if not exists public.deals (
  id             uuid        primary key default gen_random_uuid(),
  property_id    uuid        not null references public.properties(id) on delete cascade,
  status         text        not null default 'possible' check (status in ('possible', 'confirmed', 'lost')),
  listing_status text        check (listing_status in ('Sold', 'Rented')),
  deal_price     numeric     check (deal_price >= 0),
  commission     numeric     check (commission >= 0),
  notes          text        check (char_length(notes) <= 1000),
  reported_at    timestamptz not null default now(),   -- when the lister marked it Sold/Rented
  notified_at    timestamptz,                          -- when Ken was alerted
  decided_at     timestamptz,                          -- when Ken confirmed or marked it lost
  decided_by     text,                                 -- Ken's Clerk user id
  created_at     timestamptz not null default now()
);

create index if not exists deals_status_idx on public.deals (status, reported_at desc);
-- At most one open ("possible") deal per listing at a time.
create unique index if not exists deals_one_open_per_listing
  on public.deals (property_id) where status = 'possible';

-- RLS on, no policies: only the server (service role) can read or write deals.
alter table public.deals enable row level security;

-- ── 2. Alert log (throttling + SMS daily cap + history) ─────────────────────
create table if not exists public.alert_log (
  id          uuid        primary key default gen_random_uuid(),
  kind        text        not null check (kind in ('lead', 'deal')),
  channel     text        not null check (channel in ('email', 'sms')),
  property_id uuid        references public.properties(id) on delete set null,
  ok          boolean     not null default true,
  detail      text        check (char_length(detail) <= 500),
  created_at  timestamptz not null default now()
);

create index if not exists alert_log_recent_idx on public.alert_log (created_at desc);
create index if not exists alert_log_property_idx on public.alert_log (property_id, kind, created_at desc);

alter table public.alert_log enable row level security;

-- Speeds up the Leads tab (recent taps).
create index if not exists contact_events_recent_idx on public.contact_events (created_at desc);

-- ── 3. Sold / Rented  ->  possible deal ─────────────────────────────────────
-- SECURITY DEFINER so an owner's status change can create the deal row even though
-- owners can't write to `deals` directly. It only ever inserts a 'possible' deal.
create or replace function public.record_possible_deal()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status in ('Sold', 'Rented')
     and new.status is distinct from old.status
     and old.verification_status = 'approved' then
    insert into public.deals (property_id, listing_status)
    values (new.id, new.status)
    on conflict (property_id) where status = 'possible' do nothing;
  end if;
  return new;
end;
$$;

revoke execute on function public.record_possible_deal() from public, anon, authenticated;

create or replace trigger record_possible_deal
  after update of status on public.properties
  for each row execute function public.record_possible_deal();
