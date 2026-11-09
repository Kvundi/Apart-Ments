"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser, RedirectToSignIn } from "@clerk/nextjs";
import { createAuthClient_FreePlan } from "@/lib/supabase/client";
import Link from "next/link";
import {
  Plus, Pencil, Trash2, MapPin, BedDouble, Bath,
  Maximize, Eye, ArrowRight, AlertCircle, ImageOff, Home,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";

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
  created_at: string;
  verification_status: string | null;
  admin_notes: string | null;
};

/** What the team's review means for the owner. */
function reviewBadge(status: string | null): { label: string; cls: string; hint: string } {
  switch (status) {
    case "approved":
    case "verified":
      return { label: "Live", cls: "bg-emerald-600 text-white", hint: "Approved and visible to the public." };
    case "rejected":
    case "changes_requested":
      return { label: "Needs changes", cls: "bg-rose-600 text-white", hint: "Our team needs changes before this can go live." };
    default:
      return { label: "In review", cls: "bg-amber-400 text-[#1a2420]", hint: "Our team is reviewing this listing — usually within 24 hours." };
  }
}

const STATUS_OPTIONS = ["Available", "Under Offer", "Sold", "Rented"];

const STATUS_STYLES: Record<string, string> = {
  Available:     "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Under Offer": "bg-amber-50 text-amber-700 border-amber-200",
  Sold:          "bg-[#f7f5ef] text-[#6b6358] border-[#e6e2d8]",
  Rented:        "bg-[#f7f5ef] text-[#6b6358] border-[#e6e2d8]",
};

export default function MyListingsPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [deleting,   setDeleting]   = useState<string | null>(null);
  const [error,      setError]      = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    const userId = user.id;

    async function fetchMyListings() {
      try {
        const supabase = await createAuthClient_FreePlan(getToken);
        const { data, error } = await supabase
          .from("properties")
          .select("id, title, price, location, property_type, listing_type, status, bedrooms, bathrooms, size_sqm, images, created_at, verification_status, admin_notes")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) {
          setError("Could not load your listings. Please try again.");
        } else {
          setProperties((data as Property[]) || []);
        }
      } catch {
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchMyListings();
  }, [isLoaded, isSignedIn, user, getToken]);

  const [updating, setUpdating] = useState<string | null>(null);
  const handleStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const supabase = await createAuthClient_FreePlan(getToken);
      const { error } = await supabase.from("properties").update({ status }).eq("id", id).eq("user_id", user?.id ?? "");
      if (error) alert(`Couldn't update status: ${error.message}`);
      else setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${title}"?\nThis cannot be undone.`);
    if (!confirmed) return;

    setDeleting(id);
    try {
      const supabase = await createAuthClient_FreePlan(getToken);
      const { error } = await supabase.from("properties").delete().eq("id", id).eq("user_id", user?.id ?? "");
      if (error) {
        alert(`Delete failed: ${error.message}`);
      } else {
        setProperties((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      alert("Something went wrong while deleting.");
    } finally {
      setDeleting(null);
    }
  };

  if (!isLoaded) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!isSignedIn) return <RedirectToSignIn />;

  const SkeletonCard = () => (
    <div className="bg-white border border-[#e6e2d8] rounded-3xl overflow-hidden animate-pulse">
      <div className="h-44 bg-[#f7f5ef]" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-[#f7f5ef] rounded w-3/4" />
        <div className="h-4 bg-[#f7f5ef] rounded w-1/2" />
        <div className="h-4 bg-[#f7f5ef] rounded w-1/3" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-[#1a2420]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">My Listings</h1>
            <p className="text-[#6b6358] mt-1">
              {loading ? "Loading your properties…" : `${properties.length} propert${properties.length === 1 ? "y" : "ies"} listed`}
            </p>
          </div>
          <Link href="/add" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3 rounded-2xl transition-colors shrink-0">
            <Plus size={20} />Add New Listing
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-8">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && properties.length === 0 && !error && (
          <div className="text-center py-24 bg-white border border-[#e6e2d8] rounded-3xl">
            <Home size={56} className="mx-auto mb-6 text-emerald-700/40" />
            <h2 className="text-2xl font-bold mb-3">No listings yet</h2>
            <p className="text-[#6b6358] mb-8 max-w-sm mx-auto">
              You haven&apos;t listed any properties yet. Add your first one and start reaching buyers and tenants.
            </p>
            <Link href="/add" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-4 rounded-2xl transition-colors">
              <Plus size={20} />List Your First Property
            </Link>
          </div>
        )}

        {/* Grid */}
        {!loading && properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => (
              <div key={p.id} className="bg-white border border-[#e6e2d8] rounded-3xl overflow-hidden hover:border-emerald-200 hover:shadow-lg transition-all duration-300 flex flex-col">

                {/* Image */}
                <div className="h-44 bg-[#f7f5ef] relative flex items-center justify-center overflow-hidden">
                  {p.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element -- remote Supabase URL
                    <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="text-center text-[#b3aca0]">
                      <ImageOff size={36} className="mx-auto opacity-60" />
                      <p className="text-xs mt-1">No photo</p>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${STATUS_STYLES[p.status] || STATUS_STYLES["Available"]}`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3" title={reviewBadge(p.verification_status).hint}>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full shadow-sm ${reviewBadge(p.verification_status).cls}`}>
                      {reviewBadge(p.verification_status).label}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-semibold text-base line-clamp-2 mb-1.5 text-[#1a2420]">{p.title}</h3>
                  <p className="text-emerald-600 text-xl font-bold">
                    KSh {p.price?.toLocaleString()}
                    {p.listing_type === "Rent" && <span className="text-sm font-normal text-[#6b6358]"> /mo</span>}
                  </p>
                  <p className="text-[#6b6358] mt-1.5 flex items-center gap-1 text-sm">
                    <MapPin size={14} className="shrink-0" />{p.location}
                  </p>
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#e6e2d8] text-sm text-[#6b6358]">
                    {p.bedrooms !== null && <span className="flex items-center gap-1"><BedDouble size={14} className="text-emerald-600/70" />{p.bedrooms === 0 ? "Studio" : `${p.bedrooms} bed`}</span>}
                    {p.bathrooms !== null && <span className="flex items-center gap-1"><Bath size={14} className="text-emerald-600/70" />{p.bathrooms} bath</span>}
                    {p.size_sqm !== null && <span className="flex items-center gap-1"><Maximize size={14} className="text-emerald-600/70" />{p.size_sqm} m²</span>}
                  </div>
                  <p className="text-xs text-[#9c948a] mt-3">
                    For {p.listing_type} · Listed {new Date(p.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                  </p>

                  {p.admin_notes && (
                    <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
                      <p className="font-semibold mb-0.5">Note from the Apart Ments team</p>
                      <p className="whitespace-pre-line">{p.admin_notes}</p>
                    </div>
                  )}

                  <label className="mt-3 flex items-center justify-between gap-3 text-sm">
                    <span className="text-[#6b6358]">Availability</span>
                    <select
                      value={p.status}
                      disabled={updating === p.id}
                      onChange={(e) => handleStatus(p.id, e.target.value)}
                      aria-label={`Availability of ${p.title}`}
                      className="px-3 py-1.5 rounded-lg border border-[#e6e2d8] bg-white text-sm disabled:opacity-50"
                    >
                      {STATUS_OPTIONS.map((o) => (
                        <option key={o} value={o}>{o === "Rented" ? "Let / Rented" : o}</option>
                      ))}
                    </select>
                  </label>
                  {p.status !== "Available" && (
                    <p className="text-xs text-[#9c948a] mt-1">Hidden from search while not available.</p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-[#e6e2d8]">
                    <Link href={`/properties/${p.id}`} className="flex items-center justify-center gap-1.5 flex-1 py-2.5 rounded-xl border border-[#e6e2d8] hover:bg-[#f7f5ef] text-sm font-medium text-[#1a2420] transition-colors">
                      <Eye size={15} />View
                    </Link>
                    <Link href={`/add?edit=${p.id}`} className="flex items-center justify-center gap-1.5 flex-1 py-2.5 rounded-xl border border-[#e6e2d8] hover:bg-[#f7f5ef] text-sm font-medium text-[#1a2420] transition-colors">
                      <Pencil size={15} />Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.title)}
                      disabled={deleting === p.id}
                      className="flex items-center justify-center gap-1.5 flex-1 py-2.5 rounded-xl border border-red-200 hover:bg-red-50 text-sm font-medium text-red-600 transition-colors disabled:opacity-50"
                    >
                      {deleting === p.id
                        ? <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        : <Trash2 size={15} />}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && properties.length > 0 && (
          <div className="mt-10 text-center">
            <Link href="/add" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold hover:underline">
              <Plus size={18} />Add another listing<ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}