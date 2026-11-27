import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import CommissionCalculator from "@/components/CommissionCalculator";
import { Callout, PageHero, Prose, ReviewedNote } from "@/components/ui";
import { COMMISSION } from "@/lib/commission";
import { earbRegistration } from "@/lib/payments";

export const metadata: Metadata = {
  title: "Commission calculator — what listing with 28Homes costs",
  description:
    "Listing on 28Homes is free. If we bring the buyer or tenant, the commission is 3% of the final sale price or one month's rent. Work out the exact amount.",
  alternates: { canonical: "/commission" },
};

export default async function CommissionPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const rawPrice = Number(one(sp.price));
  const initialPrice = Number.isFinite(rawPrice) && rawPrice > 0 ? rawPrice : undefined;
  const initialType = one(sp.type) === "rent" ? "rent" : "sale";
  const earb = earbRegistration();

  return (
    <div className="min-h-screen bg-white text-[#1a2420]">
      <Navbar />
      <PageHero
        crumbs={[{ label: "Sell & list", href: "/add" }, { label: "Commission calculator" }]}
        eyebrow="For owners, landlords & agents"
        title="What 28Homes charges"
        description="Listing is free. You only pay if 28Homes brings the buyer or tenant and the deal closes. Buyers and tenants never pay us anything."
      />
      <main className="max-w-7xl mx-auto px-6 py-12">
        {!earb && (
          <div className="mb-8 max-w-3xl">
            <Callout tone="info" title="No commission is charged yet">
              28Homes is completing its registration with the Estate Agents Registration Board (EARB). Until that is
              done, deals closed through 28Homes are free. We will tell every lister before any commission applies.
            </Callout>
          </div>
        )}

        <CommissionCalculator initialType={initialType} initialPrice={initialPrice} />

        <div className="max-w-3xl mt-16">
          <Prose>
            <h2>How it works</h2>
            <ul>
              <li>
                <strong>Sale:</strong> {COMMISSION.saleRate * 100}% of the final price agreed with the buyer.
              </li>
              <li>
                <strong>Rental:</strong> {`${COMMISSION.rentMonths} month's rent, paid once when the tenant signs.`}
              </li>
              <li>
                <strong>Only for clients we introduce.</strong> If you find the buyer or tenant yourself, you owe us nothing.
              </li>
              <li>
                <strong>No viewing fees, no listing fees, no upfront payment.</strong> Anyone asking a client for money
                before a viewing is not 28Homes. See our <Link href="/guides/rent">safety guide</Link>.
              </li>
            </ul>

            <h2>When and how you pay</h2>
            <p>
              When the deal closes, 28Homes sends you an invoice with a secure pay link. You can pay by M-Pesa (a PIN
              prompt on your phone), by card, or by bank transfer using the invoice number as the reference. Payment is
              due within the time shown on the invoice, and you get a confirmation as soon as it is received.
            </p>

            <h2>Who pays</h2>
            <p>
              The owner, landlord or agent who listed the property pays. 28Homes is paid by one side only, so buyers and
              tenants are never charged a commission or a finder&apos;s fee by us.
            </p>

            {earb && (
              <p className="text-sm">
                28Homes is registered with the Estate Agents Registration Board: registration no. {earb.regNo},
                practising certificate {earb.certNo}.
              </p>
            )}
            <p>
              Full terms: <Link href="/terms#commission">Terms of use, section 4</Link>.
            </p>
          </Prose>
          <ReviewedNote date="27 November 2026">
            Amounts are exact for the rates shown. VAT is added only if 28Homes is VAT-registered.
          </ReviewedNote>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
