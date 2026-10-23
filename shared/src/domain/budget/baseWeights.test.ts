import { describe, expect, it } from "vitest";
import { EVENT_TYPES } from "../../contracts/enums.js";
import { categoriesForEventType } from "../../contracts/categories.js";
import { BASE_BUDGET_WEIGHTS, getBaseWeights } from "./baseWeights.js";

describe("baseWeights", () => {
  it("verifies every event type table sums to exactly 100 percentage points", () => {
    for (const eventType of EVENT_TYPES) {
      const table = BASE_BUDGET_WEIGHTS[eventType];
      const sum = Object.values(table).reduce((acc, weight) => acc + weight, 0);
      expect(sum).toBe(100);
    }
  });

  it("verifies base weight categories exactly match categoriesForEventType", () => {
    for (const eventType of EVENT_TYPES) {
      const activeCategories = [...categoriesForEventType(eventType)].sort();
      const tableCategories = Object.keys(BASE_BUDGET_WEIGHTS[eventType]).sort();
      expect(tableCategories).toEqual(activeCategories);
    }
  });

  it("returns an isolated copy of weights via getBaseWeights", () => {
    const weddingWeights = getBaseWeights("wedding");
    expect(weddingWeights.catering).toBe(30);
    expect(weddingWeights.contingency).toBe(8);

    // Mutation test to ensure isolation
    weddingWeights.catering = 99;
    expect(BASE_BUDGET_WEIGHTS.wedding.catering).toBe(30);
  });
});
