-- Each listing carries the name of its owner/agent alongside contact_phone.
-- Run in the Supabase SQL editor (or `supabase db push`).

alter table public.properties
  add column if not exists contact_name text;

-- Backfill existing listings from the lister's profile where possible.
update public.properties p
set contact_name = pr.display_name
from public.profiles pr
where p.contact_name is null
  and pr.user_id = p.user_id
  and coalesce(trim(pr.display_name), '') <> '';

update public.properties p
set contact_phone = pr.phone
from public.profiles pr
where coalesce(trim(p.contact_phone), '') = ''
  and pr.user_id = p.user_id
  and coalesce(trim(pr.phone), '') <> '';
