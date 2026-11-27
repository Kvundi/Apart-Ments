"use client";

import { useEffect } from "react";
import { captureSourceFromUrl } from "@/lib/source";

/** Remembers ?src= campaign codes for the visit (see lib/source.ts). Renders nothing. */
export default function SourceTracker() {
  useEffect(() => {
    captureSourceFromUrl();
  }, []);
  return null;
}
