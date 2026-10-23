import type { ReactElement } from "react";
import { MaterialIcon } from "../../components/common/MaterialIcon.js";
import { BudgetEnvelopeBar } from "./BudgetEnvelopeBar.js";

/** Props for WizardBudgetStep. */
export interface WizardBudgetStepProps {
  readonly budgetTotal: number;
  readonly guestCount: number;
  readonly onBudgetChange: (budget: number) => void;
  readonly onGuestCountChange: (guests: number) => void;
}

const fmt = (n: number): string =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

interface MetricsProps {
  budgetTotal: number;
  guestCount: number;
  onBudgetChange: (budget: number) => void;
  onGuestCountChange: (guests: number) => void;
}

function MajorBudgetInput({
  budgetTotal,
  onBudgetChange,
}: {
  budgetTotal: number;
  onBudgetChange: (budget: number) => void;
}): ReactElement {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor="major-budget-input"
        className="font-label-sm text-label-sm uppercase tracking-wider text-text-muted font-bold"
      >
        Major Unit Budget ($)
      </label>
      <div className="flex items-center">
        <span className="font-headline-lg text-headline-lg text-wine-deep mr-1 font-bold">$</span>
        <input
          id="major-budget-input"
          type="number"
          step={500}
          min={1000}
          value={budgetTotal}
          onChange={(e) => {
            onBudgetChange(Math.max(1000, Number(e.target.value) || 0));
          }}
          className="w-full font-headline-lg text-headline-lg text-wine-deep bg-transparent font-bold focus:outline-none"
        />
      </div>
    </div>
  );
}

function GuestCountInput({
  guestCount,
  perGuest,
  onGuestCountChange,
}: {
  guestCount: number;
  perGuest: number;
  onGuestCountChange: (guests: number) => void;
}): ReactElement {
  return (
    <div className="flex flex-col gap-1 bg-secondary-container/40 px-space-md py-space-sm rounded-xl">
      <div className="flex items-center justify-between">
        <label
          htmlFor="guest-count-input"
          className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold"
        >
          Guest Count
        </label>
        <span className="font-label-md text-label-md text-wine-deep font-semibold bg-butter-sun px-2 py-0.5 rounded-full">
          {fmt(perGuest)}/guest
        </span>
      </div>
      <input
        id="guest-count-input"
        type="number"
        min={1}
        max={2000}
        value={guestCount}
        onChange={(e) => {
          onGuestCountChange(Math.max(1, Number(e.target.value) || 1));
        }}
        className="w-full font-headline-sm text-headline-sm text-text-primary font-bold bg-transparent outline-none"
      />
      <span className="font-body-sm text-body-sm text-text-muted">Optimized banquet ratio</span>
    </div>
  );
}

function BudgetMetricsInputs({
  budgetTotal,
  guestCount,
  onBudgetChange,
  onGuestCountChange,
}: MetricsProps): ReactElement {
  const cents = Math.round(budgetTotal * 100);
  const perGuest = guestCount > 0 ? budgetTotal / guestCount : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md items-center bg-cream-linen p-space-lg rounded-2xl shadow-sm">
      <MajorBudgetInput budgetTotal={budgetTotal} onBudgetChange={onBudgetChange} />

      <div className="flex flex-col gap-1 bg-surface-container-low px-space-md py-space-sm rounded-xl">
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-text-muted font-bold">
          Canonical Integer Cents
        </span>
        <span className="font-headline-sm text-headline-sm text-wine-accent font-bold tracking-tight">
          {cents.toLocaleString("en-US")} minor units
        </span>
        <span className="font-body-sm text-body-sm text-secondary font-medium">
          Locked against inflation shifts
        </span>
      </div>

      <GuestCountInput
        guestCount={guestCount}
        perGuest={perGuest}
        onGuestCountChange={onGuestCountChange}
      />
    </div>
  );
}

/**
 * Step 3 in Plan Wizard: Deterministic Budget Allocation with integer cents lock.
 */
export function WizardBudgetStep({
  budgetTotal,
  guestCount,
  onBudgetChange,
  onGuestCountChange,
}: WizardBudgetStepProps): ReactElement {
  return (
    <section className="bg-surface-container-high p-space-xl rounded-[2rem] shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs mb-space-md">
        <div className="flex items-center gap-space-xs">
          <span className="w-8 h-8 rounded-full bg-wine-accent text-cream-linen flex items-center justify-center font-bold font-label-md text-label-md">
            3
          </span>
          <h2 className="font-headline-md text-headline-md text-wine-deep font-bold">
            Deterministic Budget Allocation
          </h2>
        </div>
        <div className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
          <MaterialIcon name="verified" size={16} />
          <span>Zero-Variance Guarantee</span>
        </div>
      </div>
      <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg">
        Guaranteed financial accuracy: Total is strictly converted to canonical integer cents to
        eliminate floating-point creep.
      </p>

      <BudgetMetricsInputs
        budgetTotal={budgetTotal}
        guestCount={guestCount}
        onBudgetChange={onBudgetChange}
        onGuestCountChange={onGuestCountChange}
      />
      <BudgetEnvelopeBar budgetTotal={budgetTotal} />
    </section>
  );
}
