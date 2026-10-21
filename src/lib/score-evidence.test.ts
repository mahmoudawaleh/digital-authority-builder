import { describe, expect, test } from "bun:test";
import { evidenceDate, profileEvidence, rankWithin } from "./score-evidence";

describe("score evidence reflects existing scoring rules", () => {
  test("counts the 11 actual scoring fields, excluding empty strings", () => {
    const result = profileEvidence({ name: "Example", category: "Banking", city: "Hargeisa", website: "  " });
    expect(result.filled).toBe(3);
    expect(result.completeness).toBe(27);
    expect(result.calculatedScore).toBe(54);
  });
  test("a complete profile produces 90, not an externally measured 100", () => {
    const result = profileEvidence({ name: "A", category: "B", city: "C", logo_url: "logo", website: "site", phone: "1", whatsapp: "2", email: "email", bio_en: "en", bio_so: "so", address: "address" });
    expect(result.completeness).toBe(100);
    expect(result.calculatedScore).toBe(90);
  });
  test("ties share a rank independently of display order", () => {
    expect(rankWithin([{ trust_score: 80 }, { trust_score: 94 }, { trust_score: 80 }], 80)).toBe(2);
  });
  test("missing freshness is not reported as fresh", () => {
    expect(evidenceDate(null)).toBe("Not recorded");
    expect(evidenceDate("invalid")).toBe("Not recorded");
  });
});