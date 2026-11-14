"use client";

import { MessageCircle } from "lucide-react";
import { logContactTap } from "@/lib/contactEvents";

type Props = {
  /** Full wa.me link, including the pre-filled message. */
  href: string;
  propertyId: string;
};

/** "Chat on WhatsApp" link that also records the tap as an enquiry. */
export default function WhatsAppButton({ href, propertyId }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => logContactTap(propertyId, "whatsapp")}
      className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5c] text-white font-semibold py-4 rounded-2xl transition-colors mb-3"
    >
      <MessageCircle size={20} />
      Chat on WhatsApp
    </a>
  );
}
