"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { createAuthClient } from "@/lib/supabase/client";
import { getSavedHomes, replaceSavedHomes, subscribeSavedHomes } from "@/lib/savedHomes";

/**
 * Keeps the browser's saved homes in sync with the signed-in user's
 * `saved_properties` rows, so hearts follow the user across devices.
 *
 * On sign-in: account saves + this device's saves are merged (nothing is lost).
 * After that: every heart/un-heart is written through to Supabase.
 * Renders nothing. Mounted once in the root layout.
 */
export default function SavedHomesSync() {
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId) return;
    let cancelled = false;
    let synced = new Set<string>();
    let unsubscribe: (() => void) | null = null;

    (async () => {
      const supabase = await createAuthClient(getToken);
      const { data, error } = await supabase
        .from("saved_properties")
        .select("property_id, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) {
        // Most likely the migration hasn't been run yet — keep local-only saves working.
        console.warn("Saved homes sync disabled:", error.message);
        return;
      }

      const remote = (data ?? []).map((r) => String(r.property_id));
      const local = getSavedHomes();
      const toUpload = local.filter((id) => !remote.includes(id));
      if (toUpload.length) {
        await supabase
          .from("saved_properties")
          .upsert(toUpload.map((property_id) => ({ user_id: userId, property_id })), { ignoreDuplicates: true });
      }
      if (cancelled) return;

      const merged = [...local, ...remote.filter((id) => !local.includes(id))];
      synced = new Set(merged);
      replaceSavedHomes(merged);

      // Write-through from now on.
      unsubscribe = subscribeSavedHomes(async () => {
        const now = new Set(getSavedHomes());
        const added = [...now].filter((id) => !synced.has(id));
        const removed = [...synced].filter((id) => !now.has(id));
        synced = now;
        if (!added.length && !removed.length) return;
        const client = await createAuthClient(getToken); // fresh token each write
        if (added.length) {
          const { error: e } = await client
            .from("saved_properties")
            .upsert(added.map((property_id) => ({ user_id: userId, property_id })), { ignoreDuplicates: true });
          if (e) console.warn("Couldn't save home to account:", e.message);
        }
        if (removed.length) {
          const { error: e } = await client
            .from("saved_properties")
            .delete()
            .eq("user_id", userId)
            .in("property_id", removed);
          if (e) console.warn("Couldn't remove saved home from account:", e.message);
        }
      });
    })();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [isLoaded, isSignedIn, userId, getToken]);

  return null;
}
