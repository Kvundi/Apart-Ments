import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import Logo from "@/components/Logo";
import { FOOTER_LINKS, SITE } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="bg-[#10201a] text-[#c9d3cd] mt-20">
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          <div className="col-span-2">
            <Logo tone="light" />
            <p className="mt-4 text-sm leading-relaxed text-[#9fb0a7] max-w-xs">
              {SITE.description}
            </p>
            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-white/5 border border-white/10 p-4 max-w-xs">
              <ShieldCheck size={20} className="text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed text-[#9fb0a7]">
                Never pay a viewing fee or deposit before you&apos;ve seen a property and confirmed who owns it.{" "}
                <Link href="/guides/rent" className="text-emerald-300 hover:underline">Stay safe</Link>
              </p>
            </div>
          </div>
          {FOOTER_LINKS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h3 className="text-sm font-semibold text-white mb-4">{col.heading}</h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-[#9fb0a7] hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#7f9187]">
          <p>© {new Date().getFullYear()} Apart Ments. All rights reserved.</p>
          <p>Listings are provided by owners and agents. Always verify ownership before paying.</p>
        </div>
      </div>
    </footer>
  );
}
