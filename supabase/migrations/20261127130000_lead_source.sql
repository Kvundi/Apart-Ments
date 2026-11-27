-- Campaign source on leads (see lib/source.ts): which social post or ad brought the
-- visitor, e.g. 'tt-1201'. Additive only.
alter table public.contact_events
  add column if not exists source text check (source ~ '^[a-z0-9][a-z0-9-]{0,39}$');

create index if not exists contact_events_source_idx
  on public.contact_events (source, created_at desc) where source is not null;
