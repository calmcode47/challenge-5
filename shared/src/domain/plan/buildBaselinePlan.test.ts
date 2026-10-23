import { describe, expect, it } from "vitest";
import type { PlanInput } from "../../contracts/planInput.js";
import { buildBaselinePlan } from "./buildBaselinePlan.js";

const VALID_INPUT: PlanInput = {
  eventType: "wedding",
  title: "Dev & Priya Grand Wedding",
  eventDate: "2027-09-15",
  guestCount: 200,
  budget: { currency: "USD", totalMinor: 4000000 },
  venueType: "banquet_hall",
  style: "classic royal",
  cultureOrTradition: "Punjabi",
  dietary: ["vegetarian"],
  accessibilityNeeds: ["ramp"],
  priorities: { venue: 5, catering: 5 },
};

describe("buildBaselinePlan", () => {
  it("generates a fully populated, valid canonical plan from user input", () => {
    const now = "2026-10-23T12:00:00.000Z";
    const plan = buildBaselinePlan(VALID_INPUT, now);

    expect(plan.id).toMatch(/^plan_[0-9a-f]{8}$/);
    expect(plan.schemaVersion).toBe(1);
    expect(plan.createdAt).toBe(now);
    expect(plan.updatedAt).toBe(now);

    // Provenance
    expect(plan.provenance.baseline).toBe("calculated");
    expect(plan.provenance.enrichment).toBe("none");

    // Budget
    expect(plan.budget.totalMinor).toBe(4000000);
    expect(plan.budget.lines.length).toBeGreaterThan(0);
    const sumAllocated = plan.budget.lines.reduce((acc, l) => acc + l.allocatedMinor, 0);
    expect(sumAllocated).toBe(4000000);

    // Timeline
    expect(plan.timeline.milestones.length).toBeGreaterThan(0);
    expect(plan.timeline.eventDate).toBe(VALID_INPUT.eventDate);

    // Checklist & Briefs
    expect(plan.checklist.length).toBeGreaterThan(0);
    expect(plan.briefs.length).toBeGreaterThan(0);

    // Arrays start empty
    expect(plan.vendors).toEqual([]);
    expect(plan.ideas).toEqual([]);
    expect(plan.pinnedIdeaIds).toEqual([]);
  });

  it("produces deterministic IDs for the same input and timestamp", () => {
    const now = "2026-10-23T12:00:00.000Z";
    const planA = buildBaselinePlan(VALID_INPUT, now);
    const planB = buildBaselinePlan(VALID_INPUT, now);

    expect(planA.id).toBe(planB.id);
  });

  it("handles Date objects passed as now parameter", () => {
    const nowDate = new Date("2026-10-23T14:00:00.000Z");
    const plan = buildBaselinePlan(VALID_INPUT, nowDate);
    expect(plan.createdAt).toBe("2026-10-23T14:00:00.000Z");
  });
});
