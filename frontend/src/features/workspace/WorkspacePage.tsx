import { useState, type ReactElement } from "react";
import { useSearchParams } from "react-router";
import { WorkspaceSidebar } from "../../components/layout/WorkspaceSidebar.js";
import { WorkspaceHeader } from "../../components/layout/WorkspaceHeader.js";
import { SearchDialog } from "../../components/common/SearchDialog.js";
import { WorkspaceBanner } from "./WorkspaceBanner.js";
import { WorkspaceBudgetRatio } from "./WorkspaceBudgetRatio.js";
import { WorkspacePillarsGrid } from "./WorkspacePillarsGrid.js";
import { WorkspaceDualPassBlock } from "./WorkspaceDualPassBlock.js";
import { WorkspaceSafeguardsBlock } from "./WorkspaceSafeguardsBlock.js";
import { WorkspaceLogExpenseModal } from "./WorkspaceLogExpenseModal.js";
import { WorkspaceTimelineModal } from "./WorkspaceTimelineModal.js";
import { getPlanById, loadPlans, type StoredPlan } from "../../state/persistence.js";
import { useUiStore } from "../../state/uiStore.js";

const DEFAULT_FALLBACK_PLAN: StoredPlan = {
  id: "cl-001",
  title: "Elena & Marcus Blossom Wedding",
  date: "2025-10-18",
  guestCount: 120,
  completionRatio: 0.68,
  totalBudget: 24000,
  vertical: "wedding",
  archetype: "Wedding Atelier",
  venue: "Stone Creek Orchard",
  sensoryCount: 4,
  tags: ["Hand-Formed", "Live Music"],
  description: "Terracotta & wild cosmos palette, open-air pergola banquet.",
  updatedAt: "2025-09-01T00:00:00.000Z",
};

function exportPlanAsJson(plan: StoredPlan): void {
  const dataStr =
    "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(plan, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `brief-${plan.id}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

interface MainContentProps {
  plan: StoredPlan;
  onLogExpense: () => void;
  onExportBrief: () => void;
  onRunOfShow: () => void;
}

function WorkspaceMainContent(props: MainContentProps): ReactElement {
  return (
    <div className="flex flex-col w-full gap-space-xl pb-space-2xl">
      <WorkspaceBanner
        plan={props.plan}
        onLogExpense={props.onLogExpense}
        onExportBrief={props.onExportBrief}
        onRunOfShow={props.onRunOfShow}
      />
      <WorkspaceBudgetRatio />
      <WorkspacePillarsGrid />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        <WorkspaceDualPassBlock />
        <WorkspaceSafeguardsBlock />
      </div>
    </div>
  );
}

/**
 * Event Planning Workspace main interactive dashboard page.
 */
export function WorkspacePage(): ReactElement {
  const [searchParams] = useSearchParams();
  const { showNotification } = useUiStore();
  const [activeModule, setActiveModule] = useState("overview");
  const [isLogExpenseOpen, setIsLogExpenseOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);

  const planId = searchParams.get("planId") ?? "cl-001";
  const plan: StoredPlan = getPlanById(planId) ?? loadPlans()[0] ?? DEFAULT_FALLBACK_PLAN;

  const handleExportBrief = (): void => {
    exportPlanAsJson(plan);
    showNotification(`Brief for ${plan.title} exported as JSON.`, "success");
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen">
      <WorkspaceSidebar
        activeModule={activeModule}
        onSelectModule={(m) => {
          setActiveModule(m);
          if (m === "timeline") setIsTimelineOpen(true);
        }}
      />
      <div className="pl-64">
        <WorkspaceHeader planTitle={plan.title} />
        <main
          id="main-content"
          className="relative pt-16 bg-surface min-h-screen px-space-lg py-space-lg"
        >
          <WorkspaceMainContent
            plan={plan}
            onLogExpense={() => {
              setIsLogExpenseOpen(true);
            }}
            onExportBrief={handleExportBrief}
            onRunOfShow={() => {
              setIsTimelineOpen(true);
            }}
          />
        </main>
      </div>

      <WorkspaceLogExpenseModal
        isOpen={isLogExpenseOpen}
        onClose={() => {
          setIsLogExpenseOpen(false);
        }}
      />
      <WorkspaceTimelineModal
        isOpen={isTimelineOpen}
        planTitle={plan.title}
        onClose={() => {
          setIsTimelineOpen(false);
        }}
      />
      <SearchDialog />
    </div>
  );
}

export default WorkspacePage;
