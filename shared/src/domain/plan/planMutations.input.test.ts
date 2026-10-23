import { describe, expect, it } from "vitest";
import { isErr, isOk } from "../../lib/result.js";
import { buildBaselinePlan } from "./buildBaselinePlan.js";
import { toggleChecklistItem, toggleMilestone } from "./itemMutations.js";
import { updateInput } from "./updateInput.js";

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

describe("updateInput", () => {
  it("re-executes engines while preserving user work and completed tasks", () => {
    const plan = buildBaselinePlan(BASE_INPUT, NOW);
    const firstM = plan.timeline.milestones[0];
    const firstC = plan.checklist[0];
    if (!firstM || !firstC) throw new Error("Missing items");

    const withCompleted = toggleChecklistItem(
      toggleMilestone(plan, firstM.id, NOW),
      firstC.id,
      NOW
    );

    const updateRes = updateInput(
      withCompleted,
      {
        guestCount: 250,
        eventDate: "2027-08-01",
        priorities: { photo_video: 5 as const },
      },
      NEXT_NOW
    );

    expect(isOk(updateRes)).toBe(true);
    if (!isOk(updateRes)) return;

    const nextPlan = updateRes.value;
    expect(nextPlan.input.guestCount).toBe(250);
    expect(nextPlan.timeline.eventDate).toBe("2027-08-01");
    expect(nextPlan.input.priorities.photo_video).toBe(5);
    expect(nextPlan.input.priorities.decor).toBe(3);

    // Preserved milestone completion
    const preservedM = nextPlan.timeline.milestones.find((m) => m.id === firstM.id);
    expect(preservedM?.done).toBe(true);

    // Preserved checklist completion
    const preservedC = nextPlan.checklist.find((c) => c.id === firstC.id);
    expect(preservedC?.done).toBe(true);
  });

  it("handles patch without priorities and Date object for now", () => {
    const plan = buildBaselinePlan(BASE_INPUT, NOW);
    const nowDate = new Date("2026-10-23T15:00:00.000Z");

    const res = updateInput(plan, { guestCount: 180 }, nowDate);
    expect(isOk(res)).toBe(true);
    if (isOk(res)) {
      expect(res.value.updatedAt).toBe("2026-10-23T15:00:00.000Z");
      expect(res.value.input.guestCount).toBe(180);
    }
  });

  it("returns error Result if patch produces invalid input", () => {
    const plan = buildBaselinePlan(BASE_INPUT, NOW);
    const updateRes = updateInput(
      plan,
      {
        guestCount: -5,
      },
      NEXT_NOW
    );

    expect(isErr(updateRes)).toBe(true);
  });
});
