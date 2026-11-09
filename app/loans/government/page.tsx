import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import KmrcChecker from "@/components/KmrcChecker";
import { PageHero, Prose, Callout, ReviewedNote } from "@/components/ui";

export const metadata: Metadata = {
  title: "Affordable housing in Kenya — Boma Yangu, Housing Levy and KMRC loans",
  description:
    "How Kenya's Affordable Housing Programme works: registering on Boma Yangu, the 1.5% Housing Levy, tenant-purchase homes and KMRC-backed mortgages at about 9.5–9.9%.",
  alternates: { canonical: "/loans/government" },
};

export default function GovernmentHousingPage() {
  return (
    <div className="min-h-screen bg-white text-[#1a2420]">
      <Navbar />
      <PageHero
        crumbs={[{ label: "Home loans", href: "/loans" }, { label: "Affordable housing" }]}
        eyebrow="Home loans"
        title="Affordable housing and government-backed loans"
        description="Two routes can make owning a home cheaper: buying a unit through the Affordable Housing Programme, and a KMRC-backed mortgage with a lower fixed rate."
      />
      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <article className="lg:col-span-2">
          <Prose>
            <h2 id="ahp">The Affordable Housing Programme and Boma Yangu</h2>
            <p>
              The government&apos;s Affordable Housing Programme builds homes across the country and sells them to registered applicants
              through the <a href="https://bomayangu.go.ke" target="_blank" rel="noopener noreferrer">Boma Yangu portal</a>. By October 2026 about
              1.24 million people had registered, across more than 120 projects.
            </p>
            <ul>
              <li><strong>Register</strong> on Boma Yangu with your ID, KRA PIN and phone number.</li>
              <li><strong>Save towards a deposit</strong> in your Boma Yangu account. Reported deposits are around 5–10% of the unit price depending on the category — check the current rules on the portal.</li>
              <li><strong>Apply for a unit</strong> in a project near you. Units are allocated to qualifying applicants.</li>
              <li><strong>Pay the balance</strong> through a tenant-purchase plan (monthly instalments after you move in) or a mortgage.</li>
            </ul>

            <h2 id="levy">The Housing Levy</h2>
            <p>
              Employees pay a <strong>1.5% Housing Levy</strong> on gross salary, and employers add another 1.5%. KRA collects it to fund the
              programme. It is a levy, not savings — it isn&apos;t refunded to you, and paying it doesn&apos;t by itself give you a house.
            </p>

            <h2 id="kmrc">KMRC-backed mortgages</h2>
            <p>
              The <strong>Kenya Mortgage Refinance Company (KMRC)</strong> lends long-term money to banks, SACCOs and microfinance banks so
              they can offer cheaper fixed-rate mortgages on affordable homes. As of late 2025:
            </p>
            <ul>
              <li>Fixed rates of roughly <strong>9.5–9.9%</strong>, compared with about 13.5% for an average bank mortgage</li>
              <li>Terms of up to 20 years or more, depending on the lender</li>
              <li>For homes valued up to <strong>KSh 10.5 million</strong> (raised from KSh 8 million), including Boma Yangu units</li>
              <li>For Kenyan citizens with income they can prove; lenders apply an income cap, reported between KSh 100,000 and 200,000 a month</li>
            </ul>
            <p>
              Ask your bank or SACCO whether it is a KMRC partner lender. Then use the <Link href="/loans/calculator">mortgage calculator</Link> with
              the &ldquo;KMRC-backed&rdquo; rate to compare repayments.
            </p>
          </Prose>

          <div className="mt-10">
            <KmrcChecker />
          </div>

          <div className="mt-8">
            <Callout tone="warn" title="Beware of “Boma Yangu agents”">
              You apply for affordable housing yourself on the official portal. Nobody can sell you priority allocation, and you should never pay
              an individual to &ldquo;secure&rdquo; a unit.
            </Callout>
          </div>
          <ReviewedNote date="November 2026">
            Figures come from public reporting in 2025–2026 and change often. Check bomayangu.go.ke, kmrc.co.ke and your lender for current rules.
          </ReviewedNote>
        </article>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-[#e6e2d8] p-6 sticky top-24">
            <h2 className="font-bold text-lg mb-4">At a glance</h2>
            <dl className="space-y-4 text-sm">
              {[
                ["Housing Levy", "1.5% employee + 1.5% employer"],
                ["Boma Yangu applicants", "~1.24 million (Oct 2026)"],
                ["KMRC loan rates", "~9.5–9.9% fixed"],
                ["KMRC home value cap", "KSh 10.5 million"],
                ["Average bank mortgage", "~13.5% (Dec 2025)"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[#6b6358]">{k}</dt>
                  <dd className="font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 pt-6 border-t border-[#e6e2d8] space-y-2 text-sm">
              <a href="https://bomayangu.go.ke" target="_blank" rel="noopener noreferrer" className="block text-emerald-700 font-semibold hover:underline">Boma Yangu portal ↗</a>
              <a href="https://kmrc.co.ke" target="_blank" rel="noopener noreferrer" className="block text-emerald-700 font-semibold hover:underline">Kenya Mortgage Refinance Company ↗</a>
              <Link href="/properties?type=sale&max=10500000" className="block text-emerald-700 font-semibold hover:underline">Homes under KSh 10.5M →</Link>
            </div>
          </div>
        </aside>
      </main>
      <SiteFooter />
    </div>
  );
}
