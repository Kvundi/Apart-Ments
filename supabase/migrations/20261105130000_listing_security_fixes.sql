-- Listing security fixes (found while inspecting the live database, 5 Nov 2026).
--
-- 1. Owners couldn't see their own unapproved listings: the only SELECT policy was
--    "approved + Available", so a new listing vanished from My Listings until review.
-- 2. Any signed-in user could INSERT a listing with any user_id and any
--    verification_status — i.e. approve their own listing and skip review.
-- 3. Owners could UPDATE verification_status / admin_notes / user_id on their listings.
-- 4. public.handle_new_user() (leftover from Supabase Auth, unused with Clerk) was
--    callable by anyone through the API.
--
-- Written with ALTER/CREATE OR REPLACE (no DROP statements) so it applies cleanly
-- through tools that ask for extra confirmation on drops.

-- ── 1. Owners can read their own listings (any status) ─────────────────────
create policy "Owners can view own listings" on public.properties
  for select to authenticated
  using (user_id = (auth.jwt() ->> 'sub'));

-- ── 2 & 3. Inserts/updates must be for the signed-in user ──────────────────
alter policy "Users can submit listings" on public.properties
  to authenticated
  with check (user_id = (auth.jwt() ->> 'sub'));

alter policy "Users can update own listings" on public.properties
  to authenticated
  using (user_id = (auth.jwt() ->> 'sub'))
  with check (user_id = (auth.jwt() ->> 'sub'));

-- Review fields can only be changed by the team (dashboard / service role),
-- never through the public API by a listing owner.
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
    else
      new.verification_status := old.verification_status;
      new.admin_notes := old.admin_notes;
    end if;
  end if;
  return new;
end;
$$;

create or replace trigger protect_listing_review_fields
  before insert or update on public.properties
  for each row execute function public.protect_listing_review_fields();

-- Trigger functions don't need to be callable through the API.
revoke execute on function public.protect_listing_review_fields() from public, anon, authenticated;

-- ── 4. Lock down the unused Supabase-Auth helper ───────────────────────────
do $$
begin
  if exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
             where n.nspname = 'public' and p.proname = 'handle_new_user') then
    revoke execute on function public.handle_new_user() from public, anon, authenticated;
  end if;
end $$;
