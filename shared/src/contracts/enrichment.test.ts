import { describe, expect, it } from "vitest";
import { EnrichmentSchema, MilestoneNoteSchema, SuggestedBudgetShiftSchema } from "./enrichment.js";

describe("enrichment - SuggestedBudgetShiftSchema", () => {
  it("validates positive budget shifts between categories", () => {
    const shift = {
      from: "decor" as const,
      to: "catering" as const,
      amountMinor: 50_000,
      rationale: "Accommodate multi-course plated dinner preferences",
    };
    expect(SuggestedBudgetShiftSchema.parse(shift)).toEqual(shift);
  });

  it("rejects zero or negative shift amounts", () => {
    expect(() =>
      SuggestedBudgetShiftSchema.parse({
        from: "decor",
        to: "catering",
        amountMinor: 0,
        rationale: "Invalid zero shift",
      })
    ).toThrow();

    expect(() =>
      SuggestedBudgetShiftSchema.parse({
        from: "decor",
        to: "catering",
        amountMinor: -100,
        rationale: "Invalid negative shift",
      })
    ).toThrow();
  });
});

describe("enrichment - MilestoneNoteSchema", () => {
  it("validates milestone note attachment", () => {
    const note = {
      milestoneId: "ms-caterer-1",
      note: "Ask whether tasting session fee is credited toward deposit",
    };
    expect(MilestoneNoteSchema.parse(note)).toEqual(note);
  });
});

describe("enrichment - EnrichmentSchema", () => {
  it("validates complete AI enrichment payload", () => {
    const enrichment = {
      narrative: "Personalized wedding master plan overview.",
      briefs: [],
      ideas: [],
      suggestedBudgetShifts: [
        {
          from: "stationery" as const,
          to: "photo_video" as const,
          amountMinor: 20_000,
          rationale: "Digital invitations save budget for drone videography",
        },
      ],
      milestoneNotes: [
        {
          milestoneId: "ms-venue-1",
          note: "Confirm noise restrictions and amplified music cutoff",
        },
      ],
      meta: {
        model: "gemini-2.5-pro",
        source: "ai" as const,
        requestId: "req-enrich-123",
      },
    };
    const parsed = EnrichmentSchema.parse(enrichment);
    expect(parsed.meta.source).toBe("ai");
    expect(parsed.suggestedBudgetShifts).toHaveLength(1);
  });
});
