import type { CategoryId } from "../../contracts/enums.js";

/**
 * Result structure returned after normalising and capping budget category weights.
 */
export interface NormaliseResult {
  /** Map of CategoryId to normalise and capped percentage weights. */
  weights: Record<CategoryId, number>;
  /** Category identifiers where the maximum share cap was enforced. */
  cappedCategories: CategoryId[];
}

const MAX_CAP_PCT = 50;
const MAX_ITERATIONS = 5;
const FLOAT_EPSILON = 1e-9;

function scaleWeightsToTarget(
  rawWeights: Readonly<Record<string, number>>,
  targetSum: number
): Record<CategoryId, number> {
  const entries = Object.entries(rawWeights);
  const initialSum = entries.reduce((acc, [, val]) => acc + val, 0);
  const result: Partial<Record<CategoryId, number>> = {};

  if (initialSum <= FLOAT_EPSILON) {
    const equalShare = entries.length > 0 ? targetSum / entries.length : 0;
    for (const [key] of entries) {
      result[key as CategoryId] = equalShare;
    }
    return result as Record<CategoryId, number>;
  }

  const factor = targetSum / initialSum;
  for (const [key, val] of entries) {
    result[key as CategoryId] = val * factor;
  }
  return result as Record<CategoryId, number>;
}

function redistributeExcess(
  weights: Record<CategoryId, number>,
  uncapped: CategoryId[],
  excess: number
): void {
  const uncappedSum = uncapped.reduce((acc, cat) => acc + weights[cat], 0);
  if (uncappedSum > FLOAT_EPSILON) {
    for (const cat of uncapped) {
      weights[cat] = weights[cat] + excess * (weights[cat] / uncappedSum);
    }
  } else {
    const share = excess / uncapped.length;
    for (const cat of uncapped) {
      weights[cat] = weights[cat] + share;
    }
  }
}

/**
 * Normalises non-contingency category weights to target sum and enforces the 50% single-category cap.
 *
 * Algorithm:
 * 1. Scale all weights proportionally to achieve targetSum (e.g. 100 - contingency).
 * 2. In up to 5 iterations, identify categories exceeding 50% cap.
 * 3. Clamp exceeding categories to 50% and redistribute the excess proportionally across uncapped categories.
 * 4. Terminate when no category exceeds 50% or maximum iterations reached.
 *
 * @param rawWeights Map of CategoryId to initial modified weight.
 * @param targetSum Desired total percentage for non-contingency items (e.g. 92).
 * @param cap Maximum percentage permitted for any single category (defaults to 50).
 * @returns NormaliseResult containing scaled weights and list of capped category IDs.
 */
export function normaliseAndCapWeights(
  rawWeights: Readonly<Record<string, number>>,
  targetSum: number,
  cap: number = MAX_CAP_PCT
): NormaliseResult {
  const weights = scaleWeightsToTarget(rawWeights, targetSum);
  const categories = Object.keys(weights) as CategoryId[];
  const cappedSet = new Set<CategoryId>();

  for (let iter = 0; iter < MAX_ITERATIONS; iter += 1) {
    let excess = 0;
    let newlyCapped = 0;

    for (const cat of categories) {
      const current = weights[cat];
      if (!cappedSet.has(cat) && current > cap + FLOAT_EPSILON) {
        excess += current - cap;
        weights[cat] = cap;
        cappedSet.add(cat);
        newlyCapped += 1;
      }
    }

    if (newlyCapped === 0 || excess <= FLOAT_EPSILON) {
      break;
    }

    const uncapped = categories.filter((c) => !cappedSet.has(c));
    if (uncapped.length === 0) {
      break;
    }

    redistributeExcess(weights, uncapped, excess);
  }

  return {
    weights,
    cappedCategories: Array.from(cappedSet),
  };
}
