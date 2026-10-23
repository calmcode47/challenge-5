import type { CategoryId } from "../../contracts/enums.js";
import type { Plan } from "../../contracts/plan.js";
import { PlanSchema } from "../../contracts/plan.js";
import { type Result, err, ok } from "../../lib/result.js";
import { allocateBudget } from "../budget/allocateBudget.js";
import { computeVendorVariance } from "../checklist/variance.js";
import { validateBudgetShift } from "../enrichment/shiftBudgetValidator.js";
import { applyIdeaConstraints } from "../ideas/applyIdeaConstraints.js";

/**
 * Diagnostic error returned when a budget re-allocation mutation fails validation.
 */
export interface ShiftBudgetError {
  readonly code: "UNKNOWN_CATEGORY" | "EXCEEDS_SOURCE" | "INVARIANT_VIOLATION";
  readonly message: string;
}

/**
 * Pure mutation re-allocating minor units from one category to another while strictly enforcing invariants.
 *
 * Invariants:
 * 1. Preserves total budget minor units.
 * 2. Requires source and destination to exist and differ.
 * 3. Amount must not exceed source allocation.
 * 4. Contingency reserve must remain >= 5%.
 * 5. Destination category allocation must not exceed 50%.
 *
 * @param plan Active celebration plan.
 * @param from Source category identifier.
 * @param to Target category identifier.
 * @param amountMinor Positive integer minor currency amount to transfer.
 * @param now Reference timestamp for updatedAt.
 * @returns Result containing the updated Plan on success, or ShiftBudgetError on invariant breach.
 */
export function shiftBudget(
  plan: Plan,
  from: CategoryId,
  to: CategoryId,
  amountMinor: number,
  now: Date | string
): Result<Plan, ShiftBudgetError> {
  const validation = validateBudgetShift(plan.budget, {
    from,
    to,
    amountMinor,
    rationale: "User budget shift mutation",
  });

  if (!validation.valid) {
    return err({
      code: validation.reason,
      message: `Budget shift failed invariant verification: ${validation.reason}`,
    });
  }

  const updatedBudget = computeVendorVariance({
    budget: {
      ...plan.budget,
      lines: validation.updatedLines,
    },
    vendors: plan.vendors,
  });

  const updatedIdeas = applyIdeaConstraints(plan.ideas, {
    input: plan.input,
    budget: updatedBudget,
    pinnedIdeaIds: plan.pinnedIdeaIds,
  });

  const updatedIso = typeof now === "string" ? new Date(now).toISOString() : now.toISOString();

  const nextPlan: Plan = {
    ...plan,
    updatedAt: updatedIso,
    budget: updatedBudget,
    ideas: updatedIdeas,
  };

  return ok(PlanSchema.parse(nextPlan));
}

/**
 * Pure mutation adjusting a category's importance priority (1-5) and recomputing proportional allocations.
 *
 * @param plan Active celebration plan.
 * @param categoryId Target domain category.
 * @param priority Priority rank from 1 (lowest) to 5 (highest).
 * @param now Reference timestamp for updatedAt.
 * @returns New Plan with recalculated budget, reconciled vendor variance, and refreshed idea compatibility.
 */
export function setPriority(
  plan: Plan,
  categoryId: CategoryId,
  priority: 1 | 2 | 3 | 4 | 5,
  now: Date | string
): Plan {
  const updatedInput = {
    ...plan.input,
    priorities: {
      ...plan.input.priorities,
      [categoryId]: priority,
    },
  };

  const reallocatedBudget = allocateBudget(updatedInput, {
    tightness: plan.timeline.tightness,
  });

  const reconciledBudget = computeVendorVariance({
    budget: reallocatedBudget,
    vendors: plan.vendors,
  });

  const updatedIdeas = applyIdeaConstraints(plan.ideas, {
    input: updatedInput,
    budget: reconciledBudget,
    pinnedIdeaIds: plan.pinnedIdeaIds,
  });

  const updatedIso = typeof now === "string" ? new Date(now).toISOString() : now.toISOString();

  const nextPlan: Plan = {
    ...plan,
    updatedAt: updatedIso,
    input: updatedInput,
    budget: reconciledBudget,
    ideas: updatedIdeas,
  };

  return PlanSchema.parse(nextPlan);
}
