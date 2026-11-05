// app/properties/[id]/page.tsx

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import ImageGallery from "@/components/ImageGallery";
import {
  MapPin, BedDouble, Bath, Maximize, CheckCircle2,
  Phone, MessageCircle, Share2, Heart, ArrowLeft,
  Calendar, Shield,
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

  // Safely parse images — handles array or JSON string
  const images: string[] = Array.isArray(p.images)
    ? p.images
    : typeof p.images === "string"
    ? JSON.parse(p.images)
    : [];

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
                </div>
                <h1 className="text-2xl md:text-3xl font-bold leading-tight">{p.title}</h1>
                <p className="flex items-center gap-1.5 text-[#6b6358] mt-2">
                  <MapPin size={16} className="shrink-0 text-emerald-600" />
                  {p.address ? `${p.address}, ${p.location}` : p.location}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="p-2.5 rounded-xl border border-[#e6e2d8] hover:bg-[#f7f5ef] transition-colors">
                  <Heart size={20} className="text-[#6b6358]" />
                </button>
                <button className="p-2.5 rounded-xl border border-[#e6e2d8] hover:bg-[#f7f5ef] transition-colors">
                  <Share2 size={20} className="text-[#6b6358]" />
                </button>
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
              </div>
              <div className="flex items-center gap-1.5 text-sm text-[#6b6358]">
                <Calendar size={15} />
                Listed {listedDate}
              </div>
            </div>

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
              <div className="mt-3 h-52 rounded-2xl bg-[#e6e2d8] flex items-center justify-center text-[#9c948a] text-sm">
                🗺️ Map coming soon
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
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Hi, I'm interested in "${p.title}" on Keja Yangu`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5c] text-white font-semibold py-4 rounded-2xl transition-colors mb-3"
                >
                  <MessageCircle size={20} />
                  Chat on WhatsApp
                </a>
                <button className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-4 rounded-2xl transition-colors mb-3">
                  <Phone size={20} />
                  Call Agent
                </button>
                <button className="w-full flex items-center justify-center gap-2 border border-[#e6e2d8] hover:bg-[#f7f5ef] text-[#1a2420] font-semibold py-4 rounded-2xl transition-colors">
                  Send Enquiry
                </button>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <Shield size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-800 mb-1">Stay safe</p>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      Never send money before viewing a property in person.
                      Meet in a public place for first contact.
                    </p>
                  </div>
                </div>
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