import { describe, expect, it } from "vitest";
import type { Enrichment } from "../../contracts/enrichment.js";
import { applyEnrichment } from "./applyEnrichment.js";
import { BASE_PLAN, SAMPLE_ENRICHMENT } from "./enrichmentTestFixtures.js";

describe("applyEnrichment.rejections", () => {
  it("strictly protects user invariants against hostile enrichment tampering", () => {
    const hostileEnrichment: Enrichment = {
      ...SAMPLE_ENRICHMENT,
      suggestedBudgetShifts: [
        {
          from: "contingency",
          to: "catering",
          amountMinor: 80000,
          rationale: "More food!",
        },
      ],
    };

    const outcome = applyEnrichment(BASE_PLAN, hostileEnrichment, "2026-10-23T15:00:00.000Z");

    expect(outcome.shiftResults[0]?.applied).toBe(false);
    expect(outcome.shiftResults[0]?.reason).toBe("INVARIANT_VIOLATION");

    const contLine = outcome.plan.budget.lines.find((l) => l.categoryId === "contingency");
    expect(contLine?.allocatedMinor).toBe(100000);

    expect(outcome.plan.budget.totalMinor).toBe(BASE_PLAN.budget.totalMinor);
    expect(outcome.plan.input.budget.totalMinor).toBe(BASE_PLAN.input.budget.totalMinor);

    expect(outcome.plan.vendors).toHaveLength(1);
    expect(outcome.plan.vendors[0]?.name).toBe("Green Leaf Organic Catering");
    expect(outcome.plan.vendors[0]?.stage).toBe("booked");

    expect(outcome.plan.timeline.milestones[0]?.done).toBe(true);
    expect(outcome.plan.checklist[0]?.done).toBe(true);
  });

  it("rejects shifts with unknown category, same category, or amount exceeding source allocation", () => {
    const unknownCatEnrichment: Enrichment = {
      ...SAMPLE_ENRICHMENT,
      suggestedBudgetShifts: [
        {
          from: "marketing",
          to: "decor",
          amountMinor: 10000,
          rationale: "Invalid category not in plan",
        },
        {
          from: "entertainment",
          to: "decor",
          amountMinor: 99999999,
          rationale: "Too high",
        },
        {
          from: "decor",
          to: "decor",
          amountMinor: 5000,
          rationale: "Self shift",
        },
        {
          from: "venue",
          to: "catering",
          amountMinor: 160000,
          rationale: "Over cap",
        },
      ],
    };

    const outcome = applyEnrichment(BASE_PLAN, unknownCatEnrichment, "2026-10-23T15:00:00.000Z");

    expect(outcome.shiftResults[0]?.applied).toBe(false);
    expect(outcome.shiftResults[0]?.reason).toBe("UNKNOWN_CATEGORY");

    expect(outcome.shiftResults[1]?.applied).toBe(false);
    expect(outcome.shiftResults[1]?.reason).toBe("EXCEEDS_SOURCE");

    expect(outcome.shiftResults[2]?.applied).toBe(false);
    expect(outcome.shiftResults[2]?.reason).toBe("UNKNOWN_CATEGORY");

    expect(outcome.shiftResults[3]?.applied).toBe(false);
    expect(outcome.shiftResults[3]?.reason).toBe("INVARIANT_VIOLATION");
  });
});
