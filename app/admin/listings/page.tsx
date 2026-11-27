import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AlertTriangle, BadgeCheck, Flag, Phone, ShieldAlert } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Callout } from "@/components/ui";
import { adminConfigured, createAdminClient, getAdminUserId } from "@/lib/admin";
import { formatKsh, parseImages, toVerificationLevel, verificationBadge } from "@/lib/listing";
import { buildImageOwners, scamFlags, type FlagRow, type ScamFlag } from "@/lib/scamFlags";
import { approveListing, rejectListing, setVerificationLevel, updateReport } from "./actions";

export const metadata: Metadata = {
  title: "Review listings",
  robots: { index: false, follow: false },
};

type Tab = "pending" | "reports" | "live";
type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

type ListingRow = FlagRow & {
  status: string | null;
  admin_notes: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  expires_at: string | null;
  verification_level: number;
  verified_at: string | null;
};

type ReportRow = {
  id: string;
  property_id: string;
  reason: string;
  details: string | null;
  reporter_contact: string | null;
  created_at: string;
};

const REASON_LABELS: Record<string, string> = {
  viewing_fee: "Asked for a viewing fee",
  fake: "Fake listing",
  unavailable: "No longer available",
  wrong_details: "Wrong details",
  scam: "Scam",
  other: "Other",
};

const LEVEL_OPTIONS = [
  { value: 0, label: "0 · Not verified" },
  { value: 1, label: "1 · Phone confirmed" },
  { value: 2, label: "2 · Owner verified (ID checked)" },
  { value: 3, label: "3 · Property visited" },
];

const COLUMNS =
  "id, user_id, created_at, title, description, price, listing_type, property_type, bedrooms, location, images, " +
  "verification_status, status, admin_notes, contact_name, contact_phone, expires_at, verification_level, verified_at";

function toRow(r: Record<string, unknown>): ListingRow {
  return {
    id: String(r.id),
    user_id: (r.user_id as string | null) ?? null,
    created_at: (r.created_at as string | null) ?? null,
    title: (r.title as string | null) ?? null,
    description: (r.description as string | null) ?? null,
    price: r.price == null ? null : Number(r.price),
    listing_type: (r.listing_type as string | null) ?? null,
    property_type: (r.property_type as string | null) ?? null,
    bedrooms: r.bedrooms == null ? null : Number(r.bedrooms),
    location: (r.location as string | null) ?? null,
    images: parseImages(r.images),
    verification_status: (r.verification_status as string | null) ?? null,
    status: (r.status as string | null) ?? null,
    admin_notes: (r.admin_notes as string | null) ?? null,
    contact_name: (r.contact_name as string | null) ?? null,
    contact_phone: (r.contact_phone as string | null) ?? null,
    expires_at: (r.expires_at as string | null) ?? null,
    verification_level: toVerificationLevel(r.verification_level),
    verified_at: (r.verified_at as string | null) ?? null,
  };
}

/** Same rule as the public database policy: approved, Available and not expired. */
function isPubliclyVisible(r: ListingRow): boolean {
  const notExpired = !r.expires_at || new Date(r.expires_at).getTime() > Date.now();
  return r.verification_status === "approved" && r.status === "Available" && notExpired;
}

export default async function AdminListingsPage({ searchParams }: PageProps) {
  const { userId, isAdmin } = await getAdminUserId();
  if (!userId) redirect("/sign-in?redirect_url=%2Fadmin%2Flistings");
  if (!isAdmin) notFound();

  const sp = await searchParams;
  const tabParam = typeof sp.tab === "string" ? sp.tab : "";
  const tab: Tab = tabParam === "reports" || tabParam === "live" ? tabParam : "pending";
  const notice = typeof sp.notice === "string" ? sp.notice.slice(0, 200) : "";

  if (!adminConfigured()) {
    return (
      <Shell>
        <Callout tone="warn" title="Admin isn't configured yet">
          Add <code>SUPABASE_SERVICE_ROLE_KEY</code> to the server environment (Vercel → Settings → Environment
          Variables, and <code>.env.local</code> for local testing), then reload this page.
        </Callout>
      </Shell>
    );
  }

  const supabase = createAdminClient();
  // One read of every listing (small for now) powers all three tabs and the scam flags.
  const [{ data: listingData, error: listingError }, { data: reportData, error: reportError }] = await Promise.all([
    supabase.from("properties").select(COLUMNS).order("created_at", { ascending: false }).limit(2000),
    supabase
      .from("listing_reports")
      .select("id, property_id, reason, details, reporter_contact, created_at")
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  if (listingError || reportError) {
    const message = listingError?.message ?? reportError?.message ?? "";
    const needsMigration = /verification_level|verified_at/.test(message);
    return (
      <Shell>
        <Callout tone="warn" title={needsMigration ? "Run the database migration first" : "Couldn't load listings"}>
          {needsMigration ? (
            <>Run <code>supabase/migrations/20261126120000_verification_levels.sql</code> in the Supabase SQL editor, then reload.</>
          ) : (
            message
          )}
        </Callout>
      </Shell>
    );
  }

  const all = ((listingData ?? []) as unknown as Record<string, unknown>[]).map(toRow);
  const reports = (reportData ?? []) as ReportRow[];
  const live = all.filter(isPubliclyVisible);
  const openReports = new Map<string, number>();
  for (const r of reports) openReports.set(r.property_id, (openReports.get(r.property_id) ?? 0) + 1);
  const ctx = { live, all, openReports };
  const imageOwners = buildImageOwners(all);
  const flagsFor = (r: ListingRow) => scamFlags(r, ctx, imageOwners);
  const byId = new Map(all.map((r) => [r.id, r]));

  const pending = all.filter((r) => r.verification_status === "pending" || r.verification_status === "changes_requested");
  const approved = all.filter((r) => r.verification_status === "approved");

  const counts: Record<Tab, number> = { pending: pending.length, reports: reports.length, live: approved.length };

  return (
    <Shell>
      {notice && (
        <div className="mb-5">
          <Callout tone="success">{notice}</Callout>
        </div>
      )}

      <nav className="flex gap-2 mb-6 overflow-x-auto" aria-label="Review tabs">
        {(["pending", "reports", "live"] as Tab[]).map((t) => (
          <Link
            key={t}
            href={`/admin/listings?tab=${t}`}
            aria-current={tab === t ? "page" : undefined}
            className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold ${
              tab === t ? "bg-emerald-600 text-white" : "bg-[#f7f5ef] text-[#1a2420]"
            }`}
          >
            {t === "pending" ? "Pending" : t === "reports" ? "Reports" : "Live"} ({counts[t]})
          </Link>
        ))}
      </nav>

      {tab === "pending" &&
        (pending.length === 0 ? (
          <Empty text="Nothing waiting for review." />
        ) : (
          <div className="space-y-5">
            {pending.map((r) => (
              <ListingCard key={r.id} row={r} flags={flagsFor(r)}>
                <form action={approveListing} className="space-y-2">
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="tab" value="pending" />
                  <LevelSelect defaultValue={0} />
                  <input name="note" maxLength={500} placeholder="Note (optional): e.g. called owner, ID seen" className={inputCls} />
                  <button className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-xl">Approve and publish</button>
                </form>
                <form action={rejectListing} className="space-y-2 mt-4 pt-4 border-t border-[#e6e2d8]">
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="tab" value="pending" />
                  <textarea
                    name="reason"
                    required
                    maxLength={500}
                    rows={2}
                    placeholder="Reason the owner will see, e.g. photos don't match the address"
                    className={inputCls}
                  />
                  <button className="w-full bg-white border border-rose-300 text-rose-700 font-semibold py-3 rounded-xl">Reject</button>
                </form>
              </ListingCard>
            ))}
          </div>
        ))}

      {tab === "reports" &&
        (reports.length === 0 ? (
          <Empty text="No open reports." />
        ) : (
          <div className="space-y-5">
            {reports.map((rep) => {
              const listing = byId.get(rep.property_id);
              return (
                <div key={rep.id} className="border border-[#e6e2d8] rounded-2xl p-4 bg-white">
                  <p className="flex items-center gap-2 font-semibold text-rose-700">
                    <Flag size={16} /> {REASON_LABELS[rep.reason] ?? rep.reason}
                  </p>
                  <p className="text-xs text-[#6b6358] mt-1">{formatDate(rep.created_at)}</p>
                  {rep.details && <p className="text-sm mt-2 whitespace-pre-line">{rep.details}</p>}
                  {rep.reporter_contact && <p className="text-sm mt-2 text-[#6b6358]">Reporter: {rep.reporter_contact}</p>}
                  {listing ? (
                    <p className="text-sm mt-3">
                      Listing: <strong>{listing.title}</strong> · {listing.location} ·{" "}
                      {listing.price != null ? formatKsh(listing.price) : "no price"} ·{" "}
                      <span className="text-[#6b6358]">{listing.verification_status}</span>
                      {listing.verification_status === "approved" && (
                        <>
                          {" · "}
                          <Link href={`/properties/${listing.id}`} className="text-emerald-700 underline">
                            View
                          </Link>
                        </>
                      )}
                    </p>
                  ) : (
                    <p className="text-sm mt-3 text-[#6b6358]">Listing has been deleted.</p>
                  )}
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {(["actioned", "reviewed", "dismissed"] as const).map((s) => (
                      <form key={s} action={updateReport}>
                        <input type="hidden" name="id" value={rep.id} />
                        <input type="hidden" name="tab" value="reports" />
                        <input type="hidden" name="status" value={s} />
                        <button className="w-full text-sm font-semibold py-2.5 rounded-xl bg-[#f7f5ef]">
                          {s === "actioned" ? "Actioned" : s === "reviewed" ? "Reviewed" : "Dismiss"}
                        </button>
                      </form>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

      {tab === "live" &&
        (approved.length === 0 ? (
          <Empty text="No live listings yet." />
        ) : (
          <div className="space-y-5">
            {approved.map((r) => (
              <ListingCard key={r.id} row={r} flags={flagsFor(r)} showLink>
                <form action={setVerificationLevel} className="space-y-2">
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="tab" value="live" />
                  <LevelSelect defaultValue={r.verification_level} />
                  <input name="note" maxLength={500} placeholder="Note: what did you check?" className={inputCls} />
                  <button className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-xl">Save level</button>
                </form>
                <form action={rejectListing} className="space-y-2 mt-4 pt-4 border-t border-[#e6e2d8]">
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="tab" value="live" />
                  <textarea name="reason" required maxLength={500} rows={2} placeholder="Reason for taking it down" className={inputCls} />
                  <button className="w-full bg-white border border-rose-300 text-rose-700 font-semibold py-3 rounded-xl">Take down</button>
                </form>
              </ListingCard>
            ))}
          </div>
        ))}
    </Shell>
  );
}

const inputCls = "w-full px-3 py-2.5 rounded-xl border border-[#e6e2d8] text-sm outline-none focus:border-emerald-400";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-[#1a2420]">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-1">Review listings</h1>
        <p className="text-sm text-[#6b6358] mb-5">Private to the 28Homes team. Approve, reject and verify listings.</p>
        {children}
      </main>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="text-center text-[#6b6358] py-16 border border-dashed border-[#e6e2d8] rounded-2xl">{text}</p>;
}

function LevelSelect({ defaultValue }: { defaultValue: number }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-[#6b6358] uppercase tracking-wider mb-1">Verification level</span>
      <select name="level" defaultValue={String(defaultValue)} className={`${inputCls} bg-white`}>
        {LEVEL_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-KE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Nairobi" });
}

function ListingCard({
  row, flags, showLink, children,
}: {
  row: ListingRow; flags: ScamFlag[]; showLink?: boolean; children: React.ReactNode;
}) {
  const badge = verificationBadge(row.verification_level);
  const strong = flags.some((f) => f.strong);
  return (
    <article className={`border rounded-2xl p-4 bg-white ${strong ? "border-rose-300" : "border-[#e6e2d8]"}`}>
      {row.images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto mb-3 -mx-1 px-1">
          {row.images.slice(0, 6).map((src) => (
            <a key={src} href={src} target="_blank" rel="noopener noreferrer" className="shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element -- remote Supabase URLs, small thumbnails */}
              <img src={src} alt="" loading="lazy" referrerPolicy="no-referrer" className="h-24 w-32 object-cover rounded-lg bg-[#f7f5ef]" />
            </a>
          ))}
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-bold leading-snug">{row.title || "Untitled"}</h2>
          <p className="text-sm text-[#6b6358] mt-0.5">
            {row.listing_type} · {row.property_type}
            {row.bedrooms != null ? ` · ${row.bedrooms === 0 ? "Studio" : `${row.bedrooms} bd`}` : ""} · {row.location}
          </p>
        </div>
        <p className="font-bold whitespace-nowrap">{row.price != null ? formatKsh(row.price) : "—"}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
        <span className="px-2 py-0.5 rounded-full bg-[#f7f5ef]">{row.verification_status}</span>
        {row.status && row.status !== "Available" && <span className="px-2 py-0.5 rounded-full bg-[#f7f5ef]">{row.status}</span>}
        {badge ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
            <BadgeCheck size={12} /> {badge.label}
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full bg-[#f7f5ef] text-[#6b6358]">Not verified</span>
        )}
        <span className="text-[#6b6358]">Posted {formatDate(row.created_at)}</span>
        {showLink && (
          <Link href={`/properties/${row.id}`} className="text-emerald-700 underline">
            View on site
          </Link>
        )}
      </div>

      <p className="text-sm mt-3 flex items-center gap-2">
        <Phone size={14} className="text-emerald-600 shrink-0" />
        {row.contact_name || "No name"} ·{" "}
        {row.contact_phone ? (
          <a href={`tel:${row.contact_phone}`} className="text-emerald-700 underline">
            {row.contact_phone}
          </a>
        ) : (
          "no phone"
        )}
      </p>

      {row.description && <p className="text-sm mt-2 text-[#5c554a] line-clamp-4 whitespace-pre-line">{row.description}</p>}

      {flags.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {flags.map((f) => (
            <li
              key={f.code}
              className={`flex items-start gap-2 text-sm rounded-lg px-3 py-2 ${f.strong ? "bg-rose-50 text-rose-800" : "bg-amber-50 text-amber-900"}`}
            >
              {f.strong ? <ShieldAlert size={16} className="shrink-0 mt-0.5" /> : <AlertTriangle size={16} className="shrink-0 mt-0.5" />}
              {f.label}
            </li>
          ))}
        </ul>
      )}

      {row.admin_notes && <p className="text-xs mt-3 text-[#6b6358]">Last note to owner: {row.admin_notes}</p>}

      <div className="mt-4">{children}</div>
    </article>
  );
}
