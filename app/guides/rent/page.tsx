import type { Metadata } from "next";
import Link from "next/link";
import GuideLayout from "@/components/GuideLayout";
import { Callout } from "@/components/ui";

export const metadata: Metadata = {
  title: "Renting in Kenya safely — avoid viewing-fee scams",
  description:
    "How to rent a house in Kenya without getting scammed: viewing-fee fraud, what deposits are normal, what to check on a viewing, and what to put in your lease.",
  alternates: { canonical: "/guides/rent" },
};

const TOC = [
  { id: "scams", label: "How rental scams work" },
  { id: "rules", label: "Five rules that stop scams" },
  { id: "costs", label: "What moving in costs" },
  { id: "viewing", label: "What to check on a viewing" },
  { id: "lease", label: "Your lease and deposit" },
  { id: "report", label: "If something goes wrong" },
];

export default function RentGuidePage() {
  return (
    <GuideLayout
      slug="rent"
      title="Renter safety guide"
      description="Find a good home and keep your money safe. Most rental fraud in Kenya follows the same few patterns — here's how to spot them."
      toc={TOC}
      aside={
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6">
          <p className="font-semibold text-emerald-900 mb-2">On Apart Ments</p>
          <ul className="text-sm text-emerald-900 space-y-2 list-disc pl-5">
            <li>Every listing is reviewed before it goes live</li>
            <li>You contact the lister directly — we never charge you</li>
            <li>See something wrong? Use &ldquo;Report this listing&rdquo;</li>
          </ul>
          <Link href="/properties?type=rent" className="inline-block mt-4 text-sm font-semibold text-emerald-800 hover:underline">Browse rentals →</Link>
        </div>
      }
    >
      <h2 id="scams">How rental scams work</h2>
      <p>
        The most common scam is the <strong>viewing fee</strong>: a fake &ldquo;agent&rdquo; posts an attractive house at a good price, then
        asks for KSh 1,000–2,000 on M-Pesa to &ldquo;book a viewing&rdquo; or &ldquo;secure the house&rdquo;. The house may not exist, may
        not be theirs, or may already be let — and the money is gone. Variations include asking for a deposit before you&apos;ve seen the
        house, or showing the same house to many people and collecting deposits from all of them.
      </p>

      <h2 id="rules">Five rules that stop scams</h2>
      <ol>
        <li><strong>Never pay to view.</strong> Genuine landlords and agents don&apos;t charge for viewings.</li>
        <li><strong>Never pay a deposit before viewing</strong> the actual unit you&apos;ll live in — not a &ldquo;similar one&rdquo;.</li>
        <li><strong>Confirm who you&apos;re paying.</strong> Ask for the landlord&apos;s name and check it matches the M-Pesa or bank account name. Be wary of payments to a third party.</li>
        <li><strong>Check agents</strong> are registered with the Estate Agents Registration Board, and ask the caretaker or neighbours whether they know them.</li>
        <li><strong>Get it in writing.</strong> A signed tenancy agreement and a receipt for every payment.</li>
      </ol>
      <Callout tone="warn" title="Too good to be true usually is">
        A furnished two-bedroom in Kilimani for half the going rent, a landlord who is &ldquo;abroad&rdquo; and can&apos;t meet, or pressure to
        pay today because &ldquo;many people want it&rdquo; are classic signs of a scam.
      </Callout>

      <h2 id="costs">What moving in normally costs</h2>
      <ul>
        <li><strong>First month&apos;s rent</strong>, paid in advance.</li>
        <li><strong>Rent deposit:</strong> usually 1–2 months&apos; rent, refundable when you leave if there&apos;s no damage or unpaid rent.</li>
        <li><strong>Utility deposits:</strong> some landlords ask for water and/or electricity deposits.</li>
        <li><strong>Agent fee:</strong> some agents charge the tenant a commission — commonly 50–100% of one month&apos;s rent. Agree it before the viewing.</li>
      </ul>
      <p>Every rental on Apart Ments shows an estimated move-in cost so you can budget before you call.</p>

      <h2 id="viewing">What to check on a viewing</h2>
      <ul>
        <li><strong>Water:</strong> how many days a week the county supplies water, whether there&apos;s a borehole or storage tank. Open the taps.</li>
        <li><strong>Electricity:</strong> a separate prepaid KPLC token meter avoids disputes over shared bills.</li>
        <li><strong>Security:</strong> gate, guard, CCTV, lighting, and how the compound feels at night.</li>
        <li><strong>Getting around:</strong> distance to the nearest matatu stage and what the road is like when it rains.</li>
        <li><strong>Condition:</strong> damp, cracks, broken fittings — photograph everything before you move in.</li>
        <li><strong>Service charge</strong> and what it covers (for apartments).</li>
      </ul>

      <h2 id="lease">Your lease and deposit</h2>
      <p>
        Ask for a written tenancy agreement that states the rent, deposit, notice period, who pays which bills and how the deposit is
        returned. Take dated photos of the house when you move in and when you leave — they&apos;re your best evidence if the deposit is
        withheld. Most residential tenancies are governed by your written agreement and general contract and land law. The Rent
        Restriction Act only covers very low-rent homes, and a Landlord and Tenant Bill to modernise the rules has been proposed but
        not passed — so what&apos;s in your agreement matters.
      </p>

      <h2 id="report">If something goes wrong</h2>
      <ul>
        <li>Report the listing on Apart Ments so we can remove it and warn others.</li>
        <li>If you paid by M-Pesa, call Safaricom immediately to ask about reversing the transaction.</li>
        <li>Report fraud to the police and keep the messages, numbers and receipts.</li>
        <li>For a deposit dispute with a genuine landlord, the Small Claims Court is a low-cost option for smaller amounts; get advice from an advocate or legal-aid clinic.</li>
      </ul>
    </GuideLayout>
  );
}
