"use client";

import { useState } from "react";
import { Flag, X, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const REASONS = [
  { value: "viewing_fee",   label: "Asked me to pay a viewing fee or deposit before viewing" },
  { value: "scam",          label: "Looks like a scam / suspicious behaviour" },
  { value: "fake",          label: "Property doesn't exist or photos are fake" },
  { value: "unavailable",   label: "Already let or sold" },
  { value: "wrong_details", label: "Wrong price, location or details" },
  { value: "other",         label: "Something else" },
] as const;

/** "Report this listing" — anyone can report; reports land in `listing_reports` for the team. */
export default function ReportListingButton({ propertyId }: { propertyId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>("");
  const [details, setDetails] = useState("");
  const [contact, setContact] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const close = () => {
    setOpen(false);
    if (state === "sent") {
      setReason(""); setDetails(""); setContact(""); setState("idle");
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;
    setState("sending");
    // Anonymous client on purpose: reports must work signed-out too.
    const { error } = await createClient().from("listing_reports").insert({
      property_id: propertyId,
      reason,
      details: details.trim().slice(0, 2000) || null,
      reporter_contact: contact.trim().slice(0, 100) || null,
      reporter_user_id: null,
    });
    if (error) {
      console.warn("Report failed:", error.message);
      setState("error");
      return;
    }
    setState("sent");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-sm text-[#6b6358] hover:text-red-600 transition-colors"
      >
        <Flag size={14} /> Report this listing
      </button>

      {open && (
        <div className="fixed inset-0 z-[1000] bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={close}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-title"
            className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 id="report-title" className="text-lg font-bold">Report this listing</h2>
              <button type="button" onClick={close} aria-label="Close" className="p-1 text-[#6b6358] hover:text-[#1a2420]">
                <X size={20} />
              </button>
            </div>

            {state === "sent" ? (
              <div className="text-center py-6">
                <CheckCircle2 size={44} className="mx-auto text-emerald-600 mb-3" />
                <p className="font-semibold">Thank you — our team will review this listing.</p>
                <p className="text-sm text-[#6b6358] mt-2">
                  If you&apos;ve lost money, also report it at your nearest police station.
                </p>
                <button type="button" onClick={close} className="mt-6 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold">
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <fieldset className="space-y-2">
                  <legend className="text-sm font-medium mb-2">What&apos;s wrong?</legend>
                  {REASONS.map((r) => (
                    <label
                      key={r.value}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer text-sm ${reason === r.value ? "border-emerald-500 bg-emerald-50" : "border-[#e6e2d8] hover:bg-[#f7f5ef]"}`}
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={r.value}
                        checked={reason === r.value}
                        onChange={() => setReason(r.value)}
                        className="mt-0.5 accent-emerald-600"
                      />
                      {r.label}
                    </label>
                  ))}
                </fieldset>
                <label className="block">
                  <span className="text-sm font-medium">Details (optional)</span>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={3}
                    maxLength={2000}
                    placeholder="e.g. They asked for KSh 1,000 on M-Pesa before showing the house"
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-[#e6e2d8] text-sm outline-none focus:border-emerald-400"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Your phone or email (optional, so we can follow up)</span>
                  <input
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    maxLength={100}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-[#e6e2d8] text-sm outline-none focus:border-emerald-400"
                  />
                </label>
                {state === "error" && <p className="text-sm text-red-600">Couldn&apos;t send your report. Please try again.</p>}
                <button
                  type="submit"
                  disabled={!reason || state === "sending"}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-gray-300 text-white font-semibold"
                >
                  {state === "sending" ? "Sending…" : "Send report"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
