// lib/savedHomes.ts
// Saved ("hearted") homes. The browser copy (localStorage) is the instant,
// works-signed-out store; components/SavedHomesSync.tsx mirrors it to the
// Supabase `saved_properties` table when the visitor is signed in.

import { useSyncExternalStore } from "react";

const KEY = "apart-ments:saved-homes";
const EMPTY: string[] = [];
const listeners = new Set<() => void>();
let cache: string[] | null = null;

function read(): string[] {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    cache = [];
  }
  return cache!;
}

function write(ids: string[]) {
  cache = ids;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    // Storage blocked (private mode etc.) — keep in memory for this visit.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Keep tabs in sync.
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function toggleSavedHome(id: string) {
  const ids = read();
  write(ids.includes(id) ? ids.filter((x) => x !== id) : [id, ...ids]);
}

export function removeSavedHome(id: string) {
  write(read().filter((x) => x !== id));
}

/** Current ids (client only). */
export function getSavedHomes(): string[] {
  return read();
}

/** Replace the whole list (used when merging with the account's saves). */
export function replaceSavedHomes(ids: string[]) {
  const unique = Array.from(new Set(ids));
  const current = read();
  if (unique.length === current.length && unique.every((id, i) => id === current[i])) return;
  write(unique);
}

/** Listen for any change to saved homes. Returns an unsubscribe function. */
export const subscribeSavedHomes = subscribe;

/** All saved property ids, newest first. Empty on the server. */
export function useSavedHomes(): string[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}
