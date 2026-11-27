import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

type Props = {
  /** Listings that have used a free slot (from the free_listing_slots_used() database function). */
  used: number;
  limit: number;
};

/**
 * Compact launch-offer strip shown inside the homepage hero: the first `limit` listings are free.
 * Shows the real number of slots left; hidden once all slots are taken.
 */
export default function FreeListingsCounter({ used, limit }: Props) {
  const taken = Math.min(Math.max(used, 0), limit);
  const left = limit - taken;
  if (left === 0) return null;
  const pct = Math.max(Math.round((taken / limit) * 100), 2);
  const urgent = left <= 10;

  return (
    <Link
      href="/add?src=home-free100"
      aria-label={`List your property free: ${left} of ${limit} free slots left`}
      className="group mx-auto mt-8 flex w-full max-w-xl items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-left backdrop-blur-sm transition-colors hover:border-emerald-300/50 hover:bg-white/15"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-300">
        <Sparkles size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-3">
          <span className="text-sm font-semibold text-white">
            Own a property? <span className="text-emerald-300">List it free</span>
          </span>
          <span className={`shrink-0 text-xs font-semibold tabular-nums ${urgent ? "text-amber-200" : "text-white/70"}`}>
            {left} of {limit} slots left
          </span>
        </span>
        <span
          className="mt-2 block h-1.5 w-full overflow-hidden rounded-full bg-white/15"
          role="progressbar"
          aria-label="Free listing slots claimed"
          aria-valuemin={0}
          aria-valuemax={limit}
          aria-valuenow={taken}
        >
          <span className="block h-full rounded-full bg-emerald-300" style={{ width: `${pct}%` }} />
        </span>
      </span>
      <ArrowRight size={18} className="shrink-0 text-white/70 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
    </Link>
  );
}
