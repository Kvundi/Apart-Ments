# Copy Zillow's loops, not its data

Zillow is best understood as a lead marketplace wrapped in a consumer search product. The free tools (search, map, Zestimate, saved searches, payment calculators) bring in a very large audience. Zillow makes its money by selling the intent that audience generates to agents, property managers, builders and its own mortgage arm. In FY2025, agent-facing "Residential" revenue was **$1.70B of $2.58B (66%)**, and Rentals was the fastest-growing line at **$630M (+39%)** ([Zillow FY2025 results](https://zillowgroup.mediaroom.com/2026-02-10-Zillow-Group-Reports-Fourth-Quarter-and-Full-Year-2025-Financial-Results)). For Keja Yangu, the conclusion is that the parts of Zillow worth copying are the UX patterns and engagement loops, and most of those are portable: map search, saved-search alerts, gated agent reviews, listing expiry, tour requests, a freemium split between owners and professionals, and owner dashboards. The famous part, the Zestimate, rests on US deed, tax and MLS records that Kenya does not have, so it does not transfer. Kenya's portal market is small: the leader, BuyRentKenya, gets roughly 130-210K visits a month ([Semrush](https://www.semrush.com/trending-websites/ke/real-estate); [Pulse](https://www.pulse.co.ke/story/top-5-real-estate-websites-in-kenya-2024072913170001631)). It is mostly rentals, and viewing-fee scams are common across it. In that market the strongest position is "the portal where listings are real": publicly visible verification, EARB-checked agents, fresh listings, and contact that stays WhatsApp-first but is tracked. Data products should be built later, on the rental and price records Keja Yangu collects itself. Keja Yangu already has a good listing page, payment estimates and local saves. Its next 90 days should go to coordinates and map search, account-synced saves with saved-search alerts, public verification badges with a report flow, Kenyan rental fields, listing expiry, and lead logging. Agent profiles, M-Pesa-paid boosts and an owner dashboard should follow, and then a rent index.

## Zillow sells connections, and every feature feeds the funnel

Zillow's core economics have stayed stable even as its pricing models changed. Agents buy leads, which Zillow calls "connections," in one of two ways. Under market-based pricing they buy a share of voice in a ZIP code, and connections are distributed in proportion to that share. Under the newer pay-at-close model (Flex, now **Zillow Preferred**), they pay nothing upfront and hand over a referral fee when the deal closes ([Zillow FY2025 10-K](https://www.sec.gov/Archives/edgar/data/1617640/000161764026000015/z-20251231.htm)). The fee is **40% of commission on seller connections** ([Zillow Flex pricing](https://www.zillow.com/premier-agent/flex-pricing)) and reportedly **15-40% on buyer connections**, depending on ZIP code and price ([The Close](https://theclose.com/zillow-flex/)). Zillow keeps this marketplace sticky by owning the agent's workflow. It bought the Follow Up Boss CRM for **$400M plus up to $100M in earnouts** ([Zillow 8-K](https://www.sec.gov/Archives/edgar/data/1617640/000161764023000108/exhibit993.htm)), and it bundles ShowingTime (touring), dotloop (transactions) and Showcase (premium media) into a Zillow Pro suite ([10-K](https://www.sec.gov/Archives/edgar/data/1617640/000161764026000015/z-20251231.htm)).

The strategy now is to bundle agent, loan and tour in "Enhanced Markets." These reached **44% of agent connections in Q4 2025, up from 21% a year earlier**, and Zillow's target is at least 75% ([Q4 2025 letter](https://www.marketscreener.com/news/zillow-fourth-quarter-2025-shareholder-letter-ce7e5adcdf8bf221); [Q3 2025 call](https://www.fool.com/earnings/call-transcripts/2025/10/30/zillow-z-q3-2025-earnings-call-transcript)). The balance of the business is moving away from agents. In Q3 2026, Residential fell **4%** to $419M because of high mortgage rates, while Rentals grew **26%** to $220M and Mortgages grew **32%** to $70M ([Q3 2026 8-K](https://www.sec.gov/Archives/edgar/data/0001617640/000161764026000068/q32026991.htm)).

| Segment | FY2025 | YoY | Q3 2026 YoY | What is sold |
|---|---|---|---|---|
| Residential | $1,704M | +7% | -4% | Agent leads (share of voice, pay-at-close), software, Showcase, new-construction promotion |
| Rentals | $630M | +39% | +26% | Multifamily advertising, per-door syndication, pay-per-lease, premium landlord listings |
| Mortgages | $199M | +37% | +32% | Zillow Home Loans originations, lender marketplace |
| Other | $50M | +14% | +7% | Display ads, misc. |

Sources: [FY2025 results](https://zillowgroup.mediaroom.com/2026-02-10-Zillow-Group-Reports-Fourth-Quarter-and-Full-Year-2025-Financial-Results); [Q3 2026 8-K](https://www.sec.gov/Archives/edgar/data/0001617640/000161764026000068/q32026991.htm).

The growth loop compounds. The most listings attract the most shoppers. That makes Zillow the most valuable place for agents to advertise, which pays for more product, which brings more listings. Zillow now holds **77% of US real-estate category visitors** (Comscore) with about **215M monthly unique users** ([Q3 2026 8-K](https://www.sec.gov/Archives/edgar/data/0001617640/000161764026000068/q32026991.htm)). Third-party estimates put about 55% of its traffic as direct and 35-40% as organic search ([Semrush](https://www.semrush.com/website/zillow.com/overview/); [RubyHome](https://www.rubyhome.com/blog/zillow-stats/)). At that scale, direct and app traffic dominate. A new Kenyan portal is at the other end of the curve. Similarweb puts BuyRentKenya's desktop traffic at **43% organic search** and Property24 Kenya's at **55%** ([Similarweb](https://www.similarweb.com/website/buyrentkenya.com/); [Similarweb](https://www.similarweb.com/website/property24.co.ke/)), so SEO area pages and alerts matter more for Keja Yangu than an app does. Zillow also shows how a dominant portal can set the terms for supply. In 2025 its Listing Access Standards barred listings that were publicly marketed but not in the MLS within a day. Compass sued and lost its injunction bid, and Zillow later softened the rules by launching a "Zillow Preview" pre-market product ([NAR](https://www.nar.realtor/news/real-estate-news/law-and-ethics/judge-rejects-compasss-request-to-block-zillows-private-listing-rule); [Real Estate News](https://www.realestatenews.com/2026/03/18/compass-drops-lawsuit-after-zillow-embraces-pre-marketing)). That kind of leverage is years away for Keja Yangu. Until then, it has to reward agents for listing with it, not punish them for listing elsewhere.

## Twelve consumer surfaces turn browsing into a lead

### Search, map and filters

Zillow search is a map plus a list. Users can draw a custom area, search by school to see the attendance-zone boundary, and use a commute-time filter by foot, bike, transit or car ([Zillow Help](https://zillow.zendesk.com/hc/en-us/articles/227953268-How-do-I-search-for-properties); [Zillow press release](https://zillow.mediaroom.com/2023-10-11-Search-by-school-on-Zillow-makes-house-hunting-as-easy-as-ABC); [Zillow Group](https://zillowgroup.com/news/zillows-commute-time-filter)). Since 2023 the search bar has accepted sentences such as "$400K homes near me with three bedrooms" and converted them into filters ([The Title Report](https://www.thetitlereport.com/TTR/Articles/87414.aspx)). In March 2026 this grew into a conversational **AI mode**. It compares homes, explains affordability, books tours and submits rental applications in the conversation. A real-time **Fair Housing Classifier** screens both the questions and the answers to prevent steering ([Zillow press release](https://zillow.mediaroom.com/2026-03-25-Zillow-debuts-AI-mode,-bringing-guided-intelligence-to-every-step-of-the-housing-journey)). Zillow also runs an app inside ChatGPT. It handles discovery there, but sends users back to Zillow to tour, contact an agent or apply for a loan ([HousingWire](https://www.housingwire.com/articles/zillow-chatgpt-launch-app-integration/)). The structured filters are deep: home type, beds and baths, a free-text **Keywords** field, "must haves," a 3D-tour filter and **Days on Zillow** ([Bushe guide](https://bushe.co/blog/how-to-use-zillow-filters-like-a-real-estate-agent/)). The 2025-26 additions were affordability-based. **BuyAbility** labels each listing as in or out of the shopper's budget, and a "Preview" filter shows pre-market homes ([Zillow 2025-07-15](https://zillow.mediaroom.com/2025-07-15-Summer-just-got-hotter-Zillow-debuts-five-powerful-new-features); [Zillow 2026-06-23](https://zillow.mediaroom.com/2026-06-23-Zillow-launches-a-personalized-hub-that-guides-home-buyers-from-first-search-to-closing)). The design point to copy is that the AI layer writes into the same filter state the user can see and edit.

### The listing page and premium media

Zillow redesigned its home details page in October 2023. The desktop page is a single wide scroll: photos and 3D tours at the top, then large key facts, then "what's special." The iOS app instead groups content into tappable hubs ("What's Special," "Market Value," "Monthly Cost," "Neighborhood") that open into deeper pages ([Zillow press release](https://zillow.mediaroom.com/2023-10-23-Zillow-unveils-a-new-look-for-property-pages,-their-biggest-redesign-in-5-years)). A designer's case study, a portfolio rather than an official source, reports that full-page scroll-through rose from **12% to 33%** after the redesign ([Knecht](https://www.mpknecht.com/zillow-home-detail-page-redesign)). Showcase, the paid premium tier, adds interactive floor plans, AI virtual staging and **SkyTour**, a drone-built 3D exterior ([Zillow Group](https://www.zillowgroup.com/news/zillow-showcase-brings-listings-to-life); [Zillow 2025-09-10](https://zillow.mediaroom.com/2025-09-10-Zillow-brings-AI-powered-Virtual-Staging-to-Showcase-listings)). It was on **3.7% of new US listings** in Q4 2025 ([Q4 2025 letter](https://www.marketscreener.com/news/zillow-fourth-quarter-2025-shareholder-letter-ce7e5adcdf8bf221)). For-sale pages also show **Offer Insights**, which estimates how likely an offer is to be accepted at different prices. Rental pages show a **Costs & Fees** breakdown ([Zillow 2025-07-15](https://zillow.mediaroom.com/2025-07-15-Summer-just-got-hotter-Zillow-debuts-five-powerful-new-features)).

### Saved homes, saved searches and collaboration

The retention engine is the heart icon plus saved searches with email or push alerts. The "Instant" setting sends an alert as soon as a matching home is listed ([Zillow Help](https://zillow.zendesk.com/hc/en-us/articles/227953268-How-do-I-search-for-properties)). Collaboration has been built out on top. Zillow says **60%+ of buyers co-shop**, and it added per-listing message threads with invited partners in October 2025, then real-time Shared Collections in June 2026 ([Zillow 2025-10-28](https://zillow.mediaroom.com/2025-10-28-Zillow-launches-messaging,-a-new-way-for-home-shoppers-to-collaborate-within-the-Zillow-app); [Zillow 2026-06-23](https://zillow.mediaroom.com/2026-06-23-Zillow-launches-a-personalized-hub-that-guides-home-buyers-from-first-search-to-closing)). The June 2026 buyer hub asks whether the user is buying, selling or browsing. It then builds a milestone plan (budget, search, offer, close) that updates itself as the user progresses ([Zillow 2026-06-23](https://zillow.mediaroom.com/2026-06-23-Zillow-launches-a-personalized-hub-that-guides-home-buyers-from-first-search-to-closing)).

### Contact, tours and lead routing

The main call to action is "Request a tour." The buyer picks **up to three time slots**, states a buying timeline, and says whether they are free to talk now. A "yes" triggers a live phone transfer to an agent ([Zillow Premier Agent](https://www.zillow.com/premier-agent/when-buyers-contact-premier-agent/)). On the agent side, connections are routed by direct assignment, percentage, round robin or broadcast. Real-Time Touring offers a request to partners one at a time until one can make the slot, and leads that cannot be routed go to a fallback agent ([Zillow Help: Lead Routing](https://zillow.zendesk.com/hc/en-us/articles/1500004362661-Agent-Capacity-and-Lead-Routing)). Tour Itineraries (2025) group several homes into one tour that both buyer and agent can see ([Zillow 2025-07-15](https://zillow.mediaroom.com/2025-07-15-Summer-just-got-hotter-Zillow-debuts-five-powerful-new-features)).

### Agent profiles

Agent profiles show star ratings and reviews. Only people who **communicated or worked with the agent** can leave a review, and agents cannot delete reviews, only respond to or flag them ([Zillow Reviews FAQ](https://www.zillow.com/premieragent/agent-reviews-and-ratings-faq)). Past sales are filled in automatically by matching listings against county transaction records ([Inman](https://inman.com/2013/11/22/zillow-adds-transaction-histories-to-agent-profiles)). A 2020 comparison rated Zillow's profiles the most useful among competing sites ([Inman](https://www.inman.com/2020/07/13/zillows-agent-profiles-are-the-most-useful-according-to-new-study/)).

### Rentals: renters and landlords

The renter funnel runs from rental-specific filters (pets, laundry, parking, move-in date, days on Zillow) to a listing page that shows a **"Total price" badge** of base rent plus required fees. From there the renter books a tour or applies. One reusable application costs **$35**, is paid by the renter, and is valid for 30 days across participating listings ([App Store](https://apps.apple.com/us/app/zillow-rentals/id538946076); [Zillow pricing transparency](https://www.zillow.com/rentals-network/pricing-transparency); [RentSpree](https://www.rentspree.com/blog/zillow-rental-manager-review)). Renters who pay rent through Zillow get it reported to credit bureaus for free. Zillow had reported more than **1.78M** payments by August 2026 ([RISMedia](https://www.rismedia.com/2026/08/31/zillow-reports-1-78-million-rent-payments-to-credit-bureaus-through-rent-reporting-program/)).

Pricing is freemium. Individual landlords have listed **free since May 2022** and can buy an optional premium listing (about $39.99 for 90 days), with free screening and rent collection ([Zillow Help](https://zillow.zendesk.com/hc/en-us/articles/32915356424595-Creating-a-Listing); [Reallyo](https://www.reallyo.com/blog/zillow-rental-manager-cost)). Professional operators pay per door for syndication, flat-rate packages, or **pay-per-lease**, which is charged only when Zillow was the first point of contact for a signed lease ([Zillow Lease Connect](https://www.zillow.com/rentals-network/lease-connect/)). Free listings expire around **day 21** unless the landlord confirms the unit is still available ([Reallyo](https://www.reallyo.com/blog/how-to-post-a-rental-on-zillow)).

### Valuation and owner tools

The Zestimate has been a single neural-network model since June 2021 ([GeekWire](https://www.geekwire.com/2021/zillow-group-uses-machine-learning-improve-zestimate-algorithm-dynamic-market-conditions/)). Its inputs are home attributes, tax assessments, prior sale prices and listing data. Its 2025 median error was **1.8% for listed homes and 7.2% for off-market homes** ([10-K](https://www.sec.gov/Archives/edgar/data/1617640/000161764026000015/z-20251231.htm)). The gap matters: on a listed home, the asking price does most of the work. Owners can "claim" their home, correct its facts and track its value ([Zillow claim your home](https://zillow.com/sellerlanding/claimyourhome)). In business terms, this flow exists to identify future sellers and route them to agents. Zillow's market indices build on this data. ZHVI is computed from Zestimates. ZORI is a **repeat-rent index of asking rents** that controls for changes in the quality of listed stock ([ZHVI methodology](https://www.zillow.com/research/zhvi-methodology-2019-deep-26083); [ZORI methodology](https://www.zillow.com/research/methodology-zori-repeat-rent-27092/amp/)).

### Mortgages and affordability

Every listing carries a payment estimate covering principal and interest, mortgage insurance, taxes, home insurance and HOA fees ([Zillow mortgage calculator](https://www.zillow.com/mortgage-calculator/)). BuyAbility (May 2024) combines live Zillow Home Loans rates with the buyer's credit score and income to estimate an affordable price ([Zillow Group](https://www.zillowgroup.com/news/our-new-tool-addresses-home-buyers-biggest-concern-affordability)). Zillow Home Loans is now a direct lender in 49 states, and third-party lenders still pay to appear in a mortgage marketplace ([10-K](https://www.sec.gov/Archives/edgar/data/1617640/000161764026000015/z-20251231.htm); [Zillow](https://www.zillow.com/learn/how-does-zillow-make-money)).

### Neighbourhood data

Neighbourhood content has been the riskiest surface. Zillow added First Street climate-risk scores in 2024 and **removed them from more than 1M listings in late 2025** after agents complained the scores were costing them sales. It now links out to First Street instead ([TechCrunch](https://techcrunch.com/2025/12/01/zillow-drops-climate-risk-scores-after-agents-complained-of-lost-sales)).

### Trust and safety

Zillow's documented anti-fraud measures are modest:

- automated screening of listings before and after posting
- identity checks on listers through Persona, only when risk triggers them ([Zillow Help](https://zillow.zendesk.com/hc/en-us/articles/40388811116179-Zillow-Rental-Manager-Account-Verification))
- a "Report Listing" button and renter red-flag guides ([Zillow](https://www.zillow.com/learn/how-to-spot-rental-scams))
- a keyword filter for discriminatory wording, built with the DC Attorney General ([DC OAG](https://oag.dc.gov/node/1650))
- since May 2026, **no landlord phone numbers on free rental listings**, so that contact runs through on-platform messaging where fraud can be seen ([Lohmann](https://www.peterlohmann.com/blog/zillow-removes-phone-numbers-rental-listings))

Critics note that Zillow does not verify every landlord before a listing goes live ([Incogni](https://blog.incogni.com/is-zillow-safe/)). Its "Verified Source" badge is part of a paid advertiser package, not a check applied to every listing ([Zillow Rent Connect](https://www.zillow.com/multifamily-knowledge-center/property-management/general-marketing/rent-connect-advertising-packages/)). Zillow can get away with light trust controls because US listings mostly arrive through regulated MLS feeds. Kenya has no MLS, so Keja Yangu cannot rely on the supply channel to filter out fraud.

## Keja Yangu already has the listing page but lacks the loops

The table compares Keja Yangu as of 5 November 2026 with Zillow's core surfaces. The pattern is clear. Keja Yangu has built the **destination**: listing detail, payment estimates, similar homes and local saves. It is missing the **loops** that bring users back (alerts, synced saves, area pages), the **connective tissue** that turns visits into measured, sellable leads (lead logging, agent profiles, an owner dashboard), and the **public trust signals** it already has the back-end for (verification status is captured in review but not shown on listings).

| Zillow capability | Keja Yangu today | Gap |
|---|---|---|
| Listing detail page: gallery, facts, payment estimate, similar homes | Done: lightbox gallery, payment and move-in estimates, price per m², days on site, similar homes, share | Small: Kenyan rental fields, tour request, neighbourhood module |
| Filters and sort | Done: sale/rent, type, location text, price, beds, amenity; sort options | Keyword, Kenyan fields, monthly-budget filter, URL-shareable state if not already |
| Map search, draw, boundaries | None (no coordinates) | Large: needs PostGIS, pin capture and an estate gazetteer |
| Saved homes | localStorage only | Sync to the account, merging local saves on sign-in |
| Saved searches and alerts | None | Core retention loop, still missing |
| Contact | WhatsApp chat and call buttons, owner card | Clicks are not logged as leads; no tour request |
| Agent profiles, reviews, finder | Placeholders | Missing; profiles already have is_agent and agency_name |
| Verification | Team review sets verification_status | Not shown publicly; no report-listing flow |
| Owner / landlord dashboard | My-listings | No views, saves or lead stats; no renew, mark-let or price-achieved capture |
| Valuation / rent estimate | Valuation page (static) | No data-driven rent or price ranges |
| Mortgage tools | Loans, government loan, calculator pages; estimate on listing | No KMRC eligibility check, lender referral or affordability filter |
| Payments | None | M-Pesa for boosts and subscriptions |
| SEO area pages | None | Programmatic estate pages are missing |

## Kenya rewards verification and rentals more than valuations

### Trust is the product, because fraud is the market's defining problem

In Kenya, fake listings with **viewing or "commitment" fees of KSh 1,000-2,000** are a recognised scam system ([Rentershub](https://www.rentershub.co.ke/blogs/how-fake-rental-agents-in-nairobi-actually-operate-a-step-by-step-breakdown-of-the-scam-system/)). BuyRentKenya itself warns users never to pay before viewing ([BuyRentKenya](https://www.buyrentkenya.com/discover/how-to-identify-and-avoid-real-estate-scams)). Agent regulation is weak. In April 2024 only about **3,000 of roughly 10,000 practising agents** were registered with the Estate Agents Registration Board (EARB) ([Business Daily](https://www.businessdailyafrica.com/bd/economy/unregistered-agents-face-arrest-in-war-on-tax-evading-landlords--4559206)), and a December 2025 briefing found registration "not common" in the EARB directory ([GIACE](https://giace.org/wp-content/uploads/2025/12/Challenges-in-addressing-illicit-finance-in-the-Kenyan-real-estate-sector.pdf)). Keja Yangu should build a **visible verification ladder** and show each rung as a separate badge, never as a single "verified" mark that can be bought:

1. Phone OTP.
2. National ID check through a licensed IPRS-connected KYC vendor, triggered by risk.
3. EARB registration number checked against the public directory.
4. For sale listings, an owner-supplied land search whose registered owner matches the lister's ID.
5. An optional in-person or video "verified visit."

Title verification must be described carefully. Ardhisasa searches cost about **KSh 500 per parcel**, but full online coverage exists only for **Nairobi and Murang'a**. Kiambu, Mombasa and Isiolo are partial, and other counties still use manual RL 26 searches ([Landstock](https://landstock.co.ke/how-to-verify-a-title-deed-in-kenya-2026-ardhisasa-ecitizen-what-to-do-outside-nairobi/); [Amcco](https://amccopropertiesltd.co.ke/how-to-conduct-land-search-using-ardhisasa)). A search confirms registered ownership and encumbrances. It does not confirm that the boundaries on the ground match the title ([Real.co.ke](https://www.real.co.ke/verify-land-ownership-kenya-ardhisasa/)). The research found no public Ardhisasa API, so the badge should say "Search document reviewed (date)," not "Title verified." Many Nairobi apartments still sit on legacy long-term sub-leases rather than sectional titles, although the Sectional Properties Act required conversion by December 2022 ([DLA Piper/IKM](https://www.dlapiperafrica.com/en/kenya/insights/2022/faqs-on-sectional-properties-law-in-kenya.html)). The listing form should therefore record the tenure type: freehold, leasehold, sectional title, or sub-lease pending conversion.

Storing ID and title images makes Keja Yangu a data controller under the Data Protection Act 2019. It should register with the ODPC (reported fees run from KSh 4,000 for small entities), minimise what it retains, and encrypt these files ([ODPC guidance](https://www.odpc.go.ke/wp-content/uploads/2024/02/ODPC-Guidance-Note-on-Registration-of-Data-Controllers-and-Data-Processors.pdf)).

### Contact stays WhatsApp-first, but leads must be logged

Zillow's May 2026 move to hide phone numbers would backfire in Kenya, where WhatsApp is the default channel between renters and agents. The economics also favour keeping it. Opening a chat with a free `wa.me` deep link costs nothing, and replies within the 24-hour service window are free. Business-initiated utility templates for alerts cost roughly **KSh 0.5-1.1** each, and marketing templates about **KSh 3-5** ([Kenyans.co.ke](https://www.kenyans.co.ke/news/127393-how-much-kenyan-businesses-will-pay-send-whatsapp-messages-october-1); [Habarichat](https://habarichat.ai/blog/whatsapp-business-pricing-kenya.html)). SMS OTP through Africa's Talking costs about **KSh 0.5-1.0** ([Africa's Talking](https://africastalking.com/pricing)).

The adaptation is to send every WhatsApp and call click through a Keja Yangu redirect that logs a lead event before opening WhatsApp. The prefilled message should carry a listing reference (for example "KY-10423"). The agent then knows where the enquiry came from, and Keja Yangu gets the attribution data that every later agent-pricing model depends on. Exact map pins for rentals should be hidden until the renter makes contact, with an approximate circle shown instead. This protects landlords and makes it harder to scrape listings for scams.

### Geography is estates, not addresses

Nairobi launched street addressing in 2023, but almost nobody uses it. People search by estate (Kilimani, Ruaka, Syokimau) and describe locations by landmark ([Kenyans.co.ke](https://www.kenyans.co.ke/news/86108-sakaja-unveils-new-naming-system-nairobi-buildings-streets); [KICTANet](https://lists.kictanet.or.ke/pipermail/kictanet/2013-May/020738.html)). Even KNBS's new price index splits Nairobi into only four data-driven zones ([KNBS methodology](https://www.knbs.or.ke/wp-content/uploads/2026/05/Kenya-Residential-Proprety-Price-Index-Methodology-Note.pdf)). Keja Yangu therefore needs three location fields:

- a pin dropped on a map as the primary location
- a curated **estate gazetteer**, with polygons drawn from OpenStreetMap plus manual edits and linked to ward and county codes
- a free-text landmark field, such as "behind Yaya Centre"

The estate polygons also drive the map boundary outlines and the SEO area pages. Commute filters should use distance to matatu stages or major roads, since there is no Kenyan equivalent of reliable transit routing data.

### Rentals need Kenyan fields and deposit transparency

There is no statutory cap on tenancy deposits. For Cap 296 controlled tenancies, demanding more than two months' rent in advance is an offence. Typical terms are **1-2 months' deposit** plus the first month's rent, sometimes water and electricity deposits, and an agent fee of **50-100% of a month's rent** that the tenant usually pays. Deposit refunds are a chronic complaint ([Streamlinefeed](https://streamlinefeed.co.ke/news/kenya-tenant-rights-deposits-rent-increases-notice-evictions); [Kenyans.co.ke](https://www.kenyans.co.ke/news/56342-5-fees-landlords-use-swindle-tenants)). The 2021 Landlord and Tenant Bill lapsed, so the old Caps still apply ([Realtor Kenya](https://www.realtorkenya.com/blog/landlord-and-tenant-rights-in-kenya)). Keja Yangu's move-in estimate is already the Kenyan version of Zillow's "Total price" badge. It should be fed by structured fields:

- deposit months, water deposit and electricity deposit
- agent fee
- service charge
- water source and supply days, including borehole and tank storage
- KPLC meter type (separate prepaid token or shared)
- security features
- floor and lift
- house types in local vocabulary: bedsitter, single room, DSQ, maisonette
- a **"No viewing fee" pledge**, enforced through the report flow

Water rationing and shared meters are among the most common renter checks ([uni2study](https://www.uni2study.com/articles/avoid-rental-scams-housing-search-nairobi)). Move-in condition photos stored on the listing record would address the deposit-refund problem cheaply.

### Price data has to be built from listings, then calibrated

Kenya has no public register of sale transactions. The available indices are:

- **HassConsult**: quarterly asking prices for about 19 suburbs and 14 satellite towns
- **Cytonn**: annual area-level yields; the 2025/26 average was **5.9%**
- **KBA-HPI**: only **102-120 homes** sampled per quarter
- **KNBS RPPI**: launched in 2026; apartment index 88.7 and house index 133.6 in Q1 2026

Sources: [Kenyans.co.ke](https://www.kenyans.co.ke/news/114499-westlands-among-nairobi-estates-where-rent-has-dropped); [Cytonn 2026](https://cytonn.com/uploads/downloads/nairobi-metropolitan-area-residential-report-2026-cytonn-weekly-232026-v2.pdf); [KBA](https://www.kba.co.ke/housing-price-index/); [KNBS Q1 2026](https://www.knbs.or.ke/wp-content/uploads/2026/07/Kenya-Residential-Property-Price-Index-First-Quarter-2026.pdf). No Kenyan portal publishes valuations ([Khusoko](https://imap.khusoko.com/2025/11/30/rushbox-acquires-buyrentkenya-in-regional-proptech-consolidation/)), so there is a gap to fill, but carefully.

The defensible sequence follows ZORI rather than the Zestimate:

1. A **rent range** per estate, house type and bedroom count, built from Keja Yangu's own listings.
2. A **repeat-listing rent index**: the same unit relisted over time, which controls for quality the way ZORI does.
3. An **asking-price** index per estate, labelled "asking."
4. Calibration against HassConsult and Cytonn medians.

The most valuable data move is to ask landlords and agents for the "rent agreed" or "price achieved" when they mark a listing as let or sold. Over time that builds the transaction dataset no Kenyan competitor has.

### Mortgages are a niche, and the instalment plan is the real financing product

Kenya had only **30,762 mortgages worth KSh 307.2B** at the end of 2025. The average rate was about **13.5%** and **16.3%** of mortgage loans were non-performing ([People Daily](https://peopledaily.digital/business/cbk-mortgage-loans-hit-ksh307b-as-average-borrowing-rises-to-ksh10m)). The affordable route is KMRC-refinanced loans at about **9.5% fixed for up to 20 years**, for property worth up to **KSh 10.5M**, with income caps ([I&M Bank](https://www.imbankgroup.com/ke/im-bank-miliki-nyumba/); [BuyRentKenya](https://www.buyrentkenya.com/discover/kmrc-increase-mortgage-limit-from-8-million-to-10-5-million)). Sources disagree on the income caps ([Streamlinefeed](https://streamlinefeed.co.ke/news/how-to-qualify-for-kmrc-affordable-mortgage-kenya-2026)), so Keja Yangu's checker should cite the lender's terms rather than hard-code a single figure. SACCOs are also KMRC partner lenders ([Stima Sacco](https://www.stima-sacco.com/mortgage-facilities/)). Boma Yangu has **1.24M registered applicants** and runs a tenant-purchase model ([paybillke](https://paybillke.com/guides/boma-yangu-how-to-register-and-pay)).

Most purchases are therefore cash, SACCO-financed or off-plan instalments. Keja Yangu's existing payment estimate should add a **developer instalment-plan mode** and a **KMRC eligibility check**. It should leave BuyAbility-style pre-qualification to lender partners.

### Diaspora buyers pay for remote trust

Remittances passed **US$5B for the first time in 2025** ([Kenyan Wall Street](https://kenyanwallstreet.com/kenya-diaspora-remittances-top-us-5-billion-for-first-time-in-2025)), then slipped 1.3% in the 12 months to August 2026 as US inflows fell ([Kenyans.co.ke](https://www.kenyans.co.ke/news/127711-kenyas-diaspora-remittances-drop-13-us-and-saudi-inflows-decline)). Diaspora buyers are frequent fraud targets. In one April 2026 case, a fake KSh 2.4M land sale initiated from Denmark was exposed by an ownership check at Ardhi House ([Dawan Africa](https://www.dawan.africa/news/fake-land-deal-exposed-at-ardhi-house-as-couple-held-over-sh24m-fraud)). Useful diaspora features include:

- USD and GBP price display
- video viewings
- a paid **verified-visit report** with geotagged photos
- an **advocate-reviewed land search**
- developer track-record pages for off-plan projects

These are services diaspora buyers will pay for by card.

### Payments run on M-Pesa, kept to low-risk flows

Access to Safaricom's Daraja API is free. Going live needs a Paybill or Till owned by a registered business, plus a Go-Live approval that takes 1-3 business days. Aggregators such as IntaSend are faster to set up but take about 1-3% per transaction ([paybillke](https://paybillke.com/guides/mpesa-daraja-api-complete-guide-2026); [IntaSend](https://intasend.com/payments/new-mpesa-transaction-charges)). Keja Yangu should use STK Push for listing boosts, agent subscriptions, verification services and diaspora reports. It should **not hold rent deposits or purchase money**. Escrow likely falls under CBK payment rules and trust-account law, which the research did not examine. A bank or an advocate's client account is the safer partner for that.

## A four-phase roadmap ships trust and loops before data

The effort estimates assume two or three developers. **S** is up to about one week, **M** is two to four weeks, and **L** is one to three months. These are the author's judgements, not sourced figures. Supabase provides PostGIS for geo queries, scheduled jobs for expiry and alert digests, and storage for verification documents. Clerk's user IDs key the synced saves and agent profiles, and its organisations feature is a natural fit for agencies.

### Phase 1 (weeks 0-6): make trust visible and start measuring leads

| Item | Why (Zillow analogue) | Effort |
|---|---|---|
| Show verification badges publicly (verified listing, verified owner/agent) using the existing verification_status; add a "No viewing fee" pledge | Zillow's trust gap is Keja Yangu's chance to differentiate | S |
| Report-listing button, admin review queue, auto-hide after N reports | "Report Listing" | S |
| Log every WhatsApp and call click as a lead event through a redirect, with a listing reference in the prefilled message | Lead attribution that agent analytics, pay-per-lease and agent pricing all depend on | S |
| Sync saves to the account (Supabase table keyed by Clerk user; merge localStorage saves on sign-in) | Saved homes across devices | S |
| Kenyan rental fields (deposits, agent fee, service charge, water, meter, security, bedsitter/DSQ types, tenure type) feeding the move-in estimate and filters | "Total price" and Costs & Fees | M |
| Listing expiry: rentals ask "still available?" at about day 14 and auto-pause at about day 21; sales at about 60-90 days | Rental Manager auto-expiry | S |
| ODPC registration and a data-retention policy for ID and title files | Compliance before collecting KYC data | S |

### Phase 2 (weeks 6-16): map search and the return-visit loop

| Item | Why | Effort |
|---|---|---|
| Pin-drop on the add/edit form; PostGIS column; backfill existing listings | Prerequisite for everything spatial | S |
| Estate gazetteer (OSM polygons plus manual edits, mapped to ward and county) and estate autocomplete in search | Boundary outlines and geography the way Kenyans search | M |
| Split map/list search with bounding-box queries, pin clustering, "search as map moves," approximate circles for rentals | Zillow's map-plus-list UX | L |
| Saved searches with instant or daily alerts, email first and WhatsApp utility templates (about KSh 1 each) as an option | Zillow's main retention loop | M |
| Programmatic area pages (e.g. /rent/nairobi/kilimani/2-bedroom) with live counts, median asking rent and recent listings | SEO is Keja Yangu's main acquisition channel | M |
| Keyword filter and a "monthly budget" filter that reuses the payment estimate | Keywords; affordability filtering | S |

### Phase 3 (months 4-7): agents, owners and money

| Item | Why | Effort |
|---|---|---|
| Agent profiles: photo, agency, EARB number (checked), estates covered, active and let/sold listings, median response time from lead logs | Agent profiles | M |
| Reviews limited to users with a logged lead to that agent; agent can respond but not delete | Zillow's "communicated or worked with" rule | S |
| Agent finder by estate, replacing the placeholder pages | Agent Finder | S |
| Owner/landlord dashboard: views, saves, leads per listing, renew, mark let/sold with "rent agreed / price achieved" | Owner dashboard and claim-your-home; builds transaction data | M |
| Viewing request: up to three time slots, confirmed over WhatsApp; agent gets a lead inbox | Tour request and lead inbox | M |
| M-Pesa STK Push (Daraja or an aggregator) for boosts, featured listings and agent subscriptions | Monetisation rail | M |
| Risk-triggered ID verification through an IPRS-connected KYC vendor | Persona-style checks | M |
| Duplicate and scam detection: perceptual hashing of photos, reuse of phone numbers across listings, the same property at different prices | Zillow's listing-hijack red flag | M |

### Phase 4 (months 7-12+): data, finance and premium

| Item | Why | Effort |
|---|---|---|
| Rent range per estate and type on listings and the valuation page; repeat-listing rent index per estate | Rent Zestimate and ZORI, adapted | L |
| Asking-price index per estate, labelled "asking," calibrated to HassConsult and Cytonn | ZHVI substitute | M |
| KMRC eligibility checker; lender/SACCO referral marketplace; developer instalment mode in the calculator | Mortgage marketplace, without lending | M |
| New-development (off-plan) project pages with developer track record and unit availability | New Construction marketplace | M |
| Diaspora pack: USD/GBP display, video viewings, paid verified-visit and advocate-reviewed search reports | Kenya-specific premium service | M |
| Premium "Showcase" tier: 3D tour and floor-plan embeds, hero placement | Showcase | S-M |
| Natural-language search that writes into visible filters, with a screen that blocks steering by tribe, religion or ethnicity | AI mode and the Fair Housing Classifier | L |
| Shared collections and per-listing comments for co-renters and couples | Collaboration | M |

## Charge professionals, keep owners and renters free

Keja Yangu should follow Zillow's freemium split, which already fits Kenyan pricing. **Individual owners and landlords list free**, because they are the supply and their listings make the site worth visiting. **Renters and buyers never pay**: a renter-side fee looks too much like the viewing-fee scam Keja Yangu is positioning against. Revenue should come from four lines, introduced in this order.

First, **per-listing boosts** bought via M-Pesa: featured placement, a top-of-estate slot, and Showcase media. BuyRentKenya's private-lister tiers of **KSh 1,500-20,000 per 30 days** set the reference price ([BuyRentKenya](https://www.buyrentkenya.com/list-privately)). Keja Yangu should launch below those prices to win switching agents.

Second, **agent and agency subscriptions** with share of voice per estate. This is the Premier Agent market-based model, which works without tracking deals to closing. Secondary sources put BuyRentKenya's agent plans at **KSh 5,000-110,000** ([liners.com](https://liners.com/buyrentkenya)). Keja Yangu's version should be sold on logged leads per shilling, which competitors cannot report.

Third, **developer project promotion** for off-plan schemes, the analogue of Zillow's New Construction line.

Fourth, **referral fees from lenders and SACCOs** for qualified mortgage enquiries, plus **paid diaspora verification services**.

Verification itself should stay outside the pricing tiers. Zillow attaches a "Verified Source" badge to a paid package. Keja Yangu should do the opposite: badges reflect checks passed, and any fee for a land search or site visit is a disclosed cost-recovery service. Pay-per-lease and pay-at-close should wait. Both depend on attribution and on confirming that a deal closed. Zillow's pay-at-close referral fees are now the subject of a class action alleging they are not disclosed to consumers ([HousingWire](https://www.housingwire.com/articles/zillow-lawsuit-preferred-agent/)). Once Phase 3 lead logging and mark-let data mature, a success fee for property managers (for example, a fraction of a month's rent on a lease Keja Yangu originated) is the natural next model. It matches where Zillow's growth now comes from: Rentals revenue grew 39% in FY2025 ([Zillow FY2025 results](https://zillowgroup.mediaroom.com/2026-02-10-Zillow-Group-Reports-Fourth-Quarter-and-Full-Year-2025-Financial-Results)).

## What Zillow does that Kenya should skip

**A point-estimate Zestimate for every property.** Even with US deed records, off-market error is **7.2%**, and accuracy varies by state from 4.5% to 12.7% depending on how many homes sell ([10-K](https://www.sec.gov/Archives/edgar/data/1617640/000161764026000015/z-20251231.htm); [Clever](https://listwithclever.com/real-estate-blog/how-accurate-is-a-zillow-zestimate-5-things-to-know/)). Kenya has no transaction register, so error would be much worse and could not even be measured. A KSh figure on every home would be a liability. Zillow's own 10-K lists disputes over Zestimate accuracy as a risk factor.

**Transacting on the model.** Zillow Offers, the iBuying business that made cash offers based on Zestimates, ended in 2021 with **$407.9M in inventory write-downs**. The CEO said that "the unpredictability in forecasting home prices far exceeds what we anticipated" ([FY2021 10-K](https://www.sec.gov/Archives/edgar/data/1617640/000161764022000013/z-20211231.htm); [Zillow 8-K](https://www.sec.gov/Archives/edgar/data/1617640/000161764021000085/z-20211102.htm)). Guaranteed offers, instant cash bids or price guarantees based on Keja Yangu estimates should be ruled out.

**Direct lending and BuyAbility-grade pre-approval.** Zillow had **$227M** of operating cash tied up in loans held for sale in 2025 ([Panabee](https://www.panabee.com/news/zillow-earnings-2025-annual)). Kenya's entire mortgage book is about 30,000 loans. A referral marketplace captures the intent without the balance-sheet risk.

**MLS-based supply rules and pay-at-close referrals.** Listing Access Standards only work when one portal controls the traffic and a feed exists to enforce against. Pay-at-close needs closings that can be verified. Kenya has neither yet.

**School zones, climate scores and US-style address search.** GreatSchools-style ratings and attendance boundaries have no Kenyan dataset. Climate scores were pulled even by Zillow. Address search fails where nobody uses addresses. Estates, landmarks, water reliability and distance to a matatu stage are the Kenyan neighbourhood signals.

**Hiding phone numbers on free listings.** This fights the WhatsApp habit. Logging clicks gives the same measurement without the friction.

**The reusable $35 rental application, rent-to-credit reporting and the US closing dashboard.** These depend on US tenant-screening bureaus, credit bureaus and title/escrow processes. Kenya has CRBs, but renters do not expect formal screening, and charging renters cuts against the no-fee promise.

**SkyTour-class drone splats and app-first launches.** These are expensive, and the payoff is low at Kenyan traffic levels. A responsive web app (PWA) and simple 3D-tour embeds deliver most of the value.

## Conclusion

The clearest lesson from Zillow's 2025-26 record is that its data products followed its traffic. Its marketplace mechanics did not wait for the data, and the same order applies to Keja Yangu. The Zestimate became credible only after Zillow had a national database and years of recorded sales. The lead-routing, alert and freemium machinery worked from the start. For Keja Yangu, the scarce asset in Kenya is not listings, which Jiji, Facebook groups and BuyRentKenya all have, but listings people can believe. A portal that publicly separates EARB-checked agents, ID-checked owners and reviewed land searches, expires stale rentals within three weeks, and logs every WhatsApp enquiry builds two assets at once. One is a reputation competitors cannot copy quickly. The other is a lead and rent-agreed dataset from which an honest rent index, and eventually a price index, can be built. One question remains open: whether Kenyan agents will pay for measured leads when the market is used to unmeasured WhatsApp traffic. The Phase 1 lead-logging work is the cheapest way to find out. It should go live before any pricing decision is made.
