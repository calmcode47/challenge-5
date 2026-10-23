import { describe, expect, it } from "vitest";
import type { Enrichment } from "../../contracts/enrichment.js";
import { applyEnrichment } from "./applyEnrichment.js";
import { BASE_PLAN, SAMPLE_ENRICHMENT } from "./enrichmentTestFixtures.js";

describe("applyEnrichment.merge", () => {
  it("applies a valid budget shift, merges briefs and narrative, and sets AI provenance", () => {
    const outcome = applyEnrichment(BASE_PLAN, SAMPLE_ENRICHMENT, "2026-10-23T14:30:00.000Z");

    expect(outcome.shiftResults).toHaveLength(1);
    expect(outcome.shiftResults[0]?.applied).toBe(true);

    const decorLine = outcome.plan.budget.lines.find((l) => l.categoryId === "decor");
    const entLine = outcome.plan.budget.lines.find((l) => l.categoryId === "entertainment");

    expect(decorLine?.allocatedMinor).toBe(200000);
    expect(entLine?.allocatedMinor).toBe(100000);

    expect(outcome.plan.narrative).toBe(SAMPLE_ENRICHMENT.narrative);
    expect(outcome.plan.briefs).toHaveLength(1);
    expect(outcome.plan.ideas).toHaveLength(1);
    expect(outcome.plan.provenance.enrichment).toBe("ai");
    expect(outcome.plan.updatedAt).toBe("2026-10-23T14:30:00.000Z");
  });

  it("applies a valid shift from contingency when resulting reserve remains >= 5%", () => {
    const validContingencyShiftEnrichment: Enrichment = {
      ...SAMPLE_ENRICHMENT,
      suggestedBudgetShifts: [
        {
          from: "contingency",
          to: "decor",
          amountMinor: 20000,
          rationale: "Use part of contingency reserve for flowers",
        },
      ],
    };

    const outcome = applyEnrichment(
      BASE_PLAN,
      validContingencyShiftEnrichment,
      new Date("2026-10-23T14:30:00.000Z")
    );

    expect(outcome.shiftResults[0]?.applied).toBe(true);
    const contLine = outcome.plan.budget.lines.find((l) => l.categoryId === "contingency");
    expect(contLine?.allocatedMinor).toBe(80000);
    expect(outcome.plan.updatedAt).toBe("2026-10-23T14:30:00.000Z");
  });

  it("sets enrichment provenance to demo when enrichment source is demo", () => {
    const demoEnrichment: Enrichment = {
      ...SAMPLE_ENRICHMENT,
      meta: {
        model: "demo-pack",
        source: "demo",
        requestId: "demo-req",
      },
    };

    const outcome = applyEnrichment(BASE_PLAN, demoEnrichment, "2026-10-23T14:30:00.000Z");
    expect(outcome.plan.provenance.enrichment).toBe("demo");
  });

  it("sets enrichment provenance to none when enrichment source is fallback", () => {
    const fallbackEnrichment: Enrichment = {
      ...SAMPLE_ENRICHMENT,
      meta: {
        model: "fallback",
        source: "fallback",
        requestId: "fallback-req",
      },
    };

    const outcome = applyEnrichment(BASE_PLAN, fallbackEnrichment, "2026-10-23T14:30:00.000Z");
    expect(outcome.plan.provenance.enrichment).toBe("none");
  });
});
