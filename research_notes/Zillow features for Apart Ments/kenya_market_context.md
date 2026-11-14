# Kenya Residential Property Market & Digital-Infrastructure Context for a Zillow-like Portal (2025-2026)

Research date: 2026-11-05. Most sources reached were news outlets, law-firm blogs and commercial guide sites rather than primary government documents (several primary PDFs failed to fetch: CBK BSD report via People Daily returned 403, KNBS RPPI PDF had a TLS error, KBA HPI PDF was unreadable binary, and the ODPC regulations PDF returned no usable text). Figures marked "secondary" should be checked against the primary source before publication.

## 1. Competitors (BuyRentKenya, Property24 Kenya, Jiji, PigiaMe, Hauzisha, Kenya Property Centre, Facebook/WhatsApp)

### Takeaway
BuyRentKenya is the traffic leader among dedicated portals (roughly 130-210K visits/month depending on the tool and date). It was acquired by the regional proptech group Rushbox in late 2025. Property24 Kenya is second. Jiji and PigiaMe are general classifieds with free or cheap property listings. None of the Kenyan portals offer public valuations or verified title data, and viewing-fee and fake-listing fraud is a market-wide problem rather than one tied to a single site.

### Cited Findings
- Rushbox acquired BuyRentKenya (reported 30 Nov 2025). Rushbox also runs PropertyCloud (Mauritius) and Property.co.zw (Zimbabwe). BuyRentKenya is described as the market leader, competing with Hauzisha, Property24 Kenya and Jiji — [Khusoko](https://imap.khusoko.com/2025/11/30/rushbox-acquires-buyrentkenya-in-regional-proptech-consolidation/)
- Traffic estimates (the tools disagree):
  - Semrush, Aug 2025: buyrentkenya.com about 131.9K visits; property24.co.ke about 48.3K — [Semrush](https://www.semrush.com/trending-websites/ke/real-estate)
  - Pulse Kenya, 2024, citing Similarweb: BuyRentKenya 211,500/month; Property24 Kenya 169,400/month — [Pulse](https://www.pulse.co.ke/story/top-5-real-estate-websites-in-kenya-2024072913170001631)
  - Similarweb, Feb 2026: buyrentkenya.com 187.5K visits over 3 months, with 43% of desktop visits from organic search — [Similarweb](https://www.similarweb.com/website/buyrentkenya.com/)
  - Similarweb, Sep 2026: property24.co.ke traffic down 18% month on month, with organic search at 55% of desktop visits — [Similarweb](https://www.similarweb.com/website/property24.co.ke/)
  - Ahrefs, mid-2026, organic search only: BuyRentKenya about 29K/month (88% Kenya); Property24 about 14.5K/month — [Ahrefs](https://ahrefstop.com/websites/buyrentkenya.com), [Ahrefs](https://ahrefstop.com/websites/property24.co.ke)
- BuyRentKenya pricing for private listers (per listing, 30 days): Silver KSh 1,500; Silver Boost KSh 4,000; Gold Priority KSh 8,000; Top Listing KSh 20,000. Agencies and developers buy subscription packages negotiated with the sales team — [BuyRentKenya list-privately](https://www.buyrentkenya.com/list-privately)
- Secondary sources put BuyRentKenya agent subscriptions at KSh 5,000-110,000 (Basic/Optimum/Premium) — [liners.com](https://liners.com/buyrentkenya), [Scribd 2024 rate card](https://www.scribd.com/document/820257815/BuyRentKenya-Rate-Card-2024)
- Jiji and Property24 Kenya are described as offering free listings, but that comparison is about two years old — [Commercial Property Kenya](https://commercialpropertykenya.com/kenyas-best-real-estate-websites-an-in-depth-comparison/)
- Jiji revamped its property category in 2021 with "AI tools and algorithms" for safety. Jiji agreed to buy OLX's businesses in Kenya, Ghana, Uganda and Tanzania — [HapaKenya](https://hapakenya.com/2021/08/10/jiji-improves-its-property-category-to-enhance-service-delivery-for-real-estate-buyers-sellers), [ITWeb](https://itweb.africa/content/kLgB1Me8N8V759N4)
- PigiaMe is part of Ringier One Africa Media (ROAM) and is a general classifieds site. A review notes its "verified seller programs" but "limited filters and lack of market information" — [Techweez](https://techweez.com/2017/11/15/classifieds-platforms-ringier-africa-one-africa-media-sign-merger-form-roam/), [Commercial Property Kenya](https://commercialpropertykenya.com/kenyas-best-real-estate-websites-an-in-depth-comparison/)
- Fraud pattern: scammers post listings on websites and social media and demand a fee to view. A Dec 2025 Mombasa case involved non-existent beach apartments, and one family lost KSh 24,000 — [Streamlinefeed](https://streamlinefeed.co.ke/news/rental-and-land-scams-in-kenya-checks-before-you-pay), [Tolet Kenya](https://toletkenya.co.ke/common-rental-scams-in-kenya-and-how-to-avoid-them/)
- BuyRentKenya's own advice tells users never to pay fees before viewing, which shows the portals themselves treat this as a major user risk — [BuyRentKenya](https://www.buyrentkenya.com/discover/how-to-identify-and-avoid-real-estate-scams)
- Viewing or "commitment" fees typically run KSh 1,000-2,000 and are non-refundable. Fake agents are a structured scam operation — [Rentershub](https://www.rentershub.co.ke/blogs/how-fake-rental-agents-in-nairobi-actually-operate-a-step-by-step-breakdown-of-the-scam-system/), [Kenyans.co.ke](https://www.kenyans.co.ke/news/56342-5-fees-landlords-use-swindle-tenants)

### Inferences
- The market is small in web-traffic terms: the leading portal sees well under 1M visits a month. Much discovery probably happens on Facebook groups, WhatsApp and Jiji, so a new entrant competes with informal channels as much as with portals.
- The obvious differentiators are verified listings (agent registered with EARB, landlord or owner identity checks, freshness checks) and a no-viewing-fee guarantee. No competitor appears to publish valuations or Zestimate-style estimates.
- Rushbox's ownership may bring more investment and product change at BuyRentKenya in 2026.

### Gaps
- I found no reliable features, pricing or traffic data for Hauzisha or Kenya Property Centre. The only material was self-promotional.
- I found no quantitative data on Facebook Marketplace or groups, or on WhatsApp agent networks, despite their likely dominance.
- I found no current Property24 Kenya or Jiji agent rate cards. I found no documented complaints specifically about BuyRentKenya or Property24 stale listings, only general scam reports.

## 2. Payments (M-Pesa Daraja and alternatives)

### Takeaway
Daraja API access is free, but going live requires a Safaricom Paybill or Till shortcode owned by a registered business, plus Go-Live approval (about 1-3 business days). The cost is in M-Pesa transaction tariffs. Aggregators (IntaSend, Pesapal, Flutterwave, Paystack) are faster to set up but charge roughly 1-3.5% per transaction.

### Cited Findings
- Daraja prerequisites: an active Paybill or Buy Goods Till from the M-Pesa for Business portal, plus a Business Administrator/Manager on the M-Pesa Org Portal to link the shortcode. Some guides list a registered business name, KRA PIN and Safaricom Business account. The Go-Live request needs the shortcode, HTTPS callback URLs and a settlement bank account — [Angazé](https://www.angaze.co/blog/daraja-sandbox-to-production), [Hostiko](https://hostiko.co.ke/blog/mpesa-integration-kenya-daraja-api), [paybillke](https://paybillke.com/guides/mpesa-daraja-api-complete-guide-2026)
- Go-Live approval is reported at 24 working hours to 1-3 business days. The sandbox shortcode is 174379. STK Push has no published rate limit; the community estimate is about 100 requests per minute per shortcode. TransactionType must match the shortcode type: CustomerPayBillOnline or CustomerBuyGoodsOnline — [paybillke](https://paybillke.com/guides/mpesa-daraja-api-complete-guide-2026), [Kenzobe](https://www.kenzobe.com/blog/mpesa-stk-push-tutorial)
- No fee for API access. Paybill tariffs are negotiated with Safaricom. An unverified figure puts Paybill setup at about KSh 1,800 plus about KSh 100 per month — [paybillke](https://paybillke.com/guides/daraja-api-mpesa-integration)
- Buy Goods merchant fee is reported as free up to KSh 500, 0.55% for KSh 501-36,363, and capped at KSh 200 above that. A calculator site instead says 0.5%, so the figures conflict — [MyCyber](https://mycyber.co.ke/mpesa-charges/), [calculator.co.ke](https://calculator.co.ke/till-transaction-cost-calculator)
- IntaSend: its own 2023 page lists 1% on M-Pesa collections and 1.5% on disbursements (min KSh 10, cap KSh 50). Aggregator sites list 3% M-Pesa and 3.8% cards — [IntaSend](https://intasend.com/payments/new-mpesa-transaction-charges), [PaymentProviders.io](https://paymentproviders.io/blog/best-payment-gateways-kenya)

### Inferences
- Portal use cases with low regulatory risk are listing fees, featured or boosted listings, agent subscriptions and verification fees, all collected via STK Push.
- Holding rent deposits or purchase money (escrow) is a different matter. It likely touches CBK payment-service-provider rules and trust-account law. Partnering with a bank, or an advocate's client account for sales, is safer than holding funds directly. This is an inference; I did not research the CBK rules.
- B2C (payouts) fits refunds, for example a refundable viewing deposit or agent referral payouts.

### Gaps
- I found no official Safaricom tariff sheet or official Pesapal, Flutterwave or Paystack Kenya fee schedules.
- I found no information on CBK licensing requirements for escrow or PSP activity.

## 3. Contact behaviour: WhatsApp and SMS

### Takeaway
WhatsApp is the default channel between agents and renters. Since 1 July 2025 Meta bills per template message, and in Kenya marketing templates cost roughly KSh 3-5 and utility/authentication templates roughly KSh 0.5-1.1. Service replies inside the 24-hour window are free. SMS through Africa's Talking or local aggregators costs about KSh 0.25-1.00 per message.

### Cited Findings
- Meta switched to per-message pricing on 1 July 2025. Utility templates sent inside an open window became chargeable in Kenya from 1 October — [Kenyans.co.ke](https://www.kenyans.co.ke/news/127393-how-much-kenyan-businesses-will-pay-send-whatsapp-messages-october-1), [Blueticks](https://blueticks.co/blog/whatsapp-business-api-pricing-2026)
- Kenya marketing template: about KSh 3.20-3.30 per delivered message (Kenyans.co.ke). Resellers quote KSh 3.525 or about KSh 5.20 — [Kenyans.co.ke](https://www.kenyans.co.ke/news/127393-how-much-kenyan-businesses-will-pay-send-whatsapp-messages-october-1), [Habarichat](https://habarichat.ai/blog/whatsapp-business-pricing-kenya.html), [rankingkenya](https://rankingkenya.co.ke/whatsapp-business-api-africa)
- Utility and authentication: KSh 1.12 each from one reseller; another estimates KSh 0.80 and KSh 0.50. Volume tiers apply — [Habarichat](https://habarichat.ai/blog/whatsapp-business-pricing-kenya.html), [Whatsetter](https://www.whatsetter.com/tools/whatsapp-api-pricing-calculator)
- SMS: Africa's Talking is about KSh 0.50-1.00 per SMS at low volume (another guide says about KSh 0.80). Celcom Africa starts at about KSh 0.25 — [helloduty](https://helloduty.com/blogs/sending-bulk-sms-via-africas-talking-api), [Techweez](https://techweez.com/2025/08/26/top-6-affordable-bulk-sms-api-gateways-in-kenya/), [Africa's Talking pricing](https://africastalking.com/pricing)

### Inferences
- "Contact agent" should open WhatsApp through a wa.me deep link (free) as the main call to action. Use the Cloud API only for alerts and templates, where saved-search alerts at about KSh 1 per utility message are affordable. SMS OTP at about KSh 0.5-0.8 is cheaper than WhatsApp authentication at some tiers.
- Masking or proxying agent phone numbers would let the portal measure leads (the Zillow Premier Agent model), but it conflicts with the user habit of direct WhatsApp contact.

### Gaps
- I found no hard statistics on WhatsApp's share of property enquiries in Kenya, and I did not retrieve Meta's official Kenya rate card.

## 4. Land/title verification, agent regulation, data protection

### Takeaway
Ardhisasa online searches (about KSh 500 per parcel, some reports say KSh 1,000) work fully only for Nairobi and Murang'a, with partial coverage of a few other counties. Elsewhere searches are manual (form RL 26). Land fraud is widespread but poorly quantified. A portal can realistically verify agent EARB registration, check a title search document supplied by the seller, and confirm user identity (IPRS through licensed KYC vendors). Data protection law (ODPC registration under the DPA 2019) applies.

### Cited Findings
- Ardhisasa coverage as of 2026: full for Nairobi and Murang'a; partial for Kiambu, Mombasa and Isiolo; patchy elsewhere. Non-covered counties use eCitizen or a manual Lands Registry search (form RL 26), at about KSh 500-1,000 and 1-3 working days — [Landstock](https://landstock.co.ke/how-to-verify-a-title-deed-in-kenya-2026-ardhisasa-ecitizen-what-to-do-outside-nairobi/), [Nashthuo](https://nashthuo.com/how-to-do-a-land-search-in-kenya/)
- Search fee: most guides say KSh 500 per parcel via ArdhiPay (M-Pesa, card or bank). One 2026 guide says KSh 1,000 — [Amcco](https://amccopropertiesltd.co.ke/how-to-conduct-land-search-using-ardhisasa), [Space Kenya](https://space.ke/guides/running-an-ardhisasa-search-from-abroad/)
- An Ardhisasa search shows registered ownership and encumbrances. It does not confirm that the boundaries on the ground match the title — [Real.co.ke](https://www.real.co.ke/verify-land-ownership-kenya-ardhisasa/)
- Fraud scale: no authoritative count. Blog claims range from "over 3,000 cases a year" to "10,000+ under investigation," and a repeated claim that 1 in 10 titles has irregularities. None of these could be traced to a primary source — [Username Properties](https://www.usernameproperties.com/blog/how-to-verify-a-title-deed-in-kenya-to-avoid-being-scammed-2026-guide/), [Royalwood](https://royalwoodhomes.co.ke/real-estate/how-to-avoid-real-estate-scams-in-kenya-2025/)
- The Environment and Land Court received 8,923 cases in FY2024/25 (Judiciary annual report), not all of them involving fraud — [Nation](https://nation.africa/kenya/life-and-style/dn2/bogus-title-deeds-crisis-how-fake-paper-wipe-out-investment-5617614)
- April 2026: a couple were arrested over a fake KSh 2.4M land sale in Mwihoko (Ruiru), uncovered by an ownership check at Ardhi House. A Denmark-based woman initiated the deal (diaspora angle) — [Dawan Africa](https://www.dawan.africa/news/fake-land-deal-exposed-at-ardhi-house-as-couple-held-over-sh24m-fraud)
- Sectional Properties Act 2020 (commenced 28 Dec 2020): long-term sub-leases on apartments had to be converted to sectional titles within 2 years, i.e. by 28 Dec 2022. No formal extension was found. Most legacy Nairobi buildings reportedly have not converted, and Ardhisasa has had "teething problems." One 2026 law-firm post cites a 2026 deadline without a clear legal basis — [Mondaq](https://www.mondaq.com/landlord--tenant---leases/1241770/land-reform-in-kenya), [DLA Piper/IKM](https://www.dlapiperafrica.com/en/kenya/insights/2022/faqs-on-sectional-properties-law-in-kenya.html), [DMK Law](https://www.dmklaw.co.ke/2026/02/19/sectional-properties-act-2020-why-your-kilimani-apartment-lease-must-be-converted-by-2026/), [Anyanzwa Advocates](https://www.anyanzwajsadvocates.co.ke/2025/07/16/why-nairobi-landowners-must-convert-to-sectional-titles-understanding-the-legal-requirement/)
- EARB registration: in April 2024 about 3,000 of roughly 10,000 practising agents were registered. EARB certified 500 agents in March 2025. Unregistered practice is illegal, and the crackdown is linked to rental-income tax collection — [Business Daily](https://www.businessdailyafrica.com/bd/economy/unregistered-agents-face-arrest-in-war-on-tax-evading-landlords--4559206), [Kenyans.co.ke](https://www.kenyans.co.ke/news/110444-govt-warns-kenyans-about-unregistered-real-estate-agents-threatens-legal-action), [Kenya News Agency](https://www.kenyanews.go.ke/unlicensed-estate-agents-risk-arrest-in-latest-tax-crackdown/)
- Penalties reportedly rose to up to KSh 1M for individuals and KSh 5M for companies under Estate Agents Act amendments effective 20 June 2025. This rests on a single secondary source and is unverified. A Real Estate Regulation Bill would replace EARB with a Real Estate Board; its status is unknown — [Streamlinefeed](https://streamlinefeed.co.ke/news/how-kenyan-estate-agents-register-renew-and-stay-compliant), [The Kenya Times](https://thekenyatimes.com/business/why-estate-agents-risk-arrest-and-prosecution/)
- A Dec 2025 briefing found the EARB online directory shows registration is "not common" among working agents — [GIACE/CIFAR briefing](https://giace.org/wp-content/uploads/2025/12/Challenges-in-addressing-illicit-finance-in-the-Kenyan-real-estate-sector.pdf)
- ODPC registration (Data Protection Act 2019; Registration Regulations 2021, LN 265): fees are reported at KSh 4,000 (micro/small), 16,000 (medium) and 40,000 (large), with certificates valid 24 months. Thresholds are KSh 5M turnover or 10 employees, but sources disagree on how the two combine. One guide claims real estate must register regardless of size; I could not verify this — [ODPC guidance note](https://www.odpc.go.ke/wp-content/uploads/2024/02/ODPC-Guidance-Note-on-Registration-of-Data-Controllers-and-Data-Processors.pdf), [ODPC Regulations PDF](https://www.odpc.go.ke/wp-content/uploads/2024/03/THE-DATA-PROTECTION-REGISTRATION-OF-DATA-CONTROLLERS-AND-DATA-PROCESSORS-REGULATIONS-2021.pdf), [xcobean](https://xcobean.co.ke/blog/odpc-registration-kenya-requirements), [rankingkenya](https://rankingkenya.co.ke/guides/how-to-register-with-the-odpc-as-a-data-controller-in-kenya-2026-guide)

### Inferences
- A realistic tiered verification ladder:
  1. Phone OTP.
  2. National ID / KRA PIN identity check through a licensed IPRS-connected KYC vendor (Smile ID and similar). This is an inference; I did not research vendor pricing.
  3. EARB certificate check against the public directory.
  4. Owner-supplied Ardhisasa search, with the portal checking that the name matches the lister's ID for Nairobi and Murang'a parcels.
  5. In-person or video "verified visit" for rentals.
- The portal cannot run Ardhisasa searches on users' behalf through a public API, because no public API was found. "Verified title" claims should therefore be scoped carefully, and Ardhisasa does not verify boundaries on the ground.
- A portal storing national IDs and title documents is processing personal data. It should register with the ODPC, run a DPIA, and minimise and encrypt ID images.

### Gaps
- I found no official Ardhisasa county coverage list or official fee schedule, and nothing on a programmatic or API search.
- Whether real estate is a mandatory-registration sector in the ODPC Second Schedule could not be verified from the primary text.
- I found no current total of registered agents.

## 5. Valuation & price data

### Takeaway
Public price data is index-level and asking-price-based. The suburb-level sources are HassConsult (about 19 suburbs and 14 satellite towns, quarterly) and Cytonn (annual Nairobi Metropolitan Area residential report with per-area yields). KBA-HPI (with a sample of only about 100-120 units a quarter), Knight Frank (prime only) and the new KNBS RPPI (4 zones, survey-based, launched 2026) are coarser. No public transaction-price register exists, so an AVM would have to be trained on listing asking prices and calibrated with partner data.

### Cited Findings
- HassConsult (quarterly, asking prices): Q2 2025 rents were down 0.2% overall, with falls in Muthaiga (-2.7%), Westlands (-1.7%), Kilimani (-1.2%) and Runda (-0.1%) — [Kenyans.co.ke](https://www.kenyans.co.ke/news/114499-westlands-among-nairobi-estates-where-rent-has-dropped)
- HassConsult Q2 2026: rents rose in Loresho (+2.6%), Gigiri and Langata (+2.0%), Westlands (+1.8%), Kileleshwa (+1.1%), Thika (+2.9%) and Ruaka (+2.2%) — [Mwakilishi](https://mwakilishi.com/news/2026-11-05/loresho-kitisuru-lead-nairobi-rent-increases-as-un-staff-relocate)
- HassConsult Q3 2026: Kileleshwa apartment rents had the steepest annual fall (-12%). Ruaka fell most quarter on quarter (-2.7%). Syokimau apartments fell 0.3% both quarterly and annually. Prices fell in 8 satellite towns, and the average suburb house price is about KSh 33.1M — [The Kenya Times](https://thekenyatimes.com/business/nairobi-estates-rent/), [The Kenya Times](https://thekenyatimes.com/latest-kenya-times-news/nairobi-areas-where-house-prices-are-rising-and-falling-full-list/)
- HassConsult Q4 2025: Nairobi city-wide yields were reported at about 7.4%, the highest since 2007 (secondary) — [Streamlinefeed](https://streamlinefeed.co.ke/news/kenya-property-price-indices-what-each-measures)
- KBA-HPI: index 105.29 (Q1 2025), 112.10 (Q2), 103.01 (Q3) and 102.24 (Q4 2025), after falling from 130.33 (Q1 2024) to 95.30 (Q4 2024). Samples are only 102-120 homes per quarter. Issue 39 (May 2026, Q1 2026) said prices rose modestly — [KBA HPI page](https://www.kba.co.ke/housing-price-index/), [KBA Issue 39](https://www.kba.co.ke/wp-content/uploads/2026/06/KBA-Housing-Price-Index-Issue-39.pdf), [Streamlinefeed](https://streamlinefeed.co.ke/news/kenya-property-price-indices-what-each-measures)
- KNBS Residential Property Price Index: a first-time index (methodology note and report April 2026; Q1 2026 report July 2026), built with IMF technical assistance (mission Oct 2025). Data comes from quarterly Real Estate surveys, and the market is split into 4 zones. The apartment index fell from 91.5 (Q1 2025) to 88.7 (Q1 2026), while the standalone-house index rose from 123.2 to 133.6 — [KNBS RPPI page](https://www.knbs.or.ke/residential-property-price-index-rppi/), [KNBS methodology note](https://www.knbs.or.ke/wp-content/uploads/2026/05/Kenya-Residential-Proprety-Price-Index-Methodology-Note.pdf), [KNBS Q1 2026](https://www.knbs.or.ke/wp-content/uploads/2026/07/Kenya-Residential-Property-Price-Index-First-Quarter-2026.pdf), [IMF](https://0-stg2--bookstore-imf-org.library.svsu.edu/books/kenya-report-on-residential-property-price-index-mission-october-13a-17-2025)
- Knight Frank (prime residential): prime sales price index +6.17% in the 12 months to Dec 2025 (vs +8.27% the year before); prime rents +4.05%. H1 2026: prime sale prices +6.2% and rents +0.73% vs Dec 2025 — [Capital FM](https://capitalfm.africa/demand-for-prime-offices-and-residential-property-in-nairobi-rises/), [allAfrica](https://allafrica.com/stories/202608280235.html)
- Cytonn NMA Residential Report: average rental yield 5.9% in FY2025/26, up from 5.4% in FY2024/25. Apartments averaged 6.5%. The report breaks down yields and prices by area — [Cytonn 2026 report](https://cytonn.com/uploads/downloads/nairobi-metropolitan-area-residential-report-2026-cytonn-weekly-232026-v2.pdf), [Cytonn 2025 report](https://www.cytonn.com/uploads/downloads/nma-residential-area-report-2025-cytonn-weekly-20vf.pdf)
- The Hass, Cytonn and Knight Frank yield figures use different methodologies and are not directly comparable — [Streamlinefeed](https://streamlinefeed.co.ke/news/kenya-property-price-indices-what-each-measures)

### Inferences
- The AVM is feasible only as an "estimated asking price / rent range," trained on the portal's own and scraped listing data (BuyRentKenya and Property24 are already scraped on Apify) and benchmarked to HassConsult and Cytonn suburb medians. Label it as an asking-price estimate, not a sale value.
- A rent estimate ("Rent Zestimate") is more defensible than a sale value. Rental listings are far more numerous, and rents are more observable through tenant-reported data.
- Collecting "price achieved," "rent agreed" or "time on market" from agents and landlords who close deals on the platform would build a proprietary transaction dataset that no Kenyan competitor has.

### Gaps
- No public sale-transaction or stamp-duty records are available. Institution of Surveyors of Kenya (ISK) valuation data is not public; I did not find any.
- I did not retrieve per-suburb absolute price tables for Ruaka, Syokimau or Kitengela; they would need the HassConsult PDFs directly.

## 6. Mortgages and affordable housing

### Takeaway
Kenya's mortgage market is tiny: about 30,762 loans worth KSh 307.2B (Dec 2025), at an average rate of about 13.5% and an NPL ratio of about 16%. KMRC-refinanced loans at about 9.5-9.9% fixed for up to 20 years are the affordable route, capped at KSh 10.5M property value with income caps. Boma Yangu has about 1.24M registered applicants. Mortgage pre-qualification is a niche feature, relevant mainly to salaried middle-class and diaspora buyers.

### Cited Findings
- CBK Bank Supervision Annual Report 2025 (secondary coverage): mortgage loans rose from 30,016 (Dec 2024) to 30,762 (Dec 2025). Outstanding balances grew 10% to KSh 307.2B. The average loan rose from KSh 9.0M to KSh 10.0M. The average interest rate fell to 13.5%. Mortgage NPLs were KSh 50.2B (16.3% of gross, vs 16.5%) — [Kenyan Wall Street on X](https://x.com/kenyanwalstreet/status/2104466858212479073), [People Daily](https://peopledaily.digital/business/cbk-mortgage-loans-hit-ksh307b-as-average-borrowing-rises-to-ksh10m), [CBK BSD 2024](https://www.centralbank.go.ke/2025/08/08/bsd-annual-report-2024/)
- The Central Bank Rate was cut to 8.75% by Feb 2026 (secondary). Bank mortgage rates quoted in 2026 range widely, from about 11.5% to 17% across KCB, HF Group, Stanbic and NCBA. These are commercial comparison sites and the figures conflict — [Sarafu](https://sarafu.co.ke/best-mortgage-rates-in-kenya-2026/), [sharp.co.ke](https://sharp.co.ke/blog/mortgage-rates-kenya/), [mortgage.co.ke](https://mortgage.co.ke/guides/interest-rates/)
- KMRC-linked loans: I&M "Miliki Nyumba" is 9.5% fixed for up to 20 years. Other lenders quote from about 9.9%. The property cap is KSh 10.5M (raised from 8M) and includes Boma Yangu units. The loans are for residential property and Kenyan citizens only, and need verifiable income — [I&M Bank](https://www.imbankgroup.com/ke/im-bank-miliki-nyumba/), [BuyRentKenya](https://www.buyrentkenya.com/discover/kmrc-increase-mortgage-limit-from-8-million-to-10-5-million)
- KMRC income caps conflict across sources: KSh 150K/month net in major towns and KSh 100K elsewhere; KSh 150K (Co-op arrangement); or household income KSh 200K — [Streamlinefeed](https://streamlinefeed.co.ke/news/how-to-qualify-for-kmrc-affordable-mortgage-kenya-2026), [BuyRentKenya](https://www.buyrentkenya.com/discover/kmrcs-affordable-mortgage-options-for-middle-income-buyers)
- SACCOs (e.g. Stima Sacco) also offer mortgage facilities and are KMRC primary-lender partners — [Stima Sacco](https://www.stima-sacco.com/mortgage-facilities/)
- Housing Levy: 1.5% from the employee and 1.5% from the employer, collected by KRA. Since 1 July 2026 it is recoverable as tax, and it is non-refundable — [Streamlinefeed](https://streamlinefeed.co.ke/news/boma-yangu-housing-levy-affordable-housing-programme-explained)
- Boma Yangu: 1,243,254 registered applicants and 128 projects (Oct 2026). Deposits are 5% (social housing) or 10% (affordable) of unit value; sources conflict. This is a tenant-purchase model: instalments start after allocation, and voluntary savings are withdrawable on 90 days' notice — [paybillke](https://paybillke.com/guides/boma-yangu-how-to-register-and-pay), [Realtor Kenya](https://www.realtorkenya.com/blog/affordable-housing-in-kenya-2026-the-boma-yangu-guide)

### Inferences
- With about 30K mortgages nationally, most purchases are cash, off-plan instalment or SACCO-financed. A "monthly cost" calculator should support developer instalment plans and SACCO loans as well as bank mortgages.
- A KMRC eligibility checker (price ≤ KSh 10.5M, income cap) plus Boma Yangu project listings is a useful, low-cost differentiator.

### Gaps
- I found no lender market-share data (HF Group, KCB and Stanbic are historically large, but this is unverified here).
- I did not retrieve the KMRC official eligibility page, and I found no official current Boma Yangu deposit rules.

## 7. Rental norms and tenancy law

### Takeaway
Renters typically pay 1-2 months' rent deposit plus the first month, sometimes water and electricity deposits, and sometimes an agent fee of 50-100% of one month's rent. Caretakers mediate viewings. Deposit refunds are a chronic complaint. The Landlord and Tenant Bill has lapsed, so Caps 296 and 301 still govern. Renters care most about water reliability, security, prepaid KPLC meters and access to matatu routes.

### Cited Findings
- No statute caps tenancy deposits or sets a refund deadline. For Cap 296 (controlled) tenancies, demanding more than two months' rent in advance is an offence (s.10), and "premiums" are banned (s.17) — [Streamlinefeed](https://streamlinefeed.co.ke/news/kenya-tenant-rights-deposits-rent-increases-notice-evictions), [Pangoni](https://pangoni.io/blog/guides/security-deposit-kenya)
- The 2021 Landlord and Tenant Bill lapsed with the 12th Parliament. A June 2026 petition asked the Senate to revive it, and no new Bill had been published by Oct 2026. Caps 293, 296 and 301 remain the law — [Realtor Kenya](https://www.realtorkenya.com/blog/landlord-and-tenant-rights-in-kenya), [Streamlinefeed](https://streamlinefeed.co.ke/news/kenya-tenant-rights-deposits-rent-increases-notice-evictions)
- Deposits are typically 1-2 months' rent and are often not refunded. The agent commission is 50-100% of one month's rent, usually paid by the tenant. The caretaker manages the compound but rarely has authority over deposits — [Kenyans.co.ke](https://www.kenyans.co.ke/news/56342-5-fees-landlords-use-swindle-tenants), [houserentkenya glossary](https://houserentkenya.pages.dev/glossary)
- Water rationing (for example, supply only 2 days a week in some neighbourhoods) and storage tanks are key checks. Electricity is either prepaid KPLC token meters or all-inclusive rent, and shared meters cause disputes — [uni2study](https://www.uni2study.com/articles/avoid-rental-scams-housing-search-nairobi), [houserentkenya glossary](https://houserentkenya.pages.dev/glossary)

### Inferences
- Structured listing fields Kenyan renters need, beyond the Zillow defaults:
  - water source and reliability (county supply days, borehole, tank capacity)
  - meter type (separate prepaid KPLC token vs shared)
  - security (guard, CCTV, gate, electric fence)
  - parking
  - distance to the nearest matatu stage or route
  - floor or lift
  - service charge
  - deposit months, plus water and electricity deposits
  - agent fee (yes/no and amount)
  - "no viewing fee" badge
  - house type in local vocabulary: bedsitter, single room, 1BR, DSQ (servant quarter), maisonette
- A deposit-protection or refund-tracking feature (documented move-in condition photos) addresses a known pain point.

### Gaps
- I found no primary data on typical water or electricity deposit amounts, or quantitative survey data on renter priorities.

## 8. Geography and addressing

### Takeaway
Kenya's administrative hierarchy is county > sub-county > ward, but people search by estate or neighbourhood names (Kilimani, Ruaka, Syokimau), which have no official boundaries. Street addressing exists on paper in Nairobi (launched Feb 2023) but is rarely used, and a National Addressing Bill (2021) was still pending. Location is usually given by landmark plus estate, and land is identified by plot or LR number.

### Cited Findings
- Nairobi launched a physical addressing and street-naming system in Feb 2023, funded by the World Bank through the State Department of Housing. It pairs property numbers with street names or codes — [Kenyans.co.ke](https://www.kenyans.co.ke/news/86108-sakaja-unveils-new-naming-system-nairobi-buildings-streets), [Nairobi County](https://nairobi.go.ke/nairobi-county-to-roll-out-physical-addressing-system)
- The National Addressing Bill (2021) was still under parliamentary review in the latest source. A 2025 paper argues for reviving the National Addressing System — [Frontiers 2025](https://www.frontiersin.org/journals/sustainable-cities/articles/10.3389/frsc.2025.1411904/pdf)
- Estates such as Buru Buru, Langata and Runda have had street addresses for years, but nobody uses them — [KICTANet 2013](https://lists.kictanet.or.ke/pipermail/kictanet/2013-May/020738.html)
- The KNBS RPPI stratifies suburbs into zones "informed by availability of data," showing the official statistics have no fine estate geography — [KNBS methodology note](https://www.knbs.or.ke/wp-content/uploads/2026/05/Kenya-Residential-Proprety-Price-Index-Methodology-Note.pdf)

### Inferences
- Use a pin-drop on a map (lat/long) as the primary location field, with an estate/neighbourhood gazetteer the portal curates itself (from OSM place nodes and suburb polygons plus manual drawing) mapped to official ward and county codes. Also capture a free-text landmark field, for example "behind Yaya Centre."
- Hide exact pins for rentals until contact (approximate radius) to reduce scams and protect landlord privacy.

### Gaps
- I did not verify OSM coverage quality of Nairobi estate polygons or the availability of IEBC/KNBS ward shapefiles. Separate GIS research is needed.

## 9. Diaspora buyers

### Takeaway
Diaspora remittances reached a record of about US$5.04B in 2025 (CBK) and are seen as a major driver of off-plan and land demand. Diaspora buyers are disproportionately exposed to remote land fraud, which makes remote verification and escrow-like trust services valuable to them.

### Cited Findings
- Remittances for the 12 months to Dec 2025 were US$5,037M, the first time above US$5B. One outlet cites US$4.5B, which conflicts — [Kenyan Wall Street](https://kenyanwallstreet.com/kenya-diaspora-remittances-top-us-5-billion-for-first-time-in-2025), [Eastleigh Voice](https://eastleighvoice.co.ke/business/273110/kenyans-in-diaspora-sent-home-sh6499-billion-in-2025-cbk-data-shows), [ZaKenya](https://www.zakenya.com/business/diaspora-remittances-kenya-hit-all-time-high-4-5-billion-2025.html)
- In the 12 months to Aug 2026 remittances slipped 1.3% to US$5.01B: US inflows fell 12.4% and Saudi inflows roughly halved. The US accounts for about 43.5% of cash remittances — [Kenyans.co.ke](https://www.kenyans.co.ke/news/127711-kenyas-diaspora-remittances-drop-13-us-and-saudi-inflows-decline), [Rio Times](https://www.riotimesonline.com/kenya-diaspora-remittances-2026/)
- Diaspora property investment is promoted as a demand driver (a Knight Frank-cited remittance figure, via a marketing source) — [OGRE](https://www.ogre.co.ke/the-return-of-diaspora-property-investment-in-kenya-the-complete-2026-guide/)
- Remote Ardhisasa searches are possible from abroad — [Space Kenya](https://space.ke/guides/running-an-ardhisasa-search-from-abroad/)

### Inferences
- Diaspora-oriented features could include:
  - USD/GBP price display
  - video viewings and verified-visit reports
  - an "advocate-checked title" badge
  - developer track-record pages for off-plan projects
  - card or remittance-provider payments for premium services
- KMRC loans are open to citizens, but diaspora mortgage eligibility in general was not researched.

### Gaps
- I found no hard data on the diaspora share of property purchases or on diaspora-specific fraud losses.
