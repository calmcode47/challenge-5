import type {
  BudgetLine,
  BudgetPlan,
  PlanWarning,
  Vendor,
} from "../../contracts/planComponents.js";
import { BudgetPlanSchema } from "../../contracts/planComponents.js";

/**
 * Minimal plan slice required to compute vendor expenditure variance.
 */
export interface PlanWithBudgetAndVendors {
  readonly budget: BudgetPlan;
  readonly vendors: readonly Vendor[];
}

/**
 * Calculates committed minor unit expenditure for a single vendor.
 * Defined as Math.max(quoteMinor ?? 0, paidMinor ?? 0).
 */
export function calculateVendorCommitted(vendor: Vendor): number {
  if (vendor.stage === "declined") {
    return 0;
  }
  const quote = vendor.quoteMinor ?? 0;
  const paid = vendor.paidMinor ?? 0;
  return Math.max(quote, paid);
}

function aggregateVendorActuals(vendors: readonly Vendor[]): Map<string, number> {
  const actuals = new Map<string, number>();
  for (const v of vendors) {
    if (v.stage === "declined") {
      continue;
    }
    const committed = calculateVendorCommitted(v);
    const current = actuals.get(v.categoryId) ?? 0;
    actuals.set(v.categoryId, current + committed);
  }
  return actuals;
}

function reconcileLineStatus(
  line: BudgetLine,
  actualMinor: number
): { status: BudgetLine["status"]; warning?: PlanWarning } {
  if (actualMinor > line.allocatedMinor) {
    const overAmount = actualMinor - line.allocatedMinor;
    return {
      status: "over",
      warning: {
        code: "BUDGET_OVER_BY",
        messageKey: "budget.warning.budget_over_by",
        params: { categoryId: line.categoryId, amount: overAmount },
      },
    };
  }
  if (line.allocatedMinor > 0 && actualMinor / line.allocatedMinor >= 0.85) {
    return { status: "on_track" };
  }
  if (line.allocatedMinor === 0 && actualMinor === 0) {
    return { status: "on_track" };
  }
  return { status: "under" };
}

/**
 * Computes vendor expenditure variance against the allocated budget plan.
 *
 * @param plan Object containing current budget plan and user vendors.
 * @returns Updated BudgetPlan with refreshed line item actuals, statuses, and diagnostic warnings.
 */
export function computeVendorVariance(plan: PlanWithBudgetAndVendors): BudgetPlan {
  const { budget, vendors } = plan;
  const categoryActuals = aggregateVendorActuals(vendors);

  const newWarnings: PlanWarning[] = [];
  let totalCommitted = 0;

  const updatedLines: BudgetLine[] = budget.lines.map((line) => {
    const actualMinor = categoryActuals.get(line.categoryId) ?? 0;
    totalCommitted += actualMinor;

    const { status, warning } = reconcileLineStatus(line, actualMinor);
    if (warning) {
      newWarnings.push(warning);
    }

    return {
      categoryId: line.categoryId,
      allocatedMinor: line.allocatedMinor,
      sharePct: line.sharePct,
      actualMinor,
      status,
    };
  });

  if (totalCommitted > budget.totalMinor) {
    newWarnings.push({
      code: "BUDGET_TOTAL_OVER_BY",
      messageKey: "budget.warning.budget_total_over_by",
      params: { amount: totalCommitted - budget.totalMinor },
    });
  }

  const existingNonVarianceWarnings = budget.warnings.filter(
    (w) => w.code !== "BUDGET_OVER_BY" && w.code !== "BUDGET_TOTAL_OVER_BY"
  );

  const updatedBudget: BudgetPlan = {
    currency: budget.currency,
    totalMinor: budget.totalMinor,
    perGuestMinor: budget.perGuestMinor,
    lines: updatedLines,
    warnings: [...existingNonVarianceWarnings, ...newWarnings],
  };

  return BudgetPlanSchema.parse(updatedBudget);
}
