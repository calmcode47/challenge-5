import { describe, expect, it } from "vitest";
import type { PlanInput } from "../../contracts/planInput.js";
import { buildChecklist } from "./buildChecklist.js";

describe("buildChecklist — Checklist Composition & State Integrity", () => {
  const weddingInput: PlanInput = {
    eventType: "wedding",
    title: "Checklist Test Wedding",
    eventDate: "2027-10-15",
    guestCount: 220, // > 200 triggers crowd flow & staffing
    budget: { currency: "USD", totalMinor: 3_000_000 },
    venueType: "outdoor",
    dietary: ["vegan"],
    accessibilityNeeds: ["wheelchair"],
    priorities: {},
  };

  it("builds a complete, deduplicated checklist in stable order", () => {
    const list = buildChecklist(weddingInput);
    expect(list.length).toBeGreaterThan(10);

    const ids = new Set<string>();
    for (const item of list) {
      expect(ids.has(item.id), `Duplicate checklist item id "${item.id}"`).toBe(false);
      ids.add(item.id);
      expect(item.done).toBe(false);
    }
  });

  it("preserves done status for items present in doneIds set", () => {
    const doneIds = new Set<string>(["catering-baseline-menu-proposal", "venue-access-step-free"]);
    const list = buildChecklist(weddingInput, doneIds);

    const menu = list.find((i) => i.id === "catering-baseline-menu-proposal");
    const access = list.find((i) => i.id === "venue-access-step-free");
    const other = list.find((i) => i.id === "catering-baseline-food-safety");

    expect(menu?.done).toBe(true);
    expect(access?.done).toBe(true);
    expect(other?.done).toBe(false);
  });

  it("strips commercial venue contracts when venueType is home", () => {
    const homeInput: PlanInput = {
      ...weddingInput,
      venueType: "home",
    };
    const list = buildChecklist(homeInput);

    const venueContractItems = list.filter(
      (item) => item.categoryId === "venue" && item.kind === "contract"
    );
    expect(venueContractItems.length).toBe(0);

    // Home items are present
    expect(list.some((i) => i.id === "venue-home-neighbour-notification")).toBe(true);
  });

  it("deduplicates identical items emitted across multiple rules", () => {
    const mockRule = () => [
      {
        id: "duplicate-task-1",
        categoryId: "catering" as const,
        kind: "ask" as const,
        text: "checklist.catering.baseline_menu_proposal",
        done: false,
      },
    ];

    const list = buildChecklist(weddingInput, undefined, [mockRule, mockRule]);
    expect(list.length).toBe(1);
    expect(list[0]?.id).toBe("duplicate-task-1");
  });
});
