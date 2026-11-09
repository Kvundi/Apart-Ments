import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import { PageHero, Prose, ReviewedNote } from "@/components/ui";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The rules for using Apart Ments, posting listings and contacting owners and agents.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-[#1a2420]">
      <Navbar />
      <PageHero crumbs={[{ label: "Terms of use" }]} title="Terms of use" description="The ground rules for using Apart Ments — for people searching and for people listing." />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <Prose>
          <h2>1. What Apart Ments is</h2>
          <p>
            Apart Ments is a marketplace where property owners and agents advertise homes and land for sale or rent, and where people searching
            can contact them. We are not a party to any sale, purchase or tenancy, we don&apos;t hold deposits, and we don&apos;t act as anyone&apos;s agent.
          </p>

          <h2>2. Using the site</h2>
          <ul>
            <li>You must be 18 or over to post listings or create an account.</li>
            <li>Don&apos;t use the site to harass anyone, send spam, scrape data or interfere with how it works.</li>
            <li>Tools such as the mortgage calculator and home value estimate give general estimates only — they are not financial advice or a valuation.</li>
          </ul>

          <h2>3. Posting a listing</h2>
          <p>When you post a listing you confirm that:</p>
          <ul>
            <li>you own the property or are authorised by the owner to advertise it, and agents are registered as the law requires;</li>
            <li>the details, price and photos are accurate, current and yours to use;</li>
            <li>the property is genuinely available, and you&apos;ll mark it sold or let, or delete it, when it no longer is;</li>
            <li>you will <strong>not charge viewing fees</strong> or ask for any payment before a person has viewed the property;</li>
            <li>the listing doesn&apos;t discriminate against anyone on grounds protected by Kenyan law.</li>
          </ul>
          <p>
            You keep ownership of your content and give us permission to display, resize and promote it on Apart Ments and in our alerts while it is listed.
          </p>

          <h2>4. Review and removal</h2>
          <p>
            Our team reviews listings before they go live and may edit formatting, ask for more information, decline a listing, or remove one at any
            time — particularly if it is reported, looks fraudulent, or breaks these terms. We may suspend accounts that repeatedly break the rules.
          </p>

          <h2>5. Dealing with owners and agents</h2>
          <p>
            Do your own checks before paying anyone: view the property, confirm ownership with an official search, and use an advocate for purchases.
            Our <Link href="/guides/rent">renter safety guide</Link> and <Link href="/guides/buy">buyer&apos;s guide</Link> explain how. If something
            looks wrong, use &ldquo;Report this listing&rdquo;.
          </p>

          <h2>6. Liability</h2>
          <p>
            We work hard to keep listings genuine, but we can&apos;t guarantee every listing, owner or agent. To the extent the law allows, we aren&apos;t
            liable for losses arising from transactions between users, or from relying on estimates shown on the site. Nothing in these terms limits
            rights you have under Kenyan consumer protection law.
          </p>

          <h2>7. Privacy</h2>
          <p>Our <Link href="/privacy">privacy policy</Link> explains how we handle personal data.</p>

          <h2>8. Changes and governing law</h2>
          <p>
            We may update these terms and will show the date of the latest version below. These terms are governed by the laws of Kenya, and the
            courts of Kenya have jurisdiction over disputes.
          </p>
        </Prose>
        <ReviewedNote date="November 2026">These terms should be reviewed by a qualified advocate before launch.</ReviewedNote>
      </main>
      <SiteFooter />
    </div>
  );
}
