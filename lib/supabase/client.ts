import { createBrowserClient } from "@supabase/ssr";

type GetTokenWithTemplate = (options: { template: string }) => Promise<string | null>;

/** Anonymous (public) Supabase client for reads that don't need a signed-in user. */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/** Supabase client authenticated with the Clerk "supabase" JWT template. */
export async function createAuthClient_FreePlan(getToken: GetTokenWithTemplate) {
  const token = await getToken({ template: "supabase" });
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    token
      ? { global: { headers: { Authorization: `Bearer ${token}` } } }
      : undefined
  );
}

export const createAuthClient = createAuthClient_FreePlan;
