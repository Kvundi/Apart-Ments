/** "Jane Wanjiku" -> "JW". */
export function initials(name: string | null | undefined): string {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "KY";
  return parts.slice(0, 2).map((w) => w[0]!.toUpperCase()).join("");
}

export function firstName(name: string | null | undefined): string {
  return (name ?? "").trim().split(/\s+/)[0] ?? "";
}
