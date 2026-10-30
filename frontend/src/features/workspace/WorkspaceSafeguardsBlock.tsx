import type { ReactElement } from "react";
import { MaterialIcon } from "../../components/common/MaterialIcon.js";
import type { StoredPlan } from "../../state/persistence.js";

function Checklist({ items }: { items: readonly string[] }): ReactElement {
  return (
    <ul className="flex flex-col gap-space-sm" aria-label="Vendor safeguards">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-space-sm rounded-2xl bg-surface-container-lowest p-space-sm shadow-sm"
        >
          <MaterialIcon name="check_circle" size={18} className="mt-0.5 shrink-0 text-secondary" />
          <span className="font-body-sm text-body-sm text-on-surface-variant">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function RiskFlags({ flags }: { flags: readonly string[] }): ReactElement | null {
  if (flags.length === 0) return null;
  return (
    <div className="rounded-2xl bg-butter-sun/20 p-space-sm">
      <h3 className="flex items-center gap-space-xs font-label-lg text-label-lg text-wine-deep font-bold">
        <MaterialIcon name="warning" size={18} className="text-wine-accent" /> Risk flags
      </h3>
      <ul className="mt-space-xs flex list-disc flex-col gap-1 pl-space-lg font-body-sm text-body-sm text-on-surface-variant">
        {flags.map((flag) => (
          <li key={flag}>{flag}</li>
        ))}
      </ul>
    </div>
  );
}

/** Shows the safeguards actually generated for the active event plan. */
export function WorkspaceSafeguardsBlock({ plan }: { readonly plan: StoredPlan }): ReactElement {
  const safeguards = plan.vendorChecklist ?? [
    "Create a new plan to receive context-specific vendor safeguards.",
  ];
  return (
    <section className="lg:col-span-7 rounded-3xl bg-cream-linen p-space-lg shadow-sm">
      <div className="flex items-center gap-space-xs text-wine-accent">
        <MaterialIcon name="shield_with_heart" size={18} />
        <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider">
          Generated safeguards
        </span>
      </div>
      <h2 className="mt-1 font-headline-md text-headline-md text-text-primary font-bold">
        Vendor Questions &amp; Risk Flags
      </h2>
      <p className="mt-1 font-body-sm text-body-sm text-text-muted">
        This checklist is derived from the active plan’s guest, access, and weather requirements.
      </p>
      <div className="mt-space-md flex flex-col gap-space-md">
        <Checklist items={safeguards} />
        <RiskFlags flags={plan.riskFlags ?? []} />
      </div>
    </section>
  );
}
