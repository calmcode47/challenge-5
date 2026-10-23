import { describe, expect, expectTypeOf, it } from "vitest";
import {
  BudgetPlanSchema,
  ChecklistItemSchema,
  IdeaEstimateMinorSchema,
  IdeaSchema,
  MilestoneSchema,
  PLAN_SCHEMA_VERSION,
  PlanSchema,
  PlanSummarySchema,
  TimelinePlanSchema,
  VendorBriefSchema,
  VendorSchema,
  type Milestone,
  type Plan,
  type PlanSummary,
} from "./plan.js";

describe("plan - individual entities and sub-schemas", () => {
  it("validates BudgetPlan structure", () => {
    const budget = {
      currency: "USD",
      totalMinor: 1_000_000,
      lines: [
        {
          categoryId: "venue" as const,
          allocatedMinor: 200_000,
          sharePct: 20,
          actualMinor: 190_000,
          status: "on_track" as const,
        },
      ],
      perGuestMinor: 10_000,
      warnings: [],
    };
    expect(BudgetPlanSchema.parse(budget)).toEqual(budget);
  });

  it("validates MilestoneSchema and checks type compatibility", () => {
    const milestone: Milestone = {
      id: "ms-1",
      title: "Book Venue",
      categoryId: "venue",
      dueDate: "2026-12-01",
      leadDays: 180,
      dependsOn: [],
      critical: true,
      status: "upcoming",
      done: false,
    };
    const parsed = MilestoneSchema.parse(milestone);
    expect(parsed.id).toBe("ms-1");
    expectTypeOf(parsed).toEqualTypeOf<Milestone>();
  });

  it("validates TimelinePlanSchema", () => {
    const timeline = {
      eventDate: "2027-06-01",
      daysAvailable: 220,
      compressionFactor: 1,
      tightness: "comfortable" as const,
      milestones: [],
      warnings: [],
    };
    expect(TimelinePlanSchema.parse(timeline)).toEqual(timeline);
  });

  it("validates VendorSchema with optional contact and quotes", () => {
    const vendor = {
      id: "vendor-1",
      categoryId: "catering" as const,
      name: "Artisan Kitchen",
      contact: "chef@example.com",
      stage: "quoted" as const,
      quoteMinor: 150_000,
    };
    const parsed = VendorSchema.parse(vendor);
    expect(parsed.name).toBe("Artisan Kitchen");
    expect(parsed.stage).toBe("quoted");
  });

  it("validates ChecklistItemSchema", () => {
    const item = {
      id: "chk-1",
      categoryId: "venue" as const,
      kind: "ask" as const,
      text: "Ask about curfew and load-in timing",
      done: false,
    };
    expect(ChecklistItemSchema.parse(item)).toEqual(item);
  });

  it("validates VendorBriefSchema without business names", () => {
    const brief = {
      categoryId: "photo_video" as const,
      whatToLookFor: ["Full day coverage", "Second shooter included"],
      questionsToAsk: ["What is your turnaround time for previews?"],
      redFlags: ["No written contract", "Uninsured equipment"],
      contractTerms: ["Standard cancellation timeline"],
    };
    expect(VendorBriefSchema.parse(brief)).toEqual(brief);
  });

  it("validates IdeaEstimateMinorSchema ensuring min <= max", () => {
    const valid = { min: 50_000, max: 80_000 };
    expect(IdeaEstimateMinorSchema.parse(valid)).toEqual(valid);

    const equal = { min: 50_000, max: 50_000 };
    expect(IdeaEstimateMinorSchema.parse(equal)).toEqual(equal);

    const invalid = { min: 90_000, max: 40_000 };
    expect(() => IdeaEstimateMinorSchema.parse(invalid)).toThrow();
  });

  it("validates IdeaSchema and defaults fitsBudget to true", () => {
    const idea = {
      id: "idea-1",
      categoryId: "entertainment" as const,
      title: "Acoustic Duo for Cocktail Hour",
      description: "Subtle background music during guest arrival",
      rationale: "Matches preference for live music within budget limits",
      estimateMinor: { min: 40_000, max: 60_000 },
      effort: "low" as const,
      tags: ["live-music", "outdoor-friendly"],
    };
    const parsed = IdeaSchema.parse(idea);
    expect(parsed.fitsBudget).toBe(true);
  });
});

describe("plan - canonical PlanSchema and PlanSummarySchema", () => {
  const fullPlan: Plan = {
    id: "plan-test-1",
    schemaVersion: PLAN_SCHEMA_VERSION,
    createdAt: "2026-10-23T12:00:00.000Z",
    updatedAt: "2026-10-23T12:00:00.000Z",
    input: {
      eventType: "wedding",
      title: "Dev & Priya Wedding",
      eventDate: "2027-05-15",
      guestCount: 150,
      budget: { currency: "USD", totalMinor: 3_000_000 },
      venueType: "outdoor",
      dietary: [],
      accessibilityNeeds: [],
      priorities: {},
    },
    budget: {
      currency: "USD",
      totalMinor: 3_000_000,
      lines: [],
      perGuestMinor: 20_000,
      warnings: [],
    },
    timeline: {
      eventDate: "2027-05-15",
      daysAvailable: 200,
      compressionFactor: 1,
      tightness: "comfortable",
      milestones: [],
      warnings: [],
    },
    vendors: [],
    checklist: [],
    briefs: [],
    ideas: [],
    pinnedIdeaIds: [],
    narrative: "Personalized wedding master plan.",
    provenance: {
      baseline: "calculated",
      enrichment: "none",
    },
  };

  it("validates full Plan document and infers exact TypeScript type", () => {
    const parsed = PlanSchema.parse(fullPlan);
    expect(parsed.schemaVersion).toBe(1);
    expectTypeOf(parsed).toEqualTypeOf<Plan>();
  });

  it("validates PlanSummarySchema projection", () => {
    const summary: PlanSummary = {
      id: fullPlan.id,
      schemaVersion: fullPlan.schemaVersion,
      createdAt: fullPlan.createdAt,
      updatedAt: fullPlan.updatedAt,
      input: fullPlan.input,
      budget: fullPlan.budget,
      timeline: fullPlan.timeline,
      vendors: fullPlan.vendors,
      checklist: fullPlan.checklist,
      pinnedIdeaIds: fullPlan.pinnedIdeaIds,
      provenance: fullPlan.provenance,
    };
    const parsed = PlanSummarySchema.parse(summary);
    expect(parsed.id).toBe(fullPlan.id);
    expectTypeOf(parsed).toEqualTypeOf<PlanSummary>();
  });
});
