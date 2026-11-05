import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { MapPin, BedDouble, Bath, Maximize, Search } from "lucide-react";
import PropertiesFilter from "@/components/PropertiesFilter";

type Property = {
  id: string;
  title: string;
  price: number;
  location: string;
  property_type: string;
  listing_type: string;
  status: string;
  bedrooms: number | null;
  bathrooms: number | null;
  size_sqm: number | null;
  images: string[] | null;
};

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const sp: Record<string, string> = Object.fromEntries(
    Object.entries(raw).map(([k, v]) => [k, Array.isArray(v) ? v[0] ?? "" : v ?? ""])
  );

  const type     = sp?.type     ?? "";
  const property = sp?.property ?? "";
  const location = sp?.location ?? "";
  const q        = sp?.q        ?? "";
  const min      = sp?.min      ?? "";
  const max      = sp?.max      ?? "";
  const beds     = sp?.beds     ?? "";
  const amenity  = sp?.amenity  ?? "";
  // Strip characters that break PostgREST filter syntax
  const safe = (s: string) => s.replace(/[,()*%]/g, " ").trim();

  const supabase = await createClient();

  let query = supabase
    .from("properties")
    .select("id, title, price, location, property_type, listing_type, status, bedrooms, bathrooms, size_sqm, images")
    .eq("status", "Available")
    .order("created_at", { ascending: false });

  if (type === "sale")          query = query.eq("listing_type", "Sale");
  else if (type === "rent")     query = query.eq("listing_type", "Rent");
  if (property)                 query = query.eq("property_type", property);
  if (location)                 query = query.ilike("location", `%${safe(location)}%`);
  if (safe(q))                  query = query.or(`title.ilike.%${safe(q)}%,location.ilike.%${safe(q)}%`);
  if (min && !isNaN(Number(min))) query = query.gte("price", Number(min));
  if (max && !isNaN(Number(max))) query = query.lte("price", Number(max));
  if (beds && beds !== "any" && !isNaN(Number(beds))) query = query.gte("bedrooms", Number(beds));
  if (amenity)                  query = query.contains("amenities", [amenity]);

  const { data: properties, error } = await query.limit(48);
  if (error) console.error("Failed to load properties:", error.message);

  // Parse images safely — handles both array and JSON string formats
  const listings: Property[] = (properties || []).map((row) => {
    const p = row as Omit<Property, "images"> & { images: unknown };
    return {
    ...p,
    images: Array.isArray(p.images)
      ? p.images
      : typeof p.images === "string"
      ? JSON.parse(p.images)
      : null,
    } as Property;
  });

  const filterLabel = [
    type === "sale" ? "For Sale" : type === "rent" ? "For Rent" : null,
    property,
    location,
    q,
  ].filter(Boolean).join(" · ");

  const currentParams: Record<string, string> = {};
  if (type)     currentParams.type     = type;
  if (property) currentParams.property = property;
  if (location) currentParams.location = location;
  if (q)        currentParams.q        = q;
  if (min)      currentParams.min      = min;
  if (max)      currentParams.max      = max;
  if (beds)     currentParams.beds     = beds;
  if (amenity)  currentParams.amenity  = amenity;

  return (
    <div className="min-h-screen bg-white text-[#1a2420]">
      <Navbar />

      <div className="bg-[#f7f5ef] border-b border-[#e6e2d8] py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 bg-white border border-[#e6e2d8] rounded-2xl px-5 py-3 shadow-sm">
            <Search size={18} className="text-emerald-600 shrink-0" />
            <form method="GET" action="/properties" className="flex-1 flex items-center gap-3">
              {type     && <input type="hidden" name="type"     value={type}     />}
              {property && <input type="hidden" name="property" value={property} />}
              {min      && <input type="hidden" name="min"      value={min}      />}
              {max      && <input type="hidden" name="max"      value={max}      />}
              {beds     && <input type="hidden" name="beds"     value={beds}     />}
              <input
                name="q"
                type="text"
                defaultValue={q}
                placeholder="Search by area, estate or keyword…"
                className="flex-1 outline-none text-sm bg-transparent text-[#1a2420] placeholder:text-[#9c948a]"
              />
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors shrink-0">
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-72 flex-shrink-0">
            <PropertiesFilter key={JSON.stringify(currentParams)} currentParams={currentParams} />
          </aside>

          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h1 className="text-2xl font-bold">
                  {listings.length > 0
                    ? `${listings.length} propert${listings.length === 1 ? "y" : "ies"} found`
                    : "No properties found"}
                </h1>
                {filterLabel && <p className="text-sm text-[#6b6358] mt-1">{filterLabel}</p>}
              </div>
              {Object.keys(currentParams).length > 0 && (
                <Link href="/properties" className="text-sm text-emerald-600 hover:underline">Clear filters</Link>
              )}
            </div>

            {listings.length === 0 && (
              <div className="text-center py-20 border border-[#e6e2d8] rounded-3xl bg-[#f7f5ef]">
                <div className="text-7xl mb-4 opacity-30">🏠</div>
                <h2 className="text-xl font-bold mb-2">No properties match your search</h2>
                <p className="text-[#6b6358] mb-6">Try adjusting your filters or searching a different area.</p>
                <Link href="/properties" className="inline-block bg-emerald-600 text-white font-semibold px-8 py-3 rounded-2xl">
                  View all listings
                </Link>
              </div>
            )}

            {listings.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map((p) => (
                  <Link
                    key={p.id}
                    href={`/properties/${p.id}`}
                    className="group rounded-3xl overflow-hidden bg-white border border-[#e6e2d8] hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col"
                  >
                    <div className="h-48 bg-[#f7f5ef] relative flex items-center justify-center overflow-hidden">
                      {p.images?.[0] ? (
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="text-6xl opacity-20">🏠</div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${p.listing_type === "Rent" ? "bg-emerald-600 text-white" : "bg-[#1a2420] text-white"}`}>
                          For {p.listing_type}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-semibold text-base line-clamp-2 mb-1.5 text-[#1a2420] group-hover:text-emerald-600 transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-emerald-600 text-xl font-bold">
                        KSh {p.price?.toLocaleString()}
                        {p.listing_type === "Rent" && <span className="text-sm font-normal text-[#6b6358]"> /mo</span>}
                      </p>
                      <p className="text-[#6b6358] mt-1.5 flex items-center gap-1 text-sm">
                        <MapPin size={14} className="shrink-0" />{p.location}
                      </p>
                      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#e6e2d8] text-sm text-[#6b6358]">
                        {p.bedrooms  !== null && <span className="flex items-center gap-1"><BedDouble size={14} className="text-emerald-600/70" />{p.bedrooms === 0 ? "Studio" : `${p.bedrooms} bed`}</span>}
                        {p.bathrooms !== null && <span className="flex items-center gap-1"><Bath size={14} className="text-emerald-600/70" />{p.bathrooms} bath</span>}
                        {p.size_sqm  !== null && <span className="flex items-center gap-1"><Maximize size={14} className="text-emerald-600/70" />{p.size_sqm} m²</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <footer className="bg-[#f7f5ef] py-10 border-t border-[#e6e2d8] mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-[#9c948a]">
          © 2026 Keja Yangu Ltd. All rights reserved.
        </div>
      </footer>
    </div>
  );
}