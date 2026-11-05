"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser, RedirectToSignIn } from "@clerk/nextjs";
import { createAuthClient_FreePlan } from "@/lib/supabase/client";
import Link from "next/link";
import {
  Plus, Pencil, Trash2, MapPin, BedDouble, Bath,
  Maximize, Eye, ArrowRight, AlertCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";

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
};

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
          .select("id, title, price, location, property_type, listing_type, status, bedrooms, bathrooms, size_sqm, images, created_at")
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
            <div className="text-8xl mb-6 opacity-20">🏠</div>
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
                    <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <div className="text-6xl opacity-20">🏠</div>
                      <p className="text-xs text-[#b3aca0] mt-1">No photo</p>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${STATUS_STYLES[p.status] || STATUS_STYLES["Available"]}`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${p.listing_type === "Rent" ? "bg-emerald-600 text-white" : "bg-[#1a2420] text-white"}`}>
                      For {p.listing_type}
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
                    Listed {new Date(p.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                  </p>

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

      <footer className="bg-white py-10 border-t border-[#e6e2d8] mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-[#9c948a]">
          © 2026 Keja Yangu Ltd. All rights reserved.
        </div>
      </footer>
    </div>
  );
}