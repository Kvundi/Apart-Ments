"use server";

// Admin review actions. Every function checks the caller is an admin first:
// Server Actions can be called by a direct POST, not just from the page.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient, requireAdmin } from "@/lib/admin";
import { toVerificationLevel } from "@/lib/listing";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TABS = new Set(["pending", "reports", "live"]);
const DAY_MS = 24 * 60 * 60 * 1000;

function str(formData: FormData, key: string, max = 500): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function backTo(formData: FormData, notice: string): never {
  const tab = str(formData, "tab", 20);
  const params = new URLSearchParams({ tab: TABS.has(tab) ? tab : "pending", notice });
  redirect(`/admin/listings?${params.toString()}`);
}

function refresh(propertyId: string) {
  revalidatePath("/admin/listings");
  revalidatePath("/properties");
  revalidatePath(`/properties/${propertyId}`);
  revalidatePath("/");
}

type Row = { id: string; verification_status: string | null; verification_level: number | null; expires_at: string | null };

async function loadListing(id: string): Promise<Row> {
  if (!UUID.test(id)) throw new Error("Invalid listing id");
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("properties")
    .select("id, verification_status, verification_level, expires_at")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Could not load listing: ${error.message}`);
  if (!data) throw new Error("Listing not found");
  return data as Row;
}

async function logEvent(event: {
  property_id: string; action: "approve" | "reject" | "set_level";
  old_status: string | null; new_status: string | null;
  old_level: number | null; new_level: number | null;
  note: string; actor: string;
}) {
  const { error } = await createAdminClient().from("verification_events").insert({ ...event, note: event.note || null });
  // The decision itself already saved; a missing log entry shouldn't undo it.
  if (error) console.error("verification_events insert failed:", error.message);
}

/** Publish a pending listing, optionally setting its trust level in the same step. */
export async function approveListing(formData: FormData) {
  const actor = await requireAdmin();
  const id = str(formData, "id", 36);
  const level = toVerificationLevel(str(formData, "level", 1));
  const note = str(formData, "note");
  const old = await loadListing(id);

  // A listing that waited too long in review may already be past its 30-day expiry,
  // which would make it invisible even after approval. Give it a fresh 30 days.
  const expires = old.expires_at ? new Date(old.expires_at).getTime() : 0;
  const update: Record<string, unknown> = {
    verification_status: "approved",
    verification_level: level,
    verified_at: level > 0 ? new Date().toISOString() : null,
    verified_by: level > 0 ? actor : null,
  };
  if (expires < Date.now() + 7 * DAY_MS) update.expires_at = new Date(Date.now() + 30 * DAY_MS).toISOString();

  const { error } = await createAdminClient().from("properties").update(update).eq("id", id);
  if (error) throw new Error(`Approve failed: ${error.message}`);
  await logEvent({
    property_id: id, action: "approve", actor, note,
    old_status: old.verification_status, new_status: "approved",
    old_level: old.verification_level, new_level: level,
  });
  refresh(id);
  backTo(formData, "Listing approved and live.");
}

/** Keep a listing off the site. The reason is shown to the owner on My Listings. */
export async function rejectListing(formData: FormData) {
  const actor = await requireAdmin();
  const id = str(formData, "id", 36);
  const reason = str(formData, "reason");
  if (!reason) backTo(formData, "Add a reason so the owner knows what to fix.");
  const old = await loadListing(id);

  const { error } = await createAdminClient()
    .from("properties")
    .update({ verification_status: "rejected", admin_notes: reason, verification_level: 0, verified_at: null, verified_by: null })
    .eq("id", id);
  if (error) throw new Error(`Reject failed: ${error.message}`);
  await logEvent({
    property_id: id, action: "reject", actor, note: reason,
    old_status: old.verification_status, new_status: "rejected",
    old_level: old.verification_level, new_level: 0,
  });
  refresh(id);
  backTo(formData, "Listing rejected. The owner will see your reason.");
}

/** Change the trust level of a live listing (after a call, ID check or visit). */
export async function setVerificationLevel(formData: FormData) {
  const actor = await requireAdmin();
  const id = str(formData, "id", 36);
  const level = toVerificationLevel(str(formData, "level", 1));
  const note = str(formData, "note");
  const old = await loadListing(id);
  if (old.verification_status !== "approved") backTo(formData, "Approve the listing before setting a verification level.");

  const { error } = await createAdminClient()
    .from("properties")
    .update({
      verification_level: level,
      verified_at: level > 0 ? new Date().toISOString() : null,
      verified_by: level > 0 ? actor : null,
    })
    .eq("id", id);
  if (error) throw new Error(`Update failed: ${error.message}`);
  await logEvent({
    property_id: id, action: "set_level", actor, note,
    old_status: old.verification_status, new_status: old.verification_status,
    old_level: old.verification_level, new_level: level,
  });
  refresh(id);
  backTo(formData, `Verification level set to ${level}.`);
}

const REPORT_STATUSES = new Set(["reviewed", "actioned", "dismissed"]);

/** Close a public report. */
export async function updateReport(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id", 36);
  const status = str(formData, "status", 20);
  if (!UUID.test(id) || !REPORT_STATUSES.has(status)) throw new Error("Invalid report update");

  const { error } = await createAdminClient().from("listing_reports").update({ status }).eq("id", id);
  if (error) throw new Error(`Report update failed: ${error.message}`);
  revalidatePath("/admin/listings");
  backTo(formData, `Report marked ${status}.`);
}
