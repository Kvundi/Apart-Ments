"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import { BellPlus, BellRing } from "lucide-react";
import { createAuthClient } from "@/lib/supabase/client";

type Props = {
  /** Canonical query string from searchKey(), e.g. "type=rent&location=Kilimani". */
  query: string;
  /** Human label from describeFilters(). */
  label: string;
};

/** Zillow "Save search": stores the current filters and emails new matches. */
export default function SaveSearchButton({ query, label }: Props) {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const cls =
    "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors";

  if (!isSignedIn) {
    const back = `/properties${query ? `?${query}` : ""}`;
    return (
      <Link href={`/sign-in?redirect_url=${encodeURIComponent(back)}`} className={`${cls} border border-emerald-600 text-emerald-700 hover:bg-emerald-50`}>
        <BellPlus size={16} /> Save search
      </Link>
    );
  }

  if (state === "saved") {
    return (
      <Link href="/saved?tab=searches" className={`${cls} bg-emerald-50 text-emerald-700 border border-emerald-200`}>
        <BellRing size={16} /> Saved — you&apos;ll get alerts
      </Link>
    );
  }

  const save = async () => {
    if (!user) return;
    setState("saving");
    const supabase = await createAuthClient(getToken);
    const { error } = await supabase.from("saved_searches").upsert(
      {
        user_id: user.id,
        email: user.primaryEmailAddress?.emailAddress ?? null,
        label,
        query,
        frequency: "daily",
      },
      { onConflict: "user_id,query", ignoreDuplicates: true }
    );
    if (error) {
      console.warn("Save search failed:", error.message);
      setState("error");
      return;
    }
    setState("saved");
  };

  return (
    <button
      type="button"
      onClick={save}
      disabled={state === "saving"}
      title={state === "error" ? "Couldn't save — please try again" : `Get alerts for: ${label}`}
      className={`${cls} border ${state === "error" ? "border-red-400 text-red-600" : "border-emerald-600 text-emerald-700 hover:bg-emerald-50"} disabled:opacity-60`}
    >
      <BellPlus size={16} />
      {state === "saving" ? "Saving…" : state === "error" ? "Try again" : "Save search"}
    </button>
  );
}
