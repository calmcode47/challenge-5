import type { ReactElement } from "react";
import { MaterialIcon } from "../../components/common/MaterialIcon.js";
import { DaisySvg } from "../../components/common/DaisySvg.js";
import type { StoredPlan } from "../../state/persistence.js";

/** Props for WorkspaceBanner. */
export interface WorkspaceBannerProps {
  readonly plan: StoredPlan;
  readonly onLogExpense: () => void;
  readonly onExportBrief: () => void;
  readonly onRunOfShow: () => void;
}

function BannerActions({
  onLogExpense,
  onExportBrief,
  onRunOfShow,
}: {
  onLogExpense: () => void;
  onExportBrief: () => void;
  onRunOfShow: () => void;
}): ReactElement {
  return (
    <div className="flex flex-wrap lg:flex-col sm:flex-row items-stretch lg:items-end gap-space-xs">
      <button
        type="button"
        onClick={onLogExpense}
        className="flex items-center justify-center gap-space-xs bg-butter-sun text-text-primary px-space-md py-space-sm rounded-xl font-label-lg text-label-lg hover:bg-butter-sun/90 shadow-md transition-all active:scale-95 font-bold"
      >
        <MaterialIcon name="add_circle" size={20} />
        <span>+ Log Ceramic Expense</span>
      </button>
      <div className="flex items-center gap-space-xs">
        <button
          type="button"
          onClick={onExportBrief}
          className="flex items-center gap-space-xs bg-wine-accent/80 hover:bg-wine-accent text-cream-linen px-space-sm py-space-xs rounded-xl font-label-md text-label-md transition-colors font-medium"
        >
          <MaterialIcon name="file_download" size={16} />
          <span>Export Brief (.JSON)</span>
        </button>
        <button
          type="button"
          onClick={onRunOfShow}
          className="flex items-center gap-space-xs bg-wine-accent/80 hover:bg-wine-accent text-cream-linen px-space-sm py-space-xs rounded-xl font-label-md text-label-md transition-colors font-medium"
        >
          <MaterialIcon name="print" size={16} />
          <span>Run-of-Show</span>
        </button>
      </div>
    </div>
  );
}

interface BannerMetricTileProps {
  icon: string;
  iconBg: string;
  iconColor: string;
  label: string;
  value: React.ReactNode;
}

function BannerMetricTile(props: BannerMetricTileProps): ReactElement {
  return (
    <div className="bg-surface-container-lowest/15 backdrop-blur-md rounded-2xl p-space-sm flex items-center gap-space-sm shadow-sm">
      <div
        className={`w-10 h-10 rounded-full ${props.iconBg} flex items-center justify-center ${props.iconColor} shrink-0`}
      >
        <MaterialIcon name={props.icon} size={22} />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="font-label-sm text-label-sm text-blush-petal uppercase tracking-wider font-semibold">
          {props.label}
        </span>
        <span className="font-headline-sm text-headline-sm text-cream-linen truncate font-bold">
          {props.value}
        </span>
      </div>
    </div>
  );
}

function BannerMetrics({ plan }: { plan: StoredPlan }): ReactElement {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm pt-space-xs">
      <BannerMetricTile
        icon="calendar_month"
        iconBg="bg-butter-sun/20"
        iconColor="text-butter-sun"
        label="Date & Horizon"
        value={plan.date}
      />
      <BannerMetricTile
        icon="group"
        iconBg="bg-sage-soft/20"
        iconColor="text-sage-soft"
        label="Guest Count"
        value={`${String(plan.guestCount)} Confirmed`}
      />
      <BannerMetricTile
        icon="account_balance_wallet"
        iconBg="bg-blush-petal/20"
        iconColor="text-blush-petal"
        label="Cap vs Spent"
        value={
          <>
            $13,700{" "}
            <span className="font-body-sm text-body-sm text-cream-linen/60 font-normal">
              / ${plan.totalBudget.toLocaleString("en-US")}
            </span>
          </>
        }
      />
      <BannerMetricTile
        icon="verified_user"
        iconBg="bg-tertiary-fixed/20"
        iconColor="text-tertiary-fixed"
        label="Status Lock"
        value="Zero Deficit Guarantee"
      />
    </div>
  );
}

function BannerTopRow(): ReactElement {
  return (
    <div className="flex flex-wrap items-center justify-between gap-space-sm">
      <div className="flex items-center gap-space-xs bg-wine-accent/70 px-space-md py-1 rounded-full text-cream-linen">
        <MaterialIcon name="spa" size={18} className="text-butter-sun" />
        <span className="font-label-sm text-label-sm tracking-wider uppercase font-semibold">
          Handcrafted Planning Dossier
        </span>
        <span className="opacity-40">&bull;</span>
        <span className="font-label-sm text-label-sm text-blush-petal">Autumn Terracotta Slip</span>
      </div>
      <div className="flex items-center gap-space-xs text-cream-linen/80">
        <span className="w-2.5 h-2.5 rounded-full bg-butter-sun animate-pulse" />
        <span className="font-label-sm text-label-sm font-medium">Active Live Workspace</span>
      </div>
    </div>
  );
}

function BannerTitleBlock({ title, venue }: { title: string; venue: string }): ReactElement {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-space-sm mb-space-xs">
        <DaisySvg size={28} petalColor="#FBF7EE" centerColor="#F3CE72" />
        <span className="font-label-lg text-label-lg text-butter-sun tracking-wide font-bold">
          Studio Milestone Edition
        </span>
      </div>
      <h1 className="font-headline-xl text-headline-xl text-cream-linen tracking-tight font-bold">
        {title}
      </h1>
      <svg
        className="w-36 h-3 text-blush-petal/80 my-2"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.5"
        viewBox="0 0 144 12"
        aria-hidden="true"
      >
        <path d="M2 6 Q 14 0, 26 6 T 50 6 T 74 6 T 98 6 T 122 6 T 142 6" />
      </svg>
      <p className="font-body-md text-body-md text-cream-linen/85 max-w-2xl mt-1">
        Carefully curated gathering at {venue}. Ceramic-pressed tablescapes, heirloom botanicals,
        and unhurried acoustic celebration.
      </p>
    </div>
  );
}

/**
 * Top celebration banner in Event Workspace with wine-red canvas, daisies, and key metrics.
 */
export function WorkspaceBanner({
  plan,
  onLogExpense,
  onExportBrief,
  onRunOfShow,
}: WorkspaceBannerProps): ReactElement {
  return (
    <section className="relative bg-wine-deep text-cream-linen rounded-3xl p-space-xl overflow-hidden shadow-xl">
      <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-blush-petal/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-1/4 w-72 h-72 rounded-full bg-butter-sun/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-space-lg">
        <BannerTopRow />
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
          <BannerTitleBlock title={plan.title} venue={plan.venue} />
          <BannerActions
            onLogExpense={onLogExpense}
            onExportBrief={onExportBrief}
            onRunOfShow={onRunOfShow}
          />
        </div>
        <BannerMetrics plan={plan} />
      </div>
    </section>
  );
}
