# Zillow Consumer Home-Shopping Experience (Buyers & Browsers), 2025-2026

Research date: 2026-11-05. Note: zillow.com, zillow.com/learn, zillow.com/news and the zillow.zendesk.com help center all returned HTTP 403 to automated fetches, so official help-center detail on filters/alerts/cards could not be read directly. Zillow's press releases (zillow.mediaroom.com) and trade press were readable and are the main sources. Items marked **[unverified, prior knowledge]** come from general familiarity with the product and were not confirmed by a fetched source in this session; the report writer should treat them as plausible but uncited.

**US-data dependency legend** (for Kenya transferability): `[MLS]` needs MLS/listing-feed data; `[PUB-REC]` needs public tax/deed records; `[GS]` GreatSchools; `[FS]` First Street climate data; `[MORTGAGE]` needs US mortgage/lender integration; `[PORTABLE]` pure UX pattern, no US data dependency.

---

## 1. Search & map UX (split map/list, draw, boundaries, commute, natural-language/AI search, sorting)

### Takeaway
Zillow's search is a map-plus-list interface with draw-your-own-area, auto-displayed boundary outlines (including school attendance zones), a commute-time filter, and a natural-language search bar (2023, upgraded 2025) now extended into a conversational "AI mode" (beta, March 2026) and an app inside ChatGPT (October 2025). The structured-filter UX remains the backbone; AI layers translate sentences into filters and add actions (tours, affordability).

### Cited Findings
- **Draw on map:** Zillow's help center (search snippet) says you can draw a custom search area on the map and then open the filter panel to refine results; one help page notes you may need to remove an existing boundary before drawing a new one. — [Zillow Help: How do I search for properties?](https://zillow.zendesk.com/hc/en-us/articles/227953268-How-do-I-search-for-properties) (snippet only; page 403 on fetch) `[PORTABLE]`
- **School-zone search (Oct 2023):** Typing a school or district name into the search bar automatically displays the attendance-zone boundary on the map and shows homes inside it; launched first on the iOS app. — [Zillow press release, 2023-10-11](https://zillow.mediaroom.com/2023-10-11-Search-by-school-on-Zillow-makes-house-hunting-as-easy-as-ABC); [Inman](https://inman.com/2023/10/12/zillow-launches-new-feature-for-home-search-by-school-district) `[GS]` + school-boundary GIS data
- **Commute-time filter:** Finds homes within a chosen commute by foot, bike, transit or car; Zillow survey says 53% of buyers rank commute as a top priority. — [Zillow Group: commute time filter](https://zillowgroup.com/news/zillows-commute-time-filter) (snippet; details of destination input not confirmed) `[PORTABLE]` given a routing/isochrone API
- **Natural-language search (original, Jan 2023):** Users type phrases like "$400K homes near me with three bedrooms" into the search bar instead of stacking filters; launched on iOS first, Android and web later. — [The Title Report](https://www.thetitlereport.com/TTR/Articles/87414.aspx); [National Mortgage Professional](https://nationalmortgageprofessional.com/news/zillow-debuts-ai-powered-natural-language-search) `[PORTABLE]`
- **NL search upgrade (2025):** Now accepts commute time, affordability, schools and points of interest, e.g. "Homes 30 min drive from Millennium Park"; rolling out on iOS/Android with web later. — [CO/AI](https://getcoai.com/news/zillow-upgrades-ai-search-to-find-homes-with-natural-language-queries/) (secondary source)
- **Zillow app in ChatGPT (announced Oct 6, 2025):** Users search homes for sale and rent conversationally in ChatGPT ("What can I afford nearby?", "Show me homes with a big backyard"); results show photos, maps and pricing in a Zillow-like design, attributed to listing agent and MLS; to tour, contact an agent or get financing, the user is handed off into Zillow. Supports most listing types incl. rentals and for-sale by agent and owner; new construction not yet supported at launch. Zillow called itself the only/first real estate app on ChatGPT. — [HousingWire](https://www.housingwire.com/articles/zillow-chatgpt-launch-app-integration/); [Inman](https://www.inman.com/2025/10/06/your-listings-will-now-appear-on-chatgpt-thanks-to-zillow/)
- **Predecessor:** A Zillow ChatGPT *plugin* launched May 2, 2023 (plugins platform since retired by OpenAI; treat as **discontinued**, superseded by the 2025 app). — [Zillow press release 2023-05-02](https://zillow.mediaroom.com/2023-05-02-Zillow-builds-ChatGPT-plugin-for-real-estate-searches)
- **Zillow AI mode (announced Mar 25, 2026; beta, limited users, expanding through 2026):** Conversational assistant inside Zillow. Capabilities: compare homes/units and explain tradeoffs; estimate repair/upgrade costs from local data; explain affordability incl. BuyAbility; rent-vs-buy scenarios; neighborhood insights (amenities, shops, parks); summarize property policies (e.g. pet policy); **book tours and submit rental applications in-flow**; connect to agents; explain the Zestimate and its history; assess offer competitiveness from comps and market conditions. Remembers preferences across sessions. Example prompts: "Can I afford this apartment if I move in June?", "Find similar homes within my budget that are closer to light rail." Safeguard: a real-time **Fair Housing Classifier** screens both user questions and AI answers to prevent discriminatory steering. — [Zillow press release 2026-03-25](https://zillow.mediaroom.com/2026-03-25-Zillow-debuts-AI-mode,-bringing-guided-intelligence-to-every-step-of-the-housing-journey)
- AI mode requires typed input (CoStar's Homes AI is voice-activated); analyst William Blair said it "does not seem all that differentiated." — [Inman](https://www.inman.com/2026/03/25/zillow-goes-ai-mode-with-new-home-search-assistant/)
- Layered filters are encoded in the search URL (shareable/bookmarkable searches). — [Apify Zillow URL scraper description](https://apify.com/afanasenko/zillow-url-search) (third-party) `[PORTABLE]`

### Inferences
- Pattern to copy: one search bar that accepts place names, school names, and free-text sentences; the parser maps text to the same structured filter state the UI exposes, so the user can see and edit what the AI inferred.
- Fair-housing screening on AI output is a design requirement worth emulating in any market (avoid steering by ethnicity/religion/tribe), even absent US fair-housing law.
- ChatGPT distribution is a top-of-funnel channel; conversion actions are deliberately kept on Zillow's own surface.

### Gaps
- Could not confirm from a fetched official page: map pin clustering behavior, the exact "search as I move the map" toggle wording, neighborhood/ZIP/city boundary outline styling, or the full sort list. **[unverified, prior knowledge]**: desktop is a split view (map left/right, scrollable card grid other side) with results updating as the map moves; boundaries for city/ZIP/neighborhood draw as an outline when that place is searched; dense areas show count bubbles at low zoom and price-label pins at higher zoom; sort options include Homes for You (default, personalized), Price (high-low / low-high), Newest, Bedrooms, Bathrooms, Square feet, Lot size. Mobile app defaults to full-screen map with a pull-up list sheet / Map-List toggle.
- Commute filter input details (destination, max minutes, time of day) not confirmed.

---

## 2. Filter set and mobile vs desktop surfacing

### Takeaway
Zillow exposes a deep filter set (top-bar pills for listing type, price, beds/baths, home type, then a "More" panel with 50+ features, keywords, days on Zillow, etc.). Newer additions are affordability-based filtering (BuyAbility) and a "Preview" (pre-market) listing filter (June 2026). Official current filter lists could not be fetched.

### Cited Findings
- Mobile help pages list filters for beds/baths, square footage, lot size, year built, HOA, pools or A/C, and views. — [Zillow Help (iPhone search)](https://zillow.zendesk.com/hc/en-us/articles/360000808587-How-do-I-search-for-homes-on-the-Zillow-mobile-app-iPhone) (snippet)
- A "Keywords" field sits at the bottom of the filters and matches listing description text (e.g. "ADU", "as-is"). — [Zillow Help](https://zillow.zendesk.com/hc/en-us/articles/227953268-How-do-I-search-for-properties) (snippet); [Bushe guide](https://bushe.co/blog/how-to-use-zillow-filters-like-a-real-estate-agent/) (third-party) `[PORTABLE]`
- "Must haves" include basement, pool, A/C, waterfront, views; buyers can filter for listings with a 3D home tour; basement is under "More" filters. — [Bushe guide](https://bushe.co/blog/how-to-use-zillow-filters-like-a-real-estate-agent/); [Zillow blog](https://www.zillow.com/news/spice-up-your-relationship-with-zillow/) (snippet)
- "Days on Zillow" filter shows only new listings or ones listed a while. — [Bushe guide](https://bushe.co/blog/how-to-use-zillow-filters-like-a-real-estate-agent/)
- Filter UI includes days on Zillow and 50+ property features. — [Apify](https://apify.com/afanasenko/zillow-url-search) (third-party)
- **BuyAbility filtering (Summer 2025 update):** buyers search by both a target price (from desired monthly payment) and maximum budget (from qualification); listings are labeled whether they fall within the shopper's BuyAbility. Inputs: income, credit score, monthly debts, down payment savings, preferred monthly payment. 1.5M+ enrolled. — [Zillow press release 2025-07-15](https://zillow.mediaroom.com/2025-07-15-Summer-just-got-hotter-Zillow-debuts-five-powerful-new-features) `[MORTGAGE]` (concept portable: affordability-based filter)
- **Verified Pre-approval-linked search (June 2026):** each listing shows whether it fits the buyer's budget, factoring taxes, insurance, HOA and closing costs. — [Zillow press release 2026-06-23](https://zillow.mediaroom.com/2026-06-23-Zillow-launches-a-personalized-hub-that-guides-home-buyers-from-first-search-to-closing) `[MORTGAGE]`
- **Zillow Preview filter (June 2026):** pre-market listings appear in regular search with a "Preview" label; buyers can filter for them, save, pre-book tours. 1,200+ participating brokers. — [Zillow press release 2026-06-23](https://zillow.mediaroom.com/2026-06-23-Zillow-launches-a-personalized-hub-that-guides-home-buyers-from-first-search-to-closing)

### Inferences
- Affordability-as-filter (monthly-payment-based) is Zillow's main filter innovation 2025-26; a Kenyan equivalent could be based on monthly rent/mortgage budget without lender integration.

### Gaps
- Full official filter list not fetched. **[unverified, prior knowledge]** desktop top bar: listing-type dropdown (For Sale / For Rent / Sold), Price (list price vs monthly payment toggle, down payment), Beds & Baths, Home Type (Houses, Townhomes, Multi-family, Condos/Co-ops, Lots/Land, Apartments, Manufactured), "More" panel: listing sub-types (By agent, By owner/FSBO, New construction, Foreclosures, Auctions, Foreclosed, Pre-foreclosures), property status (Coming soon, Accepting backup offers, Pending & under contract), Max HOA, Parking spots/garage, Square feet, Lot size, Year built, Basement (finished/unfinished), Single-story only, Hide 55+ communities, Other amenities (A/C, pool, waterfront), View (city, mountain, park, water), Tours (Must have open house, Must have 3D tour), Days on Zillow (1, 7, 14, 30, 90 days, 6/12/24/36 months), Keywords. On mobile, a single "Filters" button opens a full-screen sheet with the same options plus a sticky "See N homes" button showing live result count.

---

## 3. Listing detail page (Home Details Page, HDP)

### Takeaway
Since the Oct 2023 redesign (biggest in 5 years), desktop HDP is a wider single-scroll page with media at top (photos + 3D tours expand into a full-page magazine-style viewer), large-type key facts (sqft, Zestimate, lot size, home type), "What's special" highlights near top; the iOS app groups content into tappable hubs ("What's Special", "Market Value", "Monthly Cost", "Neighborhood") with deeper "spoke" pages (Schools, Climate, Neighborhood). Showcase listings add interactive floor plans, SkyTour, and AI virtual staging. Climate risk scores were **removed** in late Nov 2025.

### Cited Findings
- Desktop redesign (2023-10-23): wider single-scroll layout; media section at top showcasing photos and 3D tours; clicking a photo expands into a full-page, magazine-style layout; key facts (square footage, Zestimate, lot size, home type) in larger fonts; clearer "what makes the home special" description near top. iOS app groups details into "What's Special," "Market Value," "Monthly Cost," "Neighborhood" sections that open on tap to reduce scrolling; includes facts & features, cost calculator, Zestimate history; new Home Loans tab (set budget, connect lender, prequalify, track loan). — [Zillow press release 2023-10-23](https://zillow.mediaroom.com/2023-10-23-Zillow-unveils-a-new-look-for-property-pages,-their-biggest-redesign-in-5-years)
- Hub-and-spoke redesign (designer case study): Hubs = concise scannable summaries; Spokes = dedicated deep pages (Schools, Climate, Neighborhood). Research quote: "The page just scrolls on and on and on... and I can never find what I am looking for." Results: full-page scroll-through rose 12% → 33%; ~$4M/yr more Zillow Home Loans revenue on iOS; text truncation fixed for ~30% of users on larger accessibility text sizes. — [Mike Knecht portfolio](https://www.mpknecht.com/zillow-home-detail-page-redesign) (personal portfolio, not official)
- Zestimate history chart: up to 10 years on the detail page when data suffices; HDP shows price history and property tax/assessment history. — [Zillow Zestimate page](https://www.zillow.com/zestimate/) (snippet) `[PUB-REC]` `[MLS]`
- Third-party scraper documentation lists HDP data blocks: schools, price history, tax history, photos, broker info, RESO facts. — [Apify detail scraper](https://apify.com/integrative_cafe_8pc/zillow-detail-scraper) (secondary) `[GS]` `[PUB-REC]`
- **Climate risk (DISCONTINUED on-page, late Nov 2025):** Zillow launched First Street climate risk scores in Sept 2024; after CRMLS objections about accuracy, it removed native scores from 1M+ listings and replaced them with a link to First Street's site. Scores remain on Realtor.com, Redfin, Homes.com. — [TechCrunch](https://techcrunch.com/2025/12/01/zillow-drops-climate-risk-scores-after-agents-complained-of-lost-sales); [RISMedia](https://www.rismedia.com/2025/12/02/zillow-removes-climate-risk-scores/); [The Real Deal](https://therealdeal.com/national/2025/12/01/zillow-drops-climate-risk-scores-after-industry-pushback) `[FS]`
- **Showcase (premium listing tier):** interactive floor plans and high-resolution scrolling hero images; Zillow claims listings with interactive floor plans get 79% more saves (company claim). AI-powered floor plans combine layout with design context; 3D Home floor plans show how rooms connect. — [Zillow Group: Showcase](https://www.zillowgroup.com/news/zillow-showcase-brings-listings-to-life); [Zillow: Listing Showcase data](https://www.zillow.com/news/listing-showcase-helps-agents-win-more-listings)
- **SkyTour (July 2025):** user-flown 3D exterior view built from drone footage via Gaussian splatting; phone or computer; only on eligible Showcase listings where drone footage was captured via the Zillow Media Experts premium package; select markets. — [Zillow press release 2025-07-15](https://zillow.mediaroom.com/2025-07-15-Summer-just-got-hotter-Zillow-debuts-five-powerful-new-features); [Zillow Group: SkyTour](https://www.zillowgroup.com/news/take-home-listings-to-new-heights-with-skytour)
- **AI Virtual Staging (Sept 10, 2025):** built into Showcase; restyles listing photos/empty rooms in styles such as modern or Scandinavian so shoppers can visualize potential. — [Zillow press release 2025-09-10](https://zillow.mediaroom.com/2025-09-10-Zillow-brings-AI-powered-Virtual-Staging-to-Showcase-listings); [Inman](https://www.inman.com/2025/09/10/zillow-ditches-outdated-decor-with-showcase-virtual-staging/) `[PORTABLE]`
- **Offer Insights (July 2025, for-sale only):** buyers toggle between offer price levels to see estimated likelihood of acceptance, from Zestimate + recent sales + local market data. — [Zillow press release 2025-07-15](https://zillow.mediaroom.com/2025-07-15-Summer-just-got-hotter-Zillow-debuts-five-powerful-new-features) `[MLS]` `[PUB-REC]`
- **Rental Costs & Fees breakdown (July 2025):** move-in expenses, monthly charges, extra fees, plus personalized calculator; shown only when property manager supplies data. — same source `[PORTABLE]`
- **Rentals AI Assist (Oct 2025, powered by EliseAI):** 24/7 instant answers for renters on properties, tours, availability. — [Zillow press release 2025-10-28](https://zillow.mediaroom.com/2025-10-28-Zillow-launches-messaging,-a-new-way-for-home-shoppers-to-collaborate-within-the-Zillow-app) `[PORTABLE]`

### Inferences
- Copyable HDP skeleton: media hero → price + key facts row → highlights/"what's special" → description → facts & features → monthly cost calculator → value/history → neighborhood/schools → similar homes, with a persistent contact/tour CTA. On mobile, collapse into tappable hub cards opening spoke pages.
- The climate-score removal is a cautionary tale: third-party risk scores shown natively on listings provoke agent/MLS backlash; linking out is the compromise.

### Gaps
- Exact current desktop section order and sticky contact module not confirmed from an official 2025-26 source. **[unverified, prior knowledge]**: desktop right rail has a sticky box with "Request a tour" (primary) and "Contact agent" (secondary) buttons; sections include Overview (Days on Zillow, views, saves counts), Facts & features (grouped Interior/Property/Construction/Utilities/Community/HOA/Financial), Services availability, Monthly payment calculator (principal & interest, mortgage insurance, taxes, home insurance, HOA), Price history table, Public tax history, Neighborhood (Walk/Transit/Bike Score by Walk Score), GreatSchools ratings 1-10 with distance, Nearby homes / Similar homes carousels.
- Walk Score presence and GreatSchools rating format not confirmed by fetched source in this session.

---

## 4. Saved homes, saved searches, alerts, collections, collaboration, personalization

### Takeaway
Saved homes (heart) and saved searches with email/push alerts (Instant or Daily historically) are core; collaboration was formalized in Oct 2025 (in-app messaging with co-shopper invites, single thread per listing) and June 2026 (real-time "Shared collection"). A personalized buyer hub (June 2026, app) and personalized "Homes for You" recommendations drive return visits.

### Cited Findings
- Saved searches let users set email alert frequency; "Instant" sends alerts as soon as a matching home hits the market. — [Zillow Help (snippet via search)](https://zillow.zendesk.com/hc/en-us/articles/227953268-How-do-I-search-for-properties) (exact article not fetched)
- Historical: daily or instant email alerts; instant capped at 15 emails per 24h with the rest batched into a daily email (2013; may be outdated). — [Inman 2013](https://www.inman.com/2013/08/26/alerts-let-agents-mine-zillow-for-potential-listings/); instant-or-daily choice repeated in [Apartment Therapy 2021](https://www.apartmenttherapy.com/zillow-alerts-2021-36856852)
- **In-app messaging (Oct 28, 2025):** chat with a co-shopper, share listings; each listing's conversation kept in a single thread; invite partner/roommate/friend from inbox via shared link; comments, reactions and saved homes together. Zillow says 60%+ of buyers co-shop. — [Zillow press release 2025-10-28](https://zillow.mediaroom.com/2025-10-28-Zillow-launches-messaging,-a-new-way-for-home-shoppers-to-collaborate-within-the-Zillow-app); [HousingWire](https://www.housingwire.com/articles/zillow-adds-in-app-messaging-to-chat-with-co-shoppers/) `[PORTABLE]`
- **Shared collection (June 23, 2026):** shared workspace where co-buyers save, organize and compare homes in real time; iOS, Android, web. — [Zillow press release 2026-06-23](https://zillow.mediaroom.com/2026-06-23-Zillow-launches-a-personalized-hub-that-guides-home-buyers-from-first-search-to-closing) `[PORTABLE]`
- **Personalized moving hub (June 2026; iOS/Android, web "coming soon"):** onboarding question "Are you buying, selling, both, or just browsing?" → personalized plan with milestones (set budget, find a home, make an offer, close) whose steps update automatically (e.g. on pre-approval or going under contract); shows BuyAbility with live rates, local market insights (conditions, median days to pending, active listings, 1-year price forecast), and "shopper's team" (agent + loan officer contacts, or Agent Finder). — same source. Milestone UX `[PORTABLE]`; forecasts `[MLS]`
- AI mode remembers preferences across sessions. — [Zillow press release 2026-03-25](https://zillow.mediaroom.com/2026-03-25-Zillow-debuts-AI-mode,-bringing-guided-intelligence-to-every-step-of-the-housing-journey)
- Closing dashboard (Oct 2025, with Spruce) tracks title/escrow tasks. — [Zillow press release 2025-10-28](https://zillow.mediaroom.com/2025-10-28-Zillow-launches-messaging,-a-new-way-for-home-shoppers-to-collaborate-within-the-Zillow-app) (US-specific closing process)

### Inferences
- Collaboration evolved from "share a link" → "message thread per listing" → "real-time shared board"; a small team could ship the first two cheaply.

### Gaps
- Current alert frequency options (Instant / Daily / Never; push vs email) not confirmed from a fetched official page; also not confirmed: "Recently viewed" list, saved-home status-change notifications (price cut, pending), notes on saved homes. **[unverified, prior knowledge]**: Saved homes and Saved searches live under a "Saved" tab in app; push notifications for new matches, price cuts and open houses on saved homes; a "Recently viewed" row and "Homes for You" feed on the home page.

---

## 5. Contact & tour request flows, lead routing

### Takeaway
"Request a tour" is the primary CTA: buyer picks up to three preferred 30-minute time slots, states buying timeline, and whether available to talk now (yes → live phone transfer to an agent); contact form captures name, phone, email. Leads route to Premier Agent partners/Flex teams by rules (direct, percentage, round-robin, broadcast), Real-Time Touring tries partners one by one until one can meet the slot. AI mode (2026) can book tours in-chat; Tour Itineraries (2025) coordinate multi-home tours.

### Cited Findings
- Tour flow: buyer selects up to three preferred times (usually 30-min increments), then buying timeline, then whether available to talk now to confirm; yes triggers live transfer call. Contact form: name, phone, email. — [Zillow Premier Agent: when buyers contact a partner](https://www.zillow.com/premier-agent/when-buyers-contact-premier-agent/) (snippet; may be dated)
- Routing rules: direct assignment, percentage, round robin, broadcast; Real-Time Touring connections go to partners one at a time until one can fulfill the requested time; teams can route all tour requests to an admin with calendar access; unroutable leads go to fallback agent or team leader; non-ready buyers become nurture leads distributed by share of voice. — [Zillow Help: Agent Capacity and Lead Routing](https://zillow.zendesk.com/hc/en-us/articles/1500004362661-Agent-Capacity-and-Lead-Routing); [Real Time Touring setup](https://zillow.zendesk.com/hc/en-us/articles/18236443597587-Real-Time-Touring-Set-up-Instructions) (snippets)
- Tour Itineraries (July 2025): after connecting with an agent, buyers add homes to a shared tour list in a central tab on app and web; buyers and agents both see upcoming and past tours. — [Zillow press release 2025-07-15](https://zillow.mediaroom.com/2025-07-15-Summer-just-got-hotter-Zillow-debuts-five-powerful-new-features) `[PORTABLE]`
- ChatGPT app hands users back to Zillow to schedule a tour, connect with an agent or explore Zillow Home Loans. — [HousingWire](https://www.housingwire.com/articles/zillow-chatgpt-launch-app-integration/)
- Preview listings allow pre-booking tours; sellers get real-time views, saves, tour requests. — [Zillow press release 2026-06-23](https://zillow.mediaroom.com/2026-06-23-Zillow-launches-a-personalized-hub-that-guides-home-buyers-from-first-search-to-closing)

### Inferences
- Copyable pattern: time-slot picker (3 options) + minimal identity fields + "talk now?" toggle → agent routing queue with fallback. Works without MLS; maps well to WhatsApp/phone-first markets.

### Gaps
- Current form fields (e.g. financing question, message box, "I'm working with an agent") not confirmed from the live 2025-26 form. Open-house listing display (badge, date/time on HDP and cards, "Must have open house" filter) not confirmed by fetched source. Listing-agent vs buyer's-agent attribution changes (and Zillow's 2025 Listing Access Standards) not researched here.

---

## 6. Mobile app patterns, visual design, badges, listing cards, accessibility

### Takeaway
Zillow ships consumer features app-first (NL search, school search, hub, AI mode all launched on iOS/Android before web). Official documentation of card anatomy and badges was not obtainable; the HDP redesign case study shows accessibility attention (large-text truncation fixes).

### Cited Findings
- App-first rollout pattern: NL search on iOS first (2023); school search iOS first (2023); HDP hub sections iOS (2023); NL upgrade on apps before web (2025); moving hub on iOS/Android with web "coming soon" (2026). — [Title Report](https://www.thetitlereport.com/TTR/Articles/87414.aspx); [Inman](https://inman.com/2023/10/12/zillow-launches-new-feature-for-home-search-by-school-district); [Zillow 2023-10-23](https://zillow.mediaroom.com/2023-10-23-Zillow-unveils-a-new-look-for-property-pages,-their-biggest-redesign-in-5-years); [Zillow 2026-06-23](https://zillow.mediaroom.com/2026-06-23-Zillow-launches-a-personalized-hub-that-guides-home-buyers-from-first-search-to-closing)
- Labels shown on listings in search: "Preview" label (2026); BuyAbility in/out-of-budget label (2025). — [Zillow 2026-06-23](https://zillow.mediaroom.com/2026-06-23-Zillow-launches-a-personalized-hub-that-guides-home-buyers-from-first-search-to-closing); [Zillow 2025-07-15](https://zillow.mediaroom.com/2025-07-15-Summer-just-got-hotter-Zillow-debuts-five-powerful-new-features)
- Accessibility: HDP redesign fixed text truncation for ~30% of users on larger accessibility text sizes. — [Mike Knecht portfolio](https://www.mpknecht.com/zillow-home-detail-page-redesign)

### Inferences
- Badges are a cheap, high-signal pattern: listing-status/feature chips on the photo of each card.

### Gaps
- No official/2025-26 source found on card anatomy. **[unverified, prior knowledge]**: card = photo carousel (swipeable, with heart/save icon top-right) + top-left badge chip(s) such as "Price cut: $X (date)", "New" / "X hours ago", "Open: Sat 1-3pm", "Showcase", "3D Tour", "Coming soon", "Foreclosure"; below photo: price (bold, large), "X bds | Y ba | Z sqft – House for sale", full address, listing brokerage attribution (small grey text, MLS requirement). Showcase listings get larger/hero-style cards. Mobile app cards are full-width with swipeable photos.
- No Baymard/Nielsen Norman teardown specific to Zillow 2025-26 was found in this session. Zillow Tech Hub engineering blog not reviewed.

---

## Transferability summary for Kenya (data dependencies)
- **Highly portable (pure UX):** split map/list, draw-on-map, keyword filter, NL search → filters, saved searches + instant/daily alerts, shared collections, per-listing message threads, tour time-slot request, tour itineraries, cards/badges, hub-and-spoke detail page, virtual staging, rental fee breakdown, AI assistant with fair-housing-style safety classifier. — sources above
- **Needs local data substitutes:** Zestimate & Offer Insights `[MLS]` `[PUB-REC]` (requires sold-price data); price/tax history `[PUB-REC]`; school ratings/boundaries `[GS]`; climate risk `[FS]` (and note Zillow itself pulled it); BuyAbility / verified pre-approval / closing dashboard `[MORTGAGE]`; commute time (needs routing API with matatu/transit coverage); SkyTour (needs drone capture + Gaussian-splat pipeline).
