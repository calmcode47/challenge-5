import { describe, expect, it } from "vitest";
import { isErr, isOk } from "../lib/result.js";
import { migratePlan } from "./migration.js";
import { PLAN_SCHEMA_VERSION, type Plan } from "./plan.js";

const validV1Plan: Plan = {
  id: "plan-v1-test",
  schemaVersion: PLAN_SCHEMA_VERSION,
  createdAt: "2026-10-23T12:00:00.000Z",
  updatedAt: "2026-10-23T12:00:00.000Z",
  input: {
    eventType: "birthday",
    title: "Aarav's 10th Birthday",
    eventDate: "2026-11-15",
    guestCount: 30,
    budget: { currency: "USD", totalMinor: 100_000 },
    venueType: "home",
    dietary: [],
    accessibilityNeeds: [],
    priorities: {},
  },
  budget: {
    currency: "USD",
    totalMinor: 100_000,
    lines: [],
    perGuestMinor: 3_333,
    warnings: [],
  },
  timeline: {
    eventDate: "2026-11-15",
    daysAvailable: 23,
    compressionFactor: 0.5,
    tightness: "tight",
    milestones: [],
    warnings: [],
  },
  vendors: [],
  checklist: [],
  briefs: [],
  ideas: [],
  pinnedIdeaIds: [],
  provenance: {
    baseline: "calculated",
    enrichment: "none",
  },
};

describe("migration - migratePlan", () => {
  it("migrates and validates a valid version 1 plan successfully", () => {
    const result = migratePlan(validV1Plan);
    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value.id).toBe("plan-v1-test");
      expect(result.value.schemaVersion).toBe(1);
    }
  });

  it("fails when payload is not an object or is null", () => {
    const nullResult = migratePlan(null);
    expect(isErr(nullResult)).toBe(true);
    if (isErr(nullResult)) {
      expect(nullResult.error.code).toBe("VALIDATION_FAILED");
    }

    const stringResult = migratePlan("not-a-plan");
    expect(isErr(stringResult)).toBe(true);
  });

  it("fails when payload is missing schemaVersion", () => {
    const withoutVersion = { ...validV1Plan };
    // @ts-expect-error Testing payload missing schemaVersion
    delete withoutVersion.schemaVersion;

    const result = migratePlan(withoutVersion);
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error.code).toBe("MISSING_VERSION");
    }
  });

  it("returns UNSUPPORTED_VERSION error for future or unsupported versions", () => {
    const futurePlan = { ...validV1Plan, schemaVersion: 2 };
    const result = migratePlan(futurePlan);
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error.code).toBe("UNSUPPORTED_VERSION");
      expect(result.error.detectedVersion).toBe(2);
    }
  });

  it("returns VALIDATION_FAILED error when v1 plan data violates schema", () => {
    const corruptedPlan = {
      ...validV1Plan,
      budget: { ...validV1Plan.budget, totalMinor: -500 }, // invalid negative money
    };
    const result = migratePlan(corruptedPlan);
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error.code).toBe("VALIDATION_FAILED");
      expect(result.error.details).toBeDefined();
    }
  });
});
