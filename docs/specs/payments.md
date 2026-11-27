# Commission payments and calculator

Status: built 27 Nov 2026, **collection switched off** until EARB registration.

## Rules (Ken's decisions)
- **Who pays:** the lister (owner, landlord or agent). Buyers and tenants never pay 28Homes.
- **Rates:** sale 3% of the final price; letting one month's rent, once. Single source: `lib/commission.ts`.
- **When:** only if 28Homes introduced the client (first contact through 28Homes within 6 months) and the deal closes. Terms section 4.
- **VAT:** off. Set `NEXT_PUBLIC_COMMISSION_VAT_RATE=0.16` once VAT-registered (turnover over KSh 5M a year).
- **Legal gate:** Estate Agents Act Cap 533. No invoice can be created and the pay page takes no money until
  `EARB_REG_NO` and `EARB_PRACTISING_CERT_NO` are set. Both numbers then print on every invoice.

## Flow
1. Lister ticks the commission checkbox on `/add` (stored in `properties.commission_terms_accepted_at`).
2. Lister marks the listing Sold/Rented → possible deal → Ken confirms it on Admin › Deals (commission pre-filled).
3. Admin › Payments › "Ready to invoice" → Create invoice (number `28H-YYYY-NNNN`, due in `INVOICE_DUE_DAYS`, default 7).
4. Ken taps "Send on WhatsApp": opens WhatsApp to the lister with the pay link `/pay/<token>`.
5. Lister pays on the pay page:
   - M-Pesa PIN prompt (IntaSend STK push)
   - card or bank (IntaSend hosted checkout)
   - bank transfer / Paybill using the invoice number as reference → Ken records it in admin.
6. IntaSend webhook → we re-ask IntaSend's status API → payment marked complete → invoice Paid → Ken gets email/SMS.
7. Overdue invoices show red in admin with a "WhatsApp reminder" button.

## Safety
- Money tables (`invoices`, `payments`) are server-only (RLS on, no policies, anon/authenticated revoked).
- Pay links use a random token, are `noindex` and `no-referrer`.
- Webhook checks the challenge, then trusts only IntaSend's status API, matched by `api_ref` = our payment id.
- Max 3 M-Pesa prompts / checkouts per invoice per 10 minutes. Each payment is marked complete once (alert sent once).
- Manual references can't be recorded twice. Only unpaid invoices can be cancelled.

## Environment variables (Vercel, Production)
| Variable | When |
|---|---|
| `EARB_REG_NO`, `EARB_PRACTISING_CERT_NO` | After EARB registration: turns collection on |
| `INTASEND_PUBLISHABLE_KEY`, `INTASEND_SECRET_KEY` | IntaSend dashboard → API keys |
| `INTASEND_TEST=true` | Only while using sandbox keys |
| `INTASEND_WEBHOOK_CHALLENGE` | Same text as the webhook challenge in IntaSend |
| `BANK_NAME`, `BANK_ACCOUNT_NAME`, `BANK_ACCOUNT_NUMBER`, `BANK_BRANCH`, `BANK_SWIFT` | Optional, shown for bank transfer |
| `MPESA_PAYBILL`, `MPESA_PAYBILL_ACCOUNT` | Optional (e.g. your bank's Paybill) |
| `INVOICE_DUE_DAYS` | Optional, default 7 |

Webhook URL to set in IntaSend: `https://<domain>/api/intasend/webhook`.

## Before going live
- Test the full flow with IntaSend **sandbox** keys (`INTASEND_TEST=true`): STK push, checkout, webhook, status.
  Endpoint paths come from IntaSend's public docs (`/api/v1/payment/mpesa-stk-push/`, `/api/v1/checkout/`,
  `/api/v1/payment/status/`); confirm the response fields in sandbox.
- Have an advocate check Terms section 4 (introduction window, due date).

## Files
`lib/commission.ts`, `lib/payments.ts`, `lib/intasend.ts`, `lib/payRoutes.ts`, `components/CommissionCalculator.tsx`,
`components/PayOptions.tsx`, `app/commission/page.tsx`, `app/pay/[token]/page.tsx`, `app/api/pay/{mpesa,checkout,status}`,
`app/api/intasend/webhook`, `app/admin/payments/{page,actions}.ts(x)`, migration `20261127170000_commission_payments.sql` (applied live).
