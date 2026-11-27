# 28homes listing verification — spec v1

Owner: verification officer agent · Approver: Ken · Status: **draft, waiting for Ken's approval**
Date: 26 Nov 2026

## Goal

No fake listings and no viewing-fee scams. A renter should be able to tell, at a glance,
how much 28homes has actually checked a listing — and the badge must never claim more
than we did.

## Problem found in the current site

Two different ideas share one column today:

- `verification_status = 'approved'` means **"the team let it go live"** (the public can only
  see `approved` listings — that is how the database rules work).
- The code also treats `approved` as **"Verified"**, so every live listing shows a
  Verified badge even if nobody has visited it.

Fix: keep `verification_status` for **publishing** (is it live?) and add a separate
`verification_level` for **trust** (how much did we check?).

## 1. Publishing (moderation) — `verification_status`

| Value | Meaning | Who sees it |
|---|---|---|
| `pending` | New or waiting for review (default for every new listing) | Owner only |
| `approved` | Reviewed and live | Everyone (if `status = 'Available'` and not expired) |
| `rejected` | Not allowed to go live; reason goes in `admin_notes` | Owner only (shows "Needs changes") |

Only Ken (through the admin page) can change this. The existing database trigger already
stops owners from changing it.
When an owner edits a `rejected` listing it goes back to `pending` automatically, so they can
fix the problem and resubmit; Ken's last note stays visible to them.

## 2. Trust — `verification_level` (new column, 0 to 3)

| Level | Name | How it is earned | Badge shown to the public |
|---|---|---|---|
| 0 | Not verified | Default. Listing is live but not checked | none |
| 1 | Phone confirmed | Ken (or later an SMS code) confirms the contact phone reaches the real owner/agent | "Phone confirmed" (grey) |
| 2 | Owner verified | Ken checks the landlord's or agent's identity (ID seen in person or on a video call; for agents also EARB registration) | "Verified owner" (green) |
| 3 | Property visited | Ken visits, or does a live video walk-through with geotagged photos, and confirms the unit exists and matches the photos | "Verified · visited" (green, strongest) |

Rules:

- A level can only be set on an `approved` listing.
- Setting a level records **who** (`verified_by` = Ken's Clerk user id) and **when** (`verified_at`).
- Every change is logged in a new `verification_events` table (listing, old level, new level,
  action, note, who, when). Nobody can read it through the public API.
- **The "Verified" filter on the search page shows level 2 and above.**
- **Auto-downgrade:** if the owner later changes the location, address, photos or contact
  phone of a listing at level 1 or above, the level drops back to 0 automatically. This
  stops "verify a real flat, then swap in fake photos" scams. Price changes do not reset it.
  (The admin page shows the level going back to 0; automatic resets are not written to the event log.)
- **ID numbers are never stored.** Ken notes only "ID seen ✓" (and the agent's EARB number, which is
  public) in the event note.

Phone confirmation by SMS code is **not** in phase 1: it needs a paid SMS provider. For now Ken
calls the number and sets level 1 by hand. Revisit after launch (cost estimate needed).

## 3. Automatic scam flags (shown on the admin page only)

Flags are warnings for Ken, not automatic rejections. They are worked out when the admin page
loads, so nothing new is stored.

| Flag | Rule | Strength |
|---|---|---|
| Price far below area | Price is under 50% of the median for the same listing type + property type (+ bedrooms when there are enough) in the same location; needs at least 3 comparable live listings, otherwise compares across all locations | Strong |
| Viewing-fee words | Title or description mentions viewing fee, booking fee, pay before viewing, send money, M-Pesa till/paybill, deposit to reserve, etc. | Strong |
| Reported | Has open reports from the public ("Report this listing") | 1 report = warning, 2+ = strong |
| Burst of listings | The same account created 5 or more listings within 7 days | Warning |
| Reused photo | A photo link on this listing also appears on a listing from a different account | Strong |

Later (not phase 1): true duplicate-photo detection by image fingerprint, and reverse image search.

## 4. Database changes

One new migration (`supabase/migrations/20261126120000_verification_levels.sql`), additive only:

- `properties`: add `verification_level smallint not null default 0` (0–3),
  `verified_at timestamptz`, `verified_by text`.
- Allow `verification_status` values `pending`, `approved`, `rejected` (check constraint).
- New table `verification_events` with row level security on and **no** public policies
  (only the server, using the service-role key, can read or write it).
- Update the `protect_listing_review_fields` trigger so owners can never set
  `verification_level`, `verified_at` or `verified_by`, and apply the auto-downgrade rule.
- Existing live listings start at level 0, so **their Verified badges will disappear until
  Ken verifies them**. This is intended: the badge was overstating what we had checked.

## 5. Admin page (task 2)

- Address: `/admin/listings`. Only Clerk user ids listed in `ADMIN_USER_IDS` can open it
  (falls back to `COMPANY_AGENT_USER_ID`). Everyone else gets "not found".
- Tabs: **Pending** (newest first), **Reports** (open reports), **Live** (with current level).
- Per listing: photos, price, location, owner contact, flags, open reports, and buttons:
  Approve, Reject (with a reason), and set level 0–3 with a short note.
- Per report: Mark reviewed / Actioned / Dismissed.
- Uses the Supabase service-role key on the server only. Never sent to the browser.

## Definition of done

- A listing's level shows correctly on the card and the detail page.
- Flags appear for test scam listings (cheap price, "viewing fee" in the text, reported twice).
- Ken can approve a pending listing and mark it verified from his phone; the badge appears.
- A different signed-in account opening `/admin/listings` gets "not found".
