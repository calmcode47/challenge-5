import { useState, type ReactElement } from "react";
import { useSearchParams, useNavigate, type NavigateFunction } from "react-router";
import { Header } from "../../components/layout/Header.js";
import { Footer } from "../../components/layout/Footer.js";
import { SearchDialog } from "../../components/common/SearchDialog.js";
import { WizardStepperHeader } from "./WizardStepperHeader.js";
import { WizardVerticalStep } from "./WizardVerticalStep.js";
import { WizardCoordinatesStep } from "./WizardCoordinatesStep.js";
import { WizardBudgetStep } from "./WizardBudgetStep.js";
import { WizardSensoryStep } from "./WizardSensoryStep.js";
import { WizardTicketSidebar } from "./WizardTicketSidebar.js";
import {
  defaultEventDate,
  type WizardFormState,
  type WizardVertical,
  type WizardVenue,
} from "./wizardTypes.js";
import { savePlan, type StoredPlan } from "../../state/persistence.js";
import { useUiStore, type UiState } from "../../state/uiStore.js";
import { generatePlan, type GeneratedPlan } from "../../services/plansApi.js";

function getInitialVertical(param: string | null): WizardVertical {
  if (param === "milestone" || param === "community" || param === "anniversary") {
    return param;
  }
  return "wedding";
}

function getInitialGuestCount(param: string | null): number {
  const parsed = Number(param);
  return Number.isInteger(parsed) && parsed >= 2 && parsed <= 5_000 ? parsed : 120;
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
        notes={formState.notes}
        date={formState.date}
        venue={formState.venue}
        onTitleChange={(t) => {
          setFormState((s) => ({ ...s, title: t }));
        }}
        onNotesChange={(notes) => {
          setFormState((s) => ({ ...s, notes }));
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

function buildStoredPlan(
  formState: WizardFormState,
  id: string,
  generated?: GeneratedPlan
): StoredPlan {
  const sensoryCount = [
    formState.sensoryAda,
    formState.sensoryAllergen,
    formState.sensoryPavilion,
    formState.sensoryAcoustic,
  ].filter(Boolean).length;

  return {
    id,
    title: formState.title || "Custom Gathering",
    date: formState.date || defaultEventDate(),
    guestCount: formState.guestCount,
    completionRatio: 0.1,
    totalBudget: formState.budgetTotal,
    vertical: formState.vertical,
    archetype: formState.venue,
    venue: formState.venue,
    sensoryCount,
    tags: [generated?.aiMode === "live" ? "AI Enriched" : "Resilient Planner", "Hand-Formed"],
    description:
      generated?.personalizedIdeas[0] ??
      `Sculpted blueprint for ${String(formState.guestCount)} guests with a protected contingency ledger.`,
    budgetAllocation: generated?.budgetAllocation,
    vendorChecklist: generated?.vendorChecklist,
    riskFlags: generated?.riskFlags,
    expenses: [],
    updatedAt: new Date().toISOString(),
  };
}

interface BakePlanActions {
  readonly navigate: NavigateFunction;
  readonly setActivePlanId: (id: string) => void;
  readonly setIsBaking: (value: boolean) => void;
  readonly showNotification: UiState["showNotification"];
}

async function bakePlan(
  formState: WizardFormState,
  id: string,
  actions: BakePlanActions
): Promise<void> {
  try {
    const generated = await generatePlan(formState);
    const newPlan = buildStoredPlan(formState, id, generated);
    savePlan(newPlan);
    actions.setActivePlanId(id);
    actions.showNotification(
      `Celebration Inscribed: ${newPlan.title} ${generated.aiMode === "live" ? "AI brief enriched." : "resilient brief prepared."}`,
      "success"
    );
  } catch {
    const newPlan = buildStoredPlan(formState, id);
    savePlan(newPlan);
    actions.setActivePlanId(id);
    actions.showNotification(
      "Planner service is offline. Your complete local workspace was still created.",
      "warning"
    );
  } finally {
    actions.setIsBaking(false);
    void actions.navigate(`/event-workspace?planId=${id}`);
  }
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
    notes: "",
    date: defaultEventDate(),
    venue: "Botanical Orchard",
    budgetTotal: 24000,
    guestCount: getInitialGuestCount(searchParams.get("guests")),
    sensoryAda: true,
    sensoryAllergen: true,
    sensoryPavilion: true,
    sensoryAcoustic: true,
  });

  const [isBaking, setIsBaking] = useState(false);

  const handleBakePlan = async (): Promise<void> => {
    setIsBaking(true);
    const id = `cl-${Date.now().toString().slice(-4)}`;
    await bakePlan(formState, id, { navigate, setActivePlanId, setIsBaking, showNotification });
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col selection:bg-blush-petal selection:text-wine-deep">
      <Header />
      <main id="main-content" className="w-full pt-20 bg-surface min-h-[calc(100vh-80px)] flex-1">
        <div className="flex flex-col w-full">
          <WizardStepperHeader />
          <div className="max-w-7xl mx-auto px-gutter py-space-xl grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            <WizardStepList formState={formState} setFormState={setFormState} />
            <WizardTicketSidebar
              formState={formState}
              isBaking={isBaking}
              onBake={() => {
                void handleBakePlan();
              }}
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
