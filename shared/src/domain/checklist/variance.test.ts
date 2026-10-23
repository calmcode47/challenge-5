import { describe, expect, it } from "vitest";
import type { BudgetPlan, Vendor } from "../../contracts/planComponents.js";
import { calculateVendorCommitted, computeVendorVariance } from "./variance.js";

describe("computeVendorVariance — Vendor Variance Reconciliation", () => {
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
      {
        categoryId: "contingency",
        allocatedMinor: 100_000,
        sharePct: 10,
        actualMinor: 0,
        status: "under",
      },
    ],
    warnings: [],
  };

  it("calculates committed amount as max(quote, paid) and treats declined as 0", () => {
    const v1: Vendor = {
      id: "v-1",
      categoryId: "venue",
      name: "Grand Ballroom",
      stage: "quoted",
      quoteMinor: 180_000,
      paidMinor: 50_000,
    };
    expect(calculateVendorCommitted(v1)).toBe(180_000);

    const v2: Vendor = {
      id: "v-2",
      categoryId: "venue",
      name: "Grand Ballroom",
      stage: "deposit_paid",
      quoteMinor: 150_000,
      paidMinor: 190_000, // paid more than original quote
    };
    expect(calculateVendorCommitted(v2)).toBe(190_000);

    const vDeclined: Vendor = {
      id: "v-3",
      categoryId: "venue",
      name: "Rejected Venue",
      stage: "declined",
      quoteMinor: 300_000,
      paidMinor: 0,
    };
    expect(calculateVendorCommitted(vDeclined)).toBe(0);

    const vWithoutQuote: Vendor = {
      id: "v-4",
      categoryId: "venue",
      name: "Deposit Only Venue",
      stage: "deposit_paid",
      paidMinor: 75_000,
    };
    expect(calculateVendorCommitted(vWithoutQuote)).toBe(75_000);

    const vWithoutPaid: Vendor = {
      id: "v-5",
      categoryId: "venue",
      name: "Quote Only Venue",
      stage: "quoted",
      quoteMinor: 95_000,
    };
    expect(calculateVendorCommitted(vWithoutPaid)).toBe(95_000);

    const vEmpty: Vendor = {
      id: "v-6",
      categoryId: "venue",
      name: "Contacted Venue",
      stage: "contacted",
    };
    expect(calculateVendorCommitted(vEmpty)).toBe(0);
  });

  it("assigns under, on_track, and over statuses based on allocation ratios", () => {
    const vendors: Vendor[] = [
      // Venue: allocated 200k, committed 140k (70% -> under)
      {
        id: "v-venue",
        categoryId: "venue",
        name: "Venue Co",
        stage: "booked",
        quoteMinor: 140_000,
      },
      // Catering: allocated 300k, committed 270k (90% -> on_track)
      {
        id: "v-cater",
        categoryId: "catering",
        name: "Catering Plus",
        stage: "quoted",
        quoteMinor: 270_000,
      },
      // Photo/video: allocated 100k, committed 125k (125% -> over)
      {
        id: "v-photo",
        categoryId: "photo_video",
        name: "Studio Visuals",
        stage: "deposit_paid",
        quoteMinor: 125_000,
        paidMinor: 50_000,
      },
    ];

    const updated = computeVendorVariance({ budget: baseBudget, vendors });

    const getLine = (cat: string) => updated.lines.find((l) => l.categoryId === cat);

    expect(getLine("venue")?.actualMinor).toBe(140_000);
    expect(getLine("venue")?.status).toBe("under");

    expect(getLine("catering")?.actualMinor).toBe(270_000);
    expect(getLine("catering")?.status).toBe("on_track");

    expect(getLine("photo_video")?.actualMinor).toBe(125_000);
    expect(getLine("photo_video")?.status).toBe("over");

    // Over warning emitted for photo_video (over by 25k)
    const overWarning = updated.warnings.find((w) => w.code === "BUDGET_OVER_BY");
    expect(overWarning).toBeDefined();
    expect(overWarning?.params?.categoryId).toBe("photo_video");
    expect(overWarning?.params?.amount).toBe(25_000);
  });

  it("aggregates multiple non-declined vendors in the same category", () => {
    const vendors: Vendor[] = [
      {
        id: "v1",
        categoryId: "catering",
        name: "Food Catering",
        stage: "booked",
        quoteMinor: 180_000,
      },
      {
        id: "v2",
        categoryId: "catering",
        name: "Bar Service",
        stage: "booked",
        quoteMinor: 80_000,
      },
      {
        id: "v3",
        categoryId: "catering",
        name: "Dessert Cart",
        stage: "declined",
        quoteMinor: 50_000,
      },
    ];

    const updated = computeVendorVariance({ budget: baseBudget, vendors });
    const cateringLine = updated.lines.find((l) => l.categoryId === "catering");

    // 180k + 80k = 260k (v3 ignored because declined)
    expect(cateringLine?.actualMinor).toBe(260_000);
    // 260k / 300k = 86.6% -> on_track
    expect(cateringLine?.status).toBe("on_track");
  });
});
