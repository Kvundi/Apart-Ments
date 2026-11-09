import Link from "next/link";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import { PageHero, Prose, ReviewedNote } from "@/components/ui";

export const GUIDES = [
  { href: "/guides/buy", label: "Buyer's guide" },
  { href: "/guides/sell", label: "Seller's guide" },
  { href: "/guides/rent", label: "Renter safety guide" },
  { href: "/loans", label: "Mortgages explained" },
  { href: "/loans/government", label: "Affordable housing" },
];

/** Shared shell for long-form guides: hero, article with table of contents, related guides. */
export default function GuideLayout({
  slug, title, description, toc, children, aside, reviewed = "November 2026",
}: {
  slug: string; title: string; description: string;
  toc: { id: string; label: string }[];
  children: React.ReactNode; aside?: React.ReactNode; reviewed?: string;
}) {
  return (
    <div className="min-h-screen bg-white text-[#1a2420]">
      <Navbar />
      <PageHero crumbs={[{ label: "Guides" }, { label: title }]} eyebrow="Guide" title={title} description={description} />
      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
        <nav aria-label="On this page" className="hidden lg:block">
          <div className="sticky top-24">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6b6358] mb-3">On this page</p>
            <ol className="space-y-2 text-sm border-l border-[#e6e2d8]">
              {toc.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="block pl-4 -ml-px border-l border-transparent hover:border-emerald-600 text-[#5c554a] hover:text-emerald-700">{t.label}</a>
                </li>
              ))}
            </ol>
          </div>
        </nav>
        <article className="lg:col-span-2 min-w-0">
          <Prose>{children}</Prose>
          <ReviewedNote date={reviewed} />
        </article>
        <aside className="space-y-6">
          {aside}
          <div className="rounded-2xl border border-[#e6e2d8] p-5">
            <p className="text-sm font-semibold mb-3">More guides</p>
            <ul className="space-y-2 text-sm">
              {GUIDES.filter((g) => g.href !== `/guides/${slug}`).map((g) => (
                <li key={g.href}><Link href={g.href} className="text-emerald-700 hover:underline">{g.label}</Link></li>
              ))}
            </ul>
          </div>
        </aside>
      </main>
      <SiteFooter />
    </div>
  );
}
