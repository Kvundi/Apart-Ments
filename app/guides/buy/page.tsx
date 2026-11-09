import type { Metadata } from "next";
import Link from "next/link";
import GuideLayout from "@/components/GuideLayout";
import { Callout } from "@/components/ui";

export const metadata: Metadata = {
  title: "How to buy a property in Kenya safely — a buyer's guide",
  description:
    "Buying a house, apartment or land in Kenya: budgeting, title searches on Ardhisasa, avoiding land fraud, the sale agreement, stamp duty and transfer.",
  alternates: { canonical: "/guides/buy" },
};

const TOC = [
  { id: "budget", label: "1. Set your budget" },
  { id: "search", label: "2. Search and view" },
  { id: "checks", label: "3. Check the title" },
  { id: "agreement", label: "4. Sale agreement" },
  { id: "complete", label: "5. Pay and transfer" },
  { id: "land", label: "Buying land" },
  { id: "offplan", label: "Buying off-plan" },
];

export default function BuyGuidePage() {
  return (
    <GuideLayout
      slug="buy"
      title="Buyer's guide"
      description="From budgeting to collecting your title — how to buy property in Kenya without nasty surprises."
      toc={TOC}
      aside={
        <div className="rounded-2xl bg-[#10201a] text-white p-6">
          <p className="font-semibold mb-2">What can you afford?</p>
          <p className="text-sm text-[#b8c6be] mb-4">Our calculator includes stamp duty, legal and bank fees — not just the repayment.</p>
          <Link href="/loans/calculator" className="inline-block bg-emerald-500 hover:bg-emerald-400 text-[#10201a] font-semibold px-5 py-2.5 rounded-xl">Open calculator</Link>
        </div>
      }
    >
      <h2 id="budget">1. Set your budget</h2>
      <p>
        Budget for more than the price. On top of your deposit you&apos;ll pay <strong>stamp duty</strong> (4% of the value in
        municipalities, 2% elsewhere), <strong>legal fees</strong>, a <strong>valuation</strong> if you borrow, and bank fees. Together
        that&apos;s often 6–8% extra. If you need a mortgage, get an offer in principle first — see{" "}
        <Link href="/loans">mortgages explained</Link>.
      </p>

      <h2 id="search">2. Search and view</h2>
      <ul>
        <li>Save searches on Apart Ments to get emailed when matching homes are listed.</li>
        <li>Visit in person — at different times of day if you can — and check water supply, road access, security and noise.</li>
        <li>For apartments, ask about the service charge, the management company and whether the building has sectional titles.</li>
        <li>Talk to neighbours. They&apos;ll tell you about flooding, water rationing and disputes that no listing mentions.</li>
      </ul>

      <h2 id="checks">3. Check the title — before paying anything</h2>
      <p>Land fraud is the biggest risk when buying in Kenya. Your advocate should do these checks, but you should understand them:</p>
      <ul>
        <li>
          <strong>Official search:</strong> confirms the registered owner and any charges, cautions or restrictions. It can be done on{" "}
          <a href="https://ardhisasa.lands.go.ke" target="_blank" rel="noopener noreferrer">Ardhisasa</a> for counties it covers fully
          (Nairobi and Murang&apos;a as of 2026, others partly), or at the land registry. Fees are around KSh 500 per search.
        </li>
        <li><strong>Match the seller to the title:</strong> the seller&apos;s ID must match the registered owner. If they&apos;re selling for someone else, get a registered power of attorney and verify it.</li>
        <li><strong>Visit the land with a surveyor</strong> if buying land — a search confirms ownership on paper, not that the boundaries on the ground match.</li>
        <li><strong>Check the county:</strong> rates owed, approved plans and zoning (you can&apos;t always build what you want).</li>
        <li><strong>Spousal and Land Control Board consents</strong>, where they apply, must be in place before transfer.</li>
      </ul>
      <Callout tone="warn" title="Red flags">
        A price far below the area&apos;s going rate, pressure to pay quickly, a seller who avoids advocates, or a request to pay into a
        personal or third-party account. Walk away.
      </Callout>

      <h2 id="agreement">4. Sale agreement</h2>
      <p>
        Your advocate drafts or reviews the sale agreement. It sets the price, the deposit (often 10%, held by an advocate until
        completion), the completion period and what happens if either side defaults. Never sign one you don&apos;t understand.
      </p>

      <h2 id="complete">5. Pay and transfer</h2>
      <ol>
        <li>The balance is paid — by you, or by your bank under a professional undertaking between advocates.</li>
        <li>The property is valued by the government valuer for stamp duty, which you pay.</li>
        <li>The transfer (and your bank&apos;s charge, if you borrowed) is registered.</li>
        <li>You receive the title in your name — or your bank holds it until the mortgage is repaid.</li>
      </ol>

      <h2 id="land">Buying land</h2>
      <p>
        Insist on seeing the original title, do a fresh official search on the day you pay, check whether the land is freehold or
        leasehold (and how many years remain on a lease), and confirm access roads are on the survey map, not just on the ground.
        Agricultural land needs Land Control Board consent for the sale.
      </p>

      <h2 id="offplan">Buying off-plan</h2>
      <p>
        Off-plan homes are cheaper but riskier. Check the developer&apos;s completed projects, that the land is in the developer&apos;s name,
        that plans are approved by the county and NEMA, and that your payments go to a project account held by an advocate or bank —
        never to an individual.
      </p>
    </GuideLayout>
  );
}
