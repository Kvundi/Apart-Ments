// lib/scamFlags.ts
// Warning signs shown to Ken on the admin page (docs/specs/verification.md, section 3).
// Pure functions: no database calls, so they are easy to test and cheap to run.

export type FlagRow = {
  id: string;
  user_id: string | null;
  created_at: string | null;
  title: string | null;
  description: string | null;
  price: number | null;
  listing_type: string | null;
  property_type: string | null;
  bedrooms: number | null;
  location: string | null;
  images: string[];
  verification_status: string | null;
};

export type ScamFlag = { code: string; label: string; strong: boolean };

const DAY_MS = 24 * 60 * 60 * 1000;

/** Words scammers use to take money before a viewing (English + common Kenyan phrasing). */
const MONEY_FIRST_PATTERNS: RegExp[] = [
  /viewing\s*fee/i,
  /booking\s*fee/i,
  /site\s*visit\s*fee/i,
  /(pay|send|deposit)[^.]{0,40}before\s*(the\s*)?view/i,
  /send\s*(the\s*)?(money|cash|deposit)/i,
  /\b(till|paybill|pay\s*bill)\s*(no\.?|number)?\s*\d{4,}/i,
  /\bm-?pesa\b[^.]{0,40}\b(first|before|to\s*(book|reserve|secure))/i,
  /(deposit|pay)[^.]{0,30}to\s*(reserve|secure|hold|book)/i,
  /\bfee\s*ya\s*kuona\b/i,
  /\blipa\s*kwanza\b/i,
];

export function mentionsMoneyFirst(text: string): boolean {
  return MONEY_FIRST_PATTERNS.some((re) => re.test(text));
}

function median(values: number[]): number | null {
  if (!values.length) return null;
  const v = [...values].sort((a, b) => a - b);
  const mid = Math.floor(v.length / 2);
  return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2;
}

const norm = (s: string | null) => (s ?? "").trim().toLowerCase();

/**
 * Median price of comparable live listings, or null if there are fewer than 3.
 * Tries the narrowest match first: same location + type + bedrooms, then location + type,
 * then type across all locations.
 */
export function comparableMedian(row: FlagRow, live: FlagRow[]): number | null {
  const same = (r: FlagRow) =>
    r.id !== row.id && r.price != null && r.price > 0 &&
    norm(r.listing_type) === norm(row.listing_type) && norm(r.property_type) === norm(row.property_type);
  const tiers: ((r: FlagRow) => boolean)[] = [
    (r) => same(r) && norm(r.location) === norm(row.location) && r.bedrooms === row.bedrooms,
    (r) => same(r) && norm(r.location) === norm(row.location),
    (r) => same(r),
  ];
  for (const t of tiers) {
    const prices = live.filter(t).map((r) => Number(r.price));
    if (prices.length >= 3) return median(prices);
  }
  return null;
}

export type FlagContext = {
  /** Live (approved + Available) listings, used as price comparables. */
  live: FlagRow[];
  /** Every listing (any status), used for the burst and reused-photo checks. */
  all: FlagRow[];
  /** Open report count per property id. */
  openReports: Map<string, number>;
};

/** Index of image URL -> set of user ids that use it. Build once per page load. */
export function buildImageOwners(all: FlagRow[]): Map<string, Set<string>> {
  const owners = new Map<string, Set<string>>();
  for (const r of all) {
    for (const url of r.images) {
      const set = owners.get(url) ?? new Set<string>();
      set.add(r.user_id ?? "");
      owners.set(url, set);
    }
  }
  return owners;
}

export function scamFlags(row: FlagRow, ctx: FlagContext, imageOwners: Map<string, Set<string>>): ScamFlag[] {
  const flags: ScamFlag[] = [];

  const med = comparableMedian(row, ctx.live);
  if (med && row.price != null && row.price > 0 && row.price < med * 0.5) {
    flags.push({
      code: "cheap",
      label: `Price is ${Math.round((1 - row.price / med) * 100)}% below similar listings (median KSh ${Math.round(med).toLocaleString("en-KE")})`,
      strong: true,
    });
  }

  if (mentionsMoneyFirst(`${row.title ?? ""}\n${row.description ?? ""}`)) {
    flags.push({ code: "money_first", label: "Mentions a viewing/booking fee or paying before viewing", strong: true });
  }

  const reports = ctx.openReports.get(row.id) ?? 0;
  if (reports > 0) {
    flags.push({ code: "reported", label: `${reports} open report${reports === 1 ? "" : "s"} from the public`, strong: reports >= 2 });
  }

  if (row.user_id) {
    const times = ctx.all
      .filter((r) => r.user_id === row.user_id && r.created_at)
      .map((r) => new Date(r.created_at as string).getTime())
      .filter((t) => Number.isFinite(t))
      .sort((a, b) => a - b);
    // Any 7-day window with 5+ listings from this account.
    let burst = false;
    for (let i = 0, j = 0; j < times.length; j++) {
      while (times[j] - times[i] > 7 * DAY_MS) i++;
      if (j - i + 1 >= 5) { burst = true; break; }
    }
    if (burst) flags.push({ code: "burst", label: "This account posted 5+ listings within 7 days", strong: false });
  }

  const reused = row.images.some((url) => {
    const owners = imageOwners.get(url);
    return !!owners && [...owners].some((u) => u !== (row.user_id ?? ""));
  });
  if (reused) flags.push({ code: "reused_photo", label: "A photo is also used on another account's listing", strong: true });

  return flags;
}
