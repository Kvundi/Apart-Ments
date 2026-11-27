-- Verification levels (see docs/specs/verification.md).
-- Run in the Supabase SQL editor AFTER all earlier migrations.
--
-- Separates "published" (verification_status) from "how much we checked"
-- (verification_level 0-3). Additive only: new columns, one new table, a check
-- constraint, and an updated trigger function. Existing live listings start at
-- level 0, so their "Verified" badge disappears until Ken verifies them.

-- ── 1. Trust level on listings ──────────────────────────────────────────────
alter table public.properties
  add column if not exists verification_level smallint not null default 0,
  add column if not exists verified_at        timestamptz,
  add column if not exists verified_by        text;

alter table public.properties
  drop constraint if exists properties_verification_level_range;
alter table public.properties
  add constraint properties_verification_level_range check (verification_level between 0 and 3);

-- Publishing states only (any older value is folded into 'pending' first).
update public.properties
set verification_status = 'pending'
where verification_status is null
   or verification_status not in ('pending', 'approved', 'rejected', 'changes_requested');

alter table public.properties
  drop constraint if exists properties_verification_status_values;
alter table public.properties
  add constraint properties_verification_status_values
  check (verification_status in ('pending', 'approved', 'rejected', 'changes_requested'));

create index if not exists properties_review_queue_idx
  on public.properties (verification_status, created_at desc);

-- ── 2. Audit log of every review decision ───────────────────────────────────
create table if not exists public.verification_events (
  id          uuid        primary key default gen_random_uuid(),
  property_id uuid        not null references public.properties(id) on delete cascade,
  action      text        not null check (action in ('approve', 'reject', 'set_level')),
  old_status  text,
  new_status  text,
  old_level   smallint,
  new_level   smallint,
  note        text        check (char_length(note) <= 500),
  actor       text,       -- Clerk user id of the reviewer; null for automatic changes
  created_at  timestamptz not null default now()
);

create index if not exists verification_events_property_idx
  on public.verification_events (property_id, created_at desc);

-- RLS on with no policies: only the service role (the admin page on the server) can use it.
alter table public.verification_events enable row level security;

-- ── 3. Owners can't touch review fields; risky edits reset the trust level ───
create or replace function public.protect_listing_review_fields()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if current_user in ('anon', 'authenticated') then
    if tg_op = 'INSERT' then
      new.verification_status := 'pending';
      new.admin_notes := null;
      new.expires_at := now() + interval '30 days';
      new.verification_level := 0;
      new.verified_at := null;
      new.verified_by := null;
    else
      new.verification_status := old.verification_status;
      new.admin_notes := old.admin_notes;
      -- "Needs changes": when the owner edits a rejected listing, send it back for review.
      if old.verification_status in ('rejected', 'changes_requested') then
        new.verification_status := 'pending';
      end if;
      if new.expires_at is distinct from old.expires_at then
        new.expires_at := now() + interval '30 days';
      end if;
      new.verification_level := old.verification_level;
      new.verified_at := old.verified_at;
      new.verified_by := old.verified_by;

      -- Auto-downgrade: a verified listing whose location, photos or phone change
      -- must be checked again (stops "verify a real flat, then swap the photos").
      if old.verification_level > 0 and (
           new.location      is distinct from old.location
        or new.address       is distinct from old.address
        or new.images        is distinct from old.images
        or new.contact_phone is distinct from old.contact_phone
      ) then
        new.verification_level := 0;
        new.verified_at := null;
        new.verified_by := null;
      end if;
    end if;
  end if;
  return new;
end;
$$;

-- Keep this function SECURITY INVOKER (the default): the current_user check above
-- depends on it. Trigger functions don't need to be callable through the API.
revoke execute on function public.protect_listing_review_fields() from public, anon, authenticated;

-- Trigger already exists (20261105130000); recreate to be safe.
create or replace trigger protect_listing_review_fields
  before insert or update on public.properties
  for each row execute function public.protect_listing_review_fields();
