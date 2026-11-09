-- Kenyan listing details (additive only: new nullable columns, nothing changed or dropped).
-- What Kenyan renters/buyers actually ask: deposit, service charge, water, power meter,
-- a landmark for directions, and the type of title.

alter table public.properties
  add column if not exists deposit_months  smallint check (deposit_months between 0 and 12),
  add column if not exists service_charge  numeric  check (service_charge >= 0),
  add column if not exists water_sources   text[]   not null default '{}',
  add column if not exists power_meter     text     check (power_meter in ('prepaid_own', 'shared', 'included')),
  add column if not exists landmark        text     check (char_length(landmark) <= 120),
  add column if not exists title_type      text     check (title_type in ('freehold', 'leasehold', 'sectional', 'share_certificate', 'other'));

comment on column public.properties.deposit_months is 'Rent deposit in months of rent (rentals).';
comment on column public.properties.service_charge is 'Monthly service charge in KSh (apartments/estates).';
comment on column public.properties.water_sources  is 'Any of: County supply, Borehole, Storage tank, Rainwater harvesting.';
comment on column public.properties.power_meter    is 'prepaid_own = own KPLC token meter; shared; included = in rent.';
comment on column public.properties.landmark       is 'Nearby landmark for directions, e.g. "behind Yaya Centre".';
comment on column public.properties.title_type     is 'Type of title for sales.';
