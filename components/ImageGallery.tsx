"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, Images, Home } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

/* eslint-disable @next/next/no-img-element -- listing photos are remote Supabase URLs with no loader configured */

/** Zillow-style photo mosaic with a swipeable mobile strip and a keyboard-friendly lightbox. */
export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);
  const n = images.length;

  const show = (i: number) => { setIndex(i); setOpen(true); };
  const prev = useCallback(() => setIndex((i) => (i - 1 + n) % n), [n]);
  const next = useCallback(() => setIndex((i) => (i + 1) % n), [n]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = overflow; };
  }, [open, prev, next]);

  if (n === 0) {
    return (
      <div className="h-72 md:h-96 bg-[#f7f5ef] border border-[#e6e2d8] rounded-3xl flex items-center justify-center">
        <div className="text-center text-[#9c948a]">
          <Home size={48} className="mx-auto mb-3 opacity-50" />
          <p>No photos yet</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile: swipe strip */}
      <div className="md:hidden relative -mx-6">
        <div
          ref={stripRef}
          onScroll={(e) => {
            const el = e.currentTarget;
            setMobileIndex(Math.round(el.scrollLeft / el.clientWidth));
          }}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          {images.map((src, i) => (
            <button key={i} type="button" onClick={() => show(i)} className="snap-center shrink-0 w-full h-72" aria-label={`Open photo ${i + 1}`}>
              <img src={src} alt={`${title} — photo ${i + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading={i === 0 ? "eager" : "lazy"} />
            </button>
          ))}
        </div>
        <span className="absolute bottom-3 right-6 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">{mobileIndex + 1} / {n}</span>
      </div>

      {/* Desktop: mosaic */}
      <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[460px] rounded-3xl overflow-hidden relative">
        <button type="button" onClick={() => show(0)} className={`${n === 1 ? "col-span-4" : "col-span-2"} row-span-2 relative group`} aria-label="Open photo 1">
          <img src={images[0]} alt={`${title} — main photo`} className="w-full h-full object-cover group-hover:brightness-95 transition" referrerPolicy="no-referrer" />
        </button>
        {images.slice(1, 5).map((src, i) => (
          <button key={i} type="button" onClick={() => show(i + 1)}
            className={`relative group ${n === 2 ? "col-span-2 row-span-2" : n === 3 || (n === 4 && i === 2) ? "col-span-2" : ""}`} aria-label={`Open photo ${i + 2}`}>
            <img src={src} alt={`${title} — photo ${i + 2}`} className="w-full h-full object-cover group-hover:brightness-95 transition" referrerPolicy="no-referrer" loading="lazy" />
          </button>
        ))}
        {n > 1 && (
          <button type="button" onClick={() => show(0)}
            className="absolute bottom-4 right-4 inline-flex items-center gap-2 bg-white/95 hover:bg-white text-[#1a2420] text-sm font-semibold px-4 py-2 rounded-xl shadow">
            <Images size={16} /> See all {n} photos
          </button>
        )}
      </div>

      {/* Lightbox */}
      {open && (
        <div className="fixed inset-0 bg-black/95 z-[2000] flex flex-col" role="dialog" aria-modal="true" aria-label={`${title} photos`}>
          <div className="flex items-center justify-between px-5 py-4 text-white">
            <span className="text-sm">{index + 1} / {n}</span>
            <button onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-white/10" aria-label="Close photos"><X size={26} /></button>
          </div>
          <div className="flex-1 relative flex items-center justify-center min-h-0 px-4" onClick={() => setOpen(false)}>
            <img src={images[index]} alt={`${title} — photo ${index + 1}`} className="max-w-full max-h-full object-contain" onClick={(e) => e.stopPropagation()} referrerPolicy="no-referrer" />
            {n > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white p-3 rounded-full" aria-label="Previous photo"><ChevronLeft size={28} /></button>
                <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white p-3 rounded-full" aria-label="Next photo"><ChevronRight size={28} /></button>
              </>
            )}
          </div>
          {n > 1 && (
            <div className="flex gap-2 overflow-x-auto px-5 py-4 justify-center">
              {images.map((src, i) => (
                <button key={i} onClick={() => setIndex(i)} className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 ${i === index ? "border-emerald-400" : "border-transparent opacity-60 hover:opacity-100"}`} aria-label={`Show photo ${i + 1}`}>
                  <img src={src} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
