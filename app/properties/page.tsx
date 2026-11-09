import { Suspense } from "react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";
import { Search, SearchX } from "lucide-react";
import PropertiesFilter from "@/components/PropertiesFilter";
import PropertyCard, { toCardData } from "@/components/PropertyCard";
import SortSelect from "@/components/SortSelect";
import ViewToggle from "@/components/ViewToggle";
import SaveSearchButton from "@/components/SaveSearchButton";
import { ListingsMap } from "@/components/map";
import { parseFilters, activeParams, searchKey, describeFilters, buildPropertyQuery } from "@/lib/propertySearch";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/** "Apartments for rent in Kilimani" style titles, so each search can rank on its own. */
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const f = parseFilters(await searchParams);
  const what = f.property ? (f.property.endsWith("s") ? f.property : `${f.property}s`) : f.type === "sale" ? "Homes" : f.type === "rent" ? "Homes" : "Property";
  const deal = f.type === "sale" ? " for sale" : f.type === "rent" ? " for rent" : " for sale and rent";
  const where = f.location ? ` in ${f.location}` : " in Kenya";
  const title = `${what}${deal}${where}`;
  const qs = new URLSearchParams(activeParams(f, { includeSort: false })).toString();
  return {
    title,
    description: `Browse ${title.toLowerCase()} on Apart Ments. Every listing is reviewed — contact owners and agents directly on WhatsApp, with no viewing fees.`,
    alternates: { canonical: `/properties${qs ? `?${qs}` : ""}` },
  };
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const filters = parseFilters(raw);
  const view: "list" | "map" = raw.view === "map" ? "map" : "list";

  const supabase = await createClient();
  const { data: rows, error } = await buildPropertyQuery(supabase, filters, { limit: view === "map" ? 200 : 48 });
  if (error) console.error("Failed to load properties:", error.message);
  const listings = (rows ?? []).map((r) => toCardData(r));

  // Filters + sort (for the filter panel); `view` rides along so filtering doesn't drop you out of map view.
  const currentParams = activeParams(filters);
  const panelParams: Record<string, string> = view === "map" ? { ...currentParams, view } : currentParams;
  const hasFilters = Object.keys(activeParams(filters, { includeSort: false })).length > 0;
  const label = describeFilters(filters);

  const empty = (
    <div className="text-center py-20 border border-[#e6e2d8] rounded-3xl bg-[#f7f5ef]">
      <SearchX size={52} className="mx-auto mb-4 text-emerald-700/50" />
      <h2 className="text-xl font-bold mb-2">No properties match your search</h2>
      <p className="text-[#6b6358] mb-6">Try adjusting your filters, or save this search and we&apos;ll alert you when one is listed.</p>
      <Link href="/properties" className="inline-block bg-emerald-600 text-white font-semibold px-8 py-3 rounded-2xl">
        View all listings
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-[#1a2420]">
      <Navbar />

      <div className="bg-[#f7f5ef] border-b border-[#e6e2d8] py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 bg-white border border-[#e6e2d8] rounded-2xl px-5 py-3 shadow-sm">
            <Search size={18} className="text-emerald-600 shrink-0" />
            <form method="GET" action="/properties" className="flex-1 flex items-center gap-3">
              {Object.entries(panelParams)
                .filter(([k]) => k !== "q")
                .map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
              <input
                name="q"
                type="text"
                defaultValue={filters.q}
                placeholder="Search by area, estate or keyword…"
                className="flex-1 min-w-0 outline-none text-sm bg-transparent text-[#1a2420] placeholder:text-[#9c948a]"
              />
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors shrink-0">
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className={`${view === "map" ? "max-w-[1600px]" : "max-w-7xl"} mx-auto px-6 py-8`}>
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-72 flex-shrink-0">
            <PropertiesFilter key={JSON.stringify(panelParams)} currentParams={panelParams} />
          </aside>

          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h1 className="text-2xl font-bold">
                  {listings.length > 0
                    ? `${listings.length} propert${listings.length === 1 ? "y" : "ies"} found`
                    : "No properties found"}
                </h1>
                <p className="text-sm text-[#6b6358] mt-1">{label}</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {hasFilters && (
                  <Link href={view === "map" ? "/properties?view=map" : "/properties"} className="text-sm text-emerald-600 hover:underline">
                    Clear filters
                  </Link>
                )}
                <SaveSearchButton query={searchKey(filters)} label={label} />
                <Suspense fallback={null}>
                  <ViewToggle view={view} />
                  {view === "list" && <SortSelect value={filters.sort} />}
                </Suspense>
              </div>
            </div>

            {listings.length === 0 ? (
              empty
            ) : view === "map" ? (
              // Zillow-style split view: map on the left, results on the right.
              <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                <div className="xl:col-span-3 xl:sticky xl:top-20 self-start">
                  <ListingsMap listings={listings} className="h-[60vh] xl:h-[78vh]" />
                </div>
                <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6 xl:max-h-[78vh] xl:overflow-y-auto xl:pr-2">
                  {listings.map((p) => <PropertyCard key={p.id} p={p} />)}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map((p) => <PropertyCard key={p.id} p={p} />)}
              </div>
            )}
          </main>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
