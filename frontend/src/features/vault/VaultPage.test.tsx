import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { VaultPage } from "./VaultPage.js";
import { VaultHero } from "./VaultHero.js";
import { VaultMetrics } from "./VaultMetrics.js";
import { VaultPlansGrid } from "./VaultPlansGrid.js";
import { VaultHygieneSuite } from "./VaultHygieneSuite.js";
import { loadPlans } from "../../state/persistence.js";
import { useUiStore } from "../../state/uiStore.js";

describe("vault feature components", () => {
  it("renders VaultHero, triggers export, and handles file import", () => {
    class MockFileReader {
      public onload: ((e: { target: { result: string } }) => void) | null = null;
      public readAsText(): void {
        this.onload?.({
          target: {
            result: JSON.stringify({
              celebrations: [
                {
                  id: "imported-1",
                  title: "Imported Gala",
                  date: "2026-01-01",
                  guestCount: 50,
                  completionRatio: 0.5,
                  totalBudget: 10000,
                  vertical: "wedding",
                  archetype: "Loft",
                  venue: "Loft",
                  sensoryCount: 2,
                  tags: [],
                  description: "Test",
                  updatedAt: "2026-01-01",
                },
              ],
            }),
          },
        });
      }
    }
    vi.stubGlobal("FileReader", MockFileReader);

    const handleDataChange = vi.fn();
    const { container } = render(
      <MemoryRouter>
        <VaultHero onDataChange={handleDataChange} />
      </MemoryRouter>
    );

    expect(screen.getByText("My Saved Celebrations & Clay Vault")).toBeInTheDocument();
    const exportBtn = screen.getByText("Export Vault (.JSON)");
    const anchorClick = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);
    fireEvent.click(exportBtn);
    anchorClick.mockRestore();
    expect(useUiStore.getState().notification?.message).toContain(
      "Artisanal Vault (.JSON) snapshot"
    );

    const fileInput = container.querySelector("input[type='file']");
    expect(fileInput).not.toBeNull();
    if (fileInput) {
      const file = new File(["{}"], "test-backup.json", { type: "application/json" });
      fireEvent.change(fileInput, { target: { files: [file] } });
      expect(handleDataChange).toHaveBeenCalled();
    }
    vi.unstubAllGlobals();
  });

  it("renders VaultMetrics with counts, storage, and singular draft fallback", () => {
    const plans = loadPlans();
    render(<VaultMetrics plans={plans} storageFormatted="2.4 KB" />);
    expect(screen.getByText("Active Gatherings")).toBeInTheDocument();
    expect(screen.getByText("2.4 KB")).toBeInTheDocument();

    render(<VaultMetrics plans={[]} storageFormatted="0 KB" />);
    expect(screen.getByText("1 blueprint in progress")).toBeInTheDocument();
  });

  it("renders VaultPlansGrid with loaded plans and handles missing imageUrl", () => {
    const plans = loadPlans();
    render(
      <MemoryRouter>
        <VaultPlansGrid plans={plans} />
      </MemoryRouter>
    );

    expect(screen.getByText("Active Celebrations Workspace")).toBeInTheDocument();
    expect(screen.getByText("Molded From Scratch")).toBeInTheDocument();

    render(
      <MemoryRouter>
        <VaultPlansGrid
          plans={[
            {
              id: "no-img",
              title: "Floral Placeholder Gathering",
              date: "2025-01-01",
              guestCount: 20,
              completionRatio: 0.2,
              totalBudget: 5000,
              vertical: "community",
              archetype: "Communal",
              venue: "Meadow",
              sensoryCount: 1,
              tags: [],
              description: "Draft",
              updatedAt: "2025-01-01",
            },
          ]}
        />
      </MemoryRouter>
    );
    expect(screen.getByText("Floral Placeholder Gathering")).toBeInTheDocument();
  });

  it("renders VaultHygieneSuite, runs audit, and resets when confirmed", () => {
    vi.useFakeTimers();
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    const handleReset = vi.fn();

    render(
      <MemoryRouter>
        <VaultHygieneSuite
          storageQuotaText="12 KB / 5,120 KB (1%)"
          storagePct={1}
          onDataReset={handleReset}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Local Storage Sovereign Hygiene")).toBeInTheDocument();
    const auditBtn = screen.getByText("Schema Hygiene Audit");
    fireEvent.click(auditBtn);
    expect(screen.getByText("Checking...")).toBeInTheDocument();

    act(() => {
      vi.runAllTimers();
    });
    expect(screen.getByText("100% Intact")).toBeInTheDocument();

    const snapshotBtn = screen.getByText("Generate Vault Snapshot");
    fireEvent.click(snapshotBtn);
    expect(useUiStore.getState().notification?.message).toContain("Vault snapshot downloaded");

    const resetBtn = screen.getByText("Wipe & Reset Local Vault");
    fireEvent.click(resetBtn);
    expect(handleReset).toHaveBeenCalled();

    confirmSpy.mockRestore();

    const cancelSpy = vi.spyOn(window, "confirm").mockReturnValue(false);
    const handleResetCancel = vi.fn();
    const { unmount } = render(
      <MemoryRouter>
        <VaultHygieneSuite
          storageQuotaText="12 KB / 5,120 KB (1%)"
          storagePct={1}
          onDataReset={handleResetCancel}
        />
      </MemoryRouter>
    );
    const resetButtons = screen.getAllByText("Wipe & Reset Local Vault");
    const firstReset = resetButtons[0];
    if (firstReset) fireEvent.click(firstReset);
    expect(handleResetCancel).not.toHaveBeenCalled();
    cancelSpy.mockRestore();
    unmount();
    vi.useRealTimers();
  });

  it("renders entire VaultPage and triggers refresh", () => {
    render(
      <MemoryRouter>
        <VaultPage />
      </MemoryRouter>
    );

    expect(screen.getByText("My Saved Celebrations & Clay Vault")).toBeInTheDocument();
    const resetBtn = screen.getByText("Wipe & Reset Local Vault");
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    fireEvent.click(resetBtn);
    confirmSpy.mockRestore();
  });
});
