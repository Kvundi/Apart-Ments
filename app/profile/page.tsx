"use client";

import { useEffect, useState } from "react";
import { useUser, useAuth, RedirectToSignIn } from "@clerk/nextjs";
import { createAuthClient_FreePlan } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { User, Phone, MapPin, FileText, Save, ArrowLeft, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";

type Profile = {
  display_name: string;
  phone: string;
  location: string;
  bio: string;
  avatar_url: string;
  is_agent: boolean;
  agency_name: string;
};

export default function ProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();

  const [form, setForm] = useState<Profile>({ display_name: "", phone: "", location: "", bio: "", avatar_url: "", is_agent: false, agency_name: "" });
  const [loading,       setLoading]       = useState(true);
  const [saving,        setSaving]        = useState(false);
  const [success,       setSuccess]       = useState(false);
  const [error,         setError]         = useState<string | null>(null);
  const [listingsCount, setListingsCount] = useState(0);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    const currentUser = user;
    async function loadProfile() {
      try {
        const supabase = await createAuthClient_FreePlan(getToken);
        const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", currentUser.id).maybeSingle();
        if (profile) {
          setForm({ display_name: profile.display_name || "", phone: profile.phone || "", location: profile.location || "", bio: profile.bio || "", avatar_url: profile.avatar_url || "", is_agent: profile.is_agent || false, agency_name: profile.agency_name || "" });
        } else {
          setForm((prev) => ({ ...prev, display_name: currentUser.fullName || currentUser.firstName || "", avatar_url: currentUser.imageUrl || "" }));
        }
        const { count } = await supabase.from("properties").select("id", { count: "exact", head: true }).eq("user_id", currentUser.id);
        setListingsCount(count || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [isLoaded, isSignedIn, user, getToken]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(null); setSuccess(false);
    try {
      const supabase = await createAuthClient_FreePlan(getToken);
      const { error } = await supabase.from("profiles").upsert({ ...form, user_id: user!.id, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
      if (error) { setError(`Save failed: ${error.message}`); }
      else { setSuccess(true); setTimeout(() => setSuccess(false), 3000); }
    } catch { setError("Something went wrong."); }
    finally { setSaving(false); }
  };

  const update = (field: string, value: string | boolean) => setForm((prev) => ({ ...prev, [field]: value }));

  if (!isLoaded) return <div className="min-h-screen bg-white flex items-center justify-center"><div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" /></div>;
  if (!isSignedIn) return <RedirectToSignIn />;

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-[#1a2420]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link href="/my-listings" className="inline-flex items-center gap-2 text-[#6b6358] hover:text-emerald-600 text-sm mb-8"><ArrowLeft size={16} />Back to My Listings</Link>

        <div className="flex items-center gap-5 mb-6">
          <img src={form.avatar_url || user.imageUrl} alt={form.display_name} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md" />
          <div>
            <h1 className="text-2xl font-bold">{form.display_name || user.firstName || "Your Profile"}</h1>
            <p className="text-[#6b6358] text-sm mt-0.5">{user.primaryEmailAddress?.emailAddress}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">{listingsCount} listing{listingsCount !== 1 ? "s" : ""}</span>
              {form.is_agent && <span className="text-xs bg-[#1a2420] text-white px-2.5 py-0.5 rounded-full">Agent</span>}
            </div>
          </div>
        </div>

        <Link href={`/agents/${user.id}`} className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:underline mb-8" target="_blank"><ExternalLink size={14} />View your public profile</Link>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white border border-[#e6e2d8] rounded-3xl p-6 space-y-5">
            <h2 className="text-lg font-bold">Personal Information</h2>
            {[
              { icon: <User size={17} className="text-emerald-600" />,    label: "Display Name",  field: "display_name", type: "text",  placeholder: "Your name or business name", required: true },
              { icon: <Phone size={17} className="text-emerald-600" />,   label: "Phone Number",  field: "phone",        type: "tel",   placeholder: "+254 7XX XXX XXX" },
              { icon: <MapPin size={17} className="text-emerald-600" />,  label: "Location",      field: "location",     type: "text",  placeholder: "e.g. Nairobi, Kenya" },
            ].map(({ icon, label, field, type, placeholder, required }) => (
              <div key={field}>
                <label className="flex items-center gap-1.5 text-sm font-medium mb-2">{icon}{label}{required && <span className="text-red-400">*</span>}</label>
                <input type={type} required={required} value={form[field as keyof Profile] as string} onChange={(e) => update(field, e.target.value)} placeholder={placeholder} className="w-full px-4 py-3 rounded-xl border border-[#e6e2d8] text-sm outline-none focus:border-emerald-400 bg-white" />
              </div>
            ))}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium mb-2"><FileText size={17} className="text-emerald-600" />Bio</label>
              <textarea rows={4} value={form.bio} onChange={(e) => update("bio", e.target.value)} placeholder="Tell buyers and tenants a bit about yourself…" className="w-full px-4 py-3 rounded-xl border border-[#e6e2d8] text-sm outline-none focus:border-emerald-400 bg-white resize-none" />
            </div>
          </div>

          <div className="bg-white border border-[#e6e2d8] rounded-3xl p-6 space-y-5">
            <h2 className="text-lg font-bold">Agent Settings</h2>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium">I am a real estate agent</p>
                <p className="text-xs text-[#6b6358] mt-0.5">Shows an &quot;Agent&quot; badge on your profile and listings</p>
              </div>
              <div onClick={() => update("is_agent", !form.is_agent)} className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${form.is_agent ? "bg-emerald-600" : "bg-[#e6e2d8]"}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_agent ? "translate-x-7" : "translate-x-1"}`} />
              </div>
            </label>
            {form.is_agent && (
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium mb-2"><User size={17} className="text-emerald-600" />Agency / Company Name</label>
                <input type="text" value={form.agency_name} onChange={(e) => update("agency_name", e.target.value)} placeholder="e.g. Savills Kenya" className="w-full px-4 py-3 rounded-xl border border-[#e6e2d8] text-sm outline-none focus:border-emerald-400 bg-white" />
              </div>
            )}
          </div>

          {success && <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl p-4"><CheckCircle2 size={18} className="shrink-0" /><p className="text-sm font-medium">Profile saved successfully!</p></div>}
          {error   && <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4"><AlertCircle size={18} className="shrink-0" /><p className="text-sm">{error}</p></div>}

          <button type="submit" disabled={saving || loading} className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-[#e6e2d8] disabled:text-[#9c948a] text-white font-semibold py-4 rounded-2xl transition-colors">
            {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={18} />}
            {saving ? "Saving…" : "Save Profile"}
          </button>
        </form>
      </div>
      <footer className="bg-white py-10 border-t border-[#e6e2d8] mt-16"><div className="max-w-7xl mx-auto px-6 text-center text-sm text-[#9c948a]">© 2026 Keja Yangu Ltd. All rights reserved.</div></footer>
    </div>
  );
}