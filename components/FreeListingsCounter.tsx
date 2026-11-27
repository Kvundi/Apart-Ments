import Link from "next/link";
import { ArrowRight, BadgeCheck, Check, MessageCircle, Sparkles } from "lucide-react";

type Props = {
  /** Listings that have used a free slot (from the free_listing_slots_used() database function). */
  used: number;
  limit: number;
};

/**
 * Homepage promo for the launch offer: the first `limit` listings are free.
 * Shows the real number of slots left; the wording gets more urgent as slots run out.
 */
export default function FreeListingsCounter({ used, limit }: Props) {
  const taken = Math.min(Math.max(used, 0), limit);
  const left = limit - taken;
  const pct = Math.round((taken / limit) * 100);
  const soldOut = left === 0;

  const urgency = soldOut
    ? "All free launch slots have been claimed. Thank you!"
    : left <= 10
      ? `Only ${left} free ${left === 1 ? "slot" : "slots"} left. Claim yours today.`
      : taken >= limit / 2
        ? "Over half the free slots are gone."
        : "Free while slots last. Once 100 properties are listed, the offer ends.";

  return (
    <section className="max-w-7xl mx-auto px-6 pt-10 md:pt-14" aria-labelledby="free-listings-heading">
      <div className="relative overflow-hidden rounded-3xl bg-[#0c2a20] text-white">
        {/* soft glow */}
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative grid gap-8 px-6 py-10 md:grid-cols-[1.15fr_1fr] md:gap-12 md:px-12 md:py-14">
          {/* Offer */}
          <div className="flex flex-col justify-center">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-200">
              <Sparkles size={14} /> Launch offer · Owners, landlords &amp; agents
            </p>
            <h2 id="free-listings-heading" className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
              {soldOut ? (
                <>List your property on <span className="text-emerald-300">28Homes</span></>
              ) : (
                <>
                  List your property <span className="text-emerald-300">free</span>.
                  <br className="hidden sm:block" /> First {limit} only.
                </>
              )}
            </h2>
            <p className="mt-4 max-w-lg text-base text-white/75 md:text-lg">
              We put your home in front of buyers and tenants who have already told us their budget, area and moving date,
              then connect them to you.
            </p>

            <ul className="mt-6 space-y-2.5 text-sm md:text-base">
              {[
                { icon: Check, text: "No listing fee for the first 100 properties" },
                { icon: BadgeCheck, text: "Verified badge after a quick check by our team" },
                { icon: MessageCircle, text: "Screened enquiries passed to you on WhatsApp" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-white/90">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
                    <Icon size={14} />
                  </span>
                  {text}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/add?src=home-free100"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-7 py-4 text-base font-bold text-[#0c2a20] shadow-lg shadow-emerald-900/30 transition-colors hover:bg-emerald-300"
              >
                {soldOut ? "List your property" : "Claim a free slot"} <ArrowRight size={18} />
              </Link>
              <span className="text-sm text-white/60">Takes about 5 minutes · sign in with Google</span>
            </div>
          </div>

          {/* Counter */}
          <div className="flex flex-col justify-center rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm md:p-8">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-wider text-white/70">Free slots left</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-200">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
                </span>
                Live
              </span>
            </div>

            <p className="mt-3 flex items-baseline gap-2">
              <span className="text-7xl font-bold leading-none tabular-nums md:text-8xl">{left}</span>
              <span className="text-2xl font-semibold text-white/50 tabular-nums">/ {limit}</span>
            </p>

            <div
              className="mt-6 h-3 w-full overflow-hidden rounded-full bg-white/10"
              role="progressbar"
              aria-label="Free listing slots claimed"
              aria-valuemin={0}
              aria-valuemax={limit}
              aria-valuenow={taken}
            >
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-200" style={{ width: `${Math.max(pct, 2)}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-xs text-white/60 tabular-nums">
              <span>{taken} claimed</span>
              <span>{left} left</span>
            </div>

            <p className={`mt-5 text-sm font-medium ${left <= 10 && !soldOut ? "text-amber-200" : "text-white/80"}`}>{urgency}</p>
            <p className="mt-4 border-t border-white/10 pt-4 text-xs leading-relaxed text-white/50">
              Free listing for the first {limit} properties. 28Homes earns a commission only when a sale or rental closes
              through us. Listings are reviewed before going live.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
