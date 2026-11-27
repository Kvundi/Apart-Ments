-- Free launch offer: the first 100 listings are free. The homepage counter calls this to
-- show how many slots are left. It returns ONE number (slots used) and nothing else, so it
-- is safe for anonymous visitors. A slot is used by every listing that hasn't been
-- rejected (pending, approved or waiting for changes), so rejected/spam posts don't eat slots.
create or replace function public.free_listing_slots_used()
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::integer
  from public.properties
  where verification_status in ('pending', 'approved', 'changes_requested');
$$;

revoke execute on function public.free_listing_slots_used() from public;
grant execute on function public.free_listing_slots_used() to anon, authenticated, service_role;
