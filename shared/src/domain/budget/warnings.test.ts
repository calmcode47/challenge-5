import { describe, expect, it } from "vitest";
import type { BudgetLine } from "../../contracts/planComponents.js";
import type { PlanInput } from "../../contracts/planInput.js";
import { evaluateBudgetWarnings } from "./warnings.js";

function makeMinimalInput(overrides?: Partial<PlanInput>): PlanInput {
  return {
    eventType: "wedding",
    title: "Minimal Test Plan",
    eventDate: "2027-06-15",
    guestCount: 100,
    budget: {
      currency: "USD",
      totalMinor: 100_000,
    },
    venueType: "banquet_hall",
    dietary: [],
    accessibilityNeeds: [],
    priorities: {},
    ...overrides,
  };
}

describe("evaluateBudgetWarnings", () => {
  it("emits PRIORITIES_CONFLICT when more than 3 categories are set to priority 5", () => {
    const input = makeMinimalInput({
      priorities: {
        venue: 5,
        catering: 5,
        decor: 5,
        entertainment: 5,
      },
    });
    const warnings = evaluateBudgetWarnings(input, []);
    const conflict = warnings.find((w) => w.code === "PRIORITIES_CONFLICT");
    expect(conflict).toBeDefined();
    expect(conflict?.params?.count).toBe(4);
  });

  it("emits SINGLE_CATEGORY_CAP_APPLIED when categories are capped", () => {
    const input = makeMinimalInput();
    const warnings = evaluateBudgetWarnings(input, [], {
      cappedCategories: ["catering"],
    });
    const capWarning = warnings.find((w) => w.code === "SINGLE_CATEGORY_CAP_APPLIED");
    expect(capWarning).toBeDefined();
    expect(capWarning?.params?.categories).toBe("catering");
  });

  it("emits CATERING_SHARE_BELOW_20PCT when catering allocation falls under 20%", () => {
    const input = makeMinimalInput();
    const lines: BudgetLine[] = [
      {
        categoryId: "catering",
        allocatedMinor: 15_000,
        sharePct: 15,
        actualMinor: 0,
        status: "under",
      },
    ];
    const warnings = evaluateBudgetWarnings(input, lines);
    const cateringWarning = warnings.find((w) => w.code === "CATERING_SHARE_BELOW_20PCT");
    expect(cateringWarning).toBeDefined();
    expect(cateringWarning?.params?.sharePct).toBe(15);
  });

  it("emits CONTINGENCY_BELOW_MIN when contingency base or priority is reduced", () => {
    const input = makeMinimalInput({
      priorities: { contingency: 1 },
    });
    const warnings = evaluateBudgetWarnings(input, [], { baseContingency: 4 });
    const contingencyWarning = warnings.find((w) => w.code === "CONTINGENCY_BELOW_MIN");
    expect(contingencyWarning).toBeDefined();
  });

  it("returns an empty array when all invariants are well within normal ranges", () => {
    const input = makeMinimalInput({
      priorities: { venue: 5, catering: 4 },
    });
    const lines: BudgetLine[] = [
      {
        categoryId: "catering",
        allocatedMinor: 30_000,
        sharePct: 30,
        actualMinor: 0,
        status: "under",
      },
      {
        categoryId: "contingency",
        allocatedMinor: 8_000,
        sharePct: 8,
        actualMinor: 0,
        status: "under",
      },
    ];
    const warnings = evaluateBudgetWarnings(input, lines);
    expect(warnings).toHaveLength(0);
  });
});
