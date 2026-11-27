// app/api/deal-signal/route.ts
// Called by My Listings after a lister marks a listing Sold or Rented.
// The database trigger has already created a "possible" deal; this route alerts Ken
// once per deal. It trusts nothing from the caller except the listing id: it only
// alerts for a possible deal that really exists and hasn't been alerted yet.

import { after } from "next/server";
import { adminConfigured, createAdminClient } from "@/lib/admin";
import { alertKen } from "@/lib/notify";
import { formatKsh } from "@/lib/listing";
import { SITE } from "@/lib/site";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  let body: { propertyId?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  const propertyId = typeof body.propertyId === "string" ? body.propertyId : "";
  if (!UUID.test(propertyId)) return Response.json({ ok: false }, { status: 400 });
  if (!adminConfigured()) return Response.json({ ok: false, error: "not configured" }, { status: 503 });

  const db = createAdminClient();
  // Claim the alert atomically: only the first caller flips notified_at.
  const { data: deal } = await db
    .from("deals")
    .update({ notified_at: new Date().toISOString() })
    .eq("property_id", propertyId)
    .eq("status", "possible")
    .is("notified_at", null)
    .select("id, listing_status")
    .maybeSingle();
  if (!deal) return Response.json({ ok: true, alerted: false });

  const { data: listing } = await db
    .from("properties")
    .select("id, title, price, location, contact_name, contact_phone")
    .eq("id", propertyId)
    .maybeSingle();

  after(async () => {
    const title = listing?.title ?? "a listing";
    const price = listing?.price != null ? formatKsh(Number(listing.price)) : "";
    const lister = [listing?.contact_name, listing?.contact_phone].filter(Boolean).join(" ");
    const leads = await db
      .from("contact_events")
      .select("id", { count: "exact", head: true })
      .eq("property_id", propertyId);
    await alertKen(db, {
      kind: "deal",
      propertyId,
      subject: `Possible deal: ${title} marked ${deal.listing_status}`,
      text: [
        `The lister just marked a listing as ${deal.listing_status}.`,
        "",
        `Listing: ${title}`,
        `Asking price: ${price}`,
        `Location: ${listing?.location ?? ""}`,
        `Lister: ${lister || "not given"}`,
        `Leads from 28Homes on this listing: ${leads.count ?? 0}`,
        "",
        `Confirm the deal and record your commission: ${SITE.url}/admin/listings?tab=deals`,
      ].join("\n"),
      sms: `28Homes possible deal: ${title} marked ${deal.listing_status} (${price}). Confirm in admin > Deals.`,
    });
  });

  return Response.json({ ok: true, alerted: true });
}
