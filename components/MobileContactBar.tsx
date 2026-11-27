"use client";

import { MessageCircle, Phone } from "lucide-react";
import { logContactTap } from "@/lib/contactEvents";
import { currentSource, withSource } from "@/lib/source";

type Props = { whatsappHref: string; phone: string; propertyId: string };

/** Contact bar pinned above the bottom navigation on phones. Taps are logged as leads. */
export default function MobileContactBar({ whatsappHref, phone, propertyId }: Props) {
  return (
    <>
      <div className="h-20 lg:hidden" aria-hidden="true" />
      <div className="lg:hidden fixed inset-x-0 bottom-[58px] z-40 bg-white/95 backdrop-blur border-t border-[#e6e2d8] px-4 py-3 flex gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.currentTarget.href = withSource(whatsappHref, currentSource());
            logContactTap(propertyId, "whatsapp");
          }}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold py-3 rounded-xl"
        >
          <MessageCircle size={18} /> WhatsApp
        </a>
        <a
          href={`tel:${phone}`}
          onClick={() => logContactTap(propertyId, "call")}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold py-3 rounded-xl"
        >
          <Phone size={18} /> Call
        </a>
      </div>
    </>
  );
}
