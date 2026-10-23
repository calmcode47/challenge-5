import type { CategoryId } from "../../contracts/enums.js";
import type { BudgetPlan } from "../../contracts/planComponents.js";
import type { PlanInput } from "../../contracts/planInput.js";
import { getBaseWeights } from "./baseWeights.js";
import { getGuestSizeModifiers, getVenueModifiers } from "./modifiers.js";

/**
 * Structured, localization-ready explanation data item describing budget rationale.
 */
export interface ExplanationLine {
  /** Relevant category identifier if the rationale is category-specific. */
  categoryId?: CategoryId;
  /** Translation message key. */
  key: string;
  /** Variable parameters for translation template rendering. */
  params: Record<string, string | number>;
}

function buildSummaryExplanation(input: PlanInput): ExplanationLine {
  if (input.venueType !== "banquet_hall" && input.venueType !== "undecided") {
    return {
      key: "budget.explain.summary.venue",
      params: { venueType: input.venueType },
    };
  }
  if (input.guestCount > 200 || input.guestCount < 30) {
    return {
      key: "budget.explain.summary.guest_size",
      params: { guestCount: input.guestCount },
    };
  }
  return {
    key: "budget.explain.summary.baseline",
    params: { eventType: input.eventType, guestCount: input.guestCount },
  };
}

function explainCategoryDeviation(
  cat: CategoryId,
  baseWeight: number,
  finalSharePct: number,
  input: PlanInput
): ExplanationLine[] {
  const reasons: ExplanationLine[] = [];
  const priority = input.priorities[cat] ?? 3;

  if (priority > 3) {
    reasons.push({
      categoryId: cat,
      key: "budget.why.priority_raised",
      params: { category: cat, priority, from: baseWeight, to: finalSharePct },
    });
  } else if (priority < 3) {
    reasons.push({
      categoryId: cat,
      key: "budget.why.priority_lowered",
      params: { category: cat, priority, from: baseWeight, to: finalSharePct },
    });
  }

  const venueMods = getVenueModifiers(input.venueType);
  const vMod = venueMods[cat];
  if (vMod !== undefined) {
    reasons.push({
      categoryId: cat,
      key: "budget.why.venue_modifier",
      params: { category: cat, venueType: input.venueType, multiplier: vMod },
    });
  }

  const guestMods = getGuestSizeModifiers(input.guestCount);
  const gMod = guestMods[cat];
  if (gMod !== undefined) {
    reasons.push({
      categoryId: cat,
      key: "budget.why.guest_modifier",
      params: { category: cat, guestCount: input.guestCount, multiplier: gMod },
    });
  }

  if (reasons.length === 0) {
    reasons.push({
      categoryId: cat,
      key: "budget.why.rebalanced",
      params: { category: cat, from: baseWeight, to: finalSharePct },
    });
  }

  return reasons;
}

/**
 * Derives explainability metadata for a computed budget plan.
 *
 * Requirements:
 * 1. Produces at least one overall summary line explaining environmental influences.
 * 2. Produces at least one explanatory reason for every category deviating from baseline
 *    weight by 1 percentage point or more.
 * 3. Output is pure structured data with i18n keys and parameters, never free sentences.
 *
 * @param input Plan input preferences.
 * @param plan Completed budget plan with line items.
 * @returns Array of ExplanationLine objects.
 */
export function explainAllocation(input: PlanInput, plan: BudgetPlan): ExplanationLine[] {
  const explanations: ExplanationLine[] = [buildSummaryExplanation(input)];
  const baseWeights = getBaseWeights(input.eventType);

  for (const line of plan.lines) {
    const baseWeight = baseWeights[line.categoryId];
    if (Math.abs(line.sharePct - baseWeight) >= 1.0) {
      const categoryExplanations = explainCategoryDeviation(
        line.categoryId,
        baseWeight,
        line.sharePct,
        input
      );
      explanations.push(...categoryExplanations);
    }
  }

  return explanations;
}
