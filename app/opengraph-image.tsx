import { ImageResponse } from "next/og";

export const alt = "Apart Ments — homes for sale and rent in Kenya";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default share card (WhatsApp, Facebook, X). Listing pages use their own photo instead. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
          padding: 72, background: "linear-gradient(135deg, #0c2a20 0%, #10402f 60%, #047857 100%)", color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: "#047857", border: "3px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>
            ⌂
          </div>
          <div style={{ fontSize: 44, fontWeight: 700, display: "flex" }}>
            Apart<span style={{ color: "#6ee7b7" }}>Ments</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, display: "flex" }}>{"Find a home you'll love in Kenya"}</div>
          <div style={{ fontSize: 28, marginTop: 24, color: "#c7e9da" }}>Homes and land for sale and rent · Every listing reviewed · No viewing fees</div>
        </div>
      </div>
    ),
    size
  );
}
