import { describe, expect, it } from "vitest";
import type { Plan } from "../../contracts/plan.js";
import { isErr, isOk } from "../../lib/result.js";
import { buildPlanJson, parsePlanJson } from "./json.js";

const VALID_PLAN: Plan = {
  id: "plan-json-roundtrip",
  schemaVersion: 1,
  createdAt: "2026-10-23T12:00:00.000Z",
  updatedAt: "2026-10-23T12:00:00.000Z",
  input: {
    eventType: "birthday",
    title: "Maya's 5th Birthday Party",
    eventDate: "2027-04-10",
    guestCount: 25,
    budget: { currency: "USD", totalMinor: 150000 },
    venueType: "home",
    style: "superhero theme",
    dietary: ["nut-free"],
    accessibilityNeeds: [],
    priorities: {},
  },
  budget: {
    currency: "USD",
    totalMinor: 150000,
    perGuestMinor: 6000,
    lines: [
      {
        categoryId: "catering",
        allocatedMinor: 50000,
        sharePct: 33.33,
        actualMinor: 0,
        status: "under",
      },
    ],
    warnings: [],
  },
  timeline: {
    eventDate: "2027-04-10",
    daysAvailable: 150,
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
  provenance: {
    baseline: "calculated",
    enrichment: "none",
  },
};

describe("buildPlanJson and parsePlanJson", () => {
  it("successfully round-trips a complete canonical plan", () => {
    const jsonText = buildPlanJson(VALID_PLAN);
    expect(jsonText).toContain('"schemaVersion":1');

    const result = parsePlanJson(jsonText);
    expect(isOk(result)).toBe(true);
    if (!isOk(result)) return;

    expect(result.value).toEqual(VALID_PLAN);
  });

  it("supports pretty-printed serialization", () => {
    const prettyJson = buildPlanJson(VALID_PLAN, true);
    expect(prettyJson).toContain("\n  ");
  });

  it("rejects payloads exceeding the 1 megabyte size guard", () => {
    // 1 MB + 1 byte
    const oversized = " ".repeat(1048577);
    const result = parsePlanJson(oversized);

    expect(isErr(result)).toBe(true);
    if (!isErr(result)) return;

    expect(result.error).toContain("exceeds 1 MB limit");
  });

  it("returns typed error for malformed JSON syntax", () => {
    const broken = '{"schemaVersion": 1, invalid';
    const result = parsePlanJson(broken);

    expect(isErr(result)).toBe(true);
    if (!isErr(result)) return;

    expect(result.error).toContain("Invalid JSON syntax");
  });

  it("returns validation error when JSON does not conform to PlanSchema", () => {
    const nonConforming = JSON.stringify({
      id: "plan-bad",
      schemaVersion: 999, // Bad version
      title: "Missing fields",
    });

    const result = parsePlanJson(nonConforming);
    expect(isErr(result)).toBe(true);
    if (!isErr(result)) return;

    expect(result.error).toContain("Schema validation failed");
  });
});
