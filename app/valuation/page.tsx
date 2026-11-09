import type { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, Info, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import PropertyCard from "@/components/PropertyCard";
import { PageHero, Prose, Callout, ReviewedNote } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { toCardData, formatKsh } from "@/lib/listing";
import { POPULAR_AREAS, areaOf } from "@/lib/areas";
import { estimate, type ValuationInput } from "@/lib/valuation";

export const metadata: Metadata = {
  title: "Home value and rent estimate — Kenya",
  description:
    "Estimate what a home in your area could sell or rent for, based on comparable live listings on Apart Ments. Free, instant and transparent.",
  alternates: { canonical: "/valuation" },
};

const TYPES = ["Apartment", "House", "Maisonette", "Villa", "Land", "Commercial"];

export default async function ValuationPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const get = (k: string) => (Array.isArray(sp[k]) ? sp[k]![0] : (sp[k] as string | undefined)) ?? "";
  const submitted = get("area") !== "";
  const input: ValuationInput = {
    type: get("type") === "rent" ? "rent" : "sale",
    area: get("area"),
    propertyType: TYPES.includes(get("property")) ? get("property") : "",
    beds: get("beds") !== "" && Number.isFinite(Number(get("beds"))) ? Number(get("beds")) : null,
    size: get("size") !== "" && Number(get("size")) > 0 ? Number(get("size")) : null,
  };

  const supabase = await createClient();
  const { data: rows } = await supabase.from("properties").select("*").eq("status", "Available").limit(1000);
  const all = (rows ?? []).map((r) => toCardData(r));
  const result = submitted ? estimate(all, input) : null;

  const liveAreas = [...new Set(all.map((p) => areaOf(p.location)).filter(Boolean) as string[])];
  const areaOptions = [...new Set([...liveAreas, ...POPULAR_AREAS.map((a) => a.name)])].sort();
  const isRent = input.type === "rent";
  const suffix = isRent ? " /mo" : "";

  return (
    <div className="min-h-screen bg-white text-[#1a2420]">
      <Navbar />
      <PageHero
        crumbs={[{ label: "Home value estimate" }]}
        eyebrow="Free estimate"
        title={isRent ? "What could your home rent for?" : "What is your home worth?"}
        description="An instant price or rent range based on comparable homes listed on Apart Ments — with every comparable shown, so you can judge it yourself."
      />

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form */}
        <form method="GET" action="/valuation" className="rounded-3xl border border-[#e6e2d8] p-6 space-y-5 h-fit lg:sticky lg:top-24 bg-white">
          <fieldset>
            <legend className="text-sm font-medium mb-2">I want to know the</legend>
            <div className="grid grid-cols-2 gap-2">
              {[["sale", "Sale price"], ["rent", "Monthly rent"]].map(([v, l]) => (
                <label key={v} className="cursor-pointer">
                  <input type="radio" name="type" value={v} defaultChecked={input.type === v} className="peer sr-only" />
                  <span className="block text-center py-2.5 rounded-xl border border-[#e6e2d8] text-sm font-semibold peer-checked:bg-emerald-600 peer-checked:text-white peer-checked:border-emerald-600 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-400">{l}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <label className="block text-sm">
            <span className="font-medium">Area or estate *</span>
            <input name="area" required list="areas" defaultValue={input.area} placeholder="e.g. Kilimani"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-[#e6e2d8] outline-none focus:border-emerald-500" />
            <datalist id="areas">{areaOptions.map((a) => <option key={a} value={a} />)}</datalist>
          </label>
          <label className="block text-sm">
            <span className="font-medium">Property type</span>
            <select name="property" defaultValue={input.propertyType} className="mt-1 w-full px-4 py-3 rounded-xl border border-[#e6e2d8] bg-white outline-none focus:border-emerald-500">
              <option value="">Any</option>
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="font-medium">Bedrooms</span>
              <select name="beds" defaultValue={input.beds ?? ""} className="mt-1 w-full px-4 py-3 rounded-xl border border-[#e6e2d8] bg-white outline-none focus:border-emerald-500">
                <option value="">Any</option>
                <option value="0">Studio</option>
                {[1, 2, 3, 4, 5].map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </label>
            <label className="block text-sm">
              <span className="font-medium">Size (m²)</span>
              <input name="size" type="number" min={1} defaultValue={input.size ?? ""} placeholder="Optional"
                className="mt-1 w-full px-4 py-3 rounded-xl border border-[#e6e2d8] outline-none focus:border-emerald-500" />
            </label>
          </div>
          <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-2xl">
            <TrendingUp size={18} /> Get estimate
          </button>
        </form>

        {/* Result */}
        <div className="lg:col-span-2 space-y-8">
          {!submitted ? (
            <div className="rounded-3xl bg-[#f7f5ef] border border-[#e6e2d8] p-8">
              <Search size={32} className="text-emerald-700 mb-4" />
              <h2 className="text-xl font-bold mb-2">Enter an area to get started</h2>
              <p className="text-[#6b6358]">We&apos;ll find comparable homes listed on Apart Ments and show you the typical range, plus each comparable home so you can see how we got there.</p>
            </div>
          ) : result ? (
            <>
              <div className="rounded-3xl bg-[#10201a] text-white p-7">
                <p className="text-sm text-emerald-200">Estimated {isRent ? "monthly rent" : "asking price"} in {input.area}</p>
                <p className="text-4xl md:text-5xl font-bold mt-1">{formatKsh(result.mid)}<span className="text-xl font-normal text-emerald-200">{suffix}</span></p>
                <p className="mt-3 text-emerald-100">Typical range: {formatKsh(result.low)} – {formatKsh(result.high)}{suffix}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-1 mt-5 pt-5 border-t border-white/10 text-sm text-[#b8c6be]">
                  <span>Based on {result.comps.length < 6 ? result.comps.length : "the closest 6 of"} comparable listing{result.comps.length === 1 ? "" : "s"}</span>
                  {result.medianPerSqm && <span>Median {formatKsh(result.medianPerSqm)} per m²{suffix}</span>}
                  <span>{result.method === "per_sqm" ? "Scaled to your size" : "Middle of comparable prices"}</span>
                </div>
              </div>
              {result.relaxed.length > 0 && (
                <Callout tone="info" title="We widened the search">
                  There weren&apos;t enough exact matches, so this estimate also uses homes with {result.relaxed.join(" and ")}. Treat it as a rough guide.
                </Callout>
              )}
              <div>
                <h2 className="text-xl font-bold mb-4">Comparable homes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {result.comps.map((p) => <PropertyCard key={p.id} p={p} />)}
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
              <Info size={28} className="text-amber-600 mb-3" />
              <h2 className="text-xl font-bold mb-2">Not enough comparable homes yet</h2>
              <p className="text-[#5c554a] mb-5">
                {`We need at least 3 similar ${isRent ? "rentals" : "homes for sale"} in ${input.area} to give a fair estimate, and we don't have them yet. We'd rather tell you that than show a number we can't stand behind.`}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href={`/properties?type=${input.type}&location=${encodeURIComponent(input.area)}`} className="bg-white border border-[#e6e2d8] hover:border-emerald-300 font-semibold px-5 py-2.5 rounded-xl text-sm">
                  See what&apos;s listed in {input.area}
                </Link>
                <Link href="/add" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm">List your property</Link>
              </div>
            </div>
          )}

          <div className="max-w-2xl">
            <Prose>
              <h2>How this estimate works</h2>
              <p>
                Kenya has no public database of what homes actually sell or rent for, so no website can give a true &ldquo;market value&rdquo;
                from records the way some overseas sites do. This tool uses the next-best evidence: <strong>asking prices of comparable homes
                currently listed on Apart Ments</strong>. If you give a size, we scale by the typical price per m².
              </p>
              <ul>
                <li>Asking prices are often higher than the final agreed price — expect some negotiation.</li>
                <li>Condition, title type, views, water and security all move value and aren&apos;t captured here.</li>
                <li>For a mortgage, a sale or a legal matter you need a valuation by a registered valuer.</li>
              </ul>
            </Prose>
            <ReviewedNote date="November 2026">This is an automated estimate from listing data, not a professional valuation.</ReviewedNote>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
