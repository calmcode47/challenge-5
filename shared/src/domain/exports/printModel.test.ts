import { describe, expect, it } from "vitest";
import type { Plan } from "../../contracts/plan.js";
import { buildPrintModel } from "./printModel.js";

const TEST_PLAN: Plan = {
  id: "plan-print-test",
  schemaVersion: 1,
  createdAt: "2026-10-23T12:00:00.000Z",
  updatedAt: "2026-10-23T12:00:00.000Z",
  input: {
    eventType: "wedding",
    title: "Ananya & Rohan Celebration",
    eventDate: "2027-06-15",
    guestCount: 150,
    budget: { currency: "USD", totalMinor: 3000000 },
    venueType: "outdoor",
    style: "bohemian",
    cultureOrTradition: "South Asian",
    dietary: ["vegan"],
    accessibilityNeeds: ["step-free"],
    priorities: {},
  },
  budget: {
    currency: "USD",
    totalMinor: 3000000,
    perGuestMinor: 20000,
    lines: [
      {
        categoryId: "venue",
        allocatedMinor: 1000000,
        sharePct: 33.3,
        actualMinor: 950000,
        status: "under",
      },
    ],
    warnings: [],
  },
  timeline: {
    eventDate: "2027-06-15",
    daysAvailable: 235,
    compressionFactor: 1,
    tightness: "comfortable",
    milestones: [
      {
        id: "m-1",
        title: "Secure Venue",
        dueDate: "2026-11-15",
        leadDays: 212,
        dependsOn: [],
        critical: true,
        status: "upcoming",
        done: true,
      },
    ],
    warnings: [],
  },
  vendors: [
    {
      id: "v-1",
      categoryId: "venue",
      name: "Meadowood Garden",
      stage: "booked",
      quoteMinor: 950000,
      paidMinor: 500000,
      contact: "manager@meadowood.test",
    },
    {
      id: "v-2",
      categoryId: "photo_video",
      name: "Shortlisted Studio",
      stage: "shortlist",
    },
  ],
  checklist: [
    {
      id: "chk-1",
      categoryId: "venue",
      kind: "contract",
      text: "Sign weather policy agreement",
      done: true,
    },
    {
      id: "chk-2",
      categoryId: "venue",
      kind: "logistics",
      text: "Verify step-free entrance route",
      done: false,
    },
  ],
  briefs: [],
  ideas: [
    {
      id: "idea-pin",
      categoryId: "decor",
      title: "Bohemian Lights",
      description: "Warm fairy lighting",
      rationale: "Matches bohemian garden theme",
      estimateMinor: { min: 20000, max: 40000 },
      effort: "low",
      tags: ["lighting"],
      fitsBudget: true,
    },
    {
      id: "idea-unpinned",
      categoryId: "decor",
      title: "Unpinned Idea",
      description: "Not pinned",
      rationale: "Bohemian theme",
      estimateMinor: { min: 10000, max: 20000 },
      effort: "low",
      tags: [],
      fitsBudget: true,
    },
  ],
  pinnedIdeaIds: ["idea-pin"],
  narrative: "An unforgettable celebration in the Napa Valley sunshine.",
  provenance: {
    baseline: "calculated",
    enrichment: "ai",
  },
};

describe("buildPrintModel", () => {
  it("generates a complete, structured print projection", () => {
    const print = buildPrintModel(TEST_PLAN);

    // Meta section
    expect(print.meta.title).toBe("Ananya & Rohan Celebration");
    expect(print.meta.eventType).toBe("wedding");
    expect(print.meta.guestCount).toBe(150);
    expect(print.meta.dietary).toEqual(["vegan"]);

    // Budget section
    expect(print.budget.currency).toBe("USD");
    expect(print.budget.totalFormatted).toBe("USD 30000.00");
    expect(print.budget.perGuestFormatted).toBe("USD 200.00");
    expect(print.budget.lines).toHaveLength(1);
    expect(print.budget.lines[0]?.categoryLabel).toBe("Venue");
    expect(print.budget.lines[0]?.allocatedFormatted).toBe("USD 10000.00");

    // Timeline section
    expect(print.timeline.milestones).toHaveLength(1);
    expect(print.timeline.milestones[0]?.title).toBe("Secure Venue");
    expect(print.timeline.milestones[0]?.done).toBe(true);

    // Checklist section
    expect(print.checklist.totalTasks).toBe(2);
    expect(print.checklist.completedTasks).toBe(1);

    // Vendors
    expect(print.vendors).toHaveLength(2);
    expect(print.vendors[0]?.name).toBe("Meadowood Garden");
    expect(print.vendors[0]?.quoteFormatted).toBe("USD 9500.00");
    expect(print.vendors[0]?.paidFormatted).toBe("USD 5000.00");
    expect(print.vendors[1]?.quoteFormatted).toBeUndefined();
    expect(print.vendors[1]?.paidFormatted).toBeUndefined();

    // Pinned ideas only
    expect(print.pinnedIdeas).toHaveLength(1);
    expect(print.pinnedIdeas[0]?.id).toBe("idea-pin");
    expect(print.pinnedIdeas[0]?.estimateFormatted).toBe("USD 200.00 - USD 400.00");

    // Narrative and provenance
    expect(print.narrative).toBe(TEST_PLAN.narrative);
    expect(print.provenance.enrichment).toBe("ai");
  });
});
