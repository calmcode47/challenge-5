import type { ReactElement } from "react";
import { Link } from "react-router";
import { MaterialIcon } from "../../components/common/MaterialIcon.js";
import type { StoredPlan } from "../../state/persistence.js";

/** Props for VaultPlansGrid. */
export interface VaultPlansGridProps {
  readonly plans: readonly StoredPlan[];
}

function PlanCardImage({ p }: { p: StoredPlan }): ReactElement {
  return (
    <div className="relative w-full h-44 rounded-t-[2rem] rounded-b-xl overflow-hidden bg-sage-soft">
      {p.imageUrl ? (
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          alt={p.title}
          src={p.imageUrl}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-cream-surface text-wine-accent">
          <MaterialIcon name="local_florist" size={48} />
        </div>
      )}
      <span className="absolute top-2 right-2 px-space-xs py-0.5 rounded-full bg-blush-petal text-wine-deep font-label-sm text-label-sm shadow-sm font-semibold">
        {p.archetype}
      </span>
    </div>
  );
}

function PlanCardProgress({ pct }: { pct: number }): ReactElement {
  return (
    <div className="bg-surface-container-low p-space-sm rounded-xl flex flex-col gap-1">
      <div className="flex justify-between items-center text-label-sm font-label-sm">
        <span className="text-wine-deep font-semibold">Progress: {String(pct)}% Prepared</span>
        <span className="text-secondary font-bold">
          {String(Math.round((pct / 100) * 35))}/35 tasks
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-surface-dim overflow-hidden">
        <div
          className="h-full bg-wine-accent rounded-full transition-all"
          style={{ width: `${String(pct)}%` }}
          role="progressbar"
          aria-label="Planning progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
        />
      </div>
    </div>
  );
}

function PlanCard({ p }: { p: StoredPlan }): ReactElement {
  const pct = Math.round(p.completionRatio * 100);

  return (
    <article className="bg-surface-container-lowest rounded-t-[2.5rem] rounded-b-2xl shadow-md p-space-md flex flex-col justify-between hover:shadow-xl transition-all duration-300 group">
      <div className="flex flex-col gap-space-sm">
        <PlanCardImage p={p} />
        <div>
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-secondary font-semibold">
              {p.date}
            </span>
            <span className="font-label-sm text-label-sm text-text-muted flex items-center gap-1">
              <MaterialIcon name="group" size={14} /> {p.guestCount} Guests
            </span>
          </div>
          <h3 className="font-headline-sm text-headline-sm text-wine-deep mt-1 group-hover:text-wine-accent transition-colors font-bold line-clamp-1">
            {p.title}
          </h3>
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
          {p.description}
        </p>
        <PlanCardProgress pct={pct} />

        <div className="flex flex-wrap gap-1">
          {p.tags.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-medium"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-space-md pt-space-xs flex items-center justify-between">
        <Link
          to={`/event-workspace?planId=${p.id}`}
          className="w-full py-space-xs px-space-sm bg-wine-accent hover:bg-wine-deep text-cream-linen rounded-full font-label-lg text-label-lg flex items-center justify-center gap-space-xs transition-colors shadow-sm font-bold"
        >
          <span>Open Workspace</span>
          <MaterialIcon name="arrow_forward" size={18} />
        </Link>
      </div>
    </article>
  );
}

function CreatePlanSlate(): ReactElement {
  return (
    <Link
      to="/plan-wizard"
      className="bg-cream-surface/60 rounded-t-[2.5rem] rounded-b-2xl p-space-md flex flex-col items-center justify-center text-center hover:bg-cream-surface transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-md"
    >
      <div className="w-20 h-20 rounded-full bg-blush-petal/30 flex items-center justify-center text-wine-accent mb-space-sm group-hover:scale-110 transition-transform">
        <MaterialIcon name="add_task" size={36} />
      </div>
      <h3 className="font-headline-sm text-headline-sm text-wine-deep font-bold">
        Molded From Scratch
      </h3>
      <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs max-w-xs">
        Start a fresh ceremony, tea soiree, or wedding banqueting canvas with local privacy presets.
      </p>
      <div className="mt-space-md inline-flex items-center gap-space-xs px-space-md py-space-xs bg-wine-accent text-cream-linen rounded-full font-label-lg text-label-lg shadow-sm group-hover:bg-wine-deep font-bold">
        <MaterialIcon name="brush" size={18} />
        <span>Shape Celebration</span>
      </div>
    </Link>
  );
}

/**
 * Grid displaying active celebratory assemblages and empty state creation slate.
 */
export function VaultPlansGrid({ plans }: VaultPlansGridProps): ReactElement {
  return (
    <>
      <div className="flex flex-col items-center text-center gap-space-xs">
        <div className="flex items-center gap-space-xs text-wine-accent">
          <MaterialIcon name="palette" size={20} />
          <span className="font-label-md text-label-md uppercase tracking-widest text-secondary font-bold">
            In-Progress Assemblages
          </span>
        </div>
        <h2 className="font-headline-lg text-headline-lg text-wine-deep font-bold">
          Active Celebrations Workspace
        </h2>
        <svg
          className="text-blush-deep my-1"
          fill="none"
          height="12"
          viewBox="0 0 120 12"
          width="120"
          aria-hidden="true"
        >
          <path
            d="M2 6C15 2 25 10 38 6C51 2 61 10 74 6C87 2 97 10 110 6C115 4 117 4 118 5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="3"
          />
        </svg>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
        {plans.map((p) => (
          <PlanCard key={p.id} p={p} />
        ))}
        <CreatePlanSlate />
      </section>
    </>
  );
}
