import Link from "next/link";

/** House-and-key mark. Pure SVG so it stays crisp at any size. */
export function LogoMark({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" className={className}>
      <rect width="40" height="40" rx="11" fill="#047857" />
      <path d="M9 19.5 20 10l11 9.5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.5 17.5V30h15V17.5" fill="none" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="20" cy="22.5" r="2.6" fill="#fcd34d" />
      <path d="M20 25v5" stroke="#fcd34d" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export default function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0" aria-label="Apart Ments home">
      <LogoMark className="transition-transform group-hover:scale-105" />
      <span className={`text-xl font-bold tracking-tight ${tone === "light" ? "text-white" : "text-[#1a2420]"}`}>
        Apart<span className="text-emerald-600">Ments</span>
      </span>
    </Link>
  );
}
