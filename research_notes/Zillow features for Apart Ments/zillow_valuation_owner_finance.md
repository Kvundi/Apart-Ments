# Zillow Valuation, Homeowner/Seller and Financing Tools (as of 2025-2026) — lessons for Keja Yangu

Research date: 2026-11-05. Note: zillow.com pages (zestimate, research methodology, newsroom) returned HTTP 403 to automated fetch, so several Zillow first-party facts are taken from search-result excerpts of those pages or from Zillow's FY2025 10-K (SEC), which was fetched directly.

## 1. Zestimate: methodology, inputs, accuracy, Rent Zestimate, owner edits, and the Zillow Offers failure

### Takeaway
The Zestimate is a single nationwide neural-network AVM (since June 2021) fed by US public records (tax assessments, deeds/sales), MLS/listing data and owner-submitted facts; it is accurate for listed homes (~1.8% median error, because the list price is a strong signal) but much weaker for off-market homes (~7% median error, far worse in thin rural markets). Zillow's 2021 iBuying collapse showed that an estimate good enough for consumer engagement is not good enough to transact on.

### Cited Findings
**Methodology**
- Zillow launched the "neural Zestimate" in June 2021, replacing a patchwork of roughly 1,000 separate local, non-ML models with a single end-to-end neural network covering 104+ million US homes, updated as often as daily — [GeekWire](https://www.geekwire.com/2021/zillow-group-uses-machine-learning-improve-zestimate-algorithm-dynamic-market-conditions/); [Inman](https://www.inman.com/2021/06/15/zillow-claims-zestimate-now-more-accurate-thanks-to-tech-update/); [DeepLearning.AI The Batch](https://www.deeplearning.ai/the-batch/home-sweet-ai-appraised-home)
- Model inputs reported: home attributes (square footage, lot size, room count, location), tax assessments, prior sale prices, days on market, sales transactions and public records — [DeepLearning.AI The Batch](https://www.deeplearning.ai/the-batch/home-sweet-ai-appraised-home); [StreetInsider/PRNewswire release](https://www.streetinsider.com/PRNewswire/Zillow+Launches+New+Neural+Zestimate%2C+Yielding+Major+Accuracy+Gains/18560796.html)
- Third-party summaries describe the inputs as public property records, tax records, recent local sales and user-submitted information — [TowneBank Mortgage](https://townebankmortgage.com/blog/how-accurate-are-zestimates)
- At launch Zillow reported national off-market median error of 6.9% (about 1 point better than the prior model) and said the change lets the model react faster to market trends — [StreetInsider/PRNewswire](https://www.streetinsider.com/PRNewswire/Zillow+Launches+New+Neural+Zestimate%2C+Yielding+Major+Accuracy+Gains/18560796.html); [Inman](https://www.inman.com/2021/06/15/zillow-claims-zestimate-now-more-accurate-thanks-to-tech-update/)
- The neural design traces back to the Zillow Prize, a two-year, $1 million data-science competition concluded in 2019 — [GeekWire](https://www.geekwire.com/2021/zillow-group-uses-machine-learning-improve-zestimate-algorithm-dynamic-market-conditions/)
- Zillow's FY2025 10-K calls the Zestimate "our patented proprietary automated valuation model" and says Zillow's "living database" covers about 173 million US homes — [Zillow FY2025 Form 10-K (SEC)](https://www.sec.gov/Archives/edgar/data/1617640/000161764026000015/z-20251231.htm)

**Accuracy**
- FY2025 10-K: 2025 median error rate 1.8% for homes listed for sale and 7.2% for off-market homes — [Zillow FY2025 10-K](https://www.sec.gov/Archives/edgar/data/1617640/000161764026000015/z-20251231.htm)
- Zillow's Zestimate page (updated July 28, 2025, per search excerpt): on-market 1.83%, off-market 7.01%; March 2025 figures were 1.94% / 7.06%; older widely-cited figures were 2.4% / 7.49% — [Zillow Zestimate page](https://www.zillow.com/zestimate); [The Close](https://theclose.com/how-accurate-is-zillow-zestimate/); [Clever Real Estate](https://listwithclever.com/real-estate-blog/how-accurate-is-a-zillow-zestimate-5-things-to-know/). (Slight conflict between the 10-K's 7.2% and the page's 7.01% reflects different measurement dates.)
- Competitor benchmark: Redfin Estimate (June 5, 2025) 1.93% on-market, 7.38% off-market — [Real Estate Witch](https://www.realestatewitch.com/redfin-vs-zillow-estimators/)
- Accuracy varies widely by state: off-market median error e.g. 4.53% in Nevada vs 12.71% in Vermont; more accurate where more homes sell — [Clever Real Estate](https://listwithclever.com/real-estate-blog/how-accurate-is-a-zillow-zestimate-5-things-to-know/)
- Some rural California counties have historically shown error rates as high as 32% — [CS Monitor (2015)](https://csmonitor.com/Business/Saving-Money/2015/1114/Are-Zillow-s-home-price-estimates-accurate)
- Definition: error = (Zestimate − eventual sale price) / sale price; "median error of X%" means half of estimates are within X% of the sale price and half are not — [Zillow Tech: Putting accuracy in context](https://www.zillow.com/tech/putting-accuracy-context)
- Zillow's 10-K lists as a risk factor: "Disputes regarding the accuracy or display of our Zestimates and Rent Zestimates may harm our business," plus data-integrity risks — [Zillow FY2025 10-K](https://www.sec.gov/Archives/edgar/data/1617640/000161764026000015/z-20251231.htm)

**Rent Zestimate**
- Zillow publishes a Rent Zestimate and names it alongside the Zestimate in its 10-K accuracy risk factor — [Zillow FY2025 10-K](https://www.sec.gov/Archives/edgar/data/1617640/000161764026000015/z-20251231.htm)
- Rental data scale that would feed it: 2.4 million average monthly active rental listings at Dec 31, 2025 (incl. 72,000 multifamily properties); ~33 million average monthly unique visitors to Rentals in 2025 — [Zillow FY2025 10-K](https://www.sec.gov/Archives/edgar/data/1617640/000161764026000015/z-20251231.htm)

**Owner updates to home facts**
- Owners enter an address, claim the home, and can edit home details for a more accurate estimate; after an improvement or addition, updating home facts updates the Zestimate — [Zillow claim-your-home landing](https://zillow.com/sellerlanding/claimyourhome); [Zillow pricing tool](https://www.zillow.com/sellerlanding/pricingtool/)
- Claiming does not guarantee a higher valuation; it allows correcting information — [Engineer Fix](https://engineerfix.com/should-i-claim-my-home-on-zillow/) (lower-quality source)

**Zillow Offers (iBuying) failure, 2021**
- Nov 2, 2021: Zillow announced the wind-down of Zillow Offers, cutting ~25% of the workforce; CEO Rich Barton: "the unpredictability in forecasting home prices far exceeds what we anticipated" — [Zillow 8-K, Nov 2021 (SEC)](https://www.sec.gov/Archives/edgar/data/1617640/000161764021000085/z-20211102.htm); [Inman](https://www.inman.com/2021/11/02/zillow-to-shut-down-ibuying-program-zillow-offers/)
- Q3 2021: ~$304M inventory write-down from buying homes above Zillow's own estimates of future sale prices; ~$381M Homes-segment loss in Q3; additional $240–265M losses expected in Q4 — [Zillow Q3 2021 8-K/release (SEC)](https://www.sec.gov/Archives/edgar/data/1617640/000161764021000085/q32021991.htm); [Daily Hive](https://dailyhive.com/seattle/zillow-offers-shutting-down)
- FY2021 10-K: inventory write-downs totaling $407.9M and $71.2M in impairment/restructuring tied to the wind-down — [Zillow FY2021 10-K (SEC)](https://www.sec.gov/Archives/edgar/data/1617640/000161764022000013/z-20211231.htm)
- Offers pricing used "the Zestimate, facts you provided, and comparable homes nearby"; at the neural Zestimate launch, Zestimates were the basis for cash offers on ~900,000 eligible homes in 23 markets — [Inman](https://www.inman.com/2021/11/02/zillow-to-shut-down-ibuying-program-zillow-offers/); [GeekWire](https://www.geekwire.com/2021/zillow-group-uses-machine-learning-improve-zestimate-algorithm-dynamic-market-conditions/)
- Critics noted an AVM cannot see hidden defects (e.g., a foundation crack) — [Inman](https://www.inman.com/2021/11/02/zillow-to-shut-down-ibuying-program-zillow-offers/)

### Inferences
- Most of the Zestimate's "accuracy" on listed homes comes from the list price itself; the honest benchmark for a valuation product is the off-market error (~7% in the data-rich US). In Kenya, with no comprehensive public sale-price records and no MLS, off-market error would likely be much worse; Keja Yangu should present ranges/confidence bands, not point estimates, and avoid transacting (iBuying/guaranteed offers) on its own estimates.
- The 2021 lesson: adverse selection plus market-turn timing risk turn small model errors into large balance-sheet losses. A consumer-engagement estimate is low risk; a binding offer is not.
- Owner-submitted facts are a cheap data source worth replicating (claim-your-home flow), especially where public records are thin, but need verification to avoid owner inflation.

### Gaps
- Could not fetch Zillow's current Zestimate page directly (403); the full current input list (e.g., whether listing photos/text are used) and the Rent Zestimate methodology/error rate were not found in reliable sources. One blog claims Rent Zestimate error of 5–10% — unverified, not included as fact.
- Zestimate coverage figure on the current page (e.g., ~100M+ homes with Zestimates vs 173M homes in database) not confirmed separately.

## 2. Owner dashboard / "My Home" / claim your home and engagement loops

### Takeaway
Claiming a home unlocks an owner view to edit facts, track Zestimate history and neighborhood ZHVI trends, and price a home for sale — a funnel that converts curious owners into seller leads for Zillow's agent partners. Detailed current UI features (equity, improvement ROI) and the cadence of Zestimate emails could not be confirmed from reliable 2025-2026 sources.

### Cited Findings
- Claiming a home lets owners edit details for a more accurate estimate and "track your home's value over time" — [Zillow claim-your-home landing](https://zillow.com/sellerlanding/claimyourhome)
- Owners can review the history of their Zestimate and/or the ZHVI for their neighborhood to see local appreciation — [Zillow pricing tool](https://www.zillow.com/sellerlanding/pricingtool/)
- Claiming historically activated an "Owner Dashboard" with tools for tracking home value and pricing a home for sale (2019 help article) — [Jack Keller help article](https://jackkeller.freshdesk.com/support/solutions/articles/6000219531-how-to-claim-your-home-on-zillow-com-)
- Owners can enter recent improvements and their costs in the update flow (homeowner blog account, not official) — [Inman (2016)](https://inman.com/2016/04/08/how-my-homes-zestimate-got-me-the-deal-of-a-lifetime)
- Zillow also lets agents claim homes / make instant Zestimate updates on behalf of sellers — [Zillow Premier Agent: How and why to claim your homes](https://www.zillow.com/premier-agent/how-and-why-to-claim-your-homes-on-zillow); [Zillow agents: make instant updates](https://www.zillow.com/agents/make-instant-updates-to-zestimate)
- Scale of audience these loops tap: peak 259 million unique users (July 2025) and ~9.6 billion visits in 2025 — [Zillow FY2025 10-K](https://www.sec.gov/Archives/edgar/data/1617640/000161764026000015/z-20251231.htm)

### Inferences
- The owner dashboard's business role is lead generation: "what's my home worth" traffic identifies future sellers, who are then routed to agents (Zillow monetizes agents, not owners).
- For Keja Yangu, a "claim your property" flow (owners/landlords verify ownership, add facts, see an estimated value/rent range and local trend) can double as a supply-acquisition tool for listings.

### Gaps
- No reliable source found describing the current (2025-2026) owner dashboard UI: equity tracking, comparable sales module, home-improvement value estimates, or the frequency/content of Zestimate update emails. These are likely features but are unverified here.
- No published engagement metrics (e.g., number of claimed homes, email open rates).

## 3. Seller tools: Make Me Move, FSBO, agent matching, seller services, ZHVI and ZORI

### Takeaway
Make Me Move is discontinued; FSBO listing remains free but deprioritized; Zillow's seller strategy now centers on routing sellers to partner agents, Showcase premium media, and partner sale options. ZHVI (Zestimate-based "typical value", 35th–65th percentile) and ZORI (repeat-rent asking-rent index) are Zillow's public market indices and depend entirely on its proprietary Zestimate and listing data.

### Cited Findings
**Make Me Move — DISCONTINUED**
- Launched December 2006 as a way for owners to post a "price that would make me move" — [TechCrunch (2006)](https://techcrunch.com/2006/12/06/zillow-knows-that-everyone-has-a-price/)
- Zillow's own page states it is no longer accepting Make Me Move listings — [Zillow Make Me Move page](https://www.zillow.com/make-me-move)
- Exact shutdown date is not published; sellers noticed it gone around 2021 — [Houzeo](https://www.houzeo.com/blog/zillow-make-me-move/). One source says it was replaced by an Opendoor partnership (compare Zestimate with an Opendoor cash-offer estimate) — single, unconfirmed source: [Houzeo](https://www.houzeo.com/blog/zillow-make-me-move/)

**For Sale By Owner (FSBO)**
- Owners can post FSBO listings free on Zillow (and Trulia) with unlimited photos, unless Zillow has paused owner posts in an area — [Beycome](https://www.beycome.com/blog/for-sale-by-owner-on-zillow-cost-breakdown/); [Anytime Estimate](https://anytimeestimate.com/?p=117995)
- Owner listings stay active 90 days, extendable once by 90 days — [Beycome](https://www.beycome.com/blog/how-to-list-on-zillow-for-sale-by-owner-guide/) (third-party)
- Zillow charges agents for advertising/lead products rather than charging sellers to list; FSBO listings compete against agent listings that get prioritized placement — [Orchard](https://orchard.com/blog/posts/zillow-listing-fees); [Houzeo](https://www.houzeo.com/blog/?p=1321)

**Seller services / agent matching (2025)**
- 10-K: sellers can work with a local agent partner and, in some markets, access alternative sale options through partners; Zillow Showcase listings offer rich media, interactive floor plans, 3D tours, virtual staging and SkyTour; for-sale listings now show "Offer Insights" — [Zillow FY2025 10-K](https://www.sec.gov/Archives/edgar/data/1617640/000161764026000015/z-20251231.htm)
- Residential (mostly agent advertising/Premier Agent) was 66% of 2025 revenue; full-year 2025 revenue $2.583B (+16%), net income $23M — [Zillow FY2025 10-K](https://www.sec.gov/Archives/edgar/data/1617640/000161764026000015/z-20251231.htm); [Zillow Q4 2025 press release](https://s24.q4cdn.com/723050407/files/doc_earnings/2025/q4/earnings-result/Zillow-Q4-2025-Press_Release_99-1.pdf)

**ZHVI (Zillow Home Value Index)**
- Middle-tier (headline) ZHVI covers homes between the 35th and 65th percentile of values; bottom tier 5th–35th, top tier 65th–95th; percentiles computed within home type — [Zillow ZHVI methodology](https://www.zillow.com/research/zhvi-methodology-2019-deep-26083)
- Built from Zestimates (calculated for 100M+ homes); each home is weighted by its Zestimate share of total regional value — [Zillow ZHVI methodology](https://www.zillow.com/research/zhvi-methodology-2019-deep-26083)
- Should be called "typical home value," NOT "median home value" — [Zillow ZHVI user guide](https://www.zillow.com/research/zhvi-user-guide/)
- Since the January 2023 release, the full ZHVI history uses the neural Zestimate; published series are smoothed and seasonally adjusted — [Zillow ZHVI methodology](https://www.zillow.com/research/zhvi-methodology-2019-deep-26083); [FRED](https://fred.stlouisfed.org/series/USAUCSFRCONDOSMSAMID)

**ZORI (Zillow Observed Rent Index)**
- Repeat-rent index of asking rents that controls for changes in the quality of available rental stock (repeat-transaction methodology dating to the 1960s / Bailey et al.) — [Zillow ZORI methodology](https://www.zillow.com/research/methodology-zori-repeat-rent-27092/amp/)
- Data: Zillow's proprietary rental listings plus MLS listing data; weighted to the full rental housing stock, not just currently listed units — [AEA / academic description](https://aeaweb.org/content/file?id=20842); [Zillow ZORI methodology](https://www.zillow.com/research/methodology-zori-32124/)
- Smoothing conflict: Zillow page says 3-month simple moving average; an academic source says 3-month exponentially weighted moving average — [Zillow](https://www.zillow.com/research/methodology-zori-32124/); contradicted by [AEA](https://aeaweb.org/content/file?id=20842)
- National index aggregates area indices weighted by rent expenditure; weights updated every two years until Jan 2023, annually since — [Zillow ZORI methodology](https://www.zillow.com/research/methodology-zori-32124/)
- Zillow claims ZORI leads CPI rent by up to 12 months (Zillow claim) — [Zillow Research](https://www.zillow.com/research/rent-zori-cpi-33861); independent test: [Kishor (2024), MPRA](https://mpra.ub.uni-muenchen.de/120818)
- Zillow also publishes a rent forecast (ZORF) — [Zillow ZORF methodology](https://www.zillow.com/research/zorf-methodology-34584)

### Inferences
- A rent index is far more feasible for Keja Yangu than a sale-price index: Kenyan portals see large volumes of asking rents, and a repeat-listing (same unit relisted) method controls for quality without needing sale records. An asking-price index for sales is also feasible, but should be labeled "asking," not "value."
- FSBO-style free owner listings are a supply tool; the money is in agent/developer advertising — consistent with Zillow's model.
- Make Me Move's demise suggests "aspirational price" listings generate low-quality leads.

### Gaps
- Could not confirm how Zillow currently matches sellers to agents (mechanics, pricing) or which alternative-sale partners operate in 2025-2026.
- No reliable source on Zillow's "home value market reports" for owners as a distinct product.

## 4. Financing: Zillow Home Loans, calculators, pre-approval, BuyAbility, mortgage marketplace, Est. payment, revenue

### Takeaway
Zillow has pivoted from a lender-ads marketplace toward its own direct lender (Zillow Home Loans, 49 states + DC) integrated into listings and agent workflows; mortgages are small but fast growing ($199M revenue in 2025, +37%), and BuyAbility personalizes "what can I afford" using live rates plus the buyer's credit and income.

### Cited Findings
**Zillow Home Loans / revenue**
- Zillow Home Loans operates in 49 states + DC, originates mortgages and generally sells them on the secondary market; buyers can also reach third-party lenders via a mortgage marketplace for purchase and refinance — [Zillow FY2025 10-K](https://www.sec.gov/Archives/edgar/data/1617640/000161764026000015/z-20251231.htm)
- 2025 Mortgages revenue $199M (+37% from $145M); Q4 $57M (+39%) driven by a 67% rise in purchase origination to $1.5B; Zillow estimated industry purchase origination flat — [Zillow Q4 2025 press release](https://s24.q4cdn.com/723050407/files/doc_earnings/2025/q4/earnings-result/Zillow-Q4-2025-Press_Release_99-1.pdf); [HousingWire](https://www.housingwire.com/articles/zillow-revenue-profit-2025/)
- Full-year purchase originations ~+53% (~$4.7B); total ~$4.8B (+52%) — secondary summaries — [HousingWire](https://www.housingwire.com/articles/zillow-revenue-profit-2025/); [Panabee](https://www.panabee.com/news/zillow-earnings-2025-annual)
- 11% increase in loan officer productivity while adding 40% more loan officers — [Zillow Q4 2025 press release via Barchart](https://www.barchart.com/story/news/140576/zillow-group-reports-fourth-quarter-and-full-year-2025-financial-results)
- $227M of operating cash tied up in mortgage loans held for sale in 2025 — [Panabee](https://www.panabee.com/news/zillow-earnings-2025-annual)
- Zillow estimates US mortgage origination revenue at $50B (2025) as its addressable market — [Zillow FY2025 10-K](https://www.sec.gov/Archives/edgar/data/1617640/000161764026000015/z-20251231.htm)

**Integration ("Enhanced Markets")**
- Enhanced Markets: geographies with an integrated buy experience combining Zillow Preferred agents and Zillow Home Loans loan officers; >40% of agent connections came through Enhanced Markets by year-end 2025 (44% vs 21% a year earlier); double-digit Zillow Home Loans adoption there — [Zillow FY2025 10-K](https://www.sec.gov/Archives/edgar/data/1617640/000161764026000015/z-20251231.htm); [HousingWire](https://www.housingwire.com/articles/zillow-revenue-profit-2025/)
- Custom Zillow Home Loans pre-approval letters rolled out inside Follow Up Boss (Zillow's agent CRM) — [HousingWire](https://www.housingwire.com/articles/zillow-revenue-profit-2025/)

**Pre-approval**
- 2025: Zillow Home Loans introduced a verified digital pre-approval and began rolling out a new borrower application — [Zillow FY2025 10-K](https://www.sec.gov/Archives/edgar/data/1617640/000161764026000015/z-20251231.htm)

**BuyAbility**
- Launched May 13, 2024 (iOS first): combines Zillow Home Loans' real-time rates with the buyer's credit score, income and comfortable monthly payment to estimate an affordable price, monthly payment, and likelihood of loan qualification; updates in real time as rates change — [Zillow Group news](https://www.zillowgroup.com/news/our-new-tool-addresses-home-buyers-biggest-concern-affordability); [MPA Mag](https://www.mpamag.com/us/specialty/technology/zillow-home-loans-introduces-tool-that-simplifies-home-affordability-calculations/489104)
- June 2026: BuyAbility folded into a personalized buyer hub across four milestones (budget, search, offer, closing) on iOS/Android, "coming soon" to Zillow.com — [RISMedia](https://www.rismedia.com/2026/06/23/zillow-launches-personalized-hub-to-guide-homebuyers-from-search-to-close/)
- A July 2026 upgrade reportedly adds debts and down payment and cites 1.5M users — single source, treat cautiously (reported in search summary; not verified)

**Calculators and Est. payment**
- Zillow mortgage calculator estimates total monthly payment: principal & interest plus PMI, property taxes, home insurance and HOA fees; mortgage insurance applies when the loan is 80%+ of value — [Zillow mortgage calculator](https://www.zillow.com/mortgage-calculator/)
- Zillow Home Loans search tooling shows a monthly cost including principal & interest plus estimates of insurance, taxes and HOA — [Mann Report](https://www.mannpublications.com/mannreport/?p=28725)

**Mortgage marketplace (third-party lenders)**
- Zillow operates a Mortgage Marketplace where third-party lenders pay to advertise rates and offers — [Zillow: How does Zillow make money](https://www.zillow.com/learn/how-does-zillow-make-money)
- Historically lenders could post quotes free and paid a market-priced/bid fee per borrower contact — [TechCrunch](https://techcrunch.com/?p=117473); [American Banker](https://www.americanbanker.com/news/zillows-next-play-lead-generation). Vendor blogs estimate $75–$120 per lead in 2025 (unofficial) — [LeadPops](https://leadpops.com/blog/zillow-mortgage-leads-review-2026)

### Inferences
- Zillow's revenue logic: free valuation and affordability tools capture intent; payment estimates on every listing make financing feel native; the direct lender captures the highest-margin step. For Keja Yangu, becoming a lender is impractical; the analogous play is a lender/SACCO marketplace (KMRC-backed banks, HFCK, SACCOs) with referral fees, plus a KES "est. monthly payment" on listings using current bank mortgage rates.
- BuyAbility-style personalization needs live rates and a credit signal (Kenya: CRB scores via Metropol/TransUnion/Creditinfo), which is more feasible than a valuation model.
- Holding loans for sale ties up cash ($227M at Zillow) — another reason to stay a marketplace.

### Gaps
- Exact label/behavior of "Est. payment" on listing pages and default assumptions (down payment %, rate source) not confirmed from an official source.
- No official current rate card for lender marketplace fees.
- RESPA/RICO litigation involving Zillow Home Loans mentioned by one secondary summary (Belcourt) — not verified against filings.

## 5. Data requirements per tool (and US public records/MLS dependence)

### Takeaway
Nearly every Zillow valuation feature rests on US-specific infrastructure — county tax/deed records with recorded sale prices, MLS listing feeds, and a large national listings database — none of which exist comprehensively in Kenya; the financing tools depend instead on live lender rates and credit data, which are more portable.

### Cited Findings
- Zestimate: public records (tax assessments, prior sale prices, sales transactions), home attributes, listing data (days on market), user-submitted facts — [DeepLearning.AI The Batch](https://www.deeplearning.ai/the-batch/home-sweet-ai-appraised-home); [TowneBank Mortgage](https://townebankmortgage.com/blog/how-accurate-are-zestimates)
- Error is measured against recorded sale prices, so accuracy measurement itself needs sale-price records — [Zillow Tech](https://www.zillow.com/tech/putting-accuracy-context)
- Accuracy degrades where fewer homes sell (state variance 4.5%–12.7%) — [Clever Real Estate](https://listwithclever.com/real-estate-blog/how-accurate-is-a-zillow-zestimate-5-things-to-know/)
- ZHVI: derived entirely from Zestimates — [Zillow ZHVI methodology](https://www.zillow.com/research/zhvi-methodology-2019-deep-26083)
- ZORI: Zillow rental listings + MLS listings, weighted to rental stock (needs a stock estimate, e.g., census) — [AEA](https://aeaweb.org/content/file?id=20842); [Zillow ZORI methodology](https://www.zillow.com/research/methodology-zori-32124/)
- Rent Zestimate: rental listing data (2.4M monthly active rental listings) — [Zillow FY2025 10-K](https://www.sec.gov/Archives/edgar/data/1617640/000161764026000015/z-20251231.htm)
- BuyAbility/pre-approval: real-time lender rates, credit score, income (and reportedly debts/down payment) — [Zillow Group news](https://www.zillowgroup.com/news/our-new-tool-addresses-home-buyers-biggest-concern-affordability)
- Mortgage calculator: price, rate, term, down payment, property tax, insurance, HOA, PMI — [Zillow mortgage calculator](https://www.zillow.com/mortgage-calculator/)

### Inferences
Summary table for Keja Yangu (inference, not sourced fact):

| Zillow tool | Core data dependency | US-specific? | Kenya feasibility |
|---|---|---|---|
| Zestimate (sale) | Recorded sale prices, tax records, MLS | Yes, heavily | Low; start with asking-price-based range estimates by area/type, clearly labeled |
| Rent Zestimate | Rental listings | Partly | Medium-high: Keja Yangu's own rental listings are the dataset |
| Claim your home / owner facts | User input | No | High |
| ZHVI | Zestimates for all homes | Yes | Low; substitute an asking-price index |
| ZORI | Repeat asking rents | Partly (MLS) | High with own listing history |
| Mortgage calculator / Est. payment | Rates, tax, insurance, fees | No | High (KES, bank rates, stamp duty, service charge) |
| BuyAbility / pre-qual | Live rates + credit | Partly | Medium (lender partnership + CRB) |
| Direct lending | Licence, capital | n/a | Not advisable; use marketplace/referrals |

### Gaps
- No source quantified how much of Zestimate accuracy comes from each input type (public records vs MLS vs user facts).
- No Kenya-specific data-availability sources were researched (out of scope for this note; other researchers may cover Ardhisasa/land registry, KNBS, HassConsult indices).
