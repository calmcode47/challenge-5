import { describe, expect, it } from "vitest";
import { buildBaselinePlan } from "./buildBaselinePlan.js";
import { pinIdea, rejectIdea, toggleChecklistItem, toggleMilestone } from "./itemMutations.js";

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

describe("itemMutations", () => {
  it("toggleMilestone and toggleChecklistItem modify completed status", () => {
    const plan = buildBaselinePlan(BASE_INPUT, NOW);
    const firstMilestone = plan.timeline.milestones[0];
    const secondMilestone = plan.timeline.milestones[1];
    const firstChecklist = plan.checklist[0];
    const secondChecklist = plan.checklist[1];
    if (!firstMilestone || !secondMilestone || !firstChecklist || !secondChecklist) {
      throw new Error("Plan missing items");
    }

    expect(firstMilestone.done).toBe(false);
    const planWithDoneMilestone = toggleMilestone(plan, firstMilestone.id, NEXT_NOW);
    const updatedM1 = planWithDoneMilestone.timeline.milestones.find(
      (m) => m.id === firstMilestone.id
    );
    const updatedM2 = planWithDoneMilestone.timeline.milestones.find(
      (m) => m.id === secondMilestone.id
    );
    expect(updatedM1?.done).toBe(true);
    expect(updatedM2?.done).toBe(false);

    expect(firstChecklist.done).toBe(false);
    const planWithDoneItem = toggleChecklistItem(plan, firstChecklist.id, NEXT_NOW);
    const updatedC1 = planWithDoneItem.checklist.find((c) => c.id === firstChecklist.id);
    const updatedC2 = planWithDoneItem.checklist.find((c) => c.id === secondChecklist.id);
    expect(updatedC1?.done).toBe(true);
    expect(updatedC2?.done).toBe(false);
  });

  it("pinIdea and rejectIdea manage user idea preferences", () => {
    const plan = buildBaselinePlan(BASE_INPUT, NOW);
    const planWithIdeas = {
      ...plan,
      ideas: [
        {
          id: "idea-1",
          categoryId: "decor" as const,
          title: "Bohemian Lighting",
          description: "Warm lights",
          rationale: "Matches bohemian garden vibe",
          estimateMinor: { min: 1000, max: 5000 },
          effort: "low" as const,
          tags: ["decor"],
          fitsBudget: true,
        },
        {
          id: "idea-2",
          categoryId: "venue" as const,
          title: "Tent Canopy",
          description: "Waterproof canopy",
          rationale: "Outdoor safety",
          estimateMinor: { min: 2000, max: 6000 },
          effort: "medium" as const,
          tags: ["venue"],
          fitsBudget: true,
        },
      ],
    };

    const pinnedPlan = pinIdea(planWithIdeas, "idea-1", NEXT_NOW);
    expect(pinnedPlan.pinnedIdeaIds).toContain("idea-1");

    const unpinnedPlan = pinIdea(pinnedPlan, "idea-1", NEXT_NOW);
    expect(unpinnedPlan.pinnedIdeaIds).not.toContain("idea-1");

    const rejectedPlan = rejectIdea(pinnedPlan, "idea-1", NEXT_NOW);
    expect(rejectedPlan.ideas).toHaveLength(1);
    expect(rejectedPlan.ideas[0]?.id).toBe("idea-2");
    expect(rejectedPlan.pinnedIdeaIds).not.toContain("idea-1");
  });

  it("handles Date objects passed as now parameter", () => {
    const plan = buildBaselinePlan(BASE_INPUT, NOW);
    const nowDate = new Date("2026-10-23T15:00:00.000Z");

    const firstM = plan.timeline.milestones[0];
    const firstC = plan.checklist[0];
    if (firstM && firstC) {
      const p1 = toggleMilestone(plan, firstM.id, nowDate);
      expect(p1.updatedAt).toBe("2026-10-23T15:00:00.000Z");

      const p2 = toggleChecklistItem(p1, firstC.id, nowDate);
      expect(p2.updatedAt).toBe("2026-10-23T15:00:00.000Z");
    }

    const planWithIdea = {
      ...plan,
      ideas: [
        {
          id: "idea-date",
          categoryId: "decor" as const,
          title: "Date Idea",
          description: "Desc",
          rationale: "Matches bohemian garden theme",
          estimateMinor: { min: 100, max: 200 },
          effort: "low" as const,
          tags: [],
          fitsBudget: true,
        },
      ],
    };
    const pPinned = pinIdea(planWithIdea, "idea-date", nowDate);
    expect(pPinned.updatedAt).toBe("2026-10-23T15:00:00.000Z");

    const pRejected = rejectIdea(pPinned, "idea-date", nowDate);
    expect(pRejected.updatedAt).toBe("2026-10-23T15:00:00.000Z");
  });
});
