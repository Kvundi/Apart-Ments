"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Bed, Bath, Square, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Property = {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  property_type: string;
  bedrooms?: number;
  bathrooms?: number;
  size_sqm?: number;
  images?: string[];
};

export default function PropertyDetail() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    async function fetchProperty() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setProperty(data);
      }
      setLoading(false);
    }

    fetchProperty();
  }, [params.id]);

  if (loading) return <p className="text-center py-20">Loading property...</p>;
  if (!property) return <p className="text-center py-20">Property not found</p>;

  return (
    <div className="min-h-screen bg-[#0f1a17] text-[#f1ede6]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-[#c8b8a8] hover:text-white mb-8"
        >
          <ArrowLeft size={20} /> Back to Listings
        </button>

        {/* Image Gallery */}
        <div className="relative rounded-3xl overflow-hidden mb-10 bg-black">
          {property.images && property.images.length > 0 ? (
            <>
              <img 
                src={property.images[currentImage]} 
                alt={property.title}
                className="w-full h-[500px] object-cover"
              />
              
              {/* Navigation Buttons */}
              {property.images.length > 1 && (
                <>
                  <button 
                    onClick={() => setCurrentImage((prev) => (prev - 1 + property.images!.length) % property.images!.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 p-3 rounded-full"
                  >
                    ←
                  </button>
                  <button 
                    onClick={() => setCurrentImage((prev) => (prev + 1) % property.images!.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 p-3 rounded-full"
                  >
                    →
                  </button>
                </>
              )}

              {/* Thumbnails */}
              <div className="flex gap-3 p-4 overflow-x-auto bg-black/70">
                {property.images.map((img, index) => (
                  <img 
                    key={index}
                    src={img}
                    alt={`Photo ${index + 1}`}
                    onClick={() => setCurrentImage(index)}
                    className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 ${currentImage === index ? 'border-emerald-500' : 'border-transparent'}`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="h-[500px] flex items-center justify-center text-6xl opacity-30">🏡</div>
          )}
        </div>

        {/* Property Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold">{property.title}</h1>
            <p className="text-3xl font-bold text-emerald-400 mt-4">
              KSh {property.price.toLocaleString()}
            </p>
            <p className="flex items-center gap-2 mt-4 text-lg">
              <MapPin size={24} /> {property.location}
            </p>

            <div className="mt-10">
              <h3 className="text-xl font-semibold mb-4">Description</h3>
              <p className="text-[#c8b8a8] leading-relaxed whitespace-pre-line">
                {property.description || "No description provided."}
              </p>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="card p-8 h-fit">
            <h3 className="font-semibold text-lg mb-6">Property Details</h3>
            
            <div className="space-y-6">
              <div className="flex justify-between">
                <span className="text-[#c8b8a8]">Type</span>
                <span>{property.property_type}</span>
              </div>
              {property.bedrooms && (
                <div className="flex justify-between">
                  <span className="text-[#c8b8a8]">Bedrooms</span>
                  <span>{property.bedrooms}</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex justify-between">
                  <span className="text-[#c8b8a8]">Bathrooms</span>
                  <span>{property.bathrooms}</span>
                </div>
              )}
              {property.size_sqm && (
                <div className="flex justify-between">
                  <span className="text-[#c8b8a8]">Size</span>
                  <span>{property.size_sqm} m²</span>
                </div>
              )}
            </div>

            <button className="w-full mt-10 bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-semibold">
              Contact Seller
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}