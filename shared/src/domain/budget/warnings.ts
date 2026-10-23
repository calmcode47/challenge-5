import type { CategoryId } from "../../contracts/enums.js";
import type { BudgetLine, PlanWarning } from "../../contracts/planComponents.js";
import type { PlanInput } from "../../contracts/planInput.js";

/**
 * Options configuring budget diagnostic warning evaluation.
 */
export interface WarningEvaluationOptions {
  /** List of categories where the 50% cap was applied. */
  cappedCategories?: readonly CategoryId[];
  /** Baseline contingency percentage prior to minimum clamping. */
  baseContingency?: number;
}

function checkPrioritiesConflict(priorities: Record<string, number>): PlanWarning | null {
  const p5Count = Object.values(priorities).filter((p) => p === 5).length;
  if (p5Count > 3) {
    return {
      code: "PRIORITIES_CONFLICT",
      messageKey: "budget.warnings.priorities_conflict",
      params: { count: p5Count },
    };
  }
  return null;
}

function checkCappingWarning(capped: readonly CategoryId[]): PlanWarning | null {
  if (capped.length > 0) {
    return {
      code: "SINGLE_CATEGORY_CAP_APPLIED",
      messageKey: "budget.warnings.single_category_cap_applied",
      params: {
        categories: capped.join(", "),
        count: capped.length,
        maxSharePct: 50,
      },
    };
  }
  return null;
}

function checkCateringWarning(lines: readonly BudgetLine[]): PlanWarning | null {
  const cateringLine = lines.find((l) => l.categoryId === "catering");
  if (cateringLine && cateringLine.sharePct < 20) {
    return {
      code: "CATERING_SHARE_BELOW_20PCT",
      messageKey: "budget.warnings.catering_share_below_20pct",
      params: { sharePct: cateringLine.sharePct },
    };
  }
  return null;
}

function checkContingencyWarning(
  input: PlanInput,
  lines: readonly BudgetLine[],
  options?: WarningEvaluationOptions
): PlanWarning | null {
  const contingencyLine = lines.find((l) => l.categoryId === "contingency");
  const hadLowBase = options?.baseContingency !== undefined && options.baseContingency < 5;
  const hadLowPriority = (input.priorities.contingency ?? 3) < 3;
  const hadClampedLine = contingencyLine !== undefined && contingencyLine.sharePct < 5;

  if (hadLowBase || hadLowPriority || hadClampedLine) {
    return {
      code: "CONTINGENCY_BELOW_MIN",
      messageKey: "budget.warnings.contingency_below_min",
      params: { minPct: 5 },
    };
  }
  return null;
}

/**
 * Evaluates pure diagnostic warnings for a calculated budget plan.
 *
 * Rules:
 * 1. `PRIORITIES_CONFLICT`: Triggered when user selects priority 5 on more than 3 categories.
 * 2. `SINGLE_CATEGORY_CAP_APPLIED`: Triggered when any category exceeds 50% and is clamped.
 * 3. `CATERING_SHARE_BELOW_20PCT`: Triggered when catering allocation is below 20%.
 * 4. `CONTINGENCY_BELOW_MIN`: Triggered if baseline contingency was below 5% or priority reduced it.
 *
 * Output consists strictly of structured translation keys and parameters, never free sentences.
 *
 * @param input Original user plan input parameters.
 * @param lines Calculated budget breakdown lines.
 * @param options Diagnostic evaluation context.
 * @returns Array of structured PlanWarning objects.
 */
export function evaluateBudgetWarnings(
  input: PlanInput,
  lines: readonly BudgetLine[],
  options?: WarningEvaluationOptions
): PlanWarning[] {
  const warnings: PlanWarning[] = [];

  const conflict = checkPrioritiesConflict(input.priorities);
  if (conflict) warnings.push(conflict);

  const capping = checkCappingWarning(options?.cappedCategories ?? []);
  if (capping) warnings.push(capping);

  const catering = checkCateringWarning(lines);
  if (catering) warnings.push(catering);

  const contingency = checkContingencyWarning(input, lines, options);
  if (contingency) warnings.push(contingency);

  return warnings;
}
