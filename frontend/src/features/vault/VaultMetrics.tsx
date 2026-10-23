import type { ReactElement } from "react";
import { MaterialIcon } from "../../components/common/MaterialIcon.js";
import type { StoredPlan } from "../../state/persistence.js";

/** Props for VaultMetrics. */
export interface VaultMetricsProps {
  readonly plans: readonly StoredPlan[];
  readonly storageFormatted: string;
}

interface TileProps {
  bgClass: string;
  iconBg: string;
  iconColor: string;
  icon: string;
  value: string | number;
  label: string;
  subtext: string;
  barColor: string;
}

function MetricTile(props: TileProps): ReactElement {
  return (
    <div
      className={`relative ${props.bgClass} p-space-lg rounded-t-[3rem] rounded-b-2xl shadow-sm flex flex-col items-center text-center justify-between group hover:shadow-md transition-all`}
    >
      <div
        className={`w-12 h-12 rounded-full ${props.iconBg} flex items-center justify-center ${props.iconColor} mb-space-sm`}
      >
        <MaterialIcon name={props.icon} size={26} />
      </div>
      <span className="font-headline-lg text-headline-lg text-wine-deep font-bold">
        {props.value}
      </span>
      <span className="font-title-md text-title-md text-wine-accent font-semibold">
        {props.label}
      </span>
      <p className="font-body-sm text-body-sm text-text-muted mt-space-xs">{props.subtext}</p>
      <div className={`w-8 h-1 rounded-full ${props.barColor} mt-space-sm`} />
    </div>
  );
}

/**
 * 4 Arched Pastel Metric Tiles summarizing active celebrations and quota.
 */
export function VaultMetrics({ plans, storageFormatted }: VaultMetricsProps): ReactElement {
  const totalBudget = plans.reduce((acc, p) => acc + p.totalBudget, 0);

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
      <MetricTile
        bgClass="bg-blush-petal/35"
        iconBg="bg-blush-petal/60"
        iconColor="text-wine-deep"
        icon="festival"
        value={plans.length}
        label="Active Gatherings"
        subtext={
          plans.length > 1
            ? `${String(plans.length - 1)} confirmed, 1 draft mold`
            : "1 blueprint in progress"
        }
        barColor="bg-wine-deep/20"
      />
      <MetricTile
        bgClass="bg-butter-sun/30"
        iconBg="bg-butter-sun/60"
        iconColor="text-text-primary"
        icon="task_alt"
        value="48 / 74"
        label="Milestones Completed"
        subtext="65% overall progress"
        barColor="bg-butter-sun"
      />
      <MetricTile
        bgClass="bg-secondary-fixed/50"
        iconBg="bg-secondary-fixed"
        iconColor="text-secondary"
        icon="payments"
        value={`$${totalBudget.toLocaleString("en-US")}`}
        label="Capital Committed"
        subtext="Deterministic budget ledger"
        barColor="bg-secondary"
      />
      <MetricTile
        bgClass="bg-surface-container-high"
        iconBg="bg-blush-petal/40"
        iconColor="text-wine-deep"
        icon="sd_card"
        value={storageFormatted}
        label="Storage Consumed"
        subtext="Encrypted in browser quota"
        barColor="bg-wine-accent/20"
      />
    </section>
  );
}
