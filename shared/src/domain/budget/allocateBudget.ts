/*
 * Budget Allocation Pipeline (Deterministic & Pure):
 *
 *   [PlanInput] + [Options (tightness)]
 *          │
 *          ▼
 *   [1. Base Weights] ─────────► (Lookup by eventType; sum = 100)
 *          │
 *          ▼
 *   [2. Apply Modifiers] ──────► (Venue + Guest size + User priority; contingency excluded)
 *          │
 *          ▼
 *   [3. Contingency Share] ────► (Max(5, base) + 2 if tight/very_tight)
 *          │
 *          ▼
 *   [4. Normalise & Cap] ──────► (Scale non-contingency to 100-contingency; cap <= 50%)
 *          │
 *          ▼
 *   [5. Hare-Niemeyer Round] ──► (Largest remainder over totalMinor; exact integer sum)
 *          │
 *          ▼
 *   [6. Diagnostics & Sort] ───► (Evaluate warnings; sort lines by allocation desc)
 *          │
 *          ▼
 *     [BudgetPlan]
 */

import type { CategoryId, TimelineTightness } from "../../contracts/enums.js";
import { categoriesForEventType } from "../../contracts/categories.js";
import type { BudgetLine, BudgetPlan } from "../../contracts/planComponents.js";
import type { PlanInput } from "../../contracts/planInput.js";
import { getBaseWeights } from "./baseWeights.js";
import { getGuestSizeModifiers, getPriorityMultiplier, getVenueModifiers } from "./modifiers.js";
import { normaliseAndCapWeights } from "./normalise.js";
import { largestRemainder } from "./rounding.js";
import { evaluateBudgetWarnings } from "./warnings.js";

/**
 * Execution options for budget plan generation.
 */
export interface AllocateBudgetOptions {
  /** Schedule tightness level used to raise contingency reserves. */
  tightness?: TimelineTightness;
}

function calculateContingencyShare(baseContingency: number, tightness?: TimelineTightness): number {
  let contingency = Math.max(5, baseContingency);
  if (tightness === "tight" || tightness === "very_tight") {
    contingency += 2;
  }
  return contingency;
}

function computeModifiedNonContingencyWeights(
  input: PlanInput,
  baseWeights: Record<CategoryId, number>,
  activeCategories: readonly CategoryId[]
): Record<string, number> {
  const venueMods = getVenueModifiers(input.venueType);
  const guestMods = getGuestSizeModifiers(input.guestCount);
  const weights: Record<string, number> = {};

  for (const cat of activeCategories) {
    if (cat === "contingency") {
      continue;
    }
    const base = baseWeights[cat];
    const vMod = venueMods[cat] ?? 1.0;
    const gMod = guestMods[cat] ?? 1.0;
    const pMod = getPriorityMultiplier(input.priorities[cat]);
    weights[cat] = base * vMod * gMod * pMod;
  }
  return weights;
}

/**
 * Computes a deterministic, context-aware event budget plan.
 *
 * Mathematical Flow:
 * 1. Base weights from industry heuristics per event type.
 * 2. Modifiers for venue, guest tier, and user priorities applied to non-contingency items.
 * 3. Contingency clamped to minimum 5% (+2% if timeline is tight or very tight).
 * 4. Normalise non-contingency items to (100 - contingency) and cap single categories at 50%.
 * 5. Convert weights to integer minor currency units using Hare-Niemeyer largest-remainder rounding.
 *
 * @param input Validated user event parameters.
 * @param options Schedule context options.
 * @returns Complete, strictly validated BudgetPlan.
 */
export function allocateBudget(input: PlanInput, options?: AllocateBudgetOptions): BudgetPlan {
  const activeCategories = categoriesForEventType(input.eventType);
  const baseWeights = getBaseWeights(input.eventType);

  const baseContingency = baseWeights.contingency;
  const contingencyShare = calculateContingencyShare(baseContingency, options?.tightness);
  const targetNonContingency = Math.max(0, 100 - contingencyShare);

  const rawNonContingency = computeModifiedNonContingencyWeights(
    input,
    baseWeights,
    activeCategories
  );
  const { weights: normWeights, cappedCategories } = normaliseAndCapWeights(
    rawNonContingency,
    targetNonContingency
  );

  const itemsToRound = activeCategories.map((cat) => ({
    categoryId: cat,
    weight: cat === "contingency" ? contingencyShare : normWeights[cat],
  }));

  const allocations = largestRemainder(input.budget.totalMinor, itemsToRound);
  const totalMinor = input.budget.totalMinor;

  const lines: BudgetLine[] = allocations.map((alloc) => {
    const sharePct =
      totalMinor > 0 ? Math.round((alloc.allocatedMinor / totalMinor) * 10000) / 100 : 0;
    return {
      categoryId: alloc.categoryId,
      allocatedMinor: alloc.allocatedMinor,
      sharePct,
      actualMinor: 0,
      status: "under",
    };
  });

  lines.sort((a, b) => {
    const diff = b.allocatedMinor - a.allocatedMinor;
    return diff !== 0 ? diff : a.categoryId.localeCompare(b.categoryId);
  });

  const perGuestMinor = Math.floor(totalMinor / Math.max(1, input.guestCount));
  const warnings = evaluateBudgetWarnings(input, lines, {
    cappedCategories,
    baseContingency,
  });

  return {
    currency: input.budget.currency,
    totalMinor,
    lines,
    perGuestMinor,
    warnings,
  };
}
