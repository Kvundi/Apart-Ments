import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import { PageHero, Prose, ReviewedNote } from "@/components/ui";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Apart Ments collects, uses and protects your personal data under Kenya's Data Protection Act, 2019.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const email = SITE.supportEmail;
  return (
    <div className="min-h-screen bg-white text-[#1a2420]">
      <Navbar />
      <PageHero crumbs={[{ label: "Privacy policy" }]} title="Privacy policy" description="What we collect, why, who we share it with, and your rights under Kenya's Data Protection Act, 2019." />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <Prose>
          <h2>Who we are</h2>
          <p>
            Apart Ments is an online property marketplace that connects people looking for homes with owners and agents in Kenya. We are the
            data controller for personal data collected through this website.
            {email && <> You can reach us about privacy at <a href={`mailto:${email}`}>{email}</a>.</>}
          </p>

          <h2>What we collect</h2>
          <ul>
            <li><strong>Account details</strong> — your name, email address and profile photo when you sign up, handled by our sign-in provider, Clerk.</li>
            <li><strong>Profile details you choose to add</strong> — display name, phone number, location, bio and agency name.</li>
            <li><strong>Listings</strong> — property details, photos, videos, map location, and the owner name, phone number and email you enter for the listing.</li>
            <li><strong>Saved homes and searches</strong> — the homes you save and the searches you ask us to alert you about, with the email address alerts go to.</li>
            <li><strong>Reports</strong> — the reason and details you give when reporting a listing, and contact details if you choose to share them.</li>
            <li><strong>Technical data</strong> — basic information your browser sends, such as IP address and device type, used to run and secure the site.</li>
          </ul>

          <h2>What is public</h2>
          <p>
            When you publish a listing, the owner or agent name and phone number on that listing are shown publicly so people can contact you.
            Your public profile shows the details you add to it. Exact map pins are not shown publicly — buyers and renters see an approximate area.
            Don&apos;t put information in a listing that you don&apos;t want the public to see.
          </p>

          <h2>Why we use your data</h2>
          <ul>
            <li>To run your account and publish and review your listings (to perform our agreement with you).</li>
            <li>To send the alerts you ask for, and to tell you about your listings (with your consent, which you can withdraw at any time).</li>
            <li>To prevent fraud and scams, investigate reports and keep the platform safe (our legitimate interests).</li>
            <li>To meet legal obligations, for example responding to lawful requests from authorities.</li>
          </ul>
          <p>We do not sell your personal data.</p>

          <h2>Who we share it with</h2>
          <p>We use trusted service providers who process data for us under contract:</p>
          <ul>
            <li><strong>Clerk</strong> — sign-in and account security</li>
            <li><strong>Supabase</strong> — database and file storage for listings, profiles and saved items</li>
            <li><strong>An email delivery provider</strong> — to send saved-search alerts</li>
            <li><strong>OpenStreetMap</strong> — map images load from OpenStreetMap servers, which receive your IP address</li>
          </ul>
          <p>Some of these providers store data outside Kenya. Where they do, we rely on the safeguards the Data Protection Act requires.</p>

          <h2>How long we keep it</h2>
          <p>
            We keep account and listing data while your account is active. If you delete a listing it is removed from the site; if you ask us to
            delete your account we delete or anonymise your personal data unless we must keep it by law or to deal with a fraud report.
          </p>

          <h2>Your rights</h2>
          <p>Under the Data Protection Act, 2019 you have the right to:</p>
          <ul>
            <li>be told how your data is used, and get a copy of it;</li>
            <li>have inaccurate data corrected, and have data deleted;</li>
            <li>object to processing, and withdraw consent (for example, turn off alerts on your Saved page);</li>
            <li>complain to the Office of the Data Protection Commissioner (ODPC).</li>
          </ul>
          <p>
            You can edit or delete most of your data yourself from your profile, My Listings and Saved pages.
            {email ? <> For anything else, email <a href={`mailto:${email}`}>{email}</a>.</> : " For anything else, contact us through our official channels."}
          </p>

          <h2>Cookies and local storage</h2>
          <p>
            We use cookies that are needed for sign-in and security. Your browser also stores the homes you save so they work before you sign in.
            We don&apos;t use advertising cookies.
          </p>

          <h2>Changes</h2>
          <p>We&apos;ll update this policy when our practices change and show the date below.</p>
        </Prose>
        <ReviewedNote date="November 2026">This policy should be reviewed by a qualified advocate before launch.</ReviewedNote>
      </main>
      <SiteFooter />
    </div>
  );
}
