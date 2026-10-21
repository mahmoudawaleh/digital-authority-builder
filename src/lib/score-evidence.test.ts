import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { evidenceDate, profileEvidence, rankWithin } from "./score-evidence";

describe("score evidence reflects existing scoring rules", () => {
  test("counts the 11 actual scoring fields, excluding empty strings", () => {
    const result = profileEvidence({ name: "Example", category: "Banking", city: "Hargeisa", website: "  " });
    assert.equal(result.filled, 3);
    assert.equal(result.completeness, 27);
    assert.equal(result.calculatedScore, 54);
  });
  test("a complete profile produces 90, not an externally measured 100", () => {
    const result = profileEvidence({ name: "A", category: "B", city: "C", logo_url: "logo", website: "site", phone: "1", whatsapp: "2", email: "email", bio_en: "en", bio_so: "so", address: "address" });
    assert.equal(result.completeness, 100);
    assert.equal(result.calculatedScore, 90);
  });
  test("ties share a rank independently of display order", () => {
    assert.equal(rankWithin([{ trust_score: 80 }, { trust_score: 94 }, { trust_score: 80 }], 80), 2);
  });
  test("missing freshness is not reported as fresh", () => {
    assert.equal(evidenceDate(null), "Not recorded");
    assert.equal(evidenceDate("invalid"), "Not recorded");
  });
});