"use client";

import { createAuthClient } from "@/lib/supabase/client";
import { useUser, RedirectToSignIn, useAuth } from "@clerk/nextjs";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, X, Image as ImageIcon, Video, AlertCircle } from "lucide-react";
import Link from "next/link";

const AMENITIES_LIST = [
  "Parking", "Garden", "Balcony", "Swimming Pool", "Gym", 
  "Security", "Furnished", "WiFi", "Water Tank", "Solar Power",
  "Servants Quarter", "Gated Community", "Lift/Elevator", 
  "Play Area", "Walk-in Closet", "Kitchen Island"
];

export default function AddPropertyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f1a17] flex items-center justify-center text-[#f1ede6]">Loading...</div>}>
      <AddProperty />
    </Suspense>
  );
}

function AddProperty() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
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
    contact_phone: "",
    contact_email: "",
    preferred_contact: "phone",
  });

  // Load property for editing
  useEffect(() => {
    if (!editId) return;

    async function loadPropertyForEdit() {
      const supabase = await createAuthClient(getToken);
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
          listing_type: data.listing_type || "Sale",
          property_type: data.property_type || "Apartment",
          status: data.status || "Available",
          bedrooms: data.bedrooms?.toString() || "",
          bathrooms: data.bathrooms?.toString() || "",
          location: data.location || "",
          address: data.address || "",
          size_sqm: data.size_sqm?.toString() || "",
          contact_phone: data.contact_phone || "",
          contact_email: data.contact_email || "",
          preferred_contact: data.preferred_contact || "phone",
        });
        setImages(data.images || []);
        setVideos(data.videos || []);
        setAmenities(data.amenities || []);
        setIsEditing(true);
      }
    }

    loadPropertyForEdit();
  }, [editId, getToken]);

  const toggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(a => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  // In app/add/page.tsx, update the compressAndUpload function:

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

          try {
            const supabase = await createAuthClient(getToken);

            // Store in user-specific folder: {userId}/{filename}
            const userId = user?.id;
            if (!userId) {
              return reject("User not authenticated");
            }

            const fileName = `${userId}/${Date.now()}-${file.name.replace(/\s+/g, "_")}`;

            const { data, error } = await supabase.storage
              .from("property-images")
              .upload(fileName, blob, { contentType: "image/jpeg" });

            if (error) {
              console.error("Supabase Storage Error:", error);
              return reject(error.message);
            }

            const { data: publicUrl } = supabase.storage
              .from("property-images")
              .getPublicUrl(data.path);

            resolve(publicUrl.publicUrl);
          } catch (err) {
            console.error("Upload catch error:", err);
            reject(err);
          }
        }, "image/jpeg", 0.85);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

  const uploadVideo = async (file: File): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const supabase = await createAuthClient(getToken);
      const userId = user?.id;
      
      if (!userId) {
        return reject("User not authenticated");
      }

      const fileName = `${userId}/${Date.now()}-${file.name.replace(/\s+/g, "_")}`;

      const { data, error } = await supabase.storage
        .from("property-videos")
        .upload(fileName, file, { contentType: file.type });

      if (error) {
        console.error("Video upload error:", error);
        return reject(error.message);
      }

      const { data: publicUrl } = supabase.storage
        .from("property-videos")
        .getPublicUrl(data.path);

      resolve(publicUrl.publicUrl);
    } catch (err) {
      console.error("Video upload catch error:", err);
      reject(err);
    }
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
      } catch {
        alert("Failed to upload one image");
      }
    }

    setImages([...images, ...newUrls]);
    setUploading(false);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploadingVideo(true);
    const newUrls: string[] = [];

    for (const file of files) {
      try {
        const url = await uploadVideo(file);
        newUrls.push(url);
      } catch {
        alert("Failed to upload one video");
      }
    }

    setVideos([...videos, ...newUrls]);
    setUploadingVideo(false);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      alert("Please upload at least one photo");
      return;
    }

    setLoading(true);

    try {
      const supabase = await createAuthClient(getToken);

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        size_sqm: formData.size_sqm ? parseFloat(formData.size_sqm) : null,
        images: images,
        videos: videos,
        amenities: amenities,
        user_id: user?.id,
        verification_status: isEditing ? undefined : 'pending', // Only set pending on new listings
      };

      let error;

      if (isEditing && editId) {
        // When editing, don't change verification_status
        const { error: updateError } = await supabase
          .from("properties")
          .update(payload)
          .eq("id", editId)
          .eq("user_id", user?.id ?? "");
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from("properties").insert(payload);
        error = insertError;
      }

      if (error) {
        console.error("Database error:", error);
        alert(`Database Error: ${error.message || JSON.stringify(error)}`);
      } else {
        if (isEditing) {
          alert("Property updated successfully!");
        } else {
          alert("Property submitted for review! We'll verify your listing and notify you once it's live.");
        }
        router.push("/my-listings");
      }
    } catch (err) {
      console.error("Submit error:", err);
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
        <p className="text-[#c8b8a8] mb-2">Fill in all the details below</p>
        
        {!isEditing && (
          <div className="flex items-center gap-2 text-amber-400 text-sm mb-8 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
            <AlertCircle size={16} />
            Your listing will be reviewed by our team before going live. This ensures quality for all users.
          </div>
        )}

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

          {/* Contact Info */}
          <div className="card rounded-2xl p-6 space-y-4 border border-[#2a3d35]">
            <h3 className="font-semibold text-lg">Contact Information</h3>
            <p className="text-sm text-[#c8b8a8]">How should interested buyers reach you?</p>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-[#c8b8a8]">Phone Number</label>
              <input 
                type="tel" 
                value={formData.contact_phone} 
                onChange={(e) => setFormData({...formData, contact_phone: e.target.value})} 
                className="input w-full px-5 py-4 rounded-2xl" 
                placeholder="+254 7XX XXX XXX" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-[#c8b8a8]">Email (Optional)</label>
              <input 
                type="email" 
                value={formData.contact_email} 
                onChange={(e) => setFormData({...formData, contact_email: e.target.value})} 
                className="input w-full px-5 py-4 rounded-2xl" 
                placeholder="your@email.com" 
              />
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
            <label className="block text-sm font-medium mb-3 text-[#c8b8a8]">Property Photos *</label>
            <div className="border-2 border-dashed border-[#2a3d35] rounded-3xl p-10 text-center hover:border-emerald-500 transition">
              <ImageIcon size={48} className="mx-auto text-emerald-500 mb-4" />
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" id="upload-images" />
              <label htmlFor="upload-images" className="mt-4 cursor-pointer bg-emerald-600 hover:bg-emerald-500 px-8 py-3 rounded-2xl inline-block">
                {uploading ? "Compressing & Uploading..." : "Select Photos"}
              </label>
              <p className="text-sm text-[#c8b8a8] mt-3">At least one photo required. Max 10 photos.</p>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-6">
                {images.map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} alt="preview" className="w-full h-24 object-cover rounded-2xl" />
                    <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full">
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video Upload (Optional) */}
          <div>
            <label className="block text-sm font-medium mb-3 text-[#c8b8a8]">Property Videos (Optional)</label>
            <div className="border-2 border-dashed border-[#2a3d35] rounded-3xl p-10 text-center hover:border-emerald-500 transition">
              <Video size={48} className="mx-auto text-emerald-500 mb-4" />
              <input type="file" multiple accept="video/*" onChange={handleVideoUpload} disabled={uploadingVideo} className="hidden" id="upload-videos" />
              <label htmlFor="upload-videos" className="mt-4 cursor-pointer bg-zinc-800 hover:bg-zinc-700 px-8 py-3 rounded-2xl inline-block">
                {uploadingVideo ? "Uploading..." : "Add Videos"}
              </label>
              <p className="text-sm text-[#c8b8a8] mt-3">Short video tours increase inquiries by 40%</p>
            </div>

            {videos.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-6">
                {videos.map((url, i) => (
                  <div key={i} className="relative group">
                    <video src={url} className="w-full h-32 object-cover rounded-2xl" controls />
                    <button type="button" onClick={() => removeVideo(i)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full">
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={loading || images.length === 0} className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 text-white font-semibold py-4 rounded-2xl text-lg transition">
            {loading ? "Saving..." : isEditing ? "Update Property" : "Submit for Review"}
          </button>

          {!isEditing && (
            <p className="text-center text-sm text-[#c8b8a8]">
              By submitting, you agree to our quality standards. Listings are typically reviewed within 24 hours.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}