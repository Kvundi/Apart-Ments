"use client";

import { useState } from "react";
import { Phone, Mail, MessageSquare, X, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type ContactCardProps = {
  propertyId: string;
  contactPhone?: string;
  contactEmail?: string;
  preferredContact?: string;
};

export default function ContactCard({ 
  propertyId, 
  contactPhone, 
  contactEmail,
  preferredContact = "phone"
}: ContactCardProps) {
  const [showPhone, setShowPhone] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !senderName.trim()) return;

    setSending(true);
    const supabase = createClient();

    const { error } = await supabase.from("inquiries").insert({
      property_id: propertyId,
      sender_name: senderName,
      sender_phone: senderPhone,
      message: message,
    });

    if (error) {
      alert("Failed to send message. Please try again.");
    } else {
      setSent(true);
      setMessage("");
      setSenderName("");
      setSenderPhone("");
      setTimeout(() => {
        setSent(false);
        setShowMessageForm(false);
      }, 3000);
    }
    setSending(false);
  };

  return (
    <div className="sticky top-24 card rounded-2xl p-6 space-y-6">
      <h2 className="text-xl font-bold">Interested in this property?</h2>
      <p className="text-sm text-[#c8b8a8]">
        Contact the owner or agent to schedule a viewing.
      </p>

      {/* Phone Reveal */}
      <div>
        {!showPhone ? (
          <button 
            onClick={() => setShowPhone(true)}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition"
          >
            <Phone size={20} />
            Show Phone Number
          </button>
        ) : (
          <div className="w-full bg-emerald-900/30 border border-emerald-500/30 rounded-2xl p-4 text-center">
            <Phone size={20} className="mx-auto text-emerald-400 mb-2" />
            <p className="text-2xl font-bold text-emerald-400">{contactPhone || "Not provided"}</p>
            <p className="text-xs text-[#c8b8a8] mt-1">Preferred contact method</p>
          </div>
        )}
      </div>

      {/* Email */}
      {contactEmail && (
        <a 
          href={`mailto:${contactEmail}`}
          className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition block"
        >
          <Mail size={20} />
          Send Email
        </a>
      )}

      {/* Message Form Toggle */}
      {!showMessageForm ? (
        <button 
          onClick={() => setShowMessageForm(true)}
          className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition"
        >
          <MessageSquare size={20} />
          Send Message
        </button>
      ) : (
        <div className="bg-zinc-800/50 rounded-2xl p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Send Inquiry</h3>
            <button onClick={() => setShowMessageForm(false)} className="text-[#c8b8a8] hover:text-white">
              <X size={18} />
            </button>
          </div>

          {sent ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-emerald-400 font-semibold">Message sent!</p>
              <p className="text-sm text-[#c8b8a8]">The seller will contact you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="space-y-3">
              <input
                type="text"
                placeholder="Your name"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                required
                className="input w-full px-4 py-3 rounded-xl text-sm"
              />
              <input
                type="tel"
                placeholder="Your phone number"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                className="input w-full px-4 py-3 rounded-xl text-sm"
              />
              <textarea
                placeholder="Hi, I'm interested in this property. Is it still available?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={3}
                className="input w-full px-4 py-3 rounded-xl text-sm"
              />
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition"
              >
                <Send size={16} />
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      )}

      <p className="text-xs text-[#c8b8a8] text-center">
        Keja Yangu never shares your contact info with third parties.
      </p>
    </div>
  );
}