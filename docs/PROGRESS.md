# 28homes progress

Goal (MVP week): Phase 1 — verified listings + AI house-hunting assistant.
Last meeting: [2026-11-26](meetings/2026-11-26.md)

## To do

- **Plan the AI house-hunting assistant.** Owner: CEO → assistant builder. Next meeting, with a cost estimate first.
- **Ken: visit and photograph 5–10 properties in one estate.** Not approved yet; revisit next meeting.

## In progress

- **Lead tracking + deal alerts** (asked 27 Nov). Owner: developer → reviewer; new agent: lead-tracker.
  Built: instant email/SMS alert per lead (max 1 per listing per 10 min, max 30 SMS/day), possible deal when a
  lister marks Sold/Rented, admin Leads and Deals tabs (confirm price + commission), `scripts/leads-report.mjs`,
  agent file `docs/agents/lead-tracker.md`. Spec: `docs/specs/leads-and-deals.md`.
  Waiting for Ken: Resend + Africa's Talking accounts and keys in Vercel; copy the agent file into `.claude/agents/`.

- **Route all client contact through Ken's number** (asked 27 Nov). Built: listing page, mobile bar (now also
  logs leads), lister profile page, Post Listing notice, site wording. Waiting for: Ken's number in Vercel
  (`NEXT_PUBLIC_CONTACT_PHONE`), then push. Next: lock lister phone columns in the database.

## Waiting for review

- **Tasks 1–3 (verification): tested 27 Nov, waiting for Ken to commit and push.**
  The live site will update automatically after the push (Vercel).
  - Spec `docs/specs/verification.md`: still needs Ken's sign-off.
  - Database migration: applied to Supabase on 26 Nov and tested (owners can't self-verify; photo swap resets level).
  - Tested in Chrome at phone width: admin page loads for Ken; setting level 3 shows the green
    "Verified · visited" badge on the card and detail page; "Verified only" shows 1 of 3 and toggles off;
    unverified listings show "Not yet verified… never pay a viewing fee"; a test scam listing showed both
    red flags (price 89% below similar, viewing fee) and rejecting it saved the reason and the review log.
    Test data was removed afterwards; all 3 real listings are back at level 0.
  - Not tested: a second, non-admin account getting "not found" (needs another Google account).

## Done

- 27 Nov: local dev fixed (corrupt `.next` cache, Clerk keys from two different apps, PC clock 2 min fast).

- 26 Nov: agent team set up (`.claude/agents/`) and docs folder created.
