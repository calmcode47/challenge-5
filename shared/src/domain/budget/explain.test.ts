import { describe, expect, it } from "vitest";
import type { BudgetPlan } from "../../contracts/planComponents.js";
import type { PlanInput } from "../../contracts/planInput.js";
import { explainAllocation } from "./explain.js";

function makeInput(overrides?: Partial<PlanInput>): PlanInput {
  return {
    eventType: "wedding",
    title: "Explanation Test",
    eventDate: "2027-08-20",
    guestCount: 150,
    budget: {
      currency: "USD",
      totalMinor: 1_000_000,
    },
    venueType: "banquet_hall",
    dietary: [],
    accessibilityNeeds: [],
    priorities: {},
    ...overrides,
  };
}

describe("explainAllocation", () => {
  it("produces a summary line for baseline conditions", () => {
    const input = makeInput();
    const plan: BudgetPlan = {
      currency: "USD",
      totalMinor: 1_000_000,
      perGuestMinor: 6_666,
      lines: [
        {
          categoryId: "venue",
          allocatedMinor: 180_000,
          sharePct: 18,
          actualMinor: 0,
          status: "under",
        },
      ],
      warnings: [],
    };
    const explanations = explainAllocation(input, plan);
    expect(explanations.length).toBeGreaterThanOrEqual(1);
    expect(explanations[0]?.key).toBe("budget.explain.summary.baseline");
  });

  it("produces venue and guest summary lines when special conditions apply", () => {
    const homeInput = makeInput({ venueType: "home" });
    const emptyPlan: BudgetPlan = {
      currency: "USD",
      totalMinor: 1_000_000,
      perGuestMinor: 10_000,
      lines: [],
      warnings: [],
    };
    const homeExplanations = explainAllocation(homeInput, emptyPlan);
    expect(homeExplanations[0]?.key).toBe("budget.explain.summary.venue");

    const largeInput = makeInput({ venueType: "banquet_hall", guestCount: 300 });
    const largeExplanations = explainAllocation(largeInput, emptyPlan);
    expect(largeExplanations[0]?.key).toBe("budget.explain.summary.guest_size");
  });

  it("produces explanations for categories that deviate by >= 1 percentage point", () => {
    const input = makeInput({
      venueType: "home",
      priorities: { entertainment: 5, attire_beauty: 1 },
    });
    // Base wedding: venue=18, catering=30, entertainment=8, attire_beauty=8
    const plan: BudgetPlan = {
      currency: "USD",
      totalMinor: 1_000_000,
      perGuestMinor: 6_666,
      lines: [
        {
          categoryId: "venue",
          allocatedMinor: 40_000,
          sharePct: 4, // 18 -> 4 (diff -14 >= 1)
          actualMinor: 0,
          status: "under",
        },
        {
          categoryId: "entertainment",
          allocatedMinor: 140_000,
          sharePct: 14, // 8 -> 14 (diff +6 >= 1)
          actualMinor: 0,
          status: "under",
        },
        {
          categoryId: "attire_beauty",
          allocatedMinor: 40_000,
          sharePct: 4, // 8 -> 4 (diff -4 >= 1)
          actualMinor: 0,
          status: "under",
        },
        {
          categoryId: "decor",
          allocatedMinor: 100_000,
          sharePct: 10, // 10 -> 10 (diff 0 < 1)
          actualMinor: 0,
          status: "under",
        },
      ],
      warnings: [],
    };

    const explanations = explainAllocation(input, plan);
    // Decor should have no explanation because diff is 0
    expect(explanations.some((e) => e.categoryId === "decor")).toBe(false);

    // Venue should explain venue_modifier
    const venueExplanation = explanations.find(
      (e) => e.categoryId === "venue" && e.key === "budget.why.venue_modifier"
    );
    expect(venueExplanation).toBeDefined();

    // Entertainment should explain priority_raised
    const entExplanation = explanations.find(
      (e) => e.categoryId === "entertainment" && e.key === "budget.why.priority_raised"
    );
    expect(entExplanation).toBeDefined();

    // Attire should explain priority_lowered
    const attireExplanation = explanations.find(
      (e) => e.categoryId === "attire_beauty" && e.key === "budget.why.priority_lowered"
    );
    expect(attireExplanation).toBeDefined();
  });

  it("produates guest_modifier explanation when guest size tier alters category share", () => {
    const input = makeInput({
      guestCount: 15, // < 30 -> venue x 0.8, catering x 1.15
    });
    // Base wedding catering is 30. With 1.15 multiplier, say catering rises to 34% (diff 4 >= 1)
    const plan: BudgetPlan = {
      currency: "USD",
      totalMinor: 1_000_000,
      perGuestMinor: 66_666,
      lines: [
        {
          categoryId: "catering",
          allocatedMinor: 340_000,
          sharePct: 34,
          actualMinor: 0,
          status: "under",
        },
      ],
      warnings: [],
    };
    const explanations = explainAllocation(input, plan);
    const guestExplanation = explanations.find(
      (e) => e.categoryId === "catering" && e.key === "budget.why.guest_modifier"
    );
    expect(guestExplanation).toBeDefined();
    expect(guestExplanation?.params.guestCount).toBe(15);
  });

  it("emits rebalanced explanation when category shifted without specific modifier", () => {
    const input = makeInput();
    const plan: BudgetPlan = {
      currency: "USD",
      totalMinor: 1_000_000,
      perGuestMinor: 6_666,
      lines: [
        {
          categoryId: "decor",
          allocatedMinor: 150_000,
          sharePct: 15, // Base 10 -> 15 (diff +5) without direct priority/venue/guest mod
          actualMinor: 0,
          status: "under",
        },
      ],
      warnings: [],
    };
    const explanations = explainAllocation(input, plan);
    const rebalanced = explanations.find(
      (e) => e.categoryId === "decor" && e.key === "budget.why.rebalanced"
    );
    expect(rebalanced).toBeDefined();
  });
});
