import { describe, expect, it } from "vitest";
import { VENDOR_STAGES, type VendorStage } from "../../contracts/enums.js";
import { canAdvance, nextStages } from "./vendorStages.js";

describe("vendorStages — Lifecycle Transition State Machine", () => {
  // Expected valid transitions for the full 7x7 matrix
  const EXPECTED_ALLOWED: Record<VendorStage, readonly VendorStage[]> = {
    shortlist: ["contacted", "quoted", "declined"],
    contacted: ["quoted", "declined"],
    quoted: ["booked", "declined"],
    booked: ["deposit_paid", "confirmed", "declined"],
    deposit_paid: ["confirmed", "declined"],
    confirmed: ["declined"],
    declined: [],
  };

  it("evaluates the complete 7x7 transition matrix matching expected lifecycle rules", () => {
    for (const from of VENDOR_STAGES) {
      const allowedTargets = new Set(EXPECTED_ALLOWED[from]);

      for (const to of VENDOR_STAGES) {
        const expected = allowedTargets.has(to);
        const actual = canAdvance(from, to);
        expect(
          actual,
          `Transition from "${from}" to "${to}" expected ${String(expected)}, got ${String(actual)}`
        ).toBe(expected);
      }
    }
  });

  it("strictly forbids illegal jumps (e.g. declined -> booked)", () => {
    expect(canAdvance("declined", "booked")).toBe(false);
    expect(canAdvance("declined", "confirmed")).toBe(false);
    expect(canAdvance("declined", "contacted")).toBe(false);
    expect(canAdvance("declined", "deposit_paid")).toBe(false);
    expect(canAdvance("declined", "quoted")).toBe(false);
    expect(canAdvance("declined", "shortlist")).toBe(false);
  });

  it("strictly forbids skipping initial engagement (e.g. shortlist -> booked / confirmed)", () => {
    expect(canAdvance("shortlist", "booked")).toBe(false);
    expect(canAdvance("shortlist", "confirmed")).toBe(false);
    expect(canAdvance("shortlist", "deposit_paid")).toBe(false);
  });

  it("forbids self-transitions (stage -> stage)", () => {
    for (const stage of VENDOR_STAGES) {
      expect(canAdvance(stage, stage)).toBe(false);
    }
  });

  it("returns the exact allowed next stages matching definition", () => {
    for (const stage of VENDOR_STAGES) {
      expect(nextStages(stage)).toEqual(EXPECTED_ALLOWED[stage]);
    }
  });
});
