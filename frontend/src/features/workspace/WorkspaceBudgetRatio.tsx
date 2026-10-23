import type { ReactElement } from "react";
import { MaterialIcon } from "../../components/common/MaterialIcon.js";

/**
 * Stoneware Capital Ledger multi-segmented allocation ratio bar component.
 */
export function WorkspaceBudgetRatio(): ReactElement {
  return (
    <section className="bg-cream-linen rounded-3xl p-space-lg shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-sm">
        <div className="flex items-center gap-space-sm">
          <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-wine-accent">
            <MaterialIcon name="pie_chart" size={18} />
          </div>
          <div>
            <h2 className="font-title-md text-title-md text-text-primary font-bold">
              Stoneware Capital Ledger
            </h2>
            <p className="font-body-sm text-body-sm text-text-muted">
              Allocated funds locked across 6 distinct craft disciplines
            </p>
          </div>
        </div>
        <div className="flex items-center gap-space-xs bg-surface-container-high px-space-md py-space-xs rounded-full">
          <span className="font-label-md text-label-md text-secondary font-medium">
            Committed Capacity:
          </span>
          <span className="font-headline-sm text-headline-sm text-wine-deep font-bold">57.08%</span>
        </div>
      </div>

      <div className="w-full h-4 rounded-full bg-surface-container-high overflow-hidden flex shadow-inner">
        <div className="h-full bg-wine-accent" style={{ width: "48%" }} title="Venue: 48%" />
        <div className="h-full bg-sage-earth" style={{ width: "15%" }} title="Photo & Film: 15%" />
        <div className="h-full bg-blush-deep" style={{ width: "12%" }} title="Flora: 12%" />
        <div className="h-full bg-butter-sun" style={{ width: "9%" }} title="Acoustic: 9%" />
        <div className="h-full bg-secondary" style={{ width: "8%" }} title="Weather: 8%" />
        <div
          className="h-full bg-primary-fixed-dim"
          style={{ width: "8%" }}
          title="Stationery: 8%"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-space-xs mt-space-sm text-text-muted font-label-sm text-label-sm">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-wine-accent" /> Venue &amp; Dining ($11.5k)
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-sage-earth" /> Photo &amp; Film ($3.6k)
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-blush-deep" /> Flora ($2.8k)
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-butter-sun" /> Acoustic Brass ($2.2k)
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary" /> Weather Contingency ($1.9k)
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-primary-fixed-dim" /> Stationery ($2.0k)
        </span>
      </div>
    </section>
  );
}
