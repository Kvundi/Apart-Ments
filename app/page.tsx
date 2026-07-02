import Link from "next/link";
import { MapPin, Search, BedDouble, Bath, Maximize, ShieldCheck, TrendingUp, Users } from "lucide-react";
import AuthButtons from "@/components/AuthButtons";
import { createClient } from "@/lib/supabase/server";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Property = {
  id: number | string;
  title: string;
  price: number;
  location: string;
  property_type: string; // "For Sale" | "For Rent"
  bedrooms: number;
  bathrooms?: number;
  area_sqm?: number;
  images: string[] | null;
  is_new?: boolean;
};

export default async function HomePage() {
  const supabase = await createClient();

  // Try to fetch real data from Supabase first.
  const { data: dbProperties } = await supabase
    .from("properties")
    .select(
      "id, title, price, location, property_type, bedrooms, bathrooms, area_sqm, images"
    )
    .eq("status", "Available")
    .order("created_at", { ascending: false })
    .limit(8);

  // Fallback placeholder data — used only when the database has nothing yet.
  // This keeps the homepage looking complete even on a brand-new deployment.
  const placeholderProperties: Property[] = [
    { id: 1, title: "4 Bedroom Villa in Karen", price: 28500000, location: "Karen, Nairobi", property_type: "For Sale", bedrooms: 4, bathrooms: 4, area_sqm: 320, images: null },
    { id: 2, title: "Modern 3 Bedroom Apartment", price: 95000, location: "Westlands, Nairobi", property_type: "For Rent", bedrooms: 3, bathrooms: 2, area_sqm: 140, images: null, is_new: true },
    { id: 3, title: "5 Bedroom Family Home", price: 42000000, location: "Runda, Nairobi", property_type: "For Sale", bedrooms: 5, bathrooms: 5, area_sqm: 420, images: null },
    { id: 4, title: "Stylish 2 Bedroom Apartment", price: 120000, location: "Kilimani, Nairobi", property_type: "For Rent", bedrooms: 2, bathrooms: 2, area_sqm: 95, images: null },
    { id: 5, title: "2 Bedroom Apartment in Lang'ata", price: 65000, location: "Lang'ata, Nairobi", property_type: "For Rent", bedrooms: 2, bathrooms: 1, area_sqm: 80, images: null, is_new: true },
    { id: 6, title: "3 Bedroom Maisonette", price: 18500000, location: "Thika Road, Nairobi", property_type: "For Sale", bedrooms: 3, bathrooms: 3, area_sqm: 210, images: null },
    { id: 7, title: "Luxury 4 Bedroom Villa", price: 55000000, location: "Nyali, Mombasa", property_type: "For Sale", bedrooms: 4, bathrooms: 4, area_sqm: 380, images: null },
    { id: 8, title: "Studio Apartment", price: 35000, location: "Kileleshwa, Nairobi", property_type: "For Rent", bedrooms: 0, bathrooms: 1, area_sqm: 38, images: null, is_new: true },
  ];

  // Use real data when we have it, otherwise fall back to placeholders.
  const properties: Property[] =
    dbProperties && dbProperties.length > 0
      ? (dbProperties as Property[])
      : placeholderProperties;

  const featured = properties.slice(0, 4);
  const recent = properties.slice(4, 8);

  const cities = [
    { name: "Nairobi", count: "14,820", gradient: "from-emerald-100 to-white" },
    { name: "Mombasa", count: "3,410", gradient: "from-cyan-100 to-white" },
    { name: "Kisumu", count: "1,640", gradient: "from-amber-100 to-white" },
    { name: "Nakuru", count: "980", gradient: "from-violet-100 to-white" },
  ];

  return (
    <div className="min-h-screen bg-white text-[#1a2420]">
      {/* ===================================================================
          NAVBAR
      =================================================================== */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-[#e6e2d8] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-emerald-600 rounded-2xl flex items-center justify-center text-3xl shadow-md shadow-emerald-900/10 group-hover:bg-emerald-500 transition-colors">
              🏠
            </div>
            <span className="text-3xl font-bold tracking-tight text-[#1a2420]">Keja Yangu</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-base text-[#5c554a]">
            <Link href="/properties?type=sale" className="hover:text-emerald-600 transition-colors">
              Buy
            </Link>
            <Link href="/properties?type=rent" className="hover:text-emerald-600 transition-colors">
              Rent
            </Link>
            <Link href="/add" className="hover:text-emerald-600 transition-colors">
              Sell
            </Link>
            <Link href="#" className="hover:text-emerald-600 transition-colors">
              Find an Agent
            </Link>
            <Link href="#" className="hover:text-emerald-600 transition-colors">
              Manage Rentals
            </Link>
            <Link href="#" className="hover:text-emerald-600 transition-colors">
              Get Help
            </Link>
          </div>

          <AuthButtons />
        </div>
      </nav>

      {/* ===================================================================
          HERO
      =================================================================== */}
      <section className="relative min-h-[560px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#1a3a6e] to-[#0f2d55]">
        {/* Dummy background photo, light-blue tint via low opacity — matches the
            original Keja Yangu hero treatment */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.18]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80')",
          }}
        />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* Small trust badge above the headline — builds credibility fast */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 text-sm text-white/90">
            <ShieldCheck size={16} className="text-emerald-300" />
            Kenya&apos;s most trusted property marketplace
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-[1.05] text-white">
            Find homes you&apos;ll{" "}
            <span className="text-emerald-300">love</span> in Kenya
          </h1>
          <p className="text-xl md:text-2xl text-white/70 mb-10 max-w-2xl mx-auto">
            Verified properties from real homeowners and agents — across all 47 counties.
          </p>

          {/* Search bar */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl p-2 shadow-2xl shadow-black/30">
              <div className="flex flex-col md:flex-row bg-[#f7f5ef] rounded-3xl overflow-hidden">
                <div className="flex-1 flex items-center px-6 py-5">
                  <Search className="text-emerald-600 mr-4 shrink-0" size={22} />
                  <input
                    type="text"
                    placeholder="Search by county, estate or neighbourhood..."
                    className="bg-transparent flex-1 outline-none text-lg text-[#1a2420] placeholder:text-[#9c948a]"
                  />
                </div>
                <Link
                  href="/properties"
                  className="bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] px-10 md:px-14 py-5 flex items-center justify-center font-semibold text-lg text-white rounded-3xl md:rounded-r-3xl md:rounded-l-none transition-all"
                >
                  Search Homes
                </Link>
              </div>
            </div>

            {/* Quick suggestion chips — easy first action for new visitors */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["Westlands", "Karen", "Kilimani", "Runda", "Nyali"].map((place) => (
                <Link
                  key={place}
                  href={`/properties?location=${encodeURIComponent(place)}`}
                  className="text-sm text-white/80 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-4 py-1.5 transition-colors"
                >
                  {place}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          STATS BAR — quick social proof right under the fold
      =================================================================== */}
      <div className="bg-[#f7f5ef] py-8 border-b border-[#e6e2d8]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <Stat value="24,300+" label="Active Listings" />
          <Stat value="1,200+" label="Verified Homeowners" />
          <Stat value="47" label="Counties Covered" />
          <Stat value="98%" label="Satisfaction Rate" />
        </div>
      </div>

      {/* ===================================================================
          FEATURED PROPERTIES
      =================================================================== */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <SectionHeader
          eyebrow="Hand-picked"
          title="Featured Properties"
          href="/properties"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map((p) => (
            <PropertyCard key={p.id} property={p} highlightBadge />
          ))}
        </div>
      </section>

      {/* ===================================================================
          EXPLORE BY CITY
      =================================================================== */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <SectionHeader
          eyebrow="Nationwide coverage"
          title="Explore by City"
          href="/properties"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {cities.map((city) => (
            <Link
              key={city.name}
              href={`/properties?location=${encodeURIComponent(city.name)}`}
              className={`group relative h-40 rounded-2xl overflow-hidden bg-gradient-to-br ${city.gradient} border border-[#e6e2d8] hover:border-emerald-400 transition-all duration-300 hover:-translate-y-1 flex items-end p-5`}
            >
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/0 transition-colors" />
              <div className="relative z-10">
                <p className="text-xl font-bold text-[#1a2420]">{city.name}</p>
                <p className="text-sm text-[#6b6358]">{city.count} listings</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===================================================================
          RECENTLY ADDED
      =================================================================== */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <SectionHeader
          eyebrow="Just listed"
          title="Recently Added"
          href="/properties"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {recent.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </section>

      {/* ===================================================================
          WHY KEJA YANGU — builds trust before the final CTA
      =================================================================== */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TrustCard
            icon={<ShieldCheck className="text-emerald-600" size={26} />}
            title="Verified listings"
            description="Every property is checked before it goes live, so you only browse real, available homes."
          />
          <TrustCard
            icon={<TrendingUp className="text-emerald-600" size={26} />}
            title="Fair market pricing"
            description="We surface up-to-date pricing trends so you know if a listing is a good deal."
          />
          <TrustCard
            icon={<Users className="text-emerald-600" size={26} />}
            title="Direct contact"
            description="Message homeowners and agents directly — no unnecessary middlemen or hidden fees."
          />
        </div>
      </section>

      {/* ===================================================================
          AGENT / OWNER CTA
      =================================================================== */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="relative overflow-hidden text-center bg-gradient-to-r from-emerald-50 to-[#f4f1e8] rounded-3xl px-6 py-16 border border-emerald-200">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a2420]">
              Own a property in Kenya?
            </h2>
            <p className="text-lg md:text-xl text-[#6b6358] mb-8 max-w-md mx-auto">
              List your property and reach thousands of serious buyers and tenants every day.
            </p>
            <Link
              href="/add"
              className="inline-block bg-[#1a2420] text-white font-semibold px-10 md:px-14 py-4 rounded-2xl text-lg hover:bg-[#2a352f] active:scale-[0.98] transition-all"
            >
              List Your Property for Free
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================================
          FOOTER
      =================================================================== */}
      <footer className="bg-[#f7f5ef] py-12 border-t border-[#e6e2d8]">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-[#9c948a]">
          © 2026 Keja Yangu Ltd. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small presentational components
// Kept in the same file for now since the project is still early-stage —
// move these into /components once the homepage stabilizes.
// ---------------------------------------------------------------------------

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-3xl md:text-4xl font-bold text-emerald-600">{value}</div>
      <div className="text-sm text-[#6b6358] mt-1">{label}</div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  href,
}: {
  eyebrow: string;
  title: string;
  href: string;
}) {
  return (
    <div className="flex justify-between items-end mb-10">
      <div>
        <p className="text-emerald-600 text-sm font-semibold uppercase tracking-wider mb-2">
          {eyebrow}
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1a2420]">{title}</h2>
      </div>
      <Link
        href={href}
        className="text-emerald-600 hover:text-emerald-700 hover:underline text-base font-medium transition-colors shrink-0"
      >
        See all →
      </Link>
    </div>
  );
}

function TrustCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white border border-[#e6e2d8] rounded-2xl p-6 shadow-sm shadow-black/[0.02]">
      <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2 text-[#1a2420]">{title}</h3>
      <p className="text-sm text-[#6b6358] leading-relaxed">{description}</p>
    </div>
  );
}

/**
 * A single property card used by both the Featured and Recently Added
 * sections. `highlightBadge` makes the "For Sale"/"For Rent" badge use
 * the emerald accent instead of the dark badge, used to make the Featured
 * row feel a touch more premium than Recently Added.
 */
function PropertyCard({
  property,
  highlightBadge = false,
}: {
  property: Property;
  highlightBadge?: boolean;
}) {
  const isRent = property.property_type === "For Rent";

  // Guard against missing/undefined prices so we never render "KSh undefined".
  const formattedPrice =
    typeof property.price === "number" ? property.price.toLocaleString() : "Price on request";

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group rounded-3xl overflow-hidden bg-white border border-[#e6e2d8] hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 flex flex-col"
    >
      {/* Image area */}
      <div className="h-56 bg-[#f7f5ef] relative flex items-center justify-center overflow-hidden">
        {property.images?.[0] ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="text-center">
            <div className="text-7xl mb-3 opacity-20">🏠</div>
            <span className="text-sm text-[#b3aca0]">Add Image Here</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              isRent
                ? "bg-emerald-600 text-white"
                : highlightBadge
                ? "bg-emerald-600 text-white"
                : "bg-[#1a2420] text-white"
            }`}
          >
            {property.property_type || "For Sale"}
          </span>
          {property.is_new && (
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white text-[#1a2420] border border-[#e6e2d8]">
              New
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-semibold text-lg line-clamp-2 mb-2 text-[#1a2420] group-hover:text-emerald-600 transition-colors">
          {property.title}
        </h3>

        <p className="text-emerald-600 text-2xl font-bold">
          KSh {formattedPrice}
          {isRent && <span className="text-base font-normal text-[#6b6358]"> /mo</span>}
        </p>

        <p className="text-[#6b6358] mt-2 flex items-center gap-1.5 text-sm">
          <MapPin size={16} className="shrink-0" />
          {property.location}
        </p>

        {/* Specs row — only render the icons we actually have data for */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#e6e2d8] text-sm text-[#6b6358]">
          <span className="flex items-center gap-1.5">
            <BedDouble size={16} className="text-emerald-600/70" />
            {property.bedrooms} {property.bedrooms === 1 ? "bed" : "beds"}
          </span>
          {property.bathrooms !== undefined && (
            <span className="flex items-center gap-1.5">
              <Bath size={16} className="text-emerald-600/70" />
              {property.bathrooms} {property.bathrooms === 1 ? "bath" : "baths"}
            </span>
          )}
          {property.area_sqm !== undefined && (
            <span className="flex items-center gap-1.5">
              <Maximize size={16} className="text-emerald-600/70" />
              {property.area_sqm} m²
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}