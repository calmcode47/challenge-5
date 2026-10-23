import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { isOk } from "../../lib/result.js";
import { applyEnrichment } from "../enrichment/applyEnrichment.js";
import { buildBaselinePlan } from "./buildBaselinePlan.js";
import { setPriority, shiftBudget, toggleChecklistItem, toggleMilestone } from "./planMutations.js";

const BASE_INPUT = {
  eventType: "wedding" as const,
  title: "Property Testing Wedding",
  eventDate: "2027-08-15",
  guestCount: 100,
  budget: { currency: "USD", totalMinor: 2000000 },
  venueType: "outdoor" as const,
  dietary: [],
  accessibilityNeeds: [],
  priorities: {},
};

const NOW = "2026-10-23T12:00:00.000Z";

describe("Plan Domain Property Invariants", () => {
  it("shiftBudget preserves exact integer totalMinor and non-negativity across random valid transfers", () => {
    const plan = buildBaselinePlan(BASE_INPUT, NOW);
    const nonContingencyCategories = plan.budget.lines
      .filter((l) => l.categoryId !== "contingency")
      .map((l) => l.categoryId);

    fc.assert(
      fc.property(
        fc.constantFrom(...nonContingencyCategories),
        fc.constantFrom(...nonContingencyCategories),
        fc.integer({ min: 1, max: 20000 }),
        (from, to, amount) => {
          if (from === to) return true;
          const result = shiftBudget(plan, from, to, amount, NOW);
          if (isOk(result)) {
            const nextPlan = result.value;
            const sum = nextPlan.budget.lines.reduce((acc, l) => acc + l.allocatedMinor, 0);
            expect(sum).toBe(plan.budget.totalMinor);
            for (const line of nextPlan.budget.lines) {
              expect(line.allocatedMinor).toBeGreaterThanOrEqual(0);
              expect(line.allocatedMinor).toBeLessThanOrEqual(
                Math.floor(plan.budget.totalMinor * 0.5)
              );
            }
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("setPriority preserves exact budget sum for all valid priority adjustments", () => {
    const plan = buildBaselinePlan(BASE_INPUT, NOW);
    const categories = plan.budget.lines.map((l) => l.categoryId);

    fc.assert(
      fc.property(
        fc.constantFrom(...categories),
        fc.integer({ min: 1, max: 5 }),
        (cat, priority) => {
          const nextPlan = setPriority(plan, cat, priority as 1 | 2 | 3 | 4 | 5, NOW);
          const sum = nextPlan.budget.lines.reduce((acc, l) => acc + l.allocatedMinor, 0);
          expect(sum).toBe(plan.budget.totalMinor);
          expect(nextPlan.input.priorities[cat]).toBe(priority);
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it("toggleMilestone and toggleChecklistItem are strictly self-inverting (involutive)", () => {
    const plan = buildBaselinePlan(BASE_INPUT, NOW);
    const milestoneId = plan.timeline.milestones[0]?.id;
    const checklistId = plan.checklist[0]?.id;
    if (!milestoneId || !checklistId) return;

    // Toggle twice restores initial state
    const milestoneToggledTwice = toggleMilestone(
      toggleMilestone(plan, milestoneId, NOW),
      milestoneId,
      NOW
    );
    const initialDoneM = plan.timeline.milestones.find((m) => m.id === milestoneId)?.done;
    const restoredDoneM = milestoneToggledTwice.timeline.milestones.find(
      (m) => m.id === milestoneId
    )?.done;
    expect(restoredDoneM).toBe(initialDoneM);

    const checklistToggledTwice = toggleChecklistItem(
      toggleChecklistItem(plan, checklistId, NOW),
      checklistId,
      NOW
    );
    const initialDoneC = plan.checklist.find((c) => c.id === checklistId)?.done;
    const restoredDoneC = checklistToggledTwice.checklist.find((c) => c.id === checklistId)?.done;
    expect(restoredDoneC).toBe(initialDoneC);
  });

  it("applyEnrichment never alters core invariants across arbitrary enrichment payloads", () => {
    const plan = buildBaselinePlan(BASE_INPUT, NOW);

    fc.assert(
      fc.property(
        fc.string({ maxLength: 100 }),
        fc.constantFrom("ai" as const, "fallback" as const, "demo" as const),
        (narrative, source) => {
          const enrichment = {
            narrative,
            briefs: [],
            ideas: [],
            suggestedBudgetShifts: [],
            milestoneNotes: [],
            meta: {
              model: "test-model",
              source,
              requestId: "req-prop-test",
            },
          };
          const outcome = applyEnrichment(plan, enrichment, NOW);
          expect(outcome.plan.budget.totalMinor).toBe(plan.budget.totalMinor);
          expect(outcome.plan.timeline.eventDate).toBe(plan.timeline.eventDate);
          expect(outcome.plan.vendors).toEqual(plan.vendors);
          expect(outcome.plan.provenance.enrichment).toBe(source === "fallback" ? "none" : source);
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});
