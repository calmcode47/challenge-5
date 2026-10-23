import { describe, expect, it } from "vitest";
import type { PlanInput } from "../../contracts/planInput.js";
import { buildTimeline } from "./buildTimeline.js";
import { compressTimeline } from "./compress.js";

describe("buildTimeline — Compression Tiers & Boundary Conditions", () => {
  const weddingInput: PlanInput = {
    eventType: "wedding",
    title: "Compression Test Wedding",
    eventDate: "2027-10-15",
    guestCount: 100,
    budget: { currency: "USD", totalMinor: 2_000_000 },
    venueType: "banquet_hall",
    dietary: [],
    accessibilityNeeds: [],
    priorities: {},
  };

  it("handles factor 1.0 (uncompressed, comfortable)", () => {
    // 300 days before 2027-10-15 is 2026-12-19
    const plan = buildTimeline(weddingInput, "2026-12-19");
    expect(plan.compressionFactor).toBe(1.0);
    expect(plan.tightness).toBe("comfortable");
    expect(plan.warnings.some((w) => w.code === "TIMELINE_COMPRESSED")).toBe(false);
  });

  it("handles factor ~0.74 (tight tier, 222 days available)", () => {
    // 222 days before 2027-10-15 is 2027-03-07
    const plan = buildTimeline(weddingInput, "2027-03-07");
    expect(plan.daysAvailable).toBe(222);
    expect(plan.compressionFactor).toBeCloseTo(0.74, 2);
    expect(plan.tightness).toBe("tight");
    expect(plan.warnings.some((w) => w.code === "TIMELINE_COMPRESSED")).toBe(true);
  });

  it("handles factor 0.50 (tight tier, exactly 150 days available with hand-verified row trace)", () => {
    // 150 days before 2027-10-15 is 2027-05-18
    const plan = buildTimeline(weddingInput, "2027-05-18");
    expect(plan.daysAvailable).toBe(150);
    expect(plan.compressionFactor).toBe(0.5);
    expect(plan.tightness).toBe("tight");

    const dates = new Map(plan.milestones.map((m) => [m.id, m.dueDate]));
    const expectedRows: Record<string, string> = {
      budget_and_guest_list: "2027-05-18",
      venue: "2027-06-02",
      photographer: "2027-06-17",
      caterer: "2027-07-02",
      save_the_dates: "2027-07-17",
      attire: "2027-08-01",
      invitations_out: "2027-08-31",
      decor_florals: "2027-09-07",
      rsvp_deadline: "2027-09-30",
      final_headcount: "2027-10-08",
      final_payments: "2027-10-11",
      rehearsal_and_setup: "2027-10-14",
      thank_you_notes: "2027-10-29",
    };

    for (const [id, expectedDate] of Object.entries(expectedRows)) {
      expect(dates.get(id)).toBe(expectedDate);
    }
  });

  it("handles factor 0.30 (very_tight tier, 90 days available)", () => {
    // 90 days before 2027-10-15 is 2027-07-17
    const plan = buildTimeline(weddingInput, "2027-07-17");
    expect(plan.daysAvailable).toBe(90);
    expect(plan.compressionFactor).toBe(0.3);
    expect(plan.tightness).toBe("very_tight");
  });

  it("handles factor 0 (event today)", () => {
    // Event is today: 2027-10-15
    const plan = buildTimeline(weddingInput, "2027-10-15");
    expect(plan.daysAvailable).toBe(0);
    expect(plan.compressionFactor).toBe(0.0);
    expect(plan.tightness).toBe("very_tight");

    // All positive lead milestones must be due today (2027-10-15)
    for (const m of plan.milestones) {
      if (m.id !== "thank_you_notes") {
        expect(m.dueDate).toBe("2027-10-15");
      }
    }
  });

  it("handles event date in the past, emitting EVENT_DATE_PAST", () => {
    const pastInput: PlanInput = {
      ...weddingInput,
      eventDate: "2025-05-01",
    };
    const plan = buildTimeline(pastInput, "2027-01-01");
    expect(plan.daysAvailable).toBe(0);
    expect(plan.compressionFactor).toBe(0.0);
    expect(plan.tightness).toBe("very_tight");
    expect(plan.warnings.some((w) => w.code === "EVENT_DATE_PAST")).toBe(true);
  });

  it("preserves done status when doneIds are provided", () => {
    const doneIds = new Set<string>(["venue", "photographer"]);
    const plan = buildTimeline(weddingInput, "2026-12-19", doneIds);

    const venue = plan.milestones.find((m) => m.id === "venue");
    const photographer = plan.milestones.find((m) => m.id === "photographer");
    const caterer = plan.milestones.find((m) => m.id === "caterer");

    expect(venue?.done).toBe(true);
    expect(venue?.status).toBe("done");
    expect(photographer?.done).toBe(true);
    expect(photographer?.status).toBe("done");
    expect(caterer?.done).toBe(false);
  });

  it("correctly identifies at_risk status when a dependency is overdue", () => {
    // At now = 2026-12-19, budget_and_guest_list (due 2026-12-19) is overdue (due today and not done).
    // save_the_dates (due 2027-04-18) depends on budget_and_guest_list -> status should be at_risk!
    const plan = buildTimeline(weddingInput, "2026-12-19");

    const budget = plan.milestones.find((m) => m.id === "budget_and_guest_list");
    const saveTheDates = plan.milestones.find((m) => m.id === "save_the_dates");

    expect(budget?.status).toBe("overdue");
    expect(saveTheDates?.status).toBe("at_risk");
  });

  it("accepts a Date object as now parameter and computes statuses identically", () => {
    const nowDate = new Date(Date.UTC(2026, 11, 19, 0, 0, 0, 0));
    const plan = buildTimeline(weddingInput, nowDate);
    expect(plan.daysAvailable).toBe(300);
    expect(plan.compressionFactor).toBe(1.0);
  });

  it("enforces dependent dueDate >= dependency dueDate and caps positive leads at eventDate", () => {
    const customTemplates = [
      // Dependency A scheduled 5 days before event
      { id: "depA", titleKey: "A", leadDays: 5, dependsOn: [], critical: true },
      // Dependent B declares 15 days lead, but depends on A -> must be clamped to at least A's dueDate
      { id: "depB", titleKey: "B", leadDays: 15, dependsOn: ["depA"], critical: true },
    ];

    const result = compressTimeline(customTemplates, "2027-10-15", "2027-01-01");
    const mB = result.scheduledMilestones.find((m) => m.template.id === "depB");
    const mA = result.scheduledMilestones.find((m) => m.template.id === "depA");

    expect(mB?.dueDate).toBe(mA?.dueDate);

    // If dependency was scheduled after event date, positive lead milestone is clamped to event date
    const customTemplates2 = [
      { id: "depPast", titleKey: "Past", leadDays: -2, dependsOn: [], critical: true },
      { id: "depPos", titleKey: "Pos", leadDays: 5, dependsOn: ["depPast"], critical: true },
    ];
    const result2 = compressTimeline(customTemplates2, "2027-10-15", "2027-01-01");
    const mPos = result2.scheduledMilestones.find((m) => m.template.id === "depPos");
    expect(mPos?.dueDate).toBe("2027-10-15");
  });

  it("handles templates containing zero positive lead days", () => {
    const postOnlyTemplates = [
      { id: "post1", titleKey: "Post1", leadDays: -5, dependsOn: [], critical: false },
    ];
    const result = compressTimeline(postOnlyTemplates, "2027-10-15", "2027-01-01");
    expect(result.factor).toBe(1.0);
    expect(result.tightness).toBe("comfortable");
  });
});
