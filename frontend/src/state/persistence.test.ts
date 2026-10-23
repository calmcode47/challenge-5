import { describe, it, expect, beforeEach } from "vitest";
import {
  loadPlans,
  savePlan,
  getPlanById,
  resetVault,
  exportVaultJson,
  importVaultJson,
  removePlan,
  getStorageUsage,
  type StoredPlan,
} from "./persistence.js";

describe("persistence store", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("loads default seed plans when empty", () => {
    const plans = loadPlans();
    expect(plans.length).toBeGreaterThanOrEqual(1);
    expect(plans[0]?.id).toBe("cl-001");
  });

  it("saves a new plan and retrieves it by id", () => {
    const testPlan: StoredPlan = {
      id: "test-123",
      title: "Test Feast",
      date: "2025-11-20",
      guestCount: 50,
      completionRatio: 0.5,
      totalBudget: 15000,
      vertical: "community",
      archetype: "Ceramic Loft",
      venue: "Artisan Loft",
      sensoryCount: 3,
      tags: ["Test", "Organic"],
      description: "A wonderful test feast.",
      updatedAt: new Date().toISOString(),
    };

    savePlan(testPlan);
    const retrieved = getPlanById("test-123");
    expect(retrieved).toBeDefined();
    expect(retrieved?.title).toBe("Test Feast");
    expect(retrieved?.totalBudget).toBe(15000);
  });

  it("updates an existing plan when saving with same id", () => {
    const testPlan: StoredPlan = {
      id: "cl-001",
      title: "Updated Elena & Marcus",
      date: "2025-12-01",
      guestCount: 150,
      completionRatio: 0.8,
      totalBudget: 30000,
      vertical: "wedding",
      archetype: "Wedding Atelier",
      venue: "Stone Creek Orchard",
      sensoryCount: 4,
      tags: ["Updated"],
      description: "Updated description.",
      updatedAt: new Date().toISOString(),
    };

    savePlan(testPlan);
    const retrieved = getPlanById("cl-001");
    expect(retrieved?.title).toBe("Updated Elena & Marcus");
    expect(retrieved?.guestCount).toBe(150);
  });

  it("resets vault back to default seeds", () => {
    savePlan({
      id: "custom-to-delete",
      title: "Temporary Plan",
      date: "2025-10-10",
      guestCount: 20,
      completionRatio: 0.1,
      totalBudget: 5000,
      vertical: "milestone",
      archetype: "Meadow",
      venue: "Meadow",
      sensoryCount: 2,
      tags: [],
      description: "Will be wiped",
      updatedAt: new Date().toISOString(),
    });

    expect(getPlanById("custom-to-delete")).toBeDefined();
    resetVault();
    expect(getPlanById("custom-to-delete")).toBeUndefined();
    expect(getPlanById("cl-001")).toBeDefined();
  });

  it("exports and imports valid vault JSON correctly", () => {
    const exportedJson = exportVaultJson();
    expect(exportedJson).toContain("Elena & Marcus");

    localStorage.clear();
    const count = importVaultJson(exportedJson);
    expect(count).toBeGreaterThanOrEqual(1);

    const plans = loadPlans();
    expect(plans.length).toBe(count);
  });

  it("handles invalid JSON safely on import", () => {
    const count = importVaultJson("invalid json syntax");
    expect(count).toBe(0);
  });

  it("handles non-array valid JSON on import", () => {
    const count = importVaultJson(JSON.stringify({ notAnArray: true }));
    expect(count).toBe(0);
  });

  it("removes a specific plan by identifier", () => {
    loadPlans();
    expect(getPlanById("cl-001")).toBeDefined();
    removePlan("cl-001");
    expect(getPlanById("cl-001")).toBeUndefined();
  });

  it("handles corrupted or empty JSON array in localStorage safely", () => {
    localStorage.setItem("occasio_soft_clay_plans", "invalid-json");
    const plansFromCorrupt = loadPlans();
    expect(plansFromCorrupt.length).toBeGreaterThan(0);

    localStorage.setItem("occasio_soft_clay_plans", JSON.stringify([]));
    const plansFromEmpty = loadPlans();
    expect(plansFromEmpty.length).toBeGreaterThan(0);
  });

  it("computes storage usage information", () => {
    loadPlans();
    const usage = getStorageUsage();
    expect(usage.bytes).toBeGreaterThan(0);
    expect(usage.formatted).toContain("KB");
    expect(typeof usage.percentage).toBe("number");
  });
});
