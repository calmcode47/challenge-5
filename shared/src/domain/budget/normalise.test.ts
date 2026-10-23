import { describe, expect, it } from "vitest";
import { normaliseAndCapWeights } from "./normalise.js";

describe("normaliseAndCapWeights", () => {
  it("normalises weights proportionally to match targetSum without hitting cap", () => {
    const raw = {
      venue: 18,
      catering: 30,
      decor: 10,
    };
    // Sum = 58. Target = 92.
    const result = normaliseAndCapWeights(raw, 92);
    const sum = Object.values(result.weights).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(92, 6);
    expect(result.cappedCategories).toHaveLength(0);
    expect(result.weights.catering).toBeCloseTo((30 / 58) * 92, 6);
  });

  it("caps an outsized category at 50% and redistributes excess over uncapped categories", () => {
    const raw = {
      venue: 10,
      catering: 80, // outsized
      decor: 10,
    };
    // Target 90. Raw sum 100. Scaled: catering = 72 (> 50), venue = 9, decor = 9.
    // Catering gets capped at 50. Excess = 22.
    // Uncapped sum = 9 + 9 = 18. Each gets 9 + 22 * (9/18) = 9 + 11 = 20.
    const result = normaliseAndCapWeights(raw, 90);
    expect(result.cappedCategories).toEqual(["catering"]);
    expect(result.weights.catering).toBe(50);
    expect(result.weights.venue).toBeCloseTo(20, 6);
    expect(result.weights.decor).toBeCloseTo(20, 6);
    const total = Object.values(result.weights).reduce((a, b) => a + b, 0);
    expect(total).toBeCloseTo(90, 6);
  });

  it("handles zero sum raw weights gracefully by distributing equally", () => {
    const raw = {
      venue: 0,
      catering: 0,
    };
    const result = normaliseAndCapWeights(raw, 80);
    expect(result.weights.venue).toBe(40);
    expect(result.weights.catering).toBe(40);
  });

  it("redistributes excess equally when all uncapped categories have zero weight", () => {
    const raw = {
      catering: 100,
      venue: 0,
      decor: 0,
    };
    // Target 90. Catering starts at 90, capped to 50. Excess = 40.
    // Uncapped are venue (0) and decor (0). UncappedSum = 0.
    // Excess 40 is split equally: 20 to venue, 20 to decor.
    const result = normaliseAndCapWeights(raw, 90);
    expect(result.weights.catering).toBe(50);
    expect(result.weights.venue).toBe(20);
    expect(result.weights.decor).toBe(20);
  });

  it("terminates when all categories hit cap or uncapped sum is zero", () => {
    const raw = {
      venue: 100,
      catering: 100,
    };
    // Target 95. Scaled: 47.5 each, neither exceeds 50.
    const result = normaliseAndCapWeights(raw, 95);
    expect(result.weights.venue).toBe(47.5);
    expect(result.weights.catering).toBe(47.5);
  });

  it("handles empty weights dictionary", () => {
    const result = normaliseAndCapWeights({}, 90);
    expect(Object.keys(result.weights)).toHaveLength(0);
    expect(result.cappedCategories).toHaveLength(0);
  });
});
