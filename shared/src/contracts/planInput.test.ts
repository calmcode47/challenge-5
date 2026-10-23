import { describe, expect, it } from "vitest";
import { PlanInputSchema } from "./planInput.js";

describe("planInput - PlanInputSchema", () => {
  const baseValidInput = {
    eventType: "wedding" as const,
    title: "Ananya & Rohan's Celebration 🎉",
    eventDate: "2027-06-15",
    guestCount: 250,
    budget: { currency: "USD", totalMinor: 5_000_000 },
    venueType: "banquet_hall" as const,
    locationNote: "Historic downtown venue",
    cultureOrTradition: "South Asian fusion",
    style: "Modern romantic",
    dietary: ["Vegetarian", "Gluten-Free"],
    accessibilityNeeds: ["Wheelchair access required", "Step-free restroom"],
    mustHaves: "Live band for evening reception",
    avoid: "Single-use plastics",
    priorities: {
      catering: 5,
      venue: 4,
      photo_video: 5,
      decor: 3,
    },
    occasionNote: "10th anniversary renewal and reception",
  };

  it("accepts a comprehensive valid plan input", () => {
    const parsed = PlanInputSchema.parse(baseValidInput);
    expect(parsed.title).toBe("Ananya & Rohan's Celebration 🎉");
    expect(parsed.guestCount).toBe(250);
    expect(parsed.budget.totalMinor).toBe(5_000_000);
    expect(parsed.dietary).toEqual(["Vegetarian", "Gluten-Free"]);
    expect(parsed.priorities.catering).toBe(5);
  });

  it("applies defaults for dietary, accessibilityNeeds, and priorities", () => {
    const minimal = {
      eventType: "birthday" as const,
      title: "Maya's 5th Birthday",
      eventDate: "2026-11-20",
      guestCount: 25,
      budget: { currency: "EUR", totalMinor: 80_000 },
      venueType: "home" as const,
    };
    const parsed = PlanInputSchema.parse(minimal);
    expect(parsed.dietary).toEqual([]);
    expect(parsed.accessibilityNeeds).toEqual([]);
    expect(parsed.priorities).toEqual({});
  });

  it("validates boundary guest count (1 and 5000)", () => {
    expect(() => PlanInputSchema.parse({ ...baseValidInput, guestCount: 0 })).toThrow();
    expect(() => PlanInputSchema.parse({ ...baseValidInput, guestCount: 5001 })).toThrow();
    expect(() => PlanInputSchema.parse({ ...baseValidInput, guestCount: 100.5 })).toThrow();

    expect(PlanInputSchema.parse({ ...baseValidInput, guestCount: 1 }).guestCount).toBe(1);
    expect(PlanInputSchema.parse({ ...baseValidInput, guestCount: 5000 }).guestCount).toBe(5000);
  });

  it("rejects zero or negative budget total", () => {
    expect(() =>
      PlanInputSchema.parse({
        ...baseValidInput,
        budget: { currency: "USD", totalMinor: 0 },
      })
    ).toThrow();
    expect(() =>
      PlanInputSchema.parse({
        ...baseValidInput,
        budget: { currency: "USD", totalMinor: -500 },
      })
    ).toThrow();
  });

  it("rejects arrays exceeding maximum count", () => {
    const tooManyDietary = Array.from({ length: 11 }, (_, i) => `Diet ${String(i)}`);
    expect(() => PlanInputSchema.parse({ ...baseValidInput, dietary: tooManyDietary })).toThrow();

    const tooManyAccess = Array.from({ length: 11 }, (_, i) => `Need ${String(i)}`);
    expect(() =>
      PlanInputSchema.parse({
        ...baseValidInput,
        accessibilityNeeds: tooManyAccess,
      })
    ).toThrow();
  });

  it("rejects individual array items exceeding maximum length", () => {
    expect(() =>
      PlanInputSchema.parse({
        ...baseValidInput,
        dietary: ["a".repeat(41)],
      })
    ).toThrow();

    expect(() =>
      PlanInputSchema.parse({
        ...baseValidInput,
        accessibilityNeeds: ["b".repeat(61)],
      })
    ).toThrow();
  });

  it("rejects priority values outside the 1..5 range", () => {
    const invalidZeroPriority: unknown = {
      ...baseValidInput,
      priorities: { venue: 0 },
    };
    expect(() => PlanInputSchema.parse(invalidZeroPriority)).toThrow();

    const invalidSixPriority: unknown = {
      ...baseValidInput,
      priorities: { venue: 6 },
    };
    expect(() => PlanInputSchema.parse(invalidSixPriority)).toThrow();
  });
});
