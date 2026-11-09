import type { Metadata } from "next";
import Link from "next/link";
import GuideLayout from "@/components/GuideLayout";
import { Callout } from "@/components/ui";

export const metadata: Metadata = {
  title: "How to sell a property in Kenya — documents, taxes and fees",
  description:
    "A step-by-step guide to selling a house, apartment or land in Kenya: pricing, the documents you need, Capital Gains Tax, agent and legal fees, and how the transfer works.",
  alternates: { canonical: "/guides/sell" },
};

const TOC = [
  { id: "price", label: "1. Price it right" },
  { id: "documents", label: "2. Get your documents ready" },
  { id: "market", label: "3. Market the property" },
  { id: "offer", label: "4. Agree a sale" },
  { id: "transfer", label: "5. Transfer and completion" },
  { id: "costs", label: "Costs and taxes for sellers" },
  { id: "letting", label: "Letting instead of selling" },
];

export default function SellGuidePage() {
  return (
    <GuideLayout
      slug="sell"
      title="Seller's guide"
      description="How to sell a home or land in Kenya smoothly — and what it will cost you."
      toc={TOC}
      aside={
        <div className="rounded-2xl bg-[#10201a] text-white p-6">
          <p className="font-semibold mb-2">Ready to list?</p>
          <p className="text-sm text-[#b8c6be] mb-4">Posting on Apart Ments is free. Add good photos and a map pin to stand out.</p>
          <Link href="/add" className="inline-block bg-emerald-500 hover:bg-emerald-400 text-[#10201a] font-semibold px-5 py-2.5 rounded-xl">Post a listing</Link>
        </div>
      }
    >
      <h2 id="price">1. Price it right</h2>
      <p>
        Overpriced homes sit unsold and end up selling for less. Look at what similar homes nearby are listed for — our{" "}
        <Link href="/valuation">home value estimate</Link> does this from live listings — and remember that asking prices are
        usually above final sale prices. For an accurate figure (and for any buyer using a mortgage) a registered valuer will
        value the property.
      </p>

      <h2 id="documents">2. Get your documents ready</h2>
      <p>Buyers and their advocates will ask for these early. Having them ready avoids weeks of delay:</p>
      <ul>
        <li><strong>Title deed</strong> (or certificate of lease / sectional title for apartments) in your name</li>
        <li><strong>A recent official search</strong> showing you as owner and listing any charges or cautions — done on Ardhisasa where available, or at the land registry</li>
        <li><strong>Rates clearance</strong> from the county, and <strong>land rent clearance</strong> for leasehold land</li>
        <li>Your <strong>ID and KRA PIN</strong>, and passport photos for transfer forms</li>
        <li><strong>Spousal consent</strong> if the property is matrimonial property</li>
        <li><strong>Land Control Board consent</strong> for agricultural land</li>
        <li>For new builds: approved building plans and an occupation certificate</li>
        <li>If there is a mortgage: a redemption statement from your bank, which will release the title on completion</li>
      </ul>
      <Callout tone="info" title="Apartments and sectional titles">
        Under the Sectional Properties Act 2020, apartment long leases were meant to be converted to sectional titles. Many older buildings
        haven&apos;t completed this — ask your advocate where your building stands before you list.
      </Callout>

      <h2 id="market">3. Market the property</h2>
      <ul>
        <li><strong>Photos sell homes.</strong> Shoot in daylight, tidy every room, and include the kitchen, bathrooms, compound and view.</li>
        <li><strong>Be specific:</strong> plot size, title type, water source, parking, security and distance to main roads.</li>
        <li><strong>Add a map pin</strong> so your listing appears in map search (buyers only see the approximate area).</li>
        <li><strong>Answer quickly.</strong> Most buyers contact several sellers; the first to reply on WhatsApp often gets the viewing.</li>
      </ul>
      <p>
        If you use an agent, check they are registered with the <strong>Estate Agents Registration Board (EARB)</strong> and agree their
        commission in writing before they start. Commission on sales is commonly a few percent of the sale price.
      </p>

      <h2 id="offer">4. Agree a sale</h2>
      <p>
        Once you agree a price, the buyer&apos;s advocate usually drafts a <strong>sale agreement</strong>, commonly based on the Law Society
        Conditions of Sale. A deposit (often 10%) is paid and held by an advocate as stakeholder until completion. The agreement sets the
        completion period — commonly 90 days — and what happens if either side pulls out.
      </p>
      <Callout tone="warn" title="Protect yourself">
        Only accept payments through advocates&apos; client accounts or a bank. Don&apos;t hand over the original title until the purchase
        price is secured, and be wary of buyers who ask to skip advocates.
      </Callout>

      <h2 id="transfer">5. Transfer and completion</h2>
      <ol>
        <li>The buyer&apos;s advocate does an official search and checks the documents.</li>
        <li>You sign the transfer forms; the buyer pays the balance (or their bank undertakes to pay).</li>
        <li>The property is valued for stamp duty, which the buyer pays.</li>
        <li>The transfer is registered and the new title issued in the buyer&apos;s name.</li>
        <li>Your advocate releases the funds to you, less any agreed deductions.</li>
      </ol>

      <h2 id="costs">Costs and taxes for sellers</h2>
      <ul>
        <li><strong>Capital Gains Tax:</strong> 15% of the gain (sale price minus what you paid and allowable costs), paid before the transfer is registered.</li>
        <li><strong>Your advocate&apos;s fees</strong>, set by the Advocates Remuneration Order.</li>
        <li><strong>Agent commission</strong>, if you used one.</li>
        <li><strong>Clearance costs</strong> — outstanding county rates and land rent must be paid up.</li>
        <li><strong>Mortgage redemption</strong> and any early-repayment fee, if the property is charged to a bank.</li>
      </ul>
      <p>Stamp duty (4% in municipalities, 2% elsewhere) is the buyer&apos;s cost, not yours.</p>

      <h2 id="letting">Letting instead of selling</h2>
      <p>
        If you&apos;d rather earn rent, you can list the same property for rent. Residential landlords pay Monthly Rental Income tax to KRA
        (7.5% of gross rent within the turnover band the law sets). Our <Link href="/guides/rent">renter safety guide</Link> explains what
        good tenants look for.
      </p>
    </GuideLayout>
  );
}
