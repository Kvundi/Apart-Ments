// lib/source.ts
// Campaign source codes: which social post or ad brought a visitor.
// Every link the social-growth agent shares ends in ?src=<code> (e.g. ?src=tt-1201 for
// TikTok video 1201). The code is remembered for the visit, added to the client's
// WhatsApp message ("via TT-1201") and saved with each lead, so we can see which posts
// produce real inquiries. Browser-only helpers; safe to import from client components.

const KEY = "28h_src";
const VALID = /^[a-z0-9][a-z0-9-]{0,39}$/i;

export function normaliseSource(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const v = raw.trim().toLowerCase();
  return VALID.test(v) ? v : null;
}

/** Store ?src= from the current URL for this visit (latest source wins). */
export function captureSourceFromUrl(): void {
  try {
    const src = normaliseSource(new URLSearchParams(window.location.search).get("src"));
    if (src) sessionStorage.setItem(KEY, src);
  } catch {
    // sessionStorage can be blocked (private mode); tracking is best-effort.
  }
}

export function currentSource(): string | null {
  try {
    return normaliseSource(sessionStorage.getItem(KEY));
  } catch {
    return null;
  }
}

/** Adds "(via TT-1201)" to the pre-filled text of a wa.me link. */
export function withSource(waHref: string, src: string | null): string {
  if (!src) return waHref;
  try {
    const url = new URL(waHref);
    const text = url.searchParams.get("text") ?? "";
    url.searchParams.set("text", `${text} (via ${src.toUpperCase()})`);
    return url.toString();
  } catch {
    return waHref;
  }
}
