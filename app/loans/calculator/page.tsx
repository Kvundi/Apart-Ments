import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import MortgageCalculator from "@/components/MortgageCalculator";
import { PageHero, Prose, ReviewedNote } from "@/components/ui";

export const metadata: Metadata = {
  title: "Mortgage calculator Kenya — repayments, costs and affordability",
  description:
    "Work out your monthly mortgage repayment in KSh, the cash you need upfront (deposit, stamp duty, legal and bank fees) and how much home you can afford.",
  alternates: { canonical: "/loans/calculator" },
};

export default async function CalculatorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.price) ? sp.price[0] : sp.price;
  const initialPrice = raw && Number.isFinite(Number(raw)) ? Number(raw) : undefined;

  return (
    <div className="min-h-screen bg-white text-[#1a2420]">
      <Navbar />
      <PageHero
        crumbs={[{ label: "Home loans", href: "/loans" }, { label: "Mortgage calculator" }]}
        eyebrow="Home loans"
        title="Mortgage calculator"
        description="See your monthly repayment, the real cash you need on day one, and how much home your income and savings can stretch to."
      />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <MortgageCalculator initialPrice={initialPrice} />

        <div className="max-w-3xl mt-16">
          <Prose>
            <h2>How this calculator works</h2>
            <p>
              Repayments use the standard reducing-balance formula that Kenyan banks use for mortgages. Interest is charged
              on what you still owe, so early repayments are mostly interest and later ones mostly capital.
            </p>
            <ul>
              <li><strong>Interest rate:</strong> the &ldquo;Bank average&rdquo; preset is the average Kenyan mortgage rate reported by the Central Bank of Kenya (about 13.5% in December 2025). Rates are often variable, so your repayment can change.</li>
              <li><strong>KMRC-backed loans:</strong> lenders who refinance through the Kenya Mortgage Refinance Company offer fixed rates of roughly 9.5–9.9% on qualifying affordable homes. <a href="/loans/government">See who qualifies</a>.</li>
              <li><strong>Stamp duty</strong> is 4% of the property value in municipalities and 2% elsewhere, and is paid by the buyer.</li>
              <li><strong>Legal, valuation and bank fees</strong> vary by lender and advocate; the percentages used here are typical estimates.</li>
            </ul>
          </Prose>
          <ReviewedNote date="November 2026" />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
