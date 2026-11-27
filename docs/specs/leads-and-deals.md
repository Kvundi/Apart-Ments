# Leads and deals: how 28homes tracks them

Date: 27 Nov 2026 · Owner: lead-tracker agent · Decisions: Ken

## Routing (from 27 Nov)
All public **WhatsApp** and **Call** buttons (listing page, mobile contact bar, lister profile page) go to
**28Homes' own number** (`NEXT_PUBLIC_CONTACT_PHONE`, optional `NEXT_PUBLIC_CONTACT_WHATSAPP`), not the lister.
The pre-filled WhatsApp message quotes the listing **ref** (first 8 characters of the listing id) and link, and
the lead alert shows the same ref, so Ken can match the chat to the listing and lister. Listers' numbers are no
longer shown publicly; the Post Listing form tells listers that 28Homes passes enquiries on to them.
If `NEXT_PUBLIC_CONTACT_PHONE` is not set, pages fall back to the lister's own number.

Still to do: lock `contact_phone`/`contact_email` (and `profiles.phone`) in the database so they can't be read
through the public API either (needs every public page to select named columns first).

## What counts
- **Lead:** a visitor taps **WhatsApp, Call or Copy number** on a live listing. Saved in `contact_events`
  (anonymous: listing + channel + time).
- **Possible deal:** the lister marks a live listing **Sold** or **Rented** in My Listings. A database trigger
  creates a `deals` row with status `possible`.
- **Confirmed deal:** Ken confirms it on `/admin/listings?tab=deals` with the final price and his commission.
  If the sale didn't come through 28homes, he marks it "not ours / fell through" (`lost`).

## Alerts to Ken
| Event | Email | SMS |
|---|---|---|
| New lead | yes | yes |
| Possible deal | yes | yes |

- At most **one lead alert per listing every 10 minutes** (stops spam taps flooding Ken).
- At most **30 alert SMS per day** (`SMS_DAILY_CAP`), so a spam attack can't run up the SMS bill.
- Every alert is logged in `alert_log` (success or error), readable only by the server.
- A channel with missing keys is skipped: email can run without SMS.

## Settings (Vercel → Settings → Environment Variables)
| Name | What | Secret? |
|---|---|---|
| `RESEND_API_KEY` | resend.com → API Keys | yes |
| `KEN_ALERT_EMAIL` | the email that should receive alerts (must be the Resend account email until a domain is verified) | no |
| `ALERTS_FROM_EMAIL` | optional; default `28Homes <onboarding@resend.dev>` | no |
| `AT_USERNAME` | Africa's Talking app username | no |
| `AT_API_KEY` | Africa's Talking → Settings → API Key | yes |
| `KEN_ALERT_PHONE` | e.g. `+2547XXXXXXXX` | no |
| `SMS_DAILY_CAP` | optional; default 30 | no |

## Costs
- Email: free on Resend's free plan (100/day).
- SMS: roughly KES 0.40–0.80 each with Africa's Talking (check your rate after signing up). Worst case with the cap:
  30 × KES 0.80 ≈ KES 24/day.
- WhatsApp alerts: later (needs Meta business verification and approved templates).
