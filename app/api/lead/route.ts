// app/api/lead/route.ts
// Called (fire-and-forget) when a visitor taps WhatsApp, Call or Copy number on a listing.
// Records the tap in `contact_events` and alerts Ken (email/SMS, see lib/notify.ts).
//
// Public endpoint: anyone can call it, so it validates input, only accepts live
// listings, and alerts are throttled to one per listing per 10 minutes.

import { after } from "next/server";
import { adminConfigured, createAdminClient } from "@/lib/admin";
import { alertKen } from "@/lib/notify";
import { formatKsh } from "@/lib/listing";
import { SITE } from "@/lib/site";
import { listingRef } from "@/lib/contact";
import { normaliseSource } from "@/lib/source";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CHANNELS = { whatsapp: "WhatsApp", call: "Call", copy_number: "Copied number" } as const;
type Channel = keyof typeof CHANNELS;

export async function POST(request: Request) {
  let body: { propertyId?: unknown; channel?: unknown; source?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  const propertyId = typeof body.propertyId === "string" ? body.propertyId : "";
  const channel = typeof body.channel === "string" && body.channel in CHANNELS ? (body.channel as Channel) : null;
  if (!UUID.test(propertyId) || !channel) return Response.json({ ok: false }, { status: 400 });
  const source = normaliseSource(body.source);
  if (!adminConfigured()) return Response.json({ ok: false, error: "not configured" }, { status: 503 });

  const db = createAdminClient();
  const { data: listing } = await db
    .from("properties")
    .select("id, title, price, location, listing_type, contact_name, contact_phone, status, verification_status")
    .eq("id", propertyId)
    .maybeSingle();
  if (!listing || listing.verification_status !== "approved") return Response.json({ ok: false }, { status: 404 });

  const { error } = await db.from("contact_events").insert({ property_id: propertyId, channel, source });
  if (error) return Response.json({ ok: false }, { status: 500 });

  // Respond straight away; send the alert after the response.
  after(async () => {
    const price = listing.price != null ? formatKsh(Number(listing.price)) : "";
    const lister = [listing.contact_name, listing.contact_phone].filter(Boolean).join(" ");
    const link = `${SITE.url}/properties/${listing.id}`;
    await alertKen(db, {
      kind: "lead",
      propertyId,
      subject: `New lead: ${CHANNELS[channel]} · ref ${listingRef(listing.id)} · ${listing.title}`,
      text: [
        `A client just tapped "${CHANNELS[channel]}" on a 28Homes listing, so they are contacting your 28Homes number now.`,
        `Their WhatsApp message will quote ref ${listingRef(listing.id)}${source ? ` (via ${source.toUpperCase()})` : ""}.`,
        `Came from: ${source ? source.toUpperCase() : "direct / unknown"}`,
        "",
        `Listing: ${listing.title} (ref ${listingRef(listing.id)})`,
        `Price: ${price} (${listing.listing_type ?? ""})`,
        `Location: ${listing.location ?? ""}`,
        `Lister to connect them with: ${lister || "not given"}`,
        `Link: ${link}`,
        "",
        `All leads: ${SITE.url}/admin/listings?tab=leads`,
        "",
        "You get at most one alert per listing every 10 minutes.",
      ].join("\n"),
      sms: `28Homes lead ${listingRef(listing.id)}${source ? ` via ${source.toUpperCase()}` : ""}: ${CHANNELS[channel]} on ${listing.title} (${price}). Lister: ${lister || "-"}`,
    });
  });

  return Response.json({ ok: true });
}
