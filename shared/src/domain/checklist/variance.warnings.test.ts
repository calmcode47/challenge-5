import { describe, expect, it } from "vitest";
import type { BudgetPlan, Vendor } from "../../contracts/planComponents.js";
import { computeVendorVariance } from "./variance.js";

describe("computeVendorVariance — Overruns & Warning Diagnostics", () => {
  const baseBudget: BudgetPlan = {
    currency: "USD",
    totalMinor: 1_000_000,
    perGuestMinor: 10_000,
    lines: [
      {
        categoryId: "venue",
        allocatedMinor: 200_000,
        sharePct: 20,
        actualMinor: 0,
        status: "under",
      },
      {
        categoryId: "catering",
        allocatedMinor: 300_000,
        sharePct: 30,
        actualMinor: 0,
        status: "under",
      },
      {
        categoryId: "photo_video",
        allocatedMinor: 100_000,
        sharePct: 10,
        actualMinor: 0,
        status: "under",
      },
    ],
    warnings: [],
  };

  it("detects overall budget overrun and emits BUDGET_TOTAL_OVER_BY", () => {
    const vendors: Vendor[] = [
      {
        id: "v1",
        categoryId: "venue",
        name: "Expensive Venue",
        stage: "booked",
        quoteMinor: 600_000,
      },
      {
        id: "v2",
        categoryId: "catering",
        name: "Expensive Food",
        stage: "booked",
        quoteMinor: 600_000,
      },
    ];

    const updated = computeVendorVariance({ budget: baseBudget, vendors });
    const totalOver = updated.warnings.find((w) => w.code === "BUDGET_TOTAL_OVER_BY");

    expect(totalOver).toBeDefined();
    expect(totalOver?.params?.amount).toBe(200_000); // 1,200,000 - 1,000,000
  });

  it("handles zero allocation lines with zero actual expenditures as on_track", () => {
    const budgetWithZeroLine: BudgetPlan = {
      ...baseBudget,
      lines: [
        ...baseBudget.lines,
        {
          categoryId: "marketing",
          allocatedMinor: 0,
          sharePct: 0,
          actualMinor: 0,
          status: "under",
        },
      ],
    };

    const updated = computeVendorVariance({ budget: budgetWithZeroLine, vendors: [] });
    const marketingLine = updated.lines.find((l) => l.categoryId === "marketing");
    expect(marketingLine?.status).toBe("on_track");
  });

  it("preserves existing non-variance warnings while filtering out old variance warnings", () => {
    const budgetWithWarnings: BudgetPlan = {
      ...baseBudget,
      warnings: [
        {
          code: "CATERING_SHARE_BELOW_20PCT",
          messageKey: "budget.warning.catering_share_below_20pct",
        },
        {
          code: "BUDGET_OVER_BY",
          messageKey: "budget.warning.budget_over_by",
          params: { categoryId: "venue", amount: 999 },
        },
      ],
    };

    const updated = computeVendorVariance({ budget: budgetWithWarnings, vendors: [] });

    expect(updated.warnings.some((w) => w.code === "CATERING_SHARE_BELOW_20PCT")).toBe(true);
    expect(updated.warnings.some((w) => w.code === "BUDGET_OVER_BY")).toBe(false);
  });
});
