import { describe, expect, it } from "vitest";
import { EVENT_TYPES } from "../../contracts/enums.js";
import type { PlanInput } from "../../contracts/planInput.js";
import { buildBaselineBriefs } from "./briefs.js";

describe("buildBaselineBriefs — Brief Integrity & Anti-Hallucination Audit", () => {
  const baseInput: PlanInput = {
    eventType: "wedding",
    title: "Brief Audit Event",
    eventDate: "2027-10-15",
    guestCount: 150,
    budget: { currency: "USD", totalMinor: 3_000_000 },
    venueType: "banquet_hall",
    dietary: [],
    accessibilityNeeds: [],
    priorities: {},
  };

  it("produces valid VendorBrief objects for every active category across all event types", () => {
    for (const eventType of EVENT_TYPES) {
      const briefs = buildBaselineBriefs({ ...baseInput, eventType });
      expect(briefs.length).toBeGreaterThan(0);

      for (const brief of briefs) {
        expect(brief.categoryId).toBeDefined();
        expect(brief.categoryId).not.toBe("contingency");
        expect(brief.whatToLookFor.length).toBeGreaterThan(0);
        expect(brief.questionsToAsk.length).toBeGreaterThan(0);
        expect(brief.redFlags.length).toBeGreaterThan(0);
        expect(brief.contractTerms.length).toBeGreaterThan(0);
      }
    }
  });

  it("scans all brief strings against a strict regex to guarantee zero URLs, emails, currencies, or business names", () => {
    // Audit regex checking for:
    // 1. URLs (http://, https://, www., .com, .org, .net, etc.)
    // 2. Email addresses
    // 3. Currency symbols ($ € £ ¥ ₹)
    // 4. Commercial corporate entity suffixes (Inc, LLC, Ltd, Corp)
    const urlPattern = /https?:\/\/|www\.|\.com|\.org|\.net/i;
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const currencyPattern = /[$€£¥₹]/;
    const businessSuffixPattern = /\b(Inc\.|LLC|Corp\.|Ltd\.)\b/i;

    for (const eventType of EVENT_TYPES) {
      const briefs = buildBaselineBriefs({ ...baseInput, eventType });

      for (const brief of briefs) {
        const allStrings = [
          ...brief.whatToLookFor,
          ...brief.questionsToAsk,
          ...brief.redFlags,
          ...brief.contractTerms,
        ];

        for (const str of allStrings) {
          expect(urlPattern.test(str), `URL found in brief (${brief.categoryId}): "${str}"`).toBe(
            false
          );
          expect(
            emailPattern.test(str),
            `Email found in brief (${brief.categoryId}): "${str}"`
          ).toBe(false);
          expect(
            currencyPattern.test(str),
            `Currency symbol found in brief (${brief.categoryId}): "${str}"`
          ).toBe(false);
          expect(
            businessSuffixPattern.test(str),
            `Business entity found in brief (${brief.categoryId}): "${str}"`
          ).toBe(false);
        }
      }
    }
  });
});
