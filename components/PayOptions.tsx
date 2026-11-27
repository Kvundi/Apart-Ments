"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2, Smartphone } from "lucide-react";

type Props = {
  token: string;
  balance: number;
  online: boolean;
  /** True after returning from the card/bank checkout: start checking straight away. */
  checkOnLoad: boolean;
};

type Phase = "idle" | "sending" | "waiting" | "done" | "error";

const fmt = (n: number) => `KSh ${Math.round(n).toLocaleString("en-KE")}`;
const POLL_MS = 5000;
const MAX_POLLS = 36; // 3 minutes

export default function PayOptions({ token, balance, online, checkOnLoad }: Props) {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [phase, setPhase] = useState<Phase>(checkOnLoad ? "waiting" : "idle");
  const [message, setMessage] = useState(checkOnLoad ? "Checking your payment…" : "");
  const polls = useRef(0);

  useEffect(() => {
    if (phase !== "waiting") return;
    polls.current = 0;
    const timer = setInterval(async () => {
      polls.current += 1;
      try {
        const res = await fetch(`/api/pay/status?token=${encodeURIComponent(token)}`, { cache: "no-store" });
        const data = await res.json();
        if (data.status === "Paid") {
          clearInterval(timer);
          setPhase("done");
          setMessage("Payment received. Thank you!");
          router.refresh();
          return;
        }
        if (data.lastAttempt?.failed) {
          clearInterval(timer);
          setPhase("error");
          setMessage("The payment didn't go through (cancelled, wrong PIN or not enough balance). You can try again.");
          router.refresh();
          return;
        }
      } catch {
        // network blip: keep polling
      }
      if (polls.current >= MAX_POLLS) {
        clearInterval(timer);
        setPhase("idle");
        setMessage("Still waiting for confirmation. If you completed the payment, refresh this page in a minute.");
      }
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [phase, token, router]);

  async function payMpesa(e: React.FormEvent) {
    e.preventDefault();
    setPhase("sending");
    setMessage("");
    try {
      const res = await fetch("/api/pay/mpesa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, phone }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setPhase("error");
        setMessage(data.error ?? "Something went wrong. Try again.");
        return;
      }
      setPhase("waiting");
      setMessage(`Check your phone and enter your M-Pesa PIN to pay ${fmt(data.amount)}.`);
    } catch {
      setPhase("error");
      setMessage("Couldn't reach the server. Check your connection and try again.");
    }
  }

  async function payCheckout() {
    setPhase("sending");
    setMessage("");
    try {
      const res = await fetch("/api/pay/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok || typeof data.url !== "string") {
        setPhase("error");
        setMessage(data.error ?? "Something went wrong. Try again.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setPhase("error");
      setMessage("Couldn't reach the server. Check your connection and try again.");
    }
  }

  const busy = phase === "sending" || phase === "waiting";

  return (
    <div className="space-y-4">
      {message && (
        <p
          role="status"
          className={`rounded-2xl px-4 py-3 text-sm flex items-start gap-2 ${
            phase === "error" ? "bg-red-50 text-red-800" : phase === "done" ? "bg-emerald-50 text-emerald-800" : "bg-sky-50 text-sky-900"
          }`}
        >
          {phase === "waiting" && <Loader2 size={16} className="animate-spin shrink-0 mt-0.5" />}
          {message}
        </p>
      )}

      {online && phase !== "done" && (
        <>
          <form onSubmit={payMpesa} className="rounded-2xl border border-[#e6e2d8] p-5 space-y-3">
            <p className="flex items-center gap-2 font-semibold">
              <Smartphone size={18} className="text-emerald-600" /> Pay with M-Pesa
            </p>
            <label className="block">
              <span className="block text-sm text-[#6b6358] mb-1">Safaricom number to receive the PIN prompt</span>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0712 345 678"
                className="input w-full px-4 py-3 rounded-xl"
              />
            </label>
            <button
              disabled={busy}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-[#d6d1c4] text-white font-semibold py-3.5 rounded-xl"
            >
              {phase === "sending" ? "Sending prompt…" : `Send M-Pesa prompt for ${fmt(balance)}`}
            </button>
          </form>

          <button
            type="button"
            onClick={payCheckout}
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border border-[#e6e2d8] bg-white py-3.5 font-semibold hover:border-emerald-400 disabled:opacity-60"
          >
            <CreditCard size={18} /> Pay by card or bank
          </button>
          <p className="text-xs text-center text-[#9c948a]">Card and bank payments are processed securely by IntaSend.</p>
        </>
      )}
    </div>
  );
}
