-- Commission invoices + payments (see docs/specs/payments.md).
-- Additive only: one new column on properties, two new tables, one helper function.
--
-- Who pays: the lister (owner or agent), and only when a deal closes with a client
-- 28Homes introduced. Rates: 3% of the final sale price; one month's rent for a letting.
-- Invoices can only be created once EARB_REG_NO and EARB_PRACTISING_CERT_NO are set
-- on the server (checked in the app, see lib/payments.ts).

-- ── 1. Lister accepted the commission terms when posting ────────────────────
alter table public.properties
  add column if not exists commission_terms_accepted_at timestamptz;

-- ── 2. Invoices ─────────────────────────────────────────────────────────────
create sequence if not exists public.invoice_number_seq start 1;

create table if not exists public.invoices (
  id             uuid        primary key default gen_random_uuid(),
  number         text        not null unique default (
                   '28H-' || to_char(now() at time zone 'Africa/Nairobi', 'YYYY') || '-' ||
                   lpad(nextval('public.invoice_number_seq')::text, 4, '0')),
  -- Secret part of the pay link (/pay/<token>). Random, so links can't be guessed.
  pay_token      uuid        not null unique default gen_random_uuid(),
  -- Kept (set null) if the listing or deal is later deleted, so the money record survives.
  deal_id        uuid        references public.deals(id) on delete set null,
  property_id    uuid        references public.properties(id) on delete set null,
  property_title text        check (char_length(property_title) <= 200),
  payer_user_id  text,
  payer_name     text        check (char_length(payer_name) <= 120),
  payer_phone    text        check (char_length(payer_phone) <= 20),
  deal_type      text        not null check (deal_type in ('sale', 'rent')),
  deal_price     numeric     not null check (deal_price > 0),
  rate_label     text        not null check (char_length(rate_label) <= 60),
  subtotal       numeric     not null check (subtotal >= 0),
  vat            numeric     not null default 0 check (vat >= 0),
  amount         numeric     not null check (amount > 0),
  amount_paid    numeric     not null default 0 check (amount_paid >= 0),
  currency       text        not null default 'KES' check (currency = 'KES'),
  status         text        not null default 'pending' check (status in ('pending', 'paid', 'cancelled')),
  due_date       date        not null,
  notes          text        check (char_length(notes) <= 1000),
  created_by     text        not null,
  created_at     timestamptz not null default now(),
  paid_at        timestamptz,
  cancelled_at   timestamptz,
  reminded_at    timestamptz
);

-- One live invoice per deal (a cancelled one can be replaced).
create unique index if not exists invoices_one_active_per_deal
  on public.invoices (deal_id) where status <> 'cancelled';
create index if not exists invoices_status_idx on public.invoices (status, due_date);

-- ── 3. Payments (online via IntaSend, or recorded by Ken) ───────────────────
create table if not exists public.payments (
  id             uuid        primary key default gen_random_uuid(),
  invoice_id     uuid        not null references public.invoices(id) on delete restrict,
  method         text        not null check (method in ('mpesa_stk', 'intasend_checkout', 'bank_transfer', 'mpesa_manual')),
  amount         numeric     not null check (amount > 0),
  status         text        not null default 'pending' check (status in ('pending', 'complete', 'failed')),
  provider_ref   text        unique,                                   -- IntaSend invoice_id
  checkout_id    text,                                                 -- IntaSend checkout id
  reference      text        check (char_length(reference) <= 80),     -- M-Pesa code / bank reference
  provider       text        check (char_length(provider) <= 40),      -- e.g. M-PESA, CARD-PAYMENT
  failure_reason text        check (char_length(failure_reason) <= 300),
  recorded_by    text,                                                 -- Ken's Clerk id for manual entries
  created_at     timestamptz not null default now(),
  completed_at   timestamptz
);

create index if not exists payments_invoice_idx on public.payments (invoice_id, created_at desc);
-- The same bank / M-Pesa reference can't be recorded twice.
create unique index if not exists payments_manual_reference
  on public.payments (method, upper(reference))
  where reference is not null and method in ('bank_transfer', 'mpesa_manual');

-- RLS on, no policies: only the server (service role) can read or write money records.
alter table public.invoices enable row level security;
alter table public.payments enable row level security;
revoke all on public.invoices, public.payments from anon, authenticated;
revoke all on sequence public.invoice_number_seq from anon, authenticated;

-- ── 4. Recalculate an invoice from its completed payments ───────────────────
-- Locks the invoice row so two payments finishing at once can't race.
create or replace function public.refresh_invoice_status(p_invoice uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_amount numeric;
  v_status text;
  v_paid   numeric;
begin
  select amount, status into v_amount, v_status
    from public.invoices where id = p_invoice for update;
  if not found then return null; end if;

  select coalesce(sum(amount), 0) into v_paid
    from public.payments where invoice_id = p_invoice and status = 'complete';

  if v_status = 'cancelled' then
    update public.invoices set amount_paid = v_paid where id = p_invoice;
    return v_status;
  end if;

  update public.invoices
     set amount_paid = v_paid,
         status  = case when v_paid >= v_amount then 'paid' else 'pending' end,
         paid_at = case when v_paid >= v_amount then coalesce(paid_at, now()) else null end
   where id = p_invoice
  returning status into v_status;
  return v_status;
end;
$$;

revoke execute on function public.refresh_invoice_status(uuid) from public, anon, authenticated;
grant execute on function public.refresh_invoice_status(uuid) to service_role;

-- ── 5. Payment alerts for Ken ───────────────────────────────────────────────
alter table public.alert_log drop constraint if exists alert_log_kind_check;
alter table public.alert_log
  add constraint alert_log_kind_check check (kind in ('lead', 'deal', 'payment'));
