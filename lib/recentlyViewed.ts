// lib/recentlyViewed.ts — last few homes this browser opened (device-only, no account needed).

import { useSyncExternalStore } from "react";

const KEY = "apart-ments:recently-viewed";
const MAX = 12;
const EMPTY: string[] = [];
const listeners = new Set<() => void>();
let cache: string[] | null = null;

function read(): string[] {
  if (cache) return cache;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    cache = Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    cache = [];
  }
  return cache;
}

export function recordView(id: string) {
  const next = [id, ...read().filter((x) => x !== id)].slice(0, MAX);
  cache = next;
  try { window.localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage blocked */ }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => { listeners.delete(l); };
}

export function useRecentlyViewed(): string[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}
