import { describe, expect, it } from "vitest";
import { largestRemainder } from "./rounding.js";

describe("largestRemainder", () => {
  it("converts weights to integer minor amounts summing to totalMinor", () => {
    const items = [
      { categoryId: "catering" as const, weight: 37.024 },
      { categoryId: "venue" as const, weight: 20 },
      { categoryId: "decor" as const, weight: 15 },
      { categoryId: "contingency" as const, weight: 10 },
      { categoryId: "logistics" as const, weight: 17.976 },
    ];
    const totalMinor = 100_000;
    const allocations = largestRemainder(totalMinor, items);

    const sum = allocations.reduce((acc, it) => acc + it.allocatedMinor, 0);
    expect(sum).toBe(totalMinor);
    for (const alloc of allocations) {
      expect(Number.isInteger(alloc.allocatedMinor)).toBe(true);
      expect(alloc.allocatedMinor).toBeGreaterThanOrEqual(0);
    }
  });

  it("handles totalMinor smaller than the number of categories without producing negatives", () => {
    const items = [
      { categoryId: "catering" as const, weight: 40 },
      { categoryId: "venue" as const, weight: 30 },
      { categoryId: "decor" as const, weight: 20 },
      { categoryId: "contingency" as const, weight: 10 },
    ];
    const totalMinor = 2; // Only 2 units to distribute across 4 categories
    const allocations = largestRemainder(totalMinor, items);

    const sum = allocations.reduce((acc, it) => acc + it.allocatedMinor, 0);
    expect(sum).toBe(2);

    // Top 2 weights (catering and venue) get 1 each, others get 0
    expect(allocations.find((a) => a.categoryId === "catering")?.allocatedMinor).toBe(1);
    expect(allocations.find((a) => a.categoryId === "venue")?.allocatedMinor).toBe(1);
    expect(allocations.find((a) => a.categoryId === "decor")?.allocatedMinor).toBe(0);
    expect(allocations.find((a) => a.categoryId === "contingency")?.allocatedMinor).toBe(0);
  });

  it("breaks ties by larger weight then category ID ascending", () => {
    // Both items have remainder 0.5, but decor has higher weight than logistics
    const items = [
      { categoryId: "logistics" as const, weight: 25 },
      { categoryId: "decor" as const, weight: 75 },
    ];
    // With totalMinor = 2, exact allocations are:
    // logistics: 2 * 0.25 = 0.5 (floor 0, rem 0.5)
    // decor: 2 * 0.75 = 1.5 (floor 1, rem 0.5)
    // floorSum = 1, remainderCount = 1
    // Decor wins the tie break due to higher weight!
    const allocations = largestRemainder(2, items);
    expect(allocations.find((a) => a.categoryId === "decor")?.allocatedMinor).toBe(2);
    expect(allocations.find((a) => a.categoryId === "logistics")?.allocatedMinor).toBe(0);

    // When both remainder AND weight are identical, categoryId breaks the tie alphabetically
    const identicalItems = [
      { categoryId: "venue" as const, weight: 50 },
      { categoryId: "catering" as const, weight: 50 },
    ];
    // totalMinor = 1 -> 'catering' < 'venue' alphabetically, so catering gets 1
    const tieAllocations = largestRemainder(1, identicalItems);
    expect(tieAllocations.find((a) => a.categoryId === "catering")?.allocatedMinor).toBe(1);
    expect(tieAllocations.find((a) => a.categoryId === "venue")?.allocatedMinor).toBe(0);
  });

  it("handles zero totalMinor, zero weights, and empty input arrays cleanly", () => {
    const emptyResult = largestRemainder(100, []);
    expect(emptyResult).toEqual([]);

    const zeroResult = largestRemainder(0, [{ categoryId: "venue", weight: 100 }]);
    expect(zeroResult).toEqual([{ categoryId: "venue", allocatedMinor: 0 }]);

    const zeroWeightsResult = largestRemainder(11, [
      { categoryId: "venue", weight: 0 },
      { categoryId: "catering", weight: 0 },
    ]);
    expect(zeroWeightsResult.reduce((a, b) => a + b.allocatedMinor, 0)).toBe(11);
  });
});
