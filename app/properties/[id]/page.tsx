// app/properties/[id]/page.tsx

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import ImageGallery from "@/components/ImageGallery";
import CallAgentButton from "@/components/CallAgentButton";
import { toE164, toWhatsAppNumber, formatPhone } from "@/lib/phone";
import { getDummyContact, placeholderContactsEnabled } from "@/lib/dummyContacts";
import { parseImages, daysOnSite, isVerifiedListing, getCoords } from "@/lib/listing";
import SaveHomeButton from "@/components/SaveHomeButton";
import ShareButton from "@/components/ShareButton";
import PaymentEstimate from "@/components/PaymentEstimate";
import ReportListingButton from "@/components/ReportListingButton";
import PropertyCard, { toCardData, type PropertyCardData } from "@/components/PropertyCard";
import { ApproxLocationMap } from "@/components/map";
import {
  MapPin, BedDouble, Bath, Maximize, CheckCircle2,
  MessageCircle, Phone, ArrowLeft,
  Calendar, Shield, BadgeCheck, PhoneOff,
} from "lucide-react";
import Link from "next/link";

type Property = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  location: string;
  address: string | null;
  property_type: string;
  listing_type: string;
  status: string;
  bedrooms: number | null;
  bathrooms: number | null;
  size_sqm: number | null;
  images: string[] | null;
  amenities: string[] | null;
  user_id: string;
  created_at: string;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  preferred_contact: string | null;
  verification_status?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !property) notFound();

  const p = property as Property;
  const isRent = p.listing_type === "Rent" || p.property_type === "For Rent";
  const formattedPrice = typeof p.price === "number" ? p.price.toLocaleString() : "Price on request";
  const listedDate = new Date(p.created_at).toLocaleDateString("en-KE", {
    day: "numeric", month: "long", year: "numeric",
  });

  // Owner contact: each listing carries its own owner's name + phone.
  // Older listings without them fall back to the lister's profile.
  let ownerName = p.contact_name?.trim() || null;
  let phone = toE164(p.contact_phone);
  if ((!ownerName || !phone) && p.user_id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, phone")
      .eq("user_id", p.user_id)
      .maybeSingle();
    ownerName ??= profile?.display_name?.trim() || null;
    phone ??= toE164(profile?.phone);
  }
  // Placeholder owners fill gaps in development only (see lib/dummyContacts.ts).
  const dummy = placeholderContactsEnabled() ? getDummyContact(p.id) : null;
  const owner: string | null = ownerName ?? dummy?.name ?? null;
  const ownerPhone: string | null = phone ?? dummy?.phone ?? null;
  const ownerInitials = owner
    ? owner.split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("")
    : "KY";
  const whatsappText = encodeURIComponent(
    `Hi${owner ? ` ${owner.split(/\s+/)[0]}` : ""}, I'm interested in "${p.title}" on Keja Yangu (ref ${p.id.slice(0, 8)})`
  );
  const whatsappHref = ownerPhone ? `https://wa.me/${toWhatsAppNumber(ownerPhone)}?text=${whatsappText}` : null;
  const verified = isVerifiedListing(p.verification_status);
  const coords = getCoords(p);

  const images = parseImages(p.images);
  const days = daysOnSite(p.created_at);
  const pricePerSqm =
    !isRent && p.size_sqm && p.size_sqm > 0 && typeof p.price === "number"
      ? Math.round(p.price / p.size_sqm)
      : null;

  // Similar homes (Zillow "Similar homes" / "Nearby homes"): same Sale/Rent, ranked by
  // same area, same property type, then closest price.
  const { data: candidates } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "Available")
    .eq("listing_type", p.listing_type)
    .neq("id", p.id)
    .order("created_at", { ascending: false })
    .limit(24);
  const area = p.location.split(",")[0].trim().toLowerCase();
  const similar: PropertyCardData[] = (candidates ?? [])
    .map((row) => toCardData(row))
    .map((c) => ({
      c,
      score:
        (area && c.location.toLowerCase().includes(area) ? 2 : 0) +
        (c.property_type === p.property_type ? 1 : 0) -
        (p.price ? Math.abs(c.price - p.price) / p.price : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ c }) => c);

  return (
    <div className="min-h-screen bg-white text-[#1a2420]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-6">
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 text-[#6b6358] hover:text-emerald-600 transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Back to listings
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── Left column ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Image gallery — fully interactive lightbox */}
            <ImageGallery images={images} title={p.title} />

            {/* Title row */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${isRent ? "bg-emerald-600 text-white" : "bg-[#1a2420] text-white"}`}>
                    For {isRent ? "Rent" : "Sale"}
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                    p.status === "Available"
                      ? "border-emerald-400 text-emerald-700 bg-emerald-50"
                      : "border-[#e6e2d8] text-[#6b6358]"
                  }`}>
                    {p.status}
                  </span>
                  <span className="px-3 py-1 text-xs rounded-full bg-[#f7f5ef] text-[#6b6358] border border-[#e6e2d8]">
                    {p.property_type}
                  </span>
                  {verified && (
                    <span
                      title="The Keja Yangu team has reviewed this listing"
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300"
                    >
                      <BadgeCheck size={14} /> Verified listing
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold leading-tight">{p.title}</h1>
                <p className="flex items-center gap-1.5 text-[#6b6358] mt-2">
                  <MapPin size={16} className="shrink-0 text-emerald-600" />
                  {p.address ? `${p.address}, ${p.location}` : p.location}
                </p>
              </div>
              <div className="flex gap-2">
                <SaveHomeButton propertyId={p.id} />
                <ShareButton title={p.title} />
              </div>
            </div>

            {/* Price */}
            <div className="bg-[#f7f5ef] rounded-2xl px-6 py-5 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-[#6b6358] mb-1">Asking price</p>
                <p className="text-3xl font-bold text-emerald-600">
                  KSh {formattedPrice}
                  {isRent && <span className="text-lg font-normal text-[#6b6358]"> / month</span>}
                </p>
                {pricePerSqm && (
                  <p className="text-sm text-[#6b6358] mt-1">KSh {pricePerSqm.toLocaleString()} per m²</p>
                )}
              </div>
              <div className="text-sm text-[#6b6358] text-right">
                <p className="flex items-center gap-1.5 justify-end">
                  <Calendar size={15} />
                  Listed {listedDate}
                </p>
                {days !== null && (
                  <p className="mt-1">
                    {days === 0 ? "New today" : `${days} day${days === 1 ? "" : "s"} on Keja Yangu`}
                  </p>
                )}
              </div>
            </div>

            {/* Monthly payment (sale) / move-in cost (rent) */}
            {typeof p.price === "number" && <PaymentEstimate price={p.price} isRent={isRent} />}

            {/* Specs */}
            <div>
              <h2 className="text-xl font-bold mb-4">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {p.bedrooms !== null && (
                  <SpecCard
                    icon={<BedDouble size={22} className="text-emerald-600" />}
                    label="Bedrooms"
                    value={p.bedrooms === 0 ? "Studio" : `${p.bedrooms}`}
                  />
                )}
                {p.bathrooms !== null && (
                  <SpecCard
                    icon={<Bath size={22} className="text-emerald-600" />}
                    label="Bathrooms"
                    value={`${p.bathrooms}`}
                  />
                )}
                {p.size_sqm !== null && (
                  <SpecCard
                    icon={<Maximize size={22} className="text-emerald-600" />}
                    label="Size"
                    value={`${p.size_sqm} m²`}
                  />
                )}
                <SpecCard
                  icon={<Shield size={22} className="text-emerald-600" />}
                  label="Type"
                  value={p.property_type}
                />
              </div>
            </div>

            {/* Description */}
            {p.description && (
              <div>
                <h2 className="text-xl font-bold mb-4">About this property</h2>
                <p className="text-[#5c554a] leading-relaxed whitespace-pre-line">
                  {p.description}
                </p>
              </div>
            )}

            {/* Amenities */}
            {p.amenities && p.amenities.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Amenities & Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {p.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2.5 p-3 rounded-xl border border-[#e6e2d8] bg-white">
                      <CheckCircle2 size={17} className="text-emerald-500 shrink-0" />
                      <span className="text-sm">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            <div>
              <h2 className="text-xl font-bold mb-4">Location</h2>
              <div className="bg-[#f7f5ef] rounded-2xl p-5 flex items-center gap-3 border border-[#e6e2d8]">
                <MapPin size={20} className="text-emerald-600 shrink-0" />
                <div>
                  <p className="font-medium">{p.address || p.location}</p>
                  <p className="text-sm text-[#6b6358]">{p.location}</p>
                </div>
              </div>
              <div className="mt-3">
                {coords ? (
                  <>
                    <ApproxLocationMap coords={coords} seed={p.id} />
                    <p className="text-xs text-[#9c948a] mt-2">
                      Approximate area shown. Get the exact location from the owner when you book a viewing.
                    </p>
                  </>
                ) : (
                  <div className="h-40 rounded-2xl bg-[#f7f5ef] border border-dashed border-[#e6e2d8] flex items-center justify-center text-[#9c948a] text-sm px-6 text-center">
                    The owner hasn&apos;t added a map pin for this listing yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Right column — contact panel ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">

              <div className="bg-white border border-[#e6e2d8] rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-1">Interested in this property?</h3>
                <p className="text-sm text-[#6b6358] mb-5">
                  Contact the owner or agent directly — no middlemen.
                </p>

                {/* Listed by */}
                <div className="p-4 mb-4 rounded-2xl bg-[#f7f5ef] border border-[#e6e2d8]">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#6b6358] mb-3">Listed by</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-600 text-white text-lg font-bold flex items-center justify-center shrink-0">
                      {ownerInitials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-base truncate">{owner ?? "Property owner"}</p>
                      {ownerPhone ? (
                        <a
                          href={`tel:${ownerPhone}`}
                          className="inline-flex items-center gap-1.5 text-sm text-emerald-700 hover:text-emerald-600 font-medium"
                        >
                          <Phone size={14} />
                          {formatPhone(ownerPhone)}
                        </a>
                      ) : (
                        <p className="inline-flex items-center gap-1.5 text-sm text-[#9c948a]">
                          <PhoneOff size={14} /> No phone number added yet
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {whatsappHref && ownerPhone ? (
                  <>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5c] text-white font-semibold py-4 rounded-2xl transition-colors mb-3"
                    >
                      <MessageCircle size={20} />
                      Chat on WhatsApp
                    </a>
                    <CallAgentButton phone={ownerPhone} name={owner ?? "owner"} />
                  </>
                ) : (
                  <p className="text-sm text-[#6b6358] bg-[#f7f5ef] rounded-2xl p-4">
                    This lister hasn&apos;t shared contact details yet. Save the home and check back, or{" "}
                    <Link href="/properties" className="text-emerald-700 font-semibold hover:underline">browse similar listings</Link>.
                  </p>
                )}
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <Shield size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-800 mb-1">Stay safe</p>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      Never pay a viewing fee or send a deposit before you have viewed the
                      property in person and confirmed who owns it.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <ReportListingButton propertyId={p.id} />
              </div>

              <div className="bg-[#f7f5ef] rounded-2xl p-5 border border-[#e6e2d8]">
                <h4 className="text-sm font-semibold mb-3">Quick summary</h4>
                <div className="space-y-0">
                  {[
                    ["Price",     `KSh ${formattedPrice}${isRent ? "/mo" : ""}`],
                    ["Type",      p.property_type],
                    ["Status",    p.status],
                    p.bedrooms  !== null ? ["Bedrooms",  p.bedrooms === 0 ? "Studio" : `${p.bedrooms}`] : null,
                    p.bathrooms !== null ? ["Bathrooms", `${p.bathrooms}`] : null,
                    p.size_sqm  !== null ? ["Size",      `${p.size_sqm} m²`] : null,
                    ["Listed",    listedDate],
                  ].filter((row): row is string[] => row !== null).map(([label, value]) => (
                    <div
                      key={label as string}
                      className="flex items-center justify-between py-2 text-sm border-b border-[#e6e2d8] last:border-0"
                    >
                      <span className="text-[#6b6358]">{label as string}</span>
                      <span className="font-medium text-right max-w-[55%] truncate">
                        {value as string}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Similar homes */}
        {similar.length > 0 && (
          <section className="mt-16">
            <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
              <h2 className="text-2xl font-bold">Similar homes {isRent ? "for rent" : "for sale"}</h2>
              <Link
                href={`/properties?type=${isRent ? "rent" : "sale"}&location=${encodeURIComponent(p.location.split(",")[0].trim())}`}
                className="text-sm font-semibold text-emerald-600 hover:underline"
              >
                See more in {p.location.split(",")[0].trim()} →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {similar.map((s) => <PropertyCard key={s.id} p={s} />)}
            </div>
          </section>
        )}
      </div>

      <footer className="bg-[#f7f5ef] py-10 border-t border-[#e6e2d8] mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-[#9c948a]">
          © 2026 Keja Yangu Ltd. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function SpecCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[#f7f5ef] border border-[#e6e2d8] rounded-2xl p-4 flex flex-col items-center text-center gap-2">
      {icon}
      <span className="text-lg font-bold">{value}</span>
      <span className="text-xs text-[#6b6358] uppercase tracking-wide">{label}</span>
    </div>
  );
}