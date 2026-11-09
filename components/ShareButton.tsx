"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

/** Uses the native share sheet on phones (WhatsApp, SMS…), falls back to copying the link. */
export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text: `${title} — on Apart Ments`, url });
        return;
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return; // user closed the sheet
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={copied ? "Link copied" : "Share this property"}
      title={copied ? "Link copied!" : "Share"}
      className="p-2.5 rounded-xl border border-[#e6e2d8] hover:bg-[#f7f5ef] transition-colors"
    >
      {copied ? <Check size={20} className="text-emerald-600" /> : <Share2 size={20} className="text-[#6b6358]" />}
    </button>
  );
}
