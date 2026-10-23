import { describe, expect, it } from "vitest";
import { EVENT_TYPES, VENUE_TYPES } from "../../contracts/enums.js";
import type { PlanInput } from "../../contracts/planInput.js";
import { allocateBudget } from "./allocateBudget.js";

describe("allocateBudget — Table Tests (Event Types x Venues x Guest Tiers)", () => {
  const guestTiers = [15, 100, 350];

  for (const eventType of EVENT_TYPES) {
    for (const venueType of VENUE_TYPES) {
      for (const guestCount of guestTiers) {
        it(`verifies invariants for ${eventType} x ${venueType} x ${String(guestCount)} guests`, () => {
          const input: PlanInput = {
            eventType,
            title: `Matrix Test ${eventType}`,
            eventDate: "2027-11-20",
            guestCount,
            budget: { currency: "EUR", totalMinor: 500_000 },
            venueType,
            dietary: [],
            accessibilityNeeds: [],
            priorities: {},
          };
          const plan = allocateBudget(input);
          const sum = plan.lines.reduce((acc, l) => acc + l.allocatedMinor, 0);
          expect(sum).toBe(500_000);

          for (const line of plan.lines) {
            expect(line.allocatedMinor).toBeGreaterThanOrEqual(0);
            expect(line.sharePct).toBeLessThanOrEqual(50);
          }

          const contingency = plan.lines.find((l) => l.categoryId === "contingency");
          expect(contingency?.sharePct).toBeGreaterThanOrEqual(5);
        });
      }
    }
  }
});
