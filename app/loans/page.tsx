import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, Percent, FileText, Landmark, Building, Users, Globe, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import { PageHero, Prose, Callout, ReviewedNote, ButtonLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "Mortgages in Kenya — how they work, costs and lenders",
  description:
    "A plain-English guide to getting a mortgage in Kenya: typical rates, deposits, documents, KMRC-backed affordable loans and the lenders to compare.",
  alternates: { canonical: "/loans" },
};

const LENDER_GROUPS = [
  {
    icon: Landmark,
    title: "Commercial banks",
    body: "Most mortgages in Kenya come from banks such as KCB, HF Group, Stanbic, NCBA, Absa, Co-operative Bank, Equity, I&M and Standard Chartered. Rates, deposits and fees differ — ask at least three for a written offer.",
  },
  {
    icon: Percent,
    title: "KMRC partner lenders",
    body: "Banks, SACCOs and microfinance banks that refinance through the Kenya Mortgage Refinance Company can offer long-term fixed rates (about 9.5–9.9%) on qualifying homes up to KSh 10.5M.",
  },
  {
    icon: Users,
    title: "SACCOs",
    body: "Many SACCOs lend to members for buying or building, often based on your savings with them. Terms are usually shorter than bank mortgages.",
  },
  {
    icon: Building,
    title: "Developer payment plans",
    body: "For off-plan homes, developers often accept instalments during construction. Check the developer's track record and that payments go to a project account held by an advocate or bank.",
  },
];

export default function LoansPage() {
  return (
    <div className="min-h-screen bg-white text-[#1a2420]">
      <Navbar />
      <PageHero
        crumbs={[{ label: "Home loans" }]}
        eyebrow="Home loans"
        title="Mortgages in Kenya, explained"
        description="How home loans work here, what they really cost, and how to get one approved — without the jargon."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/loans/calculator"><Calculator size={18} /> Mortgage calculator</ButtonLink>
          <ButtonLink href="/loans/government" variant="secondary"><Percent size={18} /> Affordable housing loans</ButtonLink>
        </div>
      </PageHero>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Market snapshot */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["~30,800", "mortgages in Kenya (Dec 2025)"],
            ["~13.5%", "average mortgage rate (Dec 2025)"],
            ["KSh 10M", "average mortgage size"],
            ["10–20%", "typical deposit"],
          ].map(([v, l]) => (
            <div key={l} className="rounded-2xl border border-[#e6e2d8] bg-[#f7f5ef] p-5">
              <p className="text-2xl md:text-3xl font-bold text-emerald-700">{v}</p>
              <p className="text-sm text-[#6b6358] mt-1">{l}</p>
            </div>
          ))}
        </section>
        <p className="text-xs text-[#9c948a] mt-3">Source: Central Bank of Kenya Bank Supervision report for 2025, as reported in the press.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-14">
          <article className="lg:col-span-2">
            <Prose>
              <h2 id="how">How a Kenyan mortgage works</h2>
              <p>
                A mortgage is a long-term loan secured on the home you buy. You pay a deposit, the lender pays the rest to the
                seller, and a <strong>charge</strong> is registered against the title until the loan is repaid — usually over
                10 to 25 years. Most bank mortgages here have <strong>variable rates</strong> that move with the Central Bank
                Rate, so budget for your repayment rising.
              </p>

              <h2 id="cost">What it really costs</h2>
              <ul>
                <li><strong>Deposit:</strong> commonly 10–20% of the price. Some affordable-housing loans need less.</li>
                <li><strong>Stamp duty:</strong> 4% of the value in municipalities, 2% elsewhere — paid by the buyer.</li>
                <li><strong>Legal fees:</strong> for the transfer and for registering the bank&apos;s charge, set by the Advocates Remuneration Order.</li>
                <li><strong>Valuation fee:</strong> the lender sends its own valuer; you pay.</li>
                <li><strong>Insurance:</strong> lenders require property insurance and usually mortgage protection (life) cover.</li>
              </ul>
              <p>
                Together these add roughly 6–8% on top of your deposit. The <Link href="/loans/calculator">mortgage calculator</Link> totals
                them for any price.
              </p>

              <h2 id="documents">Documents lenders usually ask for</h2>
              <ul>
                <li>National ID or passport, and your KRA PIN certificate</li>
                <li>Employed: recent payslips (often 3–6 months), an employment letter and 6 months of bank statements</li>
                <li>Self-employed: 2–3 years of audited accounts or management accounts, bank statements and business registration</li>
                <li>For the property: a copy of the title, an official search, the sale agreement and approved plans (for new builds)</li>
              </ul>

              <h2 id="steps">Getting approved, step by step</h2>
              <ol>
                <li><strong>Work out your budget.</strong> Lenders cap repayments at a share of your income — try the <Link href="/loans/calculator">affordability calculator</Link>.</li>
                <li><strong>Get offers in principle</strong> from two or three lenders before you commit to a home.</li>
                <li><strong>Find the home and do your checks:</strong> an official search, a visit, and confirming the seller is the registered owner. Our <Link href="/guides/buy">buyer&apos;s guide</Link> covers this.</li>
                <li><strong>Sign the sale agreement</strong> through an advocate; the deposit is usually held by the advocate until completion.</li>
                <li><strong>Valuation and final approval.</strong> The lender values the home and issues a letter of offer.</li>
                <li><strong>Completion.</strong> Stamp duty is paid, the transfer and charge are registered, and the funds are released.</li>
              </ol>

              <h2 id="diaspora">Buying from abroad</h2>
              <p>
                Several Kenyan banks run diaspora mortgage products, and land searches can now be done online through Ardhisasa for
                counties it covers. Never send money to anyone but your own advocate&apos;s client account, and never rely on photos alone —
                ask someone you trust to visit.
              </p>
            </Prose>

            <div className="mt-10">
              <Callout tone="warn" title="Compare the total cost, not just the rate">
                Ask each lender for the full list of fees, whether the rate is fixed or variable, and what happens if you repay early.
                A slightly lower rate can cost more once fees and insurance are added.
              </Callout>
            </div>
            <ReviewedNote date="November 2026" />
          </article>

          <aside className="space-y-4">
            <h2 className="text-lg font-bold">Who lends</h2>
            {LENDER_GROUPS.map((g) => (
              <div key={g.title} className="rounded-2xl border border-[#e6e2d8] p-5">
                <g.icon size={22} className="text-emerald-700 mb-3" />
                <h3 className="font-semibold mb-1">{g.title}</h3>
                <p className="text-sm text-[#6b6358] leading-relaxed">{g.body}</p>
              </div>
            ))}
            <p className="text-xs text-[#9c948a]">Apart Ments is not a lender and isn&apos;t paid by any of the lenders named here.</p>
            <div className="rounded-2xl bg-[#10201a] text-white p-6 mt-6">
              <FileText size={22} className="text-emerald-300 mb-3" />
              <h3 className="font-semibold mb-1">Ready to look?</h3>
              <p className="text-sm text-[#b8c6be] mb-4">Every for-sale listing shows an estimated monthly repayment.</p>
              <Link href="/properties?type=sale" className="inline-flex items-center gap-1.5 text-emerald-300 font-semibold hover:underline">
                Browse homes for sale <ArrowRight size={16} />
              </Link>
            </div>
            <div className="rounded-2xl border border-[#e6e2d8] p-5">
              <Globe size={22} className="text-emerald-700 mb-3" />
              <h3 className="font-semibold mb-1">Affordable housing</h3>
              <p className="text-sm text-[#6b6358] mb-3">Boma Yangu homes, the Housing Levy and KMRC-backed loans.</p>
              <Link href="/loans/government" className="text-sm text-emerald-700 font-semibold hover:underline">Read the guide →</Link>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
