// lib/admin.ts
// Server-only helpers for the private admin pages (/admin/*).
// Never import this from a "use client" file: it reads the service-role key.

import { auth } from "@clerk/nextjs/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Clerk user ids allowed into /admin. Set ADMIN_USER_IDS (comma-separated) on the server;
 * falls back to COMPANY_AGENT_USER_ID so Ken's existing setup works without changes.
 */
function adminUserIds(): string[] {
  const raw = process.env.ADMIN_USER_IDS || process.env.COMPANY_AGENT_USER_ID || "";
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

/** The signed-in user's id if they are an admin, otherwise null. Never throws. */
export async function getAdminUserId(): Promise<{ userId: string | null; isAdmin: boolean }> {
  const { userId } = await auth();
  if (!userId) return { userId: null, isAdmin: false };
  return { userId, isAdmin: adminUserIds().includes(userId) };
}

/** For Server Actions: returns the admin's user id or throws. Call first in every action. */
export async function requireAdmin(): Promise<string> {
  const { userId, isAdmin } = await getAdminUserId();
  if (!userId || !isAdmin) throw new Error("Not authorized");
  return userId;
}

export function adminConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/** Supabase client with the service-role key (bypasses row level security). Server only. */
export function createAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Admin is not configured: set SUPABASE_SERVICE_ROLE_KEY on the server.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
