import { describe, expect, it } from "vitest";
import fc from "fast-check";
import type { EventType } from "../../contracts/enums.js";
import type { PlanInput } from "../../contracts/planInput.js";
import { buildTimeline } from "./buildTimeline.js";
import { addDays, daysBetween } from "./dateMath.js";

const eventTypeArb = fc.constantFrom<EventType>("wedding", "birthday", "community", "other");

function makeInput(eventType: EventType, eventDate: string): PlanInput {
  return {
    eventType,
    title: "Property Celebration",
    eventDate,
    guestCount: 100,
    budget: { currency: "USD", totalMinor: 2_000_000 },
    venueType: "banquet_hall",
    dietary: [],
    accessibilityNeeds: [],
    priorities: {},
  };
}

describe("buildTimeline — Property Tests (fast-check)", () => {
  it("enforces topological dependency ordering: due(dependent) >= due(dependency)", () => {
    fc.assert(
      fc.property(
        eventTypeArb,
        fc.integer({ min: 0, max: 500 }), // days available
        (eventType, daysAvailable) => {
          const now = "2027-01-01";
          const eventDate = addDays(now, daysAvailable);
          const input = makeInput(eventType, eventDate);

          const plan = buildTimeline(input, now);
          const milestoneMap = new Map(plan.milestones.map((m) => [m.id, m]));

          for (const m of plan.milestones) {
            for (const depId of m.dependsOn) {
              const dep = milestoneMap.get(depId);
              if (dep) {
                expect(
                  m.dueDate >= dep.dueDate,
                  `Milestone ${m.id} (${m.dueDate}) due earlier than dependency ${dep.id} (${dep.dueDate})`
                ).toBe(true);
              }
            }

            // For positive lead days, due date must be on or before event date
            if (m.leadDays >= 0) {
              expect(
                m.dueDate <= plan.eventDate,
                `Milestone ${m.id} (${m.dueDate}) scheduled after event date (${plan.eventDate})`
              ).toBe(true);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it("is strictly idempotent: repeated executions produce identical timelines", () => {
    fc.assert(
      fc.property(eventTypeArb, fc.integer({ min: 1, max: 400 }), (eventType, daysAvailable) => {
        const now = "2027-01-01";
        const eventDate = addDays(now, daysAvailable);
        const input = makeInput(eventType, eventDate);

        const plan1 = buildTimeline(input, now);
        const plan2 = buildTimeline(input, now);

        expect(plan1).toEqual(plan2);
      }),
      { numRuns: 50 }
    );
  });

  it("shifting eventDate and now by k days shifts all uncompressed milestone dueDates by k days", () => {
    fc.assert(
      fc.property(
        eventTypeArb,
        fc.integer({ min: -60, max: 60 }), // shift k days
        (eventType, k) => {
          const baseNow = "2027-01-01";
          // Uncompressed runway: 400 days is > maxLead (300)
          const baseEventDate = addDays(baseNow, 400);

          const inputBase = makeInput(eventType, baseEventDate);
          const planBase = buildTimeline(inputBase, baseNow);

          const shiftedNow = addDays(baseNow, k);
          const shiftedEventDate = addDays(baseEventDate, k);
          const inputShifted = makeInput(eventType, shiftedEventDate);
          const planShifted = buildTimeline(inputShifted, shiftedNow);

          expect(planShifted.compressionFactor).toBe(1.0);
          expect(planShifted.milestones.length).toBe(planBase.milestones.length);

          for (let i = 0; i < planBase.milestones.length; i++) {
            const baseM = planBase.milestones[i];
            const shiftedM = planShifted.milestones[i];
            if (baseM && shiftedM) {
              expect(shiftedM.id).toBe(baseM.id);
              expect(daysBetween(baseM.dueDate, shiftedM.dueDate)).toBe(k);
            }
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  it("milestones are always returned in non-decreasing order of dueDate", () => {
    fc.assert(
      fc.property(eventTypeArb, fc.integer({ min: 0, max: 350 }), (eventType, daysAvailable) => {
        const now = "2027-01-01";
        const eventDate = addDays(now, daysAvailable);
        const input = makeInput(eventType, eventDate);

        const plan = buildTimeline(input, now);
        for (let i = 0; i < plan.milestones.length - 1; i++) {
          const current = plan.milestones[i];
          const next = plan.milestones[i + 1];
          if (current && next) {
            expect(current.dueDate <= next.dueDate).toBe(true);
          }
        }
      }),
      { numRuns: 50 }
    );
  });
});
