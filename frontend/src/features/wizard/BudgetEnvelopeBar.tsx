import type { ReactElement } from "react";

const fmt = (n: number): string =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const ENVELOPE_PILLARS = [
  {
    name: "Venue",
    pct: "45%",
    ratio: 0.45,
    dotClass: "bg-wine-accent",
    textClass: "text-wine-deep",
  },
  {
    name: "Catering",
    pct: "25%",
    ratio: 0.25,
    dotClass: "bg-butter-sun",
    textClass: "text-wine-deep",
  },
  {
    name: "Photo/Film",
    pct: "15%",
    ratio: 0.15,
    dotClass: "bg-blush-petal",
    textClass: "text-wine-deep",
  },
  {
    name: "Contingency",
    pct: "15%",
    ratio: 0.15,
    dotClass: "bg-secondary-container",
    textClass: "text-secondary",
  },
] as const;

function EnvelopeLegendGrid({ budgetTotal }: { budgetTotal: number }): ReactElement {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm mt-space-xs">
      {ENVELOPE_PILLARS.map((p) => (
        <div key={p.name} className="flex items-center gap-space-xs">
          <span className={`w-3 h-3 rounded-full shrink-0 ${p.dotClass}`} />
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-text-muted">
              {p.name} ({p.pct})
            </span>
            <span className={`font-label-md text-label-md font-bold ${p.textClass}`}>
              {fmt(budgetTotal * p.ratio)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Visual deterministic budget distribution bar and pillar percentage legend.
 */
export function BudgetEnvelopeBar({ budgetTotal }: { budgetTotal: number }): ReactElement {
  return (
    <div className="mt-space-lg flex flex-col gap-space-xs">
      <div className="flex items-center justify-between font-label-md text-label-md text-text-primary">
        <span className="font-semibold">Deterministic Envelope Distribution</span>
        <span className="text-secondary font-bold">100.0% Assigned</span>
      </div>

      <div className="w-full h-8 rounded-full overflow-hidden flex shadow-inner p-1 bg-surface-container-lowest">
        <div
          className="h-full bg-wine-accent rounded-l-full flex items-center justify-center text-cream-linen text-[11px] font-bold tracking-wider uppercase transition-all duration-300"
          style={{ width: "45%" }}
        >
          45%
        </div>
        <div
          className="h-full bg-butter-sun flex items-center justify-center text-text-primary text-[11px] font-bold tracking-wider uppercase transition-all duration-300"
          style={{ width: "25%" }}
        >
          25%
        </div>
        <div
          className="h-full bg-blush-petal flex items-center justify-center text-wine-deep text-[11px] font-bold tracking-wider uppercase transition-all duration-300"
          style={{ width: "15%" }}
        >
          15%
        </div>
        <div
          className="h-full bg-secondary-container rounded-r-full flex items-center justify-center text-secondary text-[11px] font-bold tracking-wider uppercase transition-all duration-300"
          style={{ width: "15%" }}
        >
          15%
        </div>
      </div>

      <EnvelopeLegendGrid budgetTotal={budgetTotal} />
    </div>
  );
}
