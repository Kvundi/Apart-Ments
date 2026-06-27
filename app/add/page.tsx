"use client";

import { createClient } from "@/lib/supabase/client";
import { useUser, RedirectToSignIn } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Upload, X, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

const AMENITIES_LIST = [
  "Parking", "Garden", "Balcony", "Swimming Pool", "Gym", 
  "Security", "Furnished", "WiFi", "Water Tank", "Solar Power",
  "Servants Quarter", "Gated Community", "Lift/Elevator", 
  "Play Area", "Walk-in Closet", "Kitchen Island"
];

export default function AddProperty() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [amenities, setAmenities] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    listing_type: "Sale",
    property_type: "Apartment",
    status: "Available",
    bedrooms: "",
    bathrooms: "",
    location: "",
    address: "",
    size_sqm: "",
  });

  // Load property for editing
  useEffect(() => {
    if (!editId) return;

    async function loadPropertyForEdit() {
      const supabase = createClient();
      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("id", editId)
        .single();

      if (data) {
        setFormData({
          title: data.title || "",
          description: data.description || "",
          price: data.price?.toString() || "",
          listing_type: "Sale",
          property_type: data.property_type || "Apartment",
          status: data.status || "Available",
          bedrooms: data.bedrooms?.toString() || "",
          bathrooms: data.bathrooms?.toString() || "",
          location: data.location || "",
          address: data.address || "",
          size_sqm: data.size_sqm?.toString() || "",
        });
        setImages(data.images || []);
        setIsEditing(true);
      }
    }

    loadPropertyForEdit();
  }, [editId]);

  const toggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(a => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const compressAndUpload = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 1200;

          if (width > MAX_WIDTH) {
            height = (height * MAX_WIDTH) / width;
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(async (blob) => {
            if (!blob) return reject("Compression failed");

            const fileName = `${Date.now()}-${file.name}`;
            const supabase = createClient();

            const { data, error } = await supabase.storage
              .from('property-images')
              .upload(fileName, blob, { contentType: "image/jpeg" });

            if (error) reject(error);
            else {
              const { data: publicUrl } = supabase.storage
                .from('property-images')
                .getPublicUrl(data.path);
              resolve(publicUrl.publicUrl);
            }
          }, "image/jpeg", 0.85);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    const newUrls: string[] = [];

    for (const file of files) {
      try {
        const url = await compressAndUpload(file);
        newUrls.push(url);
      } catch (err) {
        alert("Failed to upload one image");
      }
    }

    setImages([...images, ...newUrls]);
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("Please upload at least one photo");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        size_sqm: formData.size_sqm ? parseFloat(formData.size_sqm) : null,
        images: images,
        amenities: amenities,
      };

      let error;
      if (isEditing && editId) {
        ({ error } = await supabase.from("properties").update(payload).eq("id", editId));
      } else {
        ({ error } = await supabase.from("properties").insert(payload));
      }

      if (error) {
        alert("Error: " + error.message);
      } else {
        alert(isEditing ? "✅ Property updated successfully!" : "✅ Property listed successfully!");
        router.push("/my-listings");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return <div className="min-h-screen bg-[#0f1a17] flex items-center justify-center">Loading...</div>;
  if (!isSignedIn) return <RedirectToSignIn />;

  return (
    <div className="min-h-screen bg-[#0f1a17] text-[#f1ede6] pb-12">
      <div className="max-w-2xl mx-auto px-6 pt-8">
        <Link href="/my-listings" className="inline-flex items-center gap-2 text-[#c8b8a8] hover:text-white mb-8 transition">
          <ArrowLeft size={20} /> Back to My Listings
        </Link>

        <h1 className="text-4xl font-bold mb-2">{isEditing ? "Edit Property" : "List Your Property"}</h1>
        <p className="text-[#c8b8a8] mb-10">Fill in all the details below</p>

        <form onSubmit={handleSubmit} className="card rounded-3xl p-8 space-y-8">
          
          {/* Sale / Rent Toggle */}
          <div>
            <label className="block text-sm font-medium mb-3 text-[#c8b8a8]">Listing Type</label>
            <div className="flex gap-3">
              <button type="button" onClick={() => setFormData({...formData, listing_type: "Sale"})} className={`flex-1 py-4 rounded-2xl font-medium transition ${formData.listing_type === "Sale" ? "bg-emerald-600 text-white" : "bg-zinc-800 hover:bg-zinc-700"}`}>For Sale</button>
              <button type="button" onClick={() => setFormData({...formData, listing_type: "Rent"})} className={`flex-1 py-4 rounded-2xl font-medium transition ${formData.listing_type === "Rent" ? "bg-emerald-600 text-white" : "bg-zinc-800 hover:bg-zinc-700"}`}>For Rent</button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#c8b8a8]">Property Title</label>
            <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="input w-full px-5 py-4 rounded-2xl" placeholder="3 Bedroom Apartment in Kilimani" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#c8b8a8]">Location</label>
            <input type="text" required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="input w-full px-5 py-4 rounded-2xl" placeholder="Kilimani, Nairobi" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-[#c8b8a8]">Price (KSh)</label>
              <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="input w-full px-5 py-4 rounded-2xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-[#c8b8a8]">Property Type</label>
              <select value={formData.property_type} onChange={(e) => setFormData({...formData, property_type: e.target.value})} className="input w-full px-5 py-4 rounded-2xl">
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Maisonette">Maisonette</option>
                <option value="Villa">Villa</option>
                <option value="Land">Land</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-[#c8b8a8]">Bedrooms</label>
              <input type="number" value={formData.bedrooms} onChange={(e) => setFormData({...formData, bedrooms: e.target.value})} className="input w-full px-5 py-4 rounded-2xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-[#c8b8a8]">Bathrooms</label>
              <input type="number" value={formData.bathrooms} onChange={(e) => setFormData({...formData, bathrooms: e.target.value})} className="input w-full px-5 py-4 rounded-2xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-[#c8b8a8]">Size (sqm)</label>
              <input type="number" value={formData.size_sqm} onChange={(e) => setFormData({...formData, size_sqm: e.target.value})} className="input w-full px-5 py-4 rounded-2xl" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#c8b8a8]">Full Address (Optional)</label>
            <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="input w-full px-5 py-4 rounded-2xl" placeholder="Plot number, street, estate" />
          </div>

          {/* Listing Status */}
          <div>
            <label className="block text-sm font-medium mb-3 text-[#c8b8a8]">Listing Status</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {["Available", "Under Offer", "Sold", "Rented"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFormData({...formData, status})}
                  className={`py-3 rounded-2xl text-sm font-medium transition ${
                    formData.status === status ? "bg-emerald-600 text-white" : "bg-zinc-800 hover:bg-zinc-700"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium mb-3 text-[#c8b8a8]">Amenities & Features</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AMENITIES_LIST.map((amenity) => (
                <label key={amenity} className={`flex items-center gap-2 p-3 rounded-2xl border cursor-pointer transition ${amenities.includes(amenity) ? 'border-emerald-500 bg-emerald-900/30' : 'border-[#2a3d35] hover:border-gray-600'}`}>
                  <input type="checkbox" checked={amenities.includes(amenity)} onChange={() => toggleAmenity(amenity)} className="w-5 h-5 accent-emerald-500" />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#c8b8a8]">Description</label>
            <textarea rows={6} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="input w-full px-5 py-4 rounded-3xl" placeholder="Describe the property, neighborhood, and any special features..." />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium mb-3 text-[#c8b8a8]">Property Photos</label>
            <div className="border-2 border-dashed border-[#2a3d35] rounded-3xl p-10 text-center hover:border-emerald-500 transition">
              <ImageIcon size={48} className="mx-auto text-emerald-500 mb-4" />
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" id="upload" />
              <label htmlFor="upload" className="mt-4 cursor-pointer bg-emerald-600 hover:bg-emerald-500 px-8 py-3 rounded-2xl inline-block">
                {uploading ? "Compressing & Uploading..." : "Select Photos"}
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-6">
                {images.map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} alt="preview" className="w-full h-24 object-cover rounded-2xl" />
                    <button onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full">
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={loading || images.length === 0} className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 text-white font-semibold py-4 rounded-2xl text-lg transition">
            {loading ? "Saving..." : isEditing ? "Update Property" : "Publish Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}