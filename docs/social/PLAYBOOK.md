# 28homes social playbook: qualified property inquiries from Kenyan audiences

Owner: social-growth agent · Approver and poster: Ken · Started 27 Nov 2026

## 1. Operating model

**One agent, not a crew.** A single `social-growth` Claude Code agent (in `.claude/agents/`) plans, writes and
reviews. It reads live listings and lead data from the database through two read-only scripts, researches trends
on the web, and writes everything into this folder. Ken is the human in the loop at three points only:

| Point | Ken does | Time |
|---|---|---|
| Approve the week (Mon) | Read `calendar/<week>.md`, change anything, say "approved" | 10 min |
| Film (once a week) | Shoot the filming list on his listing visits (no face needed) | 45–60 min |
| Post + reply (daily) | Paste the day's posts into Buffer / TikTok / YouTube Studio; answer WhatsApp leads with the saved replies in QUALIFY.md | 10–15 min |
| Review (Fri) | Paste the week's stats; read the 3 changes | 10 min |

Why no auto-posting: X's API is now pay-per-use (about $0.20 per post with a link), TikTok's posting API needs an
approved developer app, and Buffer's free plan already gives 3 channels with 10 queued posts each. Scheduling by
hand from a ready calendar takes minutes and keeps Ken in control of the brand.

**The funnel we measure:** views → profile visits / link clicks → **inquiries** (WhatsApp/Call to 28Homes, tracked
by `?src=` code) → **qualified** (budget, area, timeline fit) → viewings → deals. Followers are a side effect.

## 2. Accounts

| Platform | Account | Why |
|---|---|---|
| TikTok | **@28homes** (Business profile, location Kenya) | Where Kenyans house-hunt on video; Business profile is needed for Buffer scheduling and link in bio. Business accounts can only use the Commercial Music Library. |
| YouTube | **28Homes** channel | Shorts (repurposed TikToks) + 1 long video every 2 weeks: long videos rank in search for "houses for sale in Lavington" for years. |
| X | **@28homes** brand account; Ken reposts/quotes from his personal verified account | Brand account for listings and tips; Ken's personal account (already Premium) adds founder credibility and reach. *Decision for Ken: if he'd rather run everything from his personal account, the agent writes in first person instead.* |

Bios end with a qualifying CTA and the bio link `…/properties?src=tt-bio` (or `yt-bio`, `x-bio`).

## 3. Content pillars (rotate; 2 value posts for every 1 promo)

| Pillar | Example | Inquiry angle |
|---|---|---|
| **Listing spotlights** (promo) | 60-second walk-through of a live listing | Direct: "WhatsApp us with ref + budget" |
| **Buyer due diligence** | "5 checks before paying an off-plan deposit" | Builds trust with the buyers we serve now |
| **Scam busters** | "Viewing fee? Walk away." | Trust → people come back to us when buying/renting |
| **True cost** | "KSh 9.3M flat: what you actually pay (deposit, legal, stamp duty)" | Pre-qualifies budget |
| **Area guides** | "Living in Lavington: schools, matatus, rent ranges" | Attracts people who already chose an area |
| **For landlords/developers** | "List free, we bring screened buyers" | Supply: more listings → more inquiries |
| **Building in public** (X) | Ken's founder updates | Credibility, X reach |

Diaspora angle (Kenyans abroad buying at home) suits the current off-plan listings: post at times they're awake
too (evening EAT = morning in the US).

## 4. Rhythm and times (Kenya, EAT)

| Platform | Frequency | Starting times (test and adjust) |
|---|---|---|
| TikTok | 4 videos/week (Mon, Wed, Fri, Sat) | 12:30 and 19:30 |
| YouTube Shorts | same videos, 1 day later | 18:00 |
| YouTube long | 1 every 2 weeks (Sun) | 10:00 |
| X | 1 post/day + 1 thread/week (Tue) | 07:30 (commute) or 13:00 |

These times are a starting hypothesis, not data. After 3 weeks the Friday review moves slots toward the ones that
produced inquiries.

## 5. Templates

### TikTok / YouTube Short (15–60 s, faceless)
```
HOOK (0–2 s, on-screen text + first spoken line): a number, a warning or a question
  e.g. "KSh 7.2M for a 1-bedroom in Lavington. Worth it?"
BODY (3–6 shots, 2–5 s each): shot list Ken can film on a phone
  shot 1: … / on-screen text: … / voiceover: …
PAYOFF: the answer, price, or the 1 thing to remember
CTA (last 3 s, on-screen + spoken): "WhatsApp 28Homes: area + budget + when you're buying. Link in bio."
CAPTION: 1–2 lines, the question again + CTA + "Ref <REF>"
HASHTAGS (3–5): 1 broad (#Nairobi), 1 property (#NairobiRealEstate / #HousesForSaleKenya), 1 area (#Lavington), 1 topic (#OffPlan)
SOURCE CODE: tt-MMDDa (bio link) · Short repost: ys-MMDDa in the description link
```

### YouTube long video (6–12 min)
```
TITLE (≤60 chars, with the search phrase): "Lavington Off-Plan Apartments: Prices, Payment Plans, Risks"
THUMBNAIL TEXT (≤4 words): "KSh 7.2M LAVINGTON?"
OUTLINE with chapters 00:00 …
DESCRIPTION: 2 lines summary · tracked link (yt-MMDD) · chapters · disclaimer for off-plan
TAGS / KEYWORDS: 8–12 search phrases Kenyans type
PINNED COMMENT: qualifying CTA
```

### X
```
Single post (≤280): hook line → 1 useful fact → CTA + link (?src=x-MMDDa). Links: max 1 per post.
Thread (5–8 posts): numbered, first line promises a payoff, last post = CTA + link.
Reply ideas: 3 per week, answering real questions under Kenyan property/news posts (no spam links in replies).
```

## 6. Tools (free or low cost)

| Need | Tool | Cost |
|---|---|---|
| Schedule X + TikTok | Buffer free (3 channels, 10 queued posts each) | Free |
| Schedule YouTube | YouTube Studio built-in scheduler | Free |
| Edit video, captions, text-to-speech | CapCut (mobile/desktop) | Free tier |
| Thumbnails, covers | Canva free | Free |
| Trends | TikTok Creative Center, Google Trends (Kenya), X search | Free |
| WhatsApp lead handling | WhatsApp Business app on 0742 672 682: quick replies + labels | Free |
| Tracking | `?src=` codes → Admin → Leads → "By source" | Built in |

## 7. Friday review: what to look at

1. **Inquiries by source code** (leads-report "By source"): which posts produced WhatsApps/calls.
2. **Qualified rate**: of those, how many answered budget/area/timeline and fit (Ken's WhatsApp labels).
3. **Click-through**: link clicks ÷ views per post (TikTok/YouTube analytics, Buffer).
4. **Hook strength**: 3-second view rate / average watch time on TikTok and Shorts.
5. Then: **3 changes** for next week (one about hooks, one about topics, one about timing/CTA), and listings
   with zero inquiries that need a new angle.

## 8. MVP this week vs later

**This week (MVP):** create the 3 accounts; WhatsApp Business on Ken's number with labels and quick replies; post
the sample week in `calendar/2026-W49.md`; Friday review.

**Later:** Buffer paid ($5/channel) for unlimited queue and first-comment scheduling once posting >10/week per
channel; a small TikTok Promote test (KSh 1,000–2,000) on the post with the best inquiry rate; a short link
domain (28homes.com/go/…) once the domain is live; WhatsApp Business API auto-replies; monthly YouTube area guides
with landlords/agents as guests.

## 9. Risks and limits

- **Tiny inventory** (3 off-plan listings, one development). Posting the same flats daily looks spammy: lean on
  value content and landlord-recruitment posts until there are 10+ listings.
- **Off-plan risk.** If the development is delayed, our content is on record. Always say "off-plan, ready Dec 2027,
  do your due diligence"; never promise returns.
- **Commission protection** depends on clients contacting 28Homes, not the developer. Don't show the developer's
  name/number in videos.
- **Platform rules change** (music, link-in-bio, API pricing). Check the platform's help page before relying on a limit.
- **Attribution gaps**: people who see a video and later type the URL show as "direct". Ask every new lead
  "Where did you find us?" (quick reply in QUALIFY.md).
