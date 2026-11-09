"use client";

import { createAuthClient } from "@/lib/supabase/client";
import { useUser, RedirectToSignIn, useAuth } from "@clerk/nextjs";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, X, Image as ImageIcon, Video, AlertCircle } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { toE164 } from "@/lib/phone";
import { getCoords } from "@/lib/listing";
import { LocationPicker } from "@/components/map";
import { createClient } from "@/lib/supabase/client";
import { WATER_SOURCES, POWER_METER_LABELS, TITLE_TYPE_LABELS, readDetails } from "@/lib/listingDetails";

const AMENITIES_LIST = [
  "Parking", "Garden", "Balcony", "Swimming Pool", "Gym", 
  "Security", "Furnished", "WiFi", "Water Tank", "Solar Power",
  "Servants Quarter", "Gated Community", "Lift/Elevator", 
  "Play Area", "Walk-in Closet", "Kitchen Island"
];

export default function AddPropertyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center text-[#1a2420]">Loading...</div>}>
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
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [hadCoords, setHadCoords] = useState(false); // editing a listing that already had a pin

  // Kenyan listing details (deposit, water, power, title…). Shown only once the
  // 20261106090000_kenyan_listing_details migration has added the columns.
  const [detailsSupported, setDetailsSupported] = useState(false);
  const [depositMonths, setDepositMonths] = useState("");
  const [serviceCharge, setServiceCharge] = useState("");
  const [waterSources, setWaterSources] = useState<string[]>([]);
  const [powerMeter, setPowerMeter] = useState("");
  const [landmark, setLandmark] = useState("");
  const [titleType, setTitleType] = useState("");

  useEffect(() => {
    let cancelled = false;
    createClient().from("properties").select("deposit_months").limit(1)
      .then(({ error }) => { if (!cancelled) setDetailsSupported(!error); });
    return () => { cancelled = true; };
  }, []);

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
    contact_name: "",
    contact_phone: "",
    contact_email: "",
    preferred_contact: "phone",
  });

  // New listing: prefill owner name/phone from the signed-in account once (user can change them).
  // Done during render rather than in an effect — see react.dev "adjusting state when a prop changes".
  const [prefilled, setPrefilled] = useState(false);
  if (!prefilled && !editId && isLoaded && user) {
    setPrefilled(true);
    setFormData((prev) => ({
      ...prev,
      contact_name: prev.contact_name || user.fullName || "",
      contact_phone: prev.contact_phone || user.primaryPhoneNumber?.phoneNumber || "",
      contact_email: prev.contact_email || user.primaryEmailAddress?.emailAddress || "",
    }));
  }

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
          contact_name: data.contact_name || "",
          contact_phone: data.contact_phone || "",
          contact_email: data.contact_email || "",
          preferred_contact: data.preferred_contact || "phone",
        });
        setImages(data.images || []);
        setVideos(data.videos || []);
        setAmenities(data.amenities || []);
        const d = readDetails(data);
        setDepositMonths(d.deposit_months?.toString() ?? "");
        setServiceCharge(d.service_charge?.toString() ?? "");
        setWaterSources(d.water_sources);
        setPowerMeter(d.power_meter ?? "");
        setLandmark(d.landmark ?? "");
        setTitleType(d.title_type ?? "");
        const existing = getCoords(data);
        setCoords(existing);
        setHadCoords(!!existing);
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

    const contactName = formData.contact_name.trim();
    const contactPhone = toE164(formData.contact_phone);
    if (!contactName) {
      alert("Please enter the owner's name");
      return;
    }
    if (!contactPhone) {
      alert("Please enter a valid phone number, e.g. 0712 345 678 or +254 712 345 678");
      return;
    }

    setLoading(true);

    try {
      const supabase = await createAuthClient(getToken);

      const payload = {
        ...formData,
        contact_name: contactName,
        contact_phone: contactPhone, // stored as E.164 so call/WhatsApp links always work
        price: parseFloat(formData.price),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        size_sqm: formData.size_sqm ? parseFloat(formData.size_sqm) : null,
        images: images,
        videos: videos,
        amenities: amenities,
        // Only send coordinates when there's a pin (or one is being removed), so saving
        // still works before the latitude/longitude migration has been run.
        ...(coords || hadCoords
          ? { latitude: coords?.[0] ?? null, longitude: coords?.[1] ?? null }
          : {}),
        ...(detailsSupported
          ? {
              deposit_months: formData.listing_type === "Rent" && depositMonths !== "" ? Number(depositMonths) : null,
              service_charge: serviceCharge !== "" ? Number(serviceCharge) : null,
              water_sources: waterSources,
              power_meter: powerMeter || null,
              landmark: landmark.trim().slice(0, 120) || null,
              title_type: formData.listing_type === "Sale" && titleType ? titleType : null,
            }
          : {}),
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

  if (!isLoaded) return <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center">Loading...</div>;
  if (!isSignedIn) return <RedirectToSignIn />;

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-[#1a2420] pb-12">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 pt-8">
        <Link href="/my-listings" className="inline-flex items-center gap-2 text-[#6b6358] hover:text-[#1a2420] mb-8 transition">
          <ArrowLeft size={20} /> Back to My Listings
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mb-2">{isEditing ? "Edit Property" : "List Your Property"}</h1>
        <p className="text-[#6b6358] mb-2">Fill in all the details below</p>
        
        {!isEditing && (
          <div className="flex items-center gap-2 text-amber-700 text-sm mb-8 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <AlertCircle size={16} />
            Your listing will be reviewed by our team before going live. This ensures quality for all users.
          </div>
        )}

        <form onSubmit={handleSubmit} className="card rounded-3xl p-6 md:p-8 space-y-8 shadow-sm">
          
          {/* Sale / Rent Toggle */}
          <div>
            <label className="block text-sm font-medium mb-3 text-[#6b6358]">Listing Type</label>
            <div className="flex gap-3">
              <button type="button" onClick={() => setFormData({...formData, listing_type: "Sale"})} className={`flex-1 py-4 rounded-2xl font-medium transition ${formData.listing_type === "Sale" ? "bg-emerald-600 text-white" : "bg-white border border-[#e6e2d8] hover:border-emerald-400"}`}>For Sale</button>
              <button type="button" onClick={() => setFormData({...formData, listing_type: "Rent"})} className={`flex-1 py-4 rounded-2xl font-medium transition ${formData.listing_type === "Rent" ? "bg-emerald-600 text-white" : "bg-white border border-[#e6e2d8] hover:border-emerald-400"}`}>For Rent</button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#6b6358]">Property Title</label>
            <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="input w-full px-5 py-4 rounded-2xl" placeholder="3 Bedroom Apartment in Kilimani" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#6b6358]">Location</label>
            <input type="text" required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="input w-full px-5 py-4 rounded-2xl" placeholder="Kilimani, Nairobi" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-[#6b6358]">Price (KSh)</label>
              <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="input w-full px-5 py-4 rounded-2xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-[#6b6358]">Property Type</label>
              <select value={formData.property_type} onChange={(e) => setFormData({...formData, property_type: e.target.value})} className="input w-full px-5 py-4 rounded-2xl">
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Maisonette">Maisonette</option>
                <option value="Villa">Villa</option>
                <option value="Land">Land</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-[#6b6358]">Bedrooms</label>
              <input type="number" value={formData.bedrooms} onChange={(e) => setFormData({...formData, bedrooms: e.target.value})} className="input w-full px-5 py-4 rounded-2xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-[#6b6358]">Bathrooms</label>
              <input type="number" value={formData.bathrooms} onChange={(e) => setFormData({...formData, bathrooms: e.target.value})} className="input w-full px-5 py-4 rounded-2xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-[#6b6358]">Size (sqm)</label>
              <input type="number" value={formData.size_sqm} onChange={(e) => setFormData({...formData, size_sqm: e.target.value})} className="input w-full px-5 py-4 rounded-2xl" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#6b6358]">Full Address (Optional)</label>
            <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="input w-full px-5 py-4 rounded-2xl" placeholder="Plot number, street, estate" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-[#6b6358]">Map Pin (Recommended)</label>
            <p className="text-xs text-[#6b6358] mb-3">
              Tap the map where the property is, or use your location if you&apos;re there now. Buyers only see the
              approximate area, never the exact pin. Listings with a pin appear in map search.
            </p>
            <LocationPicker value={coords} onChange={setCoords} />
          </div>

          {detailsSupported && (
            <div className="rounded-2xl p-6 space-y-5 border border-[#e6e2d8] bg-[#fbfaf6]">
              <div>
                <h3 className="font-semibold text-lg">Good to know</h3>
                <p className="text-sm text-[#6b6358]">The questions {formData.listing_type === "Rent" ? "tenants" : "buyers"} ask first. Answering them gets you better enquiries.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.listing_type === "Rent" ? (
                  <label className="block">
                    <span className="block text-sm font-medium mb-2 text-[#6b6358]">Deposit (months of rent)</span>
                    <select value={depositMonths} onChange={(e) => setDepositMonths(e.target.value)} className="input w-full px-4 py-3 rounded-xl">
                      <option value="">Not specified</option>
                      <option value="0">No deposit</option>
                      {[1, 2, 3].map((m) => <option key={m} value={m}>{m} month{m > 1 ? "s" : ""}</option>)}
                    </select>
                  </label>
                ) : (
                  <label className="block">
                    <span className="block text-sm font-medium mb-2 text-[#6b6358]">Title type</span>
                    <select value={titleType} onChange={(e) => setTitleType(e.target.value)} className="input w-full px-4 py-3 rounded-xl">
                      <option value="">Not specified</option>
                      {Object.entries(TITLE_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </label>
                )}
                <label className="block">
                  <span className="block text-sm font-medium mb-2 text-[#6b6358]">Service charge (KSh / month)</span>
                  <input type="number" min={0} value={serviceCharge} onChange={(e) => setServiceCharge(e.target.value)} placeholder="Leave blank if none" className="input w-full px-4 py-3 rounded-xl" />
                </label>
                <label className="block">
                  <span className="block text-sm font-medium mb-2 text-[#6b6358]">Electricity</span>
                  <select value={powerMeter} onChange={(e) => setPowerMeter(e.target.value)} className="input w-full px-4 py-3 rounded-xl">
                    <option value="">Not specified</option>
                    {Object.entries(POWER_METER_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="block text-sm font-medium mb-2 text-[#6b6358]">Nearby landmark</span>
                  <input value={landmark} maxLength={120} onChange={(e) => setLandmark(e.target.value)} placeholder="e.g. Behind Yaya Centre" className="input w-full px-4 py-3 rounded-xl" />
                </label>
              </div>

              <fieldset>
                <legend className="block text-sm font-medium mb-2 text-[#6b6358]">Water</legend>
                <div className="flex flex-wrap gap-2">
                  {WATER_SOURCES.map((w) => {
                    const on = waterSources.includes(w);
                    return (
                      <button key={w} type="button" aria-pressed={on}
                        onClick={() => setWaterSources(on ? waterSources.filter((x) => x !== w) : [...waterSources, w])}
                        className={`px-4 py-2 rounded-full text-sm border transition ${on ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-[#e6e2d8] hover:border-emerald-300"}`}>
                        {w}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </div>
          )}

          {/* Contact Info */}
          <div className="card rounded-2xl p-6 space-y-4 border border-[#e6e2d8]">
            <h3 className="font-semibold text-lg">Contact Information</h3>
            <p className="text-sm text-[#6b6358]">This is shown on your listing so interested buyers and tenants can reach you.</p>

            <div>
              <label className="block text-sm font-medium mb-2 text-[#6b6358]">Owner / Agent Name *</label>
              <input
                type="text"
                required
                value={formData.contact_name}
                onChange={(e) => setFormData({...formData, contact_name: e.target.value})}
                className="input w-full px-5 py-4 rounded-2xl"
                placeholder="e.g. Jane Wanjiku"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-[#6b6358]">Phone Number *</label>
              <input
                type="tel"
                required
                value={formData.contact_phone}
                onChange={(e) => setFormData({...formData, contact_phone: e.target.value})} 
                className="input w-full px-5 py-4 rounded-2xl" 
                placeholder="+254 7XX XXX XXX" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-[#6b6358]">Email (Optional)</label>
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
            <label className="block text-sm font-medium mb-3 text-[#6b6358]">Amenities & Features</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AMENITIES_LIST.map((amenity) => (
                <label key={amenity} className={`flex items-center gap-2 p-3 rounded-2xl border cursor-pointer transition ${amenities.includes(amenity) ? 'border-emerald-500 bg-emerald-50' : 'border-[#e6e2d8] hover:border-emerald-300'}`}>
                  <input type="checkbox" checked={amenities.includes(amenity)} onChange={() => toggleAmenity(amenity)} className="w-5 h-5 accent-emerald-500" />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#6b6358]">Description</label>
            <textarea rows={6} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="input w-full px-5 py-4 rounded-3xl" placeholder="Describe the property, neighborhood, and any special features..." />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium mb-3 text-[#6b6358]">Property Photos *</label>
            <div className="border-2 border-dashed border-[#e6e2d8] rounded-3xl p-10 text-center hover:border-emerald-500 transition">
              <ImageIcon size={48} className="mx-auto text-emerald-500 mb-4" />
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" id="upload-images" />
              <label htmlFor="upload-images" className="mt-4 cursor-pointer bg-emerald-600 hover:bg-emerald-500 px-8 py-3 rounded-2xl inline-block">
                {uploading ? "Compressing & Uploading..." : "Select Photos"}
              </label>
              <p className="text-sm text-[#6b6358] mt-3">At least one photo required. Max 10 photos.</p>
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
            <label className="block text-sm font-medium mb-3 text-[#6b6358]">Property Videos (Optional)</label>
            <div className="border-2 border-dashed border-[#e6e2d8] rounded-3xl p-10 text-center hover:border-emerald-500 transition">
              <Video size={48} className="mx-auto text-emerald-500 mb-4" />
              <input type="file" multiple accept="video/*" onChange={handleVideoUpload} disabled={uploadingVideo} className="hidden" id="upload-videos" />
              <label htmlFor="upload-videos" className="mt-4 cursor-pointer bg-white border border-[#e6e2d8] hover:border-emerald-400 px-8 py-3 rounded-2xl inline-block">
                {uploadingVideo ? "Uploading..." : "Add Videos"}
              </label>
              <p className="text-sm text-[#6b6358] mt-3">Short video tours increase inquiries by 40%</p>
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

          <button type="submit" disabled={loading || images.length === 0} className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-[#d6d1c4] text-white font-semibold py-4 rounded-2xl text-lg transition">
            {loading ? "Saving..." : isEditing ? "Update Property" : "Submit for Review"}
          </button>

          {!isEditing && (
            <p className="text-center text-sm text-[#6b6358]">
              By submitting, you agree to our quality standards. Listings are typically reviewed within 24 hours.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}