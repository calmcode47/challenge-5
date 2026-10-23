import { describe, expect, it } from "vitest";
import type { Idea } from "../../contracts/planComponents.js";
import type { PlanContextForIdeas } from "./applyIdeaConstraints.js";
import { applyIdeaConstraints } from "./applyIdeaConstraints.js";

const PLAN_CONTEXT: PlanContextForIdeas = {
  input: {
    eventType: "wedding",
    title: "Ananya & Rohan Celebration",
    eventDate: "2027-06-15",
    guestCount: 150,
    budget: { currency: "USD", totalMinor: 2000000 },
    venueType: "outdoor",
    style: "bohemian garden",
    cultureOrTradition: "South Asian fusion",
    dietary: ["vegan"],
    accessibilityNeeds: ["step-free"],
    priorities: {},
  },
  budget: {
    lines: [
      { categoryId: "decor", allocatedMinor: 300000, actualMinor: 100000 }, // 200,000 headroom
      { categoryId: "catering", allocatedMinor: 600000, actualMinor: 550000 }, // 50,000 headroom
      { categoryId: "venue", allocatedMinor: 400000, actualMinor: 400000 }, // 0 headroom
    ],
  },
  pinnedIdeaIds: ["idea-pinned-1"],
};

function makeIdea(partial: Partial<Idea> & { id: string; categoryId: Idea["categoryId"] }): Idea {
  return {
    id: partial.id,
    categoryId: partial.categoryId,
    title: partial.title ?? "Idea Title",
    description: partial.description ?? "Description text",
    rationale: partial.rationale ?? "Aligned with bohemian garden theme",
    estimateMinor: partial.estimateMinor ?? { min: 10000, max: 50000 },
    effort: partial.effort ?? "medium",
    tags: partial.tags ?? ["decor"],
    fitsBudget: partial.fitsBudget ?? true,
  };
}

describe("applyIdeaConstraints", () => {
  it("filters out ideas that lack user input context in their rationale", () => {
    const validIdea = makeIdea({
      id: "valid-1",
      categoryId: "decor",
      rationale: "Tailored for outdoor bohemian garden setup",
    });
    const genericIdea = makeIdea({
      id: "generic-1",
      categoryId: "decor",
      rationale: "A standard party package available for everyone",
    });

    const result = applyIdeaConstraints([validIdea, genericIdea], PLAN_CONTEXT);
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("valid-1");
  });

  it("calculates fitsBudget accurately according to category headroom", () => {
    const affordableDecor = makeIdea({
      id: "decor-1",
      categoryId: "decor",
      title: "Affordable Floral Arch",
      estimateMinor: { min: 50000, max: 150000 }, // <= 200,000 headroom -> fits
      rationale: "Bohemian garden floral arches",
    });
    const expensiveDecor = makeIdea({
      id: "decor-2",
      categoryId: "decor",
      title: "Extravagant Chandelier",
      estimateMinor: { min: 100000, max: 250000 }, // > 200,000 headroom -> does NOT fit
      rationale: "Massive bohemian garden chandelier rig",
    });
    const cateringOverhead = makeIdea({
      id: "cat-1",
      categoryId: "catering",
      title: "Custom Vegan Dessert Buffet",
      estimateMinor: { min: 30000, max: 60000 }, // > 50,000 headroom -> does NOT fit
      rationale: "South Asian vegan dessert counter",
    });

    const unallocatedCategoryIdea = makeIdea({
      id: "mkt-1",
      categoryId: "marketing",
      title: "Social Media Campaign",
      estimateMinor: { min: 1000, max: 5000 },
      rationale: "Outdoor bohemian marketing",
    });

    const result = applyIdeaConstraints(
      [affordableDecor, expensiveDecor, cateringOverhead, unallocatedCategoryIdea],
      PLAN_CONTEXT
    );

    const decor1 = result.find((i) => i.id === "decor-1");
    const decor2 = result.find((i) => i.id === "decor-2");
    const cat1 = result.find((i) => i.id === "cat-1");
    const mkt1 = result.find((i) => i.id === "mkt-1");

    expect(decor1?.fitsBudget).toBe(true);
    expect(decor2?.fitsBudget).toBe(false);
    expect(cat1?.fitsBudget).toBe(false);
    expect(mkt1?.fitsBudget).toBe(false);
  });

  it("deduplicates ideas by case-insensitive normalized title", () => {
    const ideaA = makeIdea({
      id: "a",
      categoryId: "decor",
      title: "Bohemian Lantern Walkway",
      rationale: "Outdoor bohemian styling",
    });
    const ideaB = makeIdea({
      id: "b",
      categoryId: "decor",
      title: "  bohemian  lantern   walkway  ",
      rationale: "Outdoor bohemian styling",
    });

    const result = applyIdeaConstraints([ideaA, ideaB], PLAN_CONTEXT);
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("a");
  });

  it("sorts by pinned status, then fitsBudget, then effort asc, then alphabetical title", () => {
    const pinnedUnfit = makeIdea({
      id: "idea-pinned-1",
      categoryId: "decor",
      title: "Z Pinned Unfit Idea",
      estimateMinor: { min: 100000, max: 500000 }, // does not fit
      effort: "high",
      rationale: "Bohemian styling",
    });
    const unpinnedFitsLow = makeIdea({
      id: "low-effort-fit",
      categoryId: "decor",
      title: "B Fits Low Effort",
      estimateMinor: { min: 1000, max: 10000 }, // fits
      effort: "low",
      rationale: "Bohemian styling",
    });
    const unpinnedFitsMedium = makeIdea({
      id: "med-effort-fit",
      categoryId: "decor",
      title: "A Fits Med Effort",
      estimateMinor: { min: 1000, max: 20000 }, // fits
      effort: "medium",
      rationale: "Bohemian styling",
    });
    const unpinnedUnfitLow = makeIdea({
      id: "unfit-low",
      categoryId: "decor",
      title: "Unfit Low Effort",
      estimateMinor: { min: 100000, max: 400000 }, // does not fit
      effort: "low",
      rationale: "Bohemian styling",
    });

    const result = applyIdeaConstraints(
      [unpinnedFitsMedium, unpinnedUnfitLow, pinnedUnfit, unpinnedFitsLow],
      PLAN_CONTEXT
    );

    // 1st: pinnedUnfit (pinned wins first regardless of fitsBudget)
    expect(result[0]?.id).toBe("idea-pinned-1");
    // 2nd: unpinnedFitsLow (fitsBudget=true, effort=low)
    expect(result[1]?.id).toBe("low-effort-fit");
    // 3rd: unpinnedFitsMedium (fitsBudget=true, effort=medium)
    expect(result[2]?.id).toBe("med-effort-fit");
    // 4th: unpinnedUnfitLow (fitsBudget=false)
    expect(result[3]?.id).toBe("unfit-low");
  });

  it("clamps results to maximum limit when given thousands of ideas", () => {
    const ideas: Idea[] = [];
    for (let idx = 0; idx < 120; idx += 1) {
      ideas.push(
        makeIdea({
          id: `idea-${String(idx)}`,
          categoryId: "decor",
          title: `Bohemian Unique Idea ${String(idx)}`,
          rationale: "Outdoor bohemian setup",
        })
      );
    }

    const result = applyIdeaConstraints(ideas, PLAN_CONTEXT);
    expect(result).toHaveLength(50);
  });
});
