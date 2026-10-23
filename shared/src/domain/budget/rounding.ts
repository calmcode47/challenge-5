import type { CategoryId } from "../../contracts/enums.js";

/**
 * Category identifier paired with its proportional weight.
 */
export interface CategoryWeight {
  categoryId: CategoryId;
  weight: number;
}

/**
 * Resulting minor-unit allocation for an individual category.
 */
export interface CategoryAllocation {
  categoryId: CategoryId;
  allocatedMinor: number;
}

interface RankedItem {
  index: number;
  categoryId: CategoryId;
  weight: number;
  floorAlloc: number;
  remainder: number;
}

function distributeZeroWeights(
  items: readonly CategoryWeight[],
  totalMinor: number
): { ranked: RankedItem[]; remainderCount: number } {
  const base = Math.floor(totalMinor / items.length);
  const rem = totalMinor % items.length;
  const list: RankedItem[] = items.map((it, idx) => ({
    index: idx,
    categoryId: it.categoryId,
    weight: 0,
    floorAlloc: base + (idx < rem ? 1 : 0),
    remainder: 0,
  }));
  return { ranked: list, remainderCount: 0 };
}

function rankRemainderItems(
  items: readonly CategoryWeight[],
  totalMinor: number,
  weightSum: number
): { ranked: RankedItem[]; remainderCount: number } {
  if (weightSum <= 0) {
    return distributeZeroWeights(items, totalMinor);
  }

  let floorSum = 0;
  const list: RankedItem[] = [];

  for (const [idx, item] of items.entries()) {
    const exactAlloc = (totalMinor * item.weight) / weightSum;
    const floorAlloc = Math.floor(exactAlloc);
    floorSum += floorAlloc;
    list.push({
      index: idx,
      categoryId: item.categoryId,
      weight: item.weight,
      floorAlloc,
      remainder: exactAlloc - floorAlloc,
    });
  }

  const remainderCount = Math.max(0, Math.min(items.length, Math.round(totalMinor - floorSum)));

  list.sort((first, second) => {
    const remDiff = second.remainder - first.remainder;
    if (Math.abs(remDiff) > 1e-12) {
      return remDiff;
    }
    const weightDiff = second.weight - first.weight;
    if (Math.abs(weightDiff) > 1e-12) {
      return weightDiff;
    }
    return first.categoryId.localeCompare(second.categoryId);
  });

  return { ranked: list, remainderCount };
}

/**
 * Converts proportional weights to discrete integer minor units using the Hare-Niemeyer
 * largest-remainder method.
 *
 * Guarantees:
 * 1. Sum of returned allocatedMinor exactly equals totalMinor.
 * 2. No negative or fractional minor units produced.
 * 3. Ties broken deterministically by higher weight, then category ID ascending.
 *
 * @param totalMinor Total budget in integer minor currency units.
 * @param items List of category IDs and their percentage weights.
 * @returns Array of allocations with discrete integer minor units.
 */
export function largestRemainder(
  totalMinor: number,
  items: readonly CategoryWeight[]
): CategoryAllocation[] {
  if (items.length === 0) {
    return [];
  }

  if (totalMinor <= 0) {
    return items.map((it) => ({
      categoryId: it.categoryId,
      allocatedMinor: 0,
    }));
  }

  const weightSum = items.reduce((acc, it) => acc + it.weight, 0);
  const { ranked, remainderCount } = rankRemainderItems(items, totalMinor, weightSum);

  const allocations: CategoryAllocation[] = new Array<CategoryAllocation>(items.length);

  for (const [idx, entry] of ranked.entries()) {
    const bonus = idx < remainderCount ? 1 : 0;
    allocations[entry.index] = {
      categoryId: entry.categoryId,
      allocatedMinor: entry.floorAlloc + bonus,
    };
  }

  return allocations;
}
