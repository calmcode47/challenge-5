import { describe, expect, it } from "vitest";
import type { PlanInput } from "../../contracts/planInput.js";
import { allocateBudget } from "./allocateBudget.js";

describe("allocateBudget — Edge Cases & Tightness", () => {
  it("increases contingency reserve by 2 percentage points when tightness is tight or very_tight", () => {
    const input: PlanInput = {
      eventType: "wedding",
      title: "Rush Wedding",
      eventDate: "2027-05-01",
      guestCount: 100,
      budget: { currency: "USD", totalMinor: 1_000_000 },
      venueType: "banquet_hall",
      dietary: [],
      accessibilityNeeds: [],
      priorities: {},
    };
    const tightPlan = allocateBudget(input, { tightness: "tight" });
    const tightContingency = tightPlan.lines.find((l) => l.categoryId === "contingency");
    expect(tightContingency?.allocatedMinor).toBe(100_000);

    const veryTightPlan = allocateBudget(input, { tightness: "very_tight" });
    const veryTightContingency = veryTightPlan.lines.find((l) => l.categoryId === "contingency");
    expect(veryTightContingency?.allocatedMinor).toBe(100_000);
  });

  it("handles totalMinor 0 by assigning zero allocatedMinor and sharePct to all lines", () => {
    const input: PlanInput = {
      eventType: "wedding",
      title: "Zero Budget Plan",
      eventDate: "2027-05-01",
      guestCount: 50,
      budget: { currency: "USD", totalMinor: 0 },
      venueType: "home",
      dietary: [],
      accessibilityNeeds: [],
      priorities: {},
    };
    const plan = allocateBudget(input);
    expect(plan.totalMinor).toBe(0);
    expect(plan.lines.every((l) => l.allocatedMinor === 0 && l.sharePct === 0)).toBe(true);
  });

  it("handles totalMinor smaller than category count without negatives", () => {
    const input: PlanInput = {
      eventType: "wedding",
      title: "Micro Budget",
      eventDate: "2027-05-01",
      guestCount: 10,
      budget: { currency: "USD", totalMinor: 3 },
      venueType: "home",
      dietary: [],
      accessibilityNeeds: [],
      priorities: {},
    };
    const plan = allocateBudget(input);
    const sum = plan.lines.reduce((acc, l) => acc + l.allocatedMinor, 0);
    expect(sum).toBe(3);
    for (const line of plan.lines) {
      expect(line.allocatedMinor).toBeGreaterThanOrEqual(0);
    }
  });

  it("handles zero-decimal currency JPY and 3-decimal currency KWD seamlessly", () => {
    const jpyInput: PlanInput = {
      eventType: "birthday",
      title: "Tokyo Birthday",
      eventDate: "2027-05-01",
      guestCount: 20,
      budget: { currency: "JPY", totalMinor: 150_000 },
      venueType: "restaurant",
      dietary: [],
      accessibilityNeeds: [],
      priorities: {},
    };
    const jpyPlan = allocateBudget(jpyInput);
    expect(jpyPlan.currency).toBe("JPY");
    expect(jpyPlan.lines.reduce((acc, l) => acc + l.allocatedMinor, 0)).toBe(150_000);

    const kwdInput: PlanInput = {
      eventType: "community",
      title: "Kuwait Community",
      eventDate: "2027-05-01",
      guestCount: 50,
      budget: { currency: "KWD", totalMinor: 2_500_000 },
      venueType: "community_hall",
      dietary: [],
      accessibilityNeeds: [],
      priorities: {},
    };
    const kwdPlan = allocateBudget(kwdInput);
    expect(kwdPlan.currency).toBe("KWD");
    expect(kwdPlan.lines.reduce((acc, l) => acc + l.allocatedMinor, 0)).toBe(2_500_000);
  });
});
