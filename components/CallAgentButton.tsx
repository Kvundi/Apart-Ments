"use client";

import { useState } from "react";
import { Phone, Copy, Check } from "lucide-react";

type Props = {
  /** Phone number in E.164 format, e.g. "+254712345678". */
  phone: string;
  /** Lister's name — the button reads "Call <first name>". */
  name: string;
};

/**
 * Call button: a tel: link (opens the dialer on phones) plus a copy button
 * for desktop users, where tel: links often do nothing.
 */
export default function CallAgentButton({ phone, name }: Props) {
  const [copied, setCopied] = useState(false);
  const firstName = name.split(/\s+/)[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (e.g. insecure context); the number is shown on the page anyway.
    }
  };

  return (
    <div className="flex gap-2">
      <a
        href={`tel:${phone}`}
        className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-4 rounded-2xl transition-colors"
      >
        <Phone size={20} />
        Call {firstName}
      </a>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Number copied" : "Copy phone number"}
        title={copied ? "Copied!" : "Copy number"}
        className="px-4 rounded-2xl border border-[#e6e2d8] hover:bg-[#f7f5ef] transition-colors text-[#6b6358]"
      >
        {copied ? <Check size={20} className="text-emerald-600" /> : <Copy size={20} />}
      </button>
    </div>
  );
}
