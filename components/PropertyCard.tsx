import Link from "next/link";
import { MapPin, BedDouble, Bath, Maximize, BadgeCheck } from "lucide-react";
import SaveHomeButton from "@/components/SaveHomeButton";
import { daysOnSite, NEW_LISTING_DAYS, type PropertyCardData } from "@/lib/listing";

// Re-exported so pages can keep importing these from the card.
export { toCardData, type PropertyCardData } from "@/lib/listing";

/** Zillow-style result card: photo with badges + save heart, price first, then facts and location. */
export default function PropertyCard({ p }: { p: PropertyCardData }) {
  const isRent = p.listing_type === "Rent";
  const days = daysOnSite(p.created_at);
  const isNew = days !== null && days <= NEW_LISTING_DAYS;
  const pricePerSqm =
    !isRent && p.size_sqm && p.size_sqm > 0 && p.price ? Math.round(p.price / p.size_sqm) : null;

  return (
    <div className="group relative rounded-3xl overflow-hidden bg-white border border-[#e6e2d8] hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col">
      <Link href={`/properties/${p.id}`} className="flex flex-col flex-1">
        <div className="h-48 bg-[#f7f5ef] relative flex items-center justify-center overflow-hidden">
          {p.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element -- remote Supabase URLs, no loader configured
            <img
              src={p.images[0]}
              alt={p.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="text-6xl opacity-20">🏠</div>
          )}
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${isRent ? "bg-emerald-600 text-white" : "bg-[#1a2420] text-white"}`}>
              For {p.listing_type}
            </span>
            {isNew && (
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-400 text-[#1a2420]">New</span>
            )}
          </div>
          {p.verified && (
            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-white/95 text-emerald-700 shadow-sm">
              <BadgeCheck size={14} /> Verified
            </span>
          )}
          {p.images.length > 1 && (
            <span className="absolute bottom-3 right-3 px-2 py-0.5 text-xs rounded-md bg-black/60 text-white">
              {p.images.length} photos
            </span>
          )}
        </div>
        <div className="p-5 flex flex-col flex-1">
          <p className="text-emerald-600 text-xl font-bold">
            KSh {p.price?.toLocaleString()}
            {isRent && <span className="text-sm font-normal text-[#6b6358]"> /mo</span>}
          </p>
          <div className="flex items-center gap-3 mt-1 text-sm text-[#1a2420]">
            {p.bedrooms  !== null && <span className="flex items-center gap-1"><BedDouble size={14} className="text-emerald-600/70" />{p.bedrooms === 0 ? "Studio" : `${p.bedrooms} bd`}</span>}
            {p.bathrooms !== null && <span className="flex items-center gap-1"><Bath size={14} className="text-emerald-600/70" />{p.bathrooms} ba</span>}
            {p.size_sqm  !== null && <span className="flex items-center gap-1"><Maximize size={14} className="text-emerald-600/70" />{p.size_sqm} m²</span>}
            <span className="text-[#6b6358]">· {p.property_type}</span>
          </div>
          <h3 className="font-semibold text-sm line-clamp-1 mt-2 text-[#1a2420] group-hover:text-emerald-600 transition-colors">
            {p.title}
          </h3>
          <p className="text-[#6b6358] mt-1 flex items-center gap-1 text-sm">
            <MapPin size={14} className="shrink-0" />
            <span className="truncate">{p.location}</span>
          </p>
          {(pricePerSqm || days !== null) && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#e6e2d8] text-xs text-[#6b6358]">
              <span>{pricePerSqm ? `KSh ${pricePerSqm.toLocaleString()}/m²` : ""}</span>
              {days !== null && <span>{days === 0 ? "Listed today" : `${days} day${days === 1 ? "" : "s"} on Keja Yangu`}</span>}
            </div>
          )}
        </div>
      </Link>
      {/* Outside the <Link> so it's not a button nested inside an anchor */}
      <SaveHomeButton propertyId={p.id} variant="overlay" className="absolute top-3 right-3" />
    </div>
  );
}
