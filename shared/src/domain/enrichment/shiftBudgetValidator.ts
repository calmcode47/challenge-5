import type { CategoryId } from "../../contracts/enums.js";
import type { BudgetLine, BudgetPlan } from "../../contracts/planComponents.js";
import type { SuggestedBudgetShift } from "../../contracts/enrichment.js";

/**
 * Rejection reason codes for invalid or invariant-breaking budget shift proposals.
 */
export type ShiftRejectionReason = "UNKNOWN_CATEGORY" | "EXCEEDS_SOURCE" | "INVARIANT_VIOLATION";

/**
 * Result of evaluating a budget re-allocation proposal against mathematical invariants.
 */
export type ShiftValidationResult =
  | { readonly valid: true; readonly updatedLines: BudgetLine[] }
  | { readonly valid: false; readonly reason: ShiftRejectionReason };

/**
 * Verifies whether a proposed budget shift satisfies strict financial and domain invariants.
 *
 * Invariants Enforced:
 * 1. Both source (`from`) and destination (`to`) categories must exist and differ.
 * 2. Shift amount must be positive, integer, and <= source category allocated amount.
 * 3. Contingency reserve must never be reduced below 5% of total budget.
 * 4. No category allocation may exceed 50% of the total budget.
 * 5. Total budget sum remains exactly invariant.
 *
 * @param budget Current budget plan.
 * @param shift Proposed shift specification.
 * @returns Object indicating validity along with updated lines or typed rejection reason.
 */
export function validateBudgetShift(
  budget: BudgetPlan,
  shift: SuggestedBudgetShift
): ShiftValidationResult {
  if (shift.from === shift.to) {
    return { valid: false, reason: "UNKNOWN_CATEGORY" };
  }

  const fromLine = budget.lines.find((l) => l.categoryId === shift.from);
  const toLine = budget.lines.find((l) => l.categoryId === shift.to);

  if (!fromLine || !toLine) {
    return { valid: false, reason: "UNKNOWN_CATEGORY" };
  }

  if (
    !Number.isSafeInteger(shift.amountMinor) ||
    shift.amountMinor <= 0 ||
    shift.amountMinor > fromLine.allocatedMinor
  ) {
    return { valid: false, reason: "EXCEEDS_SOURCE" };
  }

  const totalMinor = budget.totalMinor;
  const newFromAllocated = fromLine.allocatedMinor - shift.amountMinor;
  const newToAllocated = toLine.allocatedMinor + shift.amountMinor;

  // Invariant 3: Contingency must remain >= 5% of total
  if (shift.from === ("contingency" as CategoryId)) {
    const minContingency = Math.ceil(totalMinor * 0.05);
    if (newFromAllocated < minContingency) {
      return { valid: false, reason: "INVARIANT_VIOLATION" };
    }
  }

  // Invariant 4: No line may exceed 50% of total
  const maxCategoryAllocation = Math.floor(totalMinor * 0.5);
  if (newToAllocated > maxCategoryAllocation) {
    return { valid: false, reason: "INVARIANT_VIOLATION" };
  }

  const updatedLines: BudgetLine[] = budget.lines.map((l) => {
    if (l.categoryId === shift.from) {
      const sharePct = Math.round((newFromAllocated / totalMinor) * 10000) / 100;
      return {
        ...l,
        allocatedMinor: newFromAllocated,
        sharePct,
      };
    }
    if (l.categoryId === shift.to) {
      const sharePct = Math.round((newToAllocated / totalMinor) * 10000) / 100;
      return {
        ...l,
        allocatedMinor: newToAllocated,
        sharePct,
      };
    }
    return { ...l };
  });

  return { valid: true, updatedLines };
}
