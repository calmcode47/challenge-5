import type { ReactElement } from "react";
import { MaterialIcon } from "../../components/common/MaterialIcon.js";
import type { BudgetAllocation, StoredPlan } from "../../state/persistence.js";

const BAR_COLORS = [
  "bg-wine-accent",
  "bg-sage-earth",
  "bg-blush-deep",
  "bg-butter-sun",
  "bg-secondary",
  "bg-primary-fixed-dim",
];

function paletteColor(index: number): string {
  return BAR_COLORS[index % BAR_COLORS.length] ?? "bg-wine-accent";
}

function allocationFor(plan?: StoredPlan): readonly BudgetAllocation[] {
  return plan?.budgetAllocation ?? [];
}

function currency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function LedgerHeader({
  allocationCount,
  committedPercent,
  isOverBudget,
}: {
  allocationCount: number;
  committedPercent: number;
  isOverBudget: boolean;
}): ReactElement {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-sm">
      <div className="flex items-center gap-space-sm">
        <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-wine-accent">
          <MaterialIcon name="pie_chart" size={18} />
        </div>
        <div>
          <h2
            id="budget-ledger-title"
            className="font-title-md text-title-md text-text-primary font-bold"
          >
            Stoneware Capital Ledger
          </h2>
          <p className="font-body-sm text-body-sm text-text-muted">
            Generated allocation across {String(allocationCount)} planning envelopes
          </p>
        </div>
      </div>
      <div className="flex items-center gap-space-xs bg-surface-container-high px-space-md py-space-xs rounded-full">
        <span className="font-label-md text-label-md text-secondary font-medium">
          Committed Capacity:
        </span>
        <span
          className={`font-headline-sm text-headline-sm font-bold ${isOverBudget ? "text-error" : "text-wine-deep"}`}
        >
          {String(committedPercent)}%
        </span>
      </div>
    </div>
  );
}

function AllocationVisual({
  allocations,
  budget,
}: {
  allocations: readonly BudgetAllocation[];
  budget: number;
}): ReactElement {
  if (allocations.length === 0) {
    return (
      <p className="font-body-sm text-body-sm text-text-muted">
        This saved sample does not contain a generated allocation. Create a plan to see its API
        allocation here.
      </p>
    );
  }
  return (
    <>
      <div
        className="w-full h-4 rounded-full bg-surface-container-high overflow-hidden flex shadow-inner"
        role="img"
        aria-label={`Budget allocation totaling ${currency(budget)}`}
      >
        {allocations.map((allocation, index) => (
          <div
            key={allocation.category}
            className={`h-full ${paletteColor(index)}`}
            style={{ width: `${String(allocation.percent)}%` }}
            title={`${allocation.category}: ${String(allocation.percent)}%`}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-space-xs mt-space-sm text-text-muted font-label-sm text-label-sm">
        {allocations.map((allocation, index) => (
          <span key={allocation.category} className="flex items-center gap-1.5 font-medium">
            <span
              className={`w-2.5 h-2.5 rounded-full ${paletteColor(index)}`}
              aria-hidden="true"
            />
            {allocation.category} ({currency(allocation.amount)})
          </span>
        ))}
      </div>
    </>
  );
}

/** Displays the generated allocation and any locally recorded commitments for this plan. */
export function WorkspaceBudgetRatio({ plan }: { readonly plan?: StoredPlan }): ReactElement {
  const allocations = allocationFor(plan);
  const budget = plan?.totalBudget ?? 24_000;
  const committed = (plan?.expenses ?? []).reduce((total, expense) => total + expense.amount, 0);
  const committedPercent = Math.min(100, Math.round((committed / budget) * 100));
  const isOverBudget = committed > budget;

  return (
    <section
      className="bg-cream-linen rounded-3xl p-space-lg shadow-sm"
      aria-labelledby="budget-ledger-title"
    >
      <LedgerHeader
        allocationCount={allocations.length}
        committedPercent={committedPercent}
        isOverBudget={isOverBudget}
      />
      <AllocationVisual allocations={allocations} budget={budget} />
      <p
        className={`mt-space-sm font-body-sm text-body-sm ${isOverBudget ? "text-error" : "text-text-muted"}`}
      >
        {isOverBudget
          ? `${currency(committed - budget)} above the total budget. Revisit commitments before approving another vendor.`
          : `${currency(budget - committed)} remains uncommitted across the plan.`}
      </p>
    </section>
  );
}
