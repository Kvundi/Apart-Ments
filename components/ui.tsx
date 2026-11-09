import Link from "next/link";
import { ChevronRight, Info, AlertTriangle, CheckCircle2 } from "lucide-react";

type Crumb = { label: string; href?: string };

/** Page header band used by guides, tools and directory pages. */
export function PageHero({
  eyebrow, title, description, crumbs, children,
}: {
  eyebrow?: string; title: string; description?: string; crumbs?: Crumb[]; children?: React.ReactNode;
}) {
  return (
    <section className="bg-gradient-to-b from-emerald-50/70 to-white border-b border-[#e6e2d8]">
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-12">
        {crumbs && <Breadcrumbs items={crumbs} />}
        {eyebrow && <p className="text-emerald-700 text-sm font-semibold uppercase tracking-wider mb-3 mt-6">{eyebrow}</p>}
        <h1 className={`text-3xl md:text-5xl font-bold tracking-tight text-[#1a2420] max-w-3xl ${eyebrow ? "" : "mt-6"}`}>{title}</h1>
        {description && <p className="mt-4 text-lg text-[#5c554a] max-w-2xl leading-relaxed">{description}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-[#6b6358]">
      <ol className="flex flex-wrap items-center gap-1">
        <li><Link href="/" className="hover:text-emerald-700">Home</Link></li>
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-1">
            <ChevronRight size={14} className="text-[#b3aca0]" />
            {c.href ? <Link href={c.href} className="hover:text-emerald-700">{c.label}</Link> : <span className="text-[#1a2420]">{c.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Callout({ tone = "info", title, children }: { tone?: "info" | "warn" | "success"; title?: string; children: React.ReactNode }) {
  const styles = {
    info: { box: "bg-sky-50 border-sky-200 text-sky-900", icon: <Info size={18} className="text-sky-600 shrink-0 mt-0.5" /> },
    warn: { box: "bg-amber-50 border-amber-200 text-amber-900", icon: <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" /> },
    success: { box: "bg-emerald-50 border-emerald-200 text-emerald-900", icon: <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" /> },
  }[tone];
  return (
    <div className={`flex gap-3 rounded-2xl border p-4 ${styles.box}`}>
      {styles.icon}
      <div className="text-sm leading-relaxed">
        {title && <p className="font-semibold mb-1">{title}</p>}
        {children}
      </div>
    </div>
  );
}

/** Long-form article typography without a plugin. */
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[#3d3830] leading-relaxed space-y-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#1a2420] [&_h2]:mt-12 [&_h2:first-child]:mt-0 [&_h2]:mb-2 [&_h2]:scroll-mt-24 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[#1a2420] [&_h3]:mt-8 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_a]:text-emerald-700 [&_a]:font-medium [&_a:hover]:underline [&_strong]:text-[#1a2420]">
      {children}
    </div>
  );
}

/** Small "last reviewed / not advice" line for guides and tools. */
export function ReviewedNote({ date, children }: { date: string; children?: React.ReactNode }) {
  return (
    <p className="text-xs text-[#9c948a] border-t border-[#e6e2d8] pt-4 mt-12">
      Last reviewed {date}. {children ?? "General information only, not legal, tax or financial advice. Confirm current rules and fees with a qualified professional or the relevant government office."}
    </p>
  );
}

export function ButtonLink({ href, children, variant = "primary", className = "" }: {
  href: string; children: React.ReactNode; variant?: "primary" | "secondary"; className?: string;
}) {
  const v = variant === "primary"
    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
    : "bg-white border border-[#e6e2d8] hover:border-emerald-300 text-[#1a2420]";
  return (
    <Link href={href} className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-colors ${v} ${className}`}>
      {children}
    </Link>
  );
}
