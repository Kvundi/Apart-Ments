"use client";

import { createClient } from "@/lib/supabase/client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { MapPin, Edit3, Trash2, Eye, Clock } from "lucide-react";
import Link from "next/link";

type Property = {
  id: string;
  title: string;
  price: number;
  location: string;
  property_type: string;
  bedrooms?: number;
  bathrooms?: number;
  images?: string[];
  created_at: string;
};

export default function MyListings() {
  const { user, isLoaded } = useUser();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    async function fetchMyListings() {
      const supabase = createClient();
      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      setProperties(data || []);
      setLoading(false);
    }

    fetchMyListings();
  }, [user, isLoaded]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    setDeletingId(id);
    const supabase = createClient();

    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Failed to delete listing");
    } else {
      setProperties(properties.filter(p => p.id !== id));
      alert("Listing deleted successfully");
    }
    setDeletingId(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  if (!isLoaded) return <div className="min-h-screen bg-[#0f1a17] flex items-center justify-center">Loading...</div>;
  if (!user) return <div className="min-h-screen bg-[#0f1a17] flex items-center justify-center text-white">Please sign in</div>;

  return (
    <div className="min-h-screen bg-[#0f1a17] text-[#f1ede6] pb-12">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold">My Listings</h1>
            <p className="text-[#c8b8a8] mt-2">{properties.length} properties</p>
          </div>
          <Link 
            href="/add" 
            className="bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-2xl flex items-center gap-2 font-medium"
          >
            + List New Property
          </Link>
        </div>

        {loading ? (
          <p className="text-center py-20">Loading your listings...</p>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-[#c8b8a8]">No listings yet</p>
            <Link href="/add" className="mt-8 inline-block bg-emerald-600 hover:bg-emerald-500 px-8 py-4 rounded-2xl">
              List Your First Property
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((p) => (
              <div key={p.id} className="card rounded-3xl overflow-hidden group">
                <div className="h-56 bg-zinc-800 relative">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl opacity-30">🏡</div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="font-semibold text-lg line-clamp-2">{p.title}</h3>
                  <p className="text-emerald-400 text-2xl font-bold mt-3">
                    KSh {p.price.toLocaleString()}
                  </p>
                  <p className="text-[#c8b8a8] mt-1 flex items-center gap-1">
                    <MapPin size={18} /> {p.location}
                  </p>
                  <p className="text-sm text-gray-400 mt-4">
                    Listed {formatDate(p.created_at)}
                  </p>

                  <div className="flex gap-3 mt-6">
                    <Link 
                      href={`/properties/${p.id}`}
                      className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-3 rounded-2xl text-center text-sm flex items-center justify-center gap-2"
                    >
                      <Eye size={18} /> View
                    </Link>

                    <Link 
                      href={`/add?edit=${p.id}`} 
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-3 rounded-2xl text-center text-sm flex items-center justify-center gap-2"
                    >
                      <Edit3 size={18} /> Edit
                    </Link>

                    <button 
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-3 rounded-2xl transition disabled:opacity-50"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}