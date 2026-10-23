import type { ReactElement } from "react";
import { MaterialIcon } from "../../components/common/MaterialIcon.js";
import type { WizardFormState } from "./wizardTypes.js";

/** Props for WizardTicketSidebar. */
export interface WizardTicketSidebarProps {
  readonly formState: WizardFormState;
  readonly isBaking: boolean;
  readonly onBake: () => void;
}

const VERTICAL_LABELS: Record<string, string> = {
  wedding: "Wedding Gathering",
  milestone: "Milestone Birthday",
  community: "Communal Feast",
  anniversary: "Anniversary Salon",
};

function TicketHeader(): ReactElement {
  return (
    <div className="flex items-center justify-between border-b-0 pb-space-xs">
      <div className="flex items-center gap-space-xs">
        <div className="w-8 h-8 rounded-full bg-wine-accent text-cream-linen flex items-center justify-center">
          <MaterialIcon name="receipt_long" size={18} />
        </div>
        <span className="font-headline-sm text-headline-sm text-wine-deep font-bold">
          Studio Ticket #204
        </span>
      </div>
      <span className="font-label-sm text-label-sm px-space-sm py-0.5 rounded-full bg-butter-sun text-text-primary font-bold">
        Craft Draft
      </span>
    </div>
  );
}

function TicketBreakdown({ formState }: { formState: WizardFormState }): ReactElement {
  const { budgetTotal, guestCount } = formState;
  const perGuest = guestCount > 0 ? budgetTotal / guestCount : 0;
  const sensoryCount = [
    formState.sensoryAda,
    formState.sensoryAllergen,
    formState.sensoryPavilion,
    formState.sensoryAcoustic,
  ].filter(Boolean).length;

  return (
    <div className="flex flex-col gap-space-xs bg-cream-linen p-space-md rounded-2xl shadow-sm">
      <div className="flex items-center justify-between font-body-sm text-body-sm text-text-muted">
        <span>Deterministic Yield:</span>
        <span className="font-headline-sm text-headline-sm text-wine-deep font-bold">
          ${perGuest.toFixed(2)} / guest
        </span>
      </div>
      <div className="flex items-center justify-between font-body-sm text-body-sm text-text-muted">
        <span>Milestone Nodes:</span>
        <span className="font-label-lg text-label-lg text-text-primary font-bold">
          18 Handcrafted Nodes
        </span>
      </div>
      <div className="flex items-center justify-between font-body-sm text-body-sm text-text-muted">
        <span>Vendor RFP Briefs:</span>
        <span className="font-label-lg text-label-lg text-text-primary font-bold">
          7 Artisan Briefs
        </span>
      </div>
      <div className="flex items-center justify-between font-body-sm text-body-sm text-text-muted">
        <span>Sensory Compliances:</span>
        <span className="font-label-lg text-label-lg text-secondary font-bold">
          {sensoryCount} of 4 Active
        </span>
      </div>
    </div>
  );
}

function TicketEnvelope({ budgetTotal }: { budgetTotal: number }): ReactElement {
  const cents = Math.round(budgetTotal * 100);
  return (
    <div className="flex flex-col gap-1 bg-surface-container-high p-space-md rounded-2xl shadow-inner">
      <div className="flex items-center justify-between">
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-text-muted font-bold">
          Total Envelope
        </span>
        <span className="font-label-sm text-label-sm text-secondary font-bold">
          100% Deterministic
        </span>
      </div>
      <div className="flex items-baseline justify-between mt-1">
        <span className="font-headline-xl text-headline-xl text-wine-deep font-bold">
          ${Math.floor(budgetTotal).toLocaleString("en-US")}
        </span>
        <span className="font-label-sm text-label-sm text-text-muted font-semibold">.00 USD</span>
      </div>
      <span className="font-body-sm text-body-sm text-on-surface-variant">
        {cents.toLocaleString("en-US")} minor cent integers locked in escrow ledger.
      </span>
    </div>
  );
}

function TicketAction({
  isBaking,
  onBake,
}: {
  isBaking: boolean;
  onBake: () => void;
}): ReactElement {
  return (
    <div className="relative pt-space-xs">
      <button
        type="button"
        disabled={isBaking}
        onClick={onBake}
        className="w-full relative group overflow-hidden bg-wine-accent hover:bg-wine-deep text-cream-linen py-4 px-space-md rounded-2xl shadow-lg transition-all duration-200 transform active:scale-[0.98] flex items-center justify-center gap-space-xs disabled:opacity-80"
      >
        {isBaking ? (
          <>
            <MaterialIcon name="progress_activity" size={24} className="animate-spin" />
            <span className="font-label-lg text-label-lg uppercase tracking-wider font-bold">
              Firing Ceramic Kiln...
            </span>
          </>
        ) : (
          <>
            <MaterialIcon name="oven_gen" size={24} />
            <span className="font-label-lg text-label-lg uppercase tracking-wider font-bold">
              Bake Milestone Plan
            </span>
          </>
        )}
      </button>
      <div className="flex items-center justify-center gap-2 mt-2 text-center text-secondary font-label-sm text-label-sm font-medium">
        <MaterialIcon name="shield" size={14} />
        <span>Zero cancellation slip &bull; Immediate PDF Ledger</span>
      </div>
    </div>
  );
}

/**
 * Sticky right sidebar receipt ticket synthesizing celebration budget and specifications.
 */
export function WizardTicketSidebar({
  formState,
  isBaking,
  onBake,
}: WizardTicketSidebarProps): ReactElement {
  const { vertical, title, venue } = formState;

  return (
    <aside className="lg:col-span-4 lg:sticky lg:top-28">
      <div className="relative bg-cream-surface rounded-t-[2.5rem] rounded-b-2xl shadow-xl overflow-hidden p-space-lg flex flex-col gap-space-md">
        <TicketHeader />
        <div className="relative h-28 w-full rounded-2xl overflow-hidden bg-cream-linen flex items-center justify-center p-space-xs shadow-inner">
          <div className="flex items-center gap-space-sm">
            <div className="w-16 h-16 rounded-full bg-blush-petal/60 flex items-center justify-center text-wine-accent shadow-sm">
              <MaterialIcon name="local_florist" size={32} />
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-wine-deep font-bold">
                {VERTICAL_LABELS[vertical] ?? "Bespoke Celebration"}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 font-medium">
                {title || "Custom Gathering"}
              </span>
              <span className="font-label-sm text-label-sm text-secondary font-semibold">
                {venue}
              </span>
            </div>
          </div>
        </div>

        <TicketBreakdown formState={formState} />
        <TicketEnvelope budgetTotal={formState.budgetTotal} />
        <TicketAction isBaking={isBaking} onBake={onBake} />

        <div
          className="w-full flex justify-between gap-1 overflow-hidden -mb-4 mt-2 px-1"
          aria-hidden="true"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-full bg-surface shrink-0 -mb-2" />
          ))}
        </div>
      </div>

      <div className="mt-space-lg bg-surface-container p-space-md rounded-2xl shadow-sm flex items-center gap-space-md">
        <div className="w-16 h-16 rounded-xl bg-butter-sun/30 shrink-0 flex items-center justify-center text-wine-accent">
          <MaterialIcon name="palette" size={32} />
        </div>
        <div className="flex flex-col">
          <span className="font-headline-sm text-headline-sm text-wine-deep font-bold">
            Ceramic Glaze Guide
          </span>
          <span className="font-body-sm text-body-sm text-text-muted">
            Natural slip stoneware, wild olive foliage, and raw linen place cards.
          </span>
        </div>
      </div>
    </aside>
  );
}
