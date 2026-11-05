"use client";

import { Heart } from "lucide-react";
import { toggleSavedHome, useSavedHomes } from "@/lib/savedHomes";

type Props = {
  propertyId: string;
  /** "overlay" = round white button on top of a card photo; "outline" = detail-page toolbar button. */
  variant?: "overlay" | "outline";
  className?: string;
};

export default function SaveHomeButton({ propertyId, variant = "outline", className = "" }: Props) {
  const saved = useSavedHomes().includes(propertyId);

  const base =
    variant === "overlay"
      ? "p-2 rounded-full bg-white/90 hover:bg-white shadow-md backdrop-blur-sm"
      : "p-2.5 rounded-xl border border-[#e6e2d8] hover:bg-[#f7f5ef]";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSavedHome(propertyId);
      }}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved homes" : "Save this home"}
      title={saved ? "Saved" : "Save"}
      className={`${base} transition-colors ${className}`}
    >
      <Heart
        size={variant === "overlay" ? 18 : 20}
        className={saved ? "fill-rose-500 text-rose-500" : "text-[#6b6358]"}
      />
    </button>
  );
}
