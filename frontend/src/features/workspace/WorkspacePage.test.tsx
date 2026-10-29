import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { axe } from "vitest-axe";
import { WorkspacePage } from "./WorkspacePage.js";
import { WorkspaceBanner } from "./WorkspaceBanner.js";
import { WorkspaceBudgetRatio } from "./WorkspaceBudgetRatio.js";
import { WorkspacePillarsGrid } from "./WorkspacePillarsGrid.js";
import { WorkspaceDualPassBlock } from "./WorkspaceDualPassBlock.js";
import { WorkspaceSafeguardsBlock } from "./WorkspaceSafeguardsBlock.js";
import { WorkspaceLogExpenseModal } from "./WorkspaceLogExpenseModal.js";
import { WorkspaceTimelineModal } from "./WorkspaceTimelineModal.js";
import type { StoredPlan } from "../../state/persistence.js";
import { useUiStore } from "../../state/uiStore.js";

const mockPlan: StoredPlan = {
  id: "test-001",
  title: "Elena & Marcus Blossom Wedding",
  date: "2025-10-18",
  guestCount: 120,
  completionRatio: 0.75,
  totalBudget: 24000,
  vertical: "wedding",
  archetype: "Wedding Atelier",
  venue: "Stone Creek Orchard",
  sensoryCount: 4,
  tags: ["Handmade"],
  description: "Terracotta banquet.",
  updatedAt: new Date().toISOString(),
};

describe("workspace feature components", () => {
  it("renders WorkspaceBanner and triggers action callbacks", () => {
    const handleLog = vi.fn();
    const handleExport = vi.fn();
    const handleRunOfShow = vi.fn();

    render(
      <WorkspaceBanner
        plan={mockPlan}
        onLogExpense={handleLog}
        onExportBrief={handleExport}
        onRunOfShow={handleRunOfShow}
      />
    );

    expect(screen.getByText("Elena & Marcus Blossom Wedding")).toBeInTheDocument();
    fireEvent.click(screen.getByText("+ Log Ceramic Expense"));
    expect(handleLog).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText("Export Brief (.JSON)"));
    expect(handleExport).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText("Run-of-Show"));
    expect(handleRunOfShow).toHaveBeenCalledTimes(1);
  });

  it("renders WorkspaceBudgetRatio and WorkspacePillarsGrid", () => {
    render(
      <>
        <WorkspaceBudgetRatio />
        <WorkspacePillarsGrid />
      </>
    );

    expect(screen.getByText("Stoneware Capital Ledger")).toBeInTheDocument();
    expect(screen.getByText("Craft Pillar Budgets")).toBeInTheDocument();
    expect(screen.getByText("Venue & Dining")).toBeInTheDocument();
    expect(screen.getByText("Photo & Film")).toBeInTheDocument();
  });

  it("renders generated allocations and warns when recorded commitments exceed the budget", () => {
    render(
      <WorkspaceBudgetRatio
        plan={{
          ...mockPlan,
          totalBudget: 100,
          budgetAllocation: [{ category: "Venue & rentals", amount: 100, percent: 100 }],
          expenses: [
            {
              id: "expense-1",
              category: "Venue & rentals",
              amount: 125,
              vendor: "Test venue",
              recordedAt: new Date().toISOString(),
            },
          ],
        }}
      />
    );

    expect(screen.getByText("Venue & rentals ($100)")).toBeInTheDocument();
    expect(screen.getByText(/above the total budget/i)).toBeInTheDocument();
  });

  it("renders WorkspaceDualPassBlock, changes prompt, and commits a concept", () => {
    vi.useFakeTimers();
    render(<WorkspaceDualPassBlock />);

    expect(screen.getByText("Studio Picks: Celebration Concepts")).toBeInTheDocument();
    const promptInput = screen.getByDisplayValue(/twilight slow dance/i);
    fireEvent.change(promptInput, { target: { value: "Candlelit dessert bar" } });

    const commitButtons = screen.getAllByText("Commit to Timeline");
    const firstCommit = commitButtons[0];
    if (firstCommit) fireEvent.click(firstCommit);
    expect(useUiStore.getState().notification?.message).toContain("Sunset Acoustic Toast");

    const secondCommit = commitButtons[1];
    if (secondCommit) fireEvent.click(secondCommit);
    expect(useUiStore.getState().notification?.message).toContain("Quiet Pergola");

    const rerunBtn = screen.getByText("Rerun Dual-Pass");
    fireEvent.click(rerunBtn);
    expect(screen.getByText("Evaluating...")).toBeInTheDocument();

    act(() => {
      vi.runAllTimers();
    });
    vi.useRealTimers();
  });

  it("renders WorkspaceSafeguardsBlock and handles signoffs", () => {
    render(<WorkspaceSafeguardsBlock />);
    expect(screen.getByText("Vendor RFP Safeguard Inquiries")).toBeInTheDocument();

    const signoffBtn = screen.getByText("View Signoff");
    fireEvent.click(signoffBtn);
    expect(useUiStore.getState().notification?.message).toContain(
      "Signoff docket #CLAY-KITCHEN-08"
    );

    const acousticBtn = screen.getByText("Acoustic Map");
    fireEvent.click(acousticBtn);
    expect(useUiStore.getState().notification?.message).toContain("#TWP-2025-41A");

    const routeBtn = screen.getByText("Grounds Route");
    fireEvent.click(routeBtn);
    expect(useUiStore.getState().notification?.message).toContain("Slope Clearance: 1:14");

    const dispatchBtn = screen.getByText("Dispatch New RFP Inquiry");
    fireEvent.click(dispatchBtn);
    expect(useUiStore.getState().notification?.message).toContain("New RFP dispatch created");
  });

  it("renders an accessible WorkspaceLogExpenseModal, contains focus, and submits form", async () => {
    const handleClose = vi.fn();
    const { container } = render(<WorkspaceLogExpenseModal isOpen={true} onClose={handleClose} />);

    expect(screen.getByText("Log Ceramic Expense")).toBeInTheDocument();
    expect(screen.getByLabelText("Close dialog")).toHaveFocus();
    const categorySelect = screen.getByLabelText(/pillar category/i);
    fireEvent.change(categorySelect, { target: { value: "Flora & Decor" } });

    const amountInput = screen.getByLabelText(/amount/i);
    fireEvent.change(amountInput, { target: { value: "450.00" } });

    const vendorInput = screen.getByLabelText(/artisan/i);
    fireEvent.change(vendorInput, { target: { value: "Botanical Kiln" } });

    const submitBtn = screen.getByText("Record In Escrow");
    fireEvent.click(submitBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(
      (await axe(container, { rules: { "color-contrast": { enabled: false } } })).violations
    ).toHaveLength(0);
  });

  it("records a validated expense payload for the active plan", () => {
    const onRecordExpense = vi.fn();
    render(
      <WorkspaceLogExpenseModal
        isOpen={true}
        onClose={vi.fn()}
        categories={["Venue & rentals"]}
        onRecordExpense={onRecordExpense}
      />
    );

    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: "250.50" } });
    fireEvent.change(screen.getByLabelText(/artisan/i), { target: { value: "Orchard Studio" } });
    fireEvent.click(screen.getByText("Record In Escrow"));

    expect(onRecordExpense).toHaveBeenCalledWith({
      category: "Venue & rentals",
      amount: 250.5,
      vendor: "Orchard Studio",
    });
  });

  it("renders WorkspaceTimelineModal and prints schedule", () => {
    const printSpy = vi.spyOn(window, "print").mockImplementation(() => undefined);
    const handleClose = vi.fn();

    render(
      <WorkspaceTimelineModal isOpen={true} planTitle="Summer Festival" onClose={handleClose} />
    );
    expect(screen.getByText("Run-of-Show Milestone Schedule")).toBeInTheDocument();
    expect(screen.getByLabelText("Close schedule")).toHaveFocus();

    const printBtn = screen.getByText("Print Run-of-Show");
    fireEvent.click(printBtn);
    expect(printSpy).toHaveBeenCalled();
    printSpy.mockRestore();

    fireEvent.click(screen.getByText("Done"));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("closes both workspace dialogs with Escape", () => {
    const closeExpense = vi.fn();
    const { rerender } = render(<WorkspaceLogExpenseModal isOpen={true} onClose={closeExpense} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(closeExpense).toHaveBeenCalledTimes(1);

    const closeTimeline = vi.fn();
    rerender(
      <WorkspaceTimelineModal isOpen={true} planTitle="Summer Festival" onClose={closeTimeline} />
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(closeTimeline).toHaveBeenCalledTimes(1);
  });

  it("renders entire WorkspacePage, opens modals, and switches modules", () => {
    render(
      <MemoryRouter initialEntries={["/event-workspace?planId=test-001"]}>
        <WorkspacePage />
      </MemoryRouter>
    );

    expect(screen.getByText("Elena & Marcus Blossom Wedding")).toBeInTheDocument();

    // Open expense modal from banner
    fireEvent.click(screen.getByText("+ Log Ceramic Expense"));
    expect(screen.getByText("Log Ceramic Expense")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Cancel"));

    // Open timeline modal from banner
    fireEvent.click(screen.getByText("Run-of-Show"));
    expect(screen.getByText("Run-of-Show Milestone Schedule")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Close schedule"));

    // Select timeline module on sidebar
    fireEvent.click(screen.getByText("Timeline & Waves"));
    expect(screen.getByText("Run-of-Show Milestone Schedule")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Done"));

    // Select other modules
    fireEvent.click(screen.getByText("Tactile Budget"));
    fireEvent.click(screen.getByText("Pottery Tables"));

    // Export brief
    const anchorClick = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);
    fireEvent.click(screen.getByText("Export Brief (.JSON)"));
    anchorClick.mockRestore();
    expect(useUiStore.getState().notification?.message).toContain("exported as JSON");

    // Click search and notifications on workspace header
    fireEvent.click(screen.getByLabelText("Search project"));
    expect(useUiStore.getState().isSearchOpen).toBe(true);

    fireEvent.click(screen.getByLabelText("View notifications"));
    expect(useUiStore.getState().notification?.message).toContain("vendor certifications verified");
  });

  it("renders WorkspacePage with default plan when planId is not in store", () => {
    render(
      <MemoryRouter initialEntries={["/event-workspace?planId=non-existent-999"]}>
        <WorkspacePage />
      </MemoryRouter>
    );
    expect(screen.getAllByText(/Elena & Marcus/i).length).toBeGreaterThanOrEqual(1);
  });
});
