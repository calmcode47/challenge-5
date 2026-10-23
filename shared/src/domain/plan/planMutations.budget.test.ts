import { describe, expect, it } from "vitest";
import { isErr, isOk } from "../../lib/result.js";
import { buildBaselinePlan } from "./buildBaselinePlan.js";
import { setPriority, shiftBudget } from "./budgetMutations.js";

const BASE_INPUT = {
  eventType: "wedding" as const,
  title: "Ananya & Rohan Celebration",
  eventDate: "2027-06-15",
  guestCount: 150,
  budget: { currency: "USD", totalMinor: 3000000 },
  venueType: "outdoor" as const,
  style: "bohemian garden",
  cultureOrTradition: "South Asian fusion",
  dietary: ["vegan"],
  accessibilityNeeds: ["step-free"],
  priorities: { decor: 3 as const },
};

const NOW = "2026-10-23T12:00:00.000Z";
const NEXT_NOW = "2026-10-23T13:00:00.000Z";

describe("budgetMutations", () => {
  it("shiftBudget successfully reallocates between categories", () => {
    const plan = buildBaselinePlan(BASE_INPUT, NOW);
    const result = shiftBudget(plan, "entertainment", "decor", 50000, NEXT_NOW);

    expect(isOk(result)).toBe(true);
    if (!isOk(result)) return;

    expect(result.value.updatedAt).toBe(NEXT_NOW);
    const sum = result.value.budget.lines.reduce((acc, l) => acc + l.allocatedMinor, 0);
    expect(sum).toBe(plan.budget.totalMinor);
  });

  it("shiftBudget returns error Result on invariant breach", () => {
    const plan = buildBaselinePlan(BASE_INPUT, NOW);
    const result = shiftBudget(plan, "entertainment", "decor", 99999999, NEXT_NOW);

    expect(isErr(result)).toBe(true);
    if (!isErr(result)) return;

    expect(result.error.code).toBe("EXCEEDS_SOURCE");
  });

  it("setPriority re-allocates budget lines and updates updatedAt", () => {
    const plan = buildBaselinePlan(BASE_INPUT, NOW);
    const nextPlan = setPriority(plan, "photo_video", 5, NEXT_NOW);

    expect(nextPlan.updatedAt).toBe(NEXT_NOW);
    expect(nextPlan.input.priorities.photo_video).toBe(5);
  });

  it("handles Date objects passed as now parameter", () => {
    const plan = buildBaselinePlan(BASE_INPUT, NOW);
    const nowDate = new Date("2026-10-23T15:00:00.000Z");

    const p1 = setPriority(plan, "venue", 4, nowDate);
    expect(p1.updatedAt).toBe("2026-10-23T15:00:00.000Z");

    const shiftRes = shiftBudget(p1, "entertainment", "decor", 1000, nowDate);
    expect(isOk(shiftRes)).toBe(true);
  });
});
