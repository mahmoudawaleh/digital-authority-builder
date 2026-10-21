import type { OrgRow } from "@/lib/orgs.functions";

export const PROFILE_FIELDS = [
  ["name", "Business name"], ["category", "Category"], ["city", "City"],
  ["logo_url", "Logo"], ["website", "Website"], ["phone", "Phone"],
  ["whatsapp", "WhatsApp"], ["email", "Email"], ["bio_en", "English bio"],
  ["bio_so", "Somali bio"], ["address", "Address"],
] as const;

export function profileEvidence(o: Partial<OrgRow>) {
  const fields = PROFILE_FIELDS.map(([key, label]) => {
    const value = o[key];
    return { key, label, value: typeof value === "string" ? value.trim() : "", present: typeof value === "string" && value.trim().length > 0 };
  });
  const filled = fields.filter((f) => f.present).length;
  const completeness = Math.round(filled / fields.length * 100);
  return { fields, filled, completeness, calculatedScore: Math.min(100, 40 + Math.round(completeness * 0.5)) };
}

export function rankWithin(rows: Pick<OrgRow, "trust_score">[], score: number) {
  return rows.filter((r) => r.trust_score > score).length + 1;
}

export function evidenceDate(value?: string | null) {
  if (!value || !Number.isFinite(Date.parse(value))) return "Not recorded";
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(value)) + " UTC";
}