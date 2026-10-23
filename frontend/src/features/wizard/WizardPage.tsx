import { useState, type ReactElement } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Header } from "../../components/layout/Header.js";
import { Footer } from "../../components/layout/Footer.js";
import { SearchDialog } from "../../components/common/SearchDialog.js";
import { WizardStepperHeader } from "./WizardStepperHeader.js";
import { WizardVerticalStep } from "./WizardVerticalStep.js";
import { WizardCoordinatesStep } from "./WizardCoordinatesStep.js";
import { WizardBudgetStep } from "./WizardBudgetStep.js";
import { WizardSensoryStep } from "./WizardSensoryStep.js";
import { WizardTicketSidebar } from "./WizardTicketSidebar.js";
import type { WizardFormState, WizardVertical, WizardVenue } from "./wizardTypes.js";
import { savePlan, type StoredPlan } from "../../state/persistence.js";
import { useUiStore } from "../../state/uiStore.js";

function getInitialVertical(param: string | null): WizardVertical {
  if (param === "milestone" || param === "community" || param === "anniversary") {
    return param;
  }
  return "wedding";
}

interface StepListProps {
  formState: WizardFormState;
  setFormState: React.Dispatch<React.SetStateAction<WizardFormState>>;
}

function WizardStepList({ formState, setFormState }: StepListProps): ReactElement {
  return (
    <div className="lg:col-span-8 flex flex-col gap-space-xl">
      <WizardVerticalStep
        selectedVertical={formState.vertical}
        onSelectVertical={(v) => {
          setFormState((s) => ({ ...s, vertical: v }));
        }}
      />
      <WizardCoordinatesStep
        title={formState.title}
        date={formState.date}
        venue={formState.venue}
        onTitleChange={(t) => {
          setFormState((s) => ({ ...s, title: t }));
        }}
        onDateChange={(d) => {
          setFormState((s) => ({ ...s, date: d }));
        }}
        onVenueChange={(venue: WizardVenue) => {
          setFormState((s) => ({ ...s, venue }));
        }}
      />
      <WizardBudgetStep
        budgetTotal={formState.budgetTotal}
        guestCount={formState.guestCount}
        onBudgetChange={(b) => {
          setFormState((s) => ({ ...s, budgetTotal: b }));
        }}
        onGuestCountChange={(g) => {
          setFormState((s) => ({ ...s, guestCount: g }));
        }}
      />
      <WizardSensoryStep
        sensoryAda={formState.sensoryAda}
        sensoryAllergen={formState.sensoryAllergen}
        sensoryPavilion={formState.sensoryPavilion}
        sensoryAcoustic={formState.sensoryAcoustic}
        onToggleAda={(v) => {
          setFormState((s) => ({ ...s, sensoryAda: v }));
        }}
        onToggleAllergen={(v) => {
          setFormState((s) => ({ ...s, sensoryAllergen: v }));
        }}
        onTogglePavilion={(v) => {
          setFormState((s) => ({ ...s, sensoryPavilion: v }));
        }}
        onToggleAcoustic={(v) => {
          setFormState((s) => ({ ...s, sensoryAcoustic: v }));
        }}
      />
    </div>
  );
}

function buildStoredPlan(formState: WizardFormState, id: string): StoredPlan {
  const sensoryCount = [
    formState.sensoryAda,
    formState.sensoryAllergen,
    formState.sensoryPavilion,
    formState.sensoryAcoustic,
  ].filter(Boolean).length;

  return {
    id,
    title: formState.title || "Custom Gathering",
    date: formState.date || new Date().toISOString().slice(0, 10),
    guestCount: formState.guestCount,
    completionRatio: 0.1,
    totalBudget: formState.budgetTotal,
    vertical: formState.vertical,
    archetype: formState.venue,
    venue: formState.venue,
    sensoryCount,
    tags: ["Deterministic", "Hand-Formed"],
    description: `Sculpted blueprint for ${String(formState.guestCount)} guests with guaranteed zero-variance ledger.`,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Plan Wizard main page allowing users to sculpt deterministic celebration plans.
 */
export function WizardPage(): ReactElement {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showNotification, setActivePlanId } = useUiStore();

  const [formState, setFormState] = useState<WizardFormState>({
    vertical: getInitialVertical(searchParams.get("vertical")),
    title: "Elena & Marcus Blossom Gathering",
    date: "2025-09-19",
    venue: "Botanical Orchard",
    budgetTotal: 24000,
    guestCount: Number(searchParams.get("guests")) || 120,
    sensoryAda: true,
    sensoryAllergen: true,
    sensoryPavilion: true,
    sensoryAcoustic: true,
  });

  const [isBaking, setIsBaking] = useState(false);

  const handleBakePlan = (): void => {
    setIsBaking(true);
    const id = `cl-${Date.now().toString().slice(-4)}`;
    const newPlan = buildStoredPlan(formState, id);
    savePlan(newPlan);
    setActivePlanId(id);

    setTimeout(() => {
      setIsBaking(false);
      showNotification(
        `Celebration Inscribed: ${newPlan.title} escrow ledger verified.`,
        "success"
      );
      void navigate(`/event-workspace?planId=${id}`);
    }, 1200);
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col selection:bg-blush-petal selection:text-wine-deep">
      <Header />
      <main className="w-full pt-20 bg-surface min-h-[calc(100vh-80px)] flex-1">
        <div className="flex flex-col w-full">
          <WizardStepperHeader />
          <div className="max-w-7xl mx-auto px-gutter py-space-xl grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            <WizardStepList formState={formState} setFormState={setFormState} />
            <WizardTicketSidebar
              formState={formState}
              isBaking={isBaking}
              onBake={handleBakePlan}
            />
          </div>
        </div>
      </main>
      <Footer />
      <SearchDialog />
    </div>
  );
}

export default WizardPage;
