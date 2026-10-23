import { describe, expect, it } from "vitest";
import type { Vendor } from "../../contracts/planComponents.js";
import { buildBaselinePlan } from "./buildBaselinePlan.js";
import { addVendor, removeVendor, updateVendor } from "./vendorMutations.js";

const BASE_INPUT = {
  eventType: "wedding" as const,
  title: "Ananya & Rohan Celebration",
  eventDate: "2027-06-15",
  guestCount: 150,
  budget: { currency: "USD", totalMinor: 3000000 },
  venueType: "outdoor" as const,
  style: "bohemian garden",
  cultureOrTradition: "South Asian fusion",
  dietary: ["vegan"],
  accessibilityNeeds: ["step-free"],
  priorities: { decor: 3 as const },
};

const NOW = "2026-10-23T12:00:00.000Z";
const NEXT_NOW = "2026-10-23T13:00:00.000Z";

describe("vendorMutations", () => {
  it("addVendor, updateVendor, and removeVendor reconcile expenditure variance", () => {
    const plan = buildBaselinePlan(BASE_INPUT, NOW);
    const vendor1: Vendor = {
      id: "v-1",
      categoryId: "catering",
      name: "Delicious Catering Co",
      stage: "quoted",
      quoteMinor: 400000,
    };
    const vendor2: Vendor = {
      id: "v-2",
      categoryId: "decor",
      name: "Floral Fantasies",
      stage: "shortlist",
    };

    const withVendor1 = addVendor(plan, vendor1, NEXT_NOW);
    const withBoth = addVendor(withVendor1, vendor2, NEXT_NOW);
    expect(withBoth.vendors).toHaveLength(2);

    const cateringLine = withBoth.budget.lines.find((l) => l.categoryId === "catering");
    expect(cateringLine?.actualMinor).toBe(400000);

    const updatedVendor1: Vendor = {
      ...vendor1,
      stage: "deposit_paid",
      paidMinor: 150000,
      quoteMinor: 400000,
    };
    const withUpdate = updateVendor(withBoth, updatedVendor1, NEXT_NOW);
    expect(withUpdate.vendors[0]?.stage).toBe("deposit_paid");
    expect(withUpdate.vendors[1]?.id).toBe("v-2");

    const withoutVendor1 = removeVendor(withUpdate, "v-1", NEXT_NOW);
    expect(withoutVendor1.vendors).toHaveLength(1);
    expect(withoutVendor1.vendors[0]?.id).toBe("v-2");
    const lineAfterRemove = withoutVendor1.budget.lines.find((l) => l.categoryId === "catering");
    expect(lineAfterRemove?.actualMinor).toBe(0);
  });

  it("updateVendor returns unmodified vendors if vendor id not found", () => {
    const plan = buildBaselinePlan(BASE_INPUT, NOW);
    const nonExistentVendor: Vendor = {
      id: "v-nonexistent",
      categoryId: "catering",
      name: "Ghost Vendor",
      stage: "shortlist",
    };

    const res = updateVendor(plan, nonExistentVendor, NEXT_NOW);
    expect(res.vendors).toHaveLength(0);
    expect(res.updatedAt).toBe(NEXT_NOW);
  });

  it("handles Date objects passed as now parameter", () => {
    const plan = buildBaselinePlan(BASE_INPUT, NOW);
    const nowDate = new Date("2026-10-23T15:00:00.000Z");

    const vendor: Vendor = {
      id: "v-date",
      categoryId: "venue",
      name: "Venue Co",
      stage: "quoted",
    };
    const p1 = addVendor(plan, vendor, nowDate);
    expect(p1.updatedAt).toBe("2026-10-23T15:00:00.000Z");
  });
});
