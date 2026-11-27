# 28homes progress

Goal (MVP week): Phase 1 — verified listings + AI house-hunting assistant.
Last meeting: [2026-11-26](meetings/2026-11-26.md)

## To do

- **Plan the AI house-hunting assistant.** Owner: CEO → assistant builder. Next meeting, with a cost estimate first.
- **Ken: visit and photograph 5–10 properties in one estate.** Not approved yet; revisit next meeting.

## In progress

(none)

## Waiting for review

These are built, typechecked, linted and build-tested, but **not committed or deployed**. Ken tests, then commits.

- **Task 1: Verification spec.** `docs/specs/verification.md`.
  Done when: Ken approves the spec.
- **Task 2: Admin review page at `/admin/listings`.** Files: `app/admin/`, `lib/admin.ts`, `lib/scamFlags.ts`,
  `proxy.ts`, `supabase/migrations/20261126120000_verification_levels.sql`.
  Done when: on his phone Ken approves a test listing at level 2 or 3, and the green badge appears on the
  card and the detail page. A different signed-in account opening `/admin/listings` gets "not found".
- **Task 3: "Verified only" filter and stronger badge.** Files: `lib/listing.ts`, `lib/propertySearch.ts`,
  `components/PropertiesFilter.tsx`, `components/PropertyCard.tsx`, `app/properties/(list)/page.tsx`,
  `app/properties/[id]/page.tsx`.
  Done when: the "Verified only" chip works at phone width (375px) and hides unverified listings.

### Before testing (Ken)

1. Run `supabase/migrations/20261126120000_verification_levels.sql` in the Supabase SQL editor.
   After this, the 3 current live listings show **no** badge until you verify them. This is intended.
2. Make sure `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local` and on the host (the alerts job already needs it).
3. Optional: set `ADMIN_USER_IDS` to your Clerk user id. If it isn't set, `COMPANY_AGENT_USER_ID` is used.

## Done

- 26 Nov: agent team set up (`.claude/agents/`) and docs folder created.
