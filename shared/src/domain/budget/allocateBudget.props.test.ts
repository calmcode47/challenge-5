import { describe, expect, it } from "vitest";
import fc from "fast-check";
import {
  CATEGORY_IDS,
  EVENT_TYPES,
  VENUE_TYPES,
  type CategoryId,
  type EventType,
  type VenueType,
} from "../../contracts/enums.js";
import type { PlanInput, PriorityValue } from "../../contracts/planInput.js";
import { allocateBudget } from "./allocateBudget.js";
import { normaliseAndCapWeights } from "./normalise.js";

const planInputArbitrary = fc.record({
  eventType: fc.constantFrom<EventType>(...EVENT_TYPES),
  title: fc.constant("Property Test Celebration"),
  eventDate: fc.constant("2027-12-31"),
  guestCount: fc.integer({ min: 1, max: 5000 }),
  budget: fc.record({
    currency: fc.constantFrom("USD", "EUR", "GBP", "JPY", "INR", "CAD"),
    totalMinor: fc.integer({ min: 1, max: 1_000_000_000_000 }),
  }),
  venueType: fc.constantFrom<VenueType>(...VENUE_TYPES),
  dietary: fc.constant<string[]>([]),
  accessibilityNeeds: fc.constant<string[]>([]),
  priorities: fc.dictionary(
    fc.constantFrom<CategoryId>(...CATEGORY_IDS),
    fc.constantFrom<PriorityValue>(1, 2, 3, 4, 5)
  ),
});

describe("allocateBudget — Property-Based Tests (fast-check)", () => {
  it("maintains strict sum equality: sum(allocatedMinor) === totalMinor (>= 200 runs)", () => {
    fc.assert(
      fc.property(planInputArbitrary, (input: PlanInput) => {
        const plan = allocateBudget(input);
        const sum = plan.lines.reduce((acc, line) => acc + line.allocatedMinor, 0);
        expect(sum).toBe(input.budget.totalMinor);
      }),
      { numRuns: 250 }
    );
  });

  it("ensures all allocations are non-negative safe integers (>= 200 runs)", () => {
    fc.assert(
      fc.property(planInputArbitrary, (input: PlanInput) => {
        const plan = allocateBudget(input);
        for (const line of plan.lines) {
          expect(Number.isSafeInteger(line.allocatedMinor)).toBe(true);
          expect(line.allocatedMinor).toBeGreaterThanOrEqual(0);
        }
      }),
      { numRuns: 250 }
    );
  });

  it("enforces contingency reserve >= 5% always (>= 200 runs)", () => {
    fc.assert(
      fc.property(planInputArbitrary, (input: PlanInput) => {
        const plan = allocateBudget(input);
        const contingency = plan.lines.find((l) => l.categoryId === "contingency");
        expect(contingency).toBeDefined();
        if (input.budget.totalMinor >= 100) {
          expect(contingency?.sharePct).toBeGreaterThanOrEqual(5);
        }
      }),
      { numRuns: 250 }
    );
  });

  it("enforces no single category exceeds 50% cap for non-trivial totals (>= 200 runs)", () => {
    fc.assert(
      fc.property(planInputArbitrary, (input: PlanInput) => {
        const plan = allocateBudget(input);
        if (input.budget.totalMinor >= 100) {
          for (const line of plan.lines) {
            expect(line.sharePct).toBeLessThanOrEqual(50);
          }
        }
      }),
      { numRuns: 250 }
    );
  });

  it("is completely deterministic: identical inputs yield identical outputs (>= 200 runs)", () => {
    fc.assert(
      fc.property(planInputArbitrary, (input: PlanInput) => {
        const planA = allocateBudget(input);
        const planB = allocateBudget(input);
        expect(planA).toEqual(planB);
      }),
      { numRuns: 250 }
    );
  });

  it("guarantees monotonic priority: raising a category priority never lowers allocation (>= 200 runs)", () => {
    fc.assert(
      fc.property(
        planInputArbitrary,
        fc.constantFrom<CategoryId>("catering", "decor", "entertainment"),
        (baseInput: PlanInput, testCat: CategoryId) => {
          // Compare priority 2 vs priority 5 with identical budget total >= 100,000
          const inputLow: PlanInput = {
            ...baseInput,
            budget: { currency: "USD", totalMinor: 1_000_000 },
            priorities: { ...baseInput.priorities, [testCat]: 2 },
          };
          const inputHigh: PlanInput = {
            ...baseInput,
            budget: { currency: "USD", totalMinor: 1_000_000 },
            priorities: { ...baseInput.priorities, [testCat]: 5 },
          };

          const planLow = allocateBudget(inputLow);
          const planHigh = allocateBudget(inputHigh);

          const lowAlloc = planLow.lines.find((l) => l.categoryId === testCat)?.allocatedMinor ?? 0;
          const highAlloc =
            planHigh.lines.find((l) => l.categoryId === testCat)?.allocatedMinor ?? 0;

          expect(highAlloc).toBeGreaterThanOrEqual(lowAlloc);
        }
      ),
      { numRuns: 250 }
    );
  });

  it("verifies idempotence of weight normalisation and capping (>= 200 runs)", () => {
    fc.assert(
      fc.property(
        fc.dictionary(
          fc.constantFrom<CategoryId>(...CATEGORY_IDS),
          fc.integer({ min: 1, max: 100 })
        ),
        fc.integer({ min: 50, max: 95 }),
        (rawWeights: Record<string, number>, target: number) => {
          if (Object.keys(rawWeights).length === 0) return;
          const first = normaliseAndCapWeights(rawWeights, target);
          const second = normaliseAndCapWeights(first.weights, target);
          for (const key of Object.keys(first.weights)) {
            expect(second.weights[key as CategoryId]).toBeCloseTo(
              first.weights[key as CategoryId],
              5
            );
          }
        }
      ),
      { numRuns: 250 }
    );
  });
});
