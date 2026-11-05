"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Heart, Bell, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import PropertyCard, { toCardData, type PropertyCardData } from "@/components/PropertyCard";
import { createClient, createAuthClient } from "@/lib/supabase/client";
import { useSavedHomes } from "@/lib/savedHomes";

export default function SavedPage() {
  return (
    <div className="min-h-screen bg-white text-[#1a2420]">
      <Navbar />
      <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-10 text-[#6b6358]">Loading…</div>}>
        <Saved />
      </Suspense>
    </div>
  );
}

function Saved() {
  const router = useRouter();
  const tab = useSearchParams().get("tab") === "searches" ? "searches" : "homes";

  const tabCls = (active: boolean) =>
    `inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${active ? "bg-emerald-600 text-white" : "bg-[#f7f5ef] hover:bg-[#eceae4]"}`;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Saved</h1>
      <div className="flex gap-2 mb-8" role="tablist">
        <button role="tab" aria-selected={tab === "homes"} onClick={() => router.replace("/saved")} className={tabCls(tab === "homes")}>
          <Heart size={16} /> Homes
        </button>
        <button role="tab" aria-selected={tab === "searches"} onClick={() => router.replace("/saved?tab=searches")} className={tabCls(tab === "searches")}>
          <Bell size={16} /> Searches &amp; alerts
        </button>
      </div>
      {tab === "homes" ? <SavedHomes /> : <SavedSearches />}
    </div>
  );
}

/* ── Saved homes ─────────────────────────────────────────────────────────── */

function SavedHomes() {
  const savedIds = useSavedHomes();
  const { isSignedIn } = useAuth();
  const [homes, setHomes] = useState<PropertyCardData[]>([]);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const key = savedIds.join(",");

  useEffect(() => {
    if (savedIds.length === 0) return;
    let cancelled = false;
    createClient()
      .from("properties")
      .select("*")
      .in("id", savedIds)
      .then(({ data }) => {
        if (cancelled) return;
        const byId = new Map((data ?? []).map((row) => [String(row.id), toCardData(row)]));
        // Keep save order; silently drop homes that were deleted.
        setHomes(savedIds.map((id) => byId.get(id)).filter((h): h is PropertyCardData => !!h));
        setLoadedKey(savedIds.join(","));
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` captures savedIds' contents
  }, [key]);

  const loading = savedIds.length > 0 && loadedKey !== key;
  const visible = homes.filter((h) => savedIds.includes(h.id));

  return (
    <>
      <p className="text-[#6b6358] mb-6">
        {isSignedIn
          ? "Your saved homes, synced to your account on every device."
          : <>Saved on this device only. <Link href="/sign-in?redirect_url=/saved" className="text-emerald-700 font-semibold hover:underline">Sign in</Link> to keep them on all your devices.</>}
      </p>
      {savedIds.length === 0 ? (
        <EmptyState icon={<Heart size={48} className="mx-auto text-[#c8c0b4] mb-4" />} title="No saved homes yet" body="Tap the heart on any listing to save it here." />
      ) : loading ? (
        <p className="text-[#6b6358]">Loading your saved homes…</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {visible.map((p) => <PropertyCard key={p.id} p={p} />)}
        </div>
      )}
    </>
  );
}

/* ── Saved searches ──────────────────────────────────────────────────────── */

type SavedSearch = {
  id: string;
  label: string;
  query: string;
  frequency: "instant" | "daily" | "weekly" | "off";
  email: string | null;
  created_at: string;
};

const FREQUENCIES: { value: SavedSearch["frequency"]; label: string }[] = [
  { value: "daily", label: "Daily email" },
  { value: "weekly", label: "Weekly email" },
  { value: "off", label: "No alerts" },
];

function SavedSearches() {
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();
  const [searches, setSearches] = useState<SavedSearch[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn || !userId) return;
    let cancelled = false;
    (async () => {
      const supabase = await createAuthClient(getToken);
      const { data, error: e } = await supabase
        .from("saved_searches")
        .select("id, label, query, frequency, email, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (e) setError("Couldn't load your saved searches.");
      setSearches((data as SavedSearch[]) ?? []);
    })();
    return () => {
      cancelled = true;
    };
  }, [isSignedIn, userId, getToken]);

  const update = async (id: string, frequency: SavedSearch["frequency"]) => {
    setSearches((prev) => prev?.map((s) => (s.id === id ? { ...s, frequency } : s)) ?? prev);
    const supabase = await createAuthClient(getToken);
    const { error: e } = await supabase.from("saved_searches").update({ frequency }).eq("id", id);
    if (e) setError("Couldn't update that alert — please try again.");
  };

  const remove = async (id: string) => {
    setSearches((prev) => prev?.filter((s) => s.id !== id) ?? prev);
    const supabase = await createAuthClient(getToken);
    const { error: e } = await supabase.from("saved_searches").delete().eq("id", id);
    if (e) setError("Couldn't delete that search — please refresh and try again.");
  };

  if (!isLoaded) return <p className="text-[#6b6358]">Loading…</p>;
  if (!isSignedIn) {
    return (
      <EmptyState
        icon={<Bell size={48} className="mx-auto text-[#c8c0b4] mb-4" />}
        title="Sign in to save searches"
        body="Save a search and we'll email you when new homes match it."
        cta={{ href: "/sign-in?redirect_url=/saved?tab=searches", label: "Sign in" }}
      />
    );
  }
  if (searches === null) return <p className="text-[#6b6358]">Loading your saved searches…</p>;

  return (
    <>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      {searches.length === 0 ? (
        <EmptyState
          icon={<Bell size={48} className="mx-auto text-[#c8c0b4] mb-4" />}
          title="No saved searches yet"
          body='Search for homes, then tap "Save search" to get alerts for new matches.'
        />
      ) : (
        <ul className="space-y-3">
          {searches.map((s) => (
            <li key={s.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-[#e6e2d8]">
              <div className="min-w-0">
                <Link href={`/properties${s.query ? `?${s.query}` : ""}`} className="font-semibold hover:text-emerald-600 break-words">
                  {s.label}
                </Link>
                <p className="text-xs text-[#6b6358] mt-1">
                  {s.frequency === "off" ? "Alerts off" : `Alerts to ${s.email ?? "your email"}`}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={s.frequency === "instant" ? "daily" : s.frequency}
                  onChange={(e) => update(s.id, e.target.value as SavedSearch["frequency"])}
                  aria-label={`Alert frequency for ${s.label}`}
                  className="px-3 py-2 rounded-xl border border-[#e6e2d8] bg-white text-sm"
                >
                  {FREQUENCIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
                <button
                  type="button"
                  onClick={() => remove(s.id)}
                  aria-label={`Delete saved search ${s.label}`}
                  className="p-2 rounded-xl border border-[#e6e2d8] text-[#6b6358] hover:text-red-600 hover:border-red-300"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function EmptyState({ icon, title, body, cta = { href: "/properties", label: "Browse properties" } }: {
  icon: React.ReactNode; title: string; body: string; cta?: { href: string; label: string };
}) {
  return (
    <div className="text-center py-20 border border-[#e6e2d8] rounded-3xl bg-[#f7f5ef]">
      {icon}
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-[#6b6358] mb-6">{body}</p>
      <Link href={cta.href} className="inline-block bg-emerald-600 text-white font-semibold px-8 py-3 rounded-2xl">
        {cta.label}
      </Link>
    </div>
  );
}
