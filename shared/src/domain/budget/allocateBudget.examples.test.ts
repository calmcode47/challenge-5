import { describe, expect, it } from "vitest";
import type { PlanInput } from "../../contracts/planInput.js";
import { allocateBudget } from "./allocateBudget.js";

describe("allocateBudget — Worked Examples", () => {
  /*
   * WORKED EXAMPLE 1: Ananya & Rohan Wedding
   * - Event: wedding
   * - Guests: 150 (30 <= 150 <= 200 -> guest modifier = 1.0)
   * - Venue: banquet_hall (venue modifier = 1.0)
   * - Priorities: default 3 (m = 1.0)
   * - Budget: $30,000.00 USD (3,000,000 minor units)
   *
   * Arithmetic:
   * Base weights:
   *   venue: 18%        -> 3,000,000 * 0.18 = 540,000
   *   catering: 30%     -> 3,000,000 * 0.30 = 900,000
   *   decor: 10%        -> 3,000,000 * 0.10 = 300,000
   *   photo_video: 10%  -> 3,000,000 * 0.10 = 300,000
   *   entertainment: 8% -> 3,000,000 * 0.08 = 240,000
   *   attire_beauty: 8% -> 3,000,000 * 0.08 = 240,000
   *   stationery: 2%    -> 3,000,000 * 0.02 = 60,000
   *   logistics: 4%     -> 3,000,000 * 0.04 = 120,000
   *   gifts_favors: 2%  -> 3,000,000 * 0.02 = 60,000
   *   contingency: 8%   -> 3,000,000 * 0.08 = 240,000
   * Sum = 900k + 540k + 300k + 300k + 240k + 240k + 240k + 120k + 60k + 60k = 3,000,000
   */
  it("computes exact manual values for Worked Example 1 (Wedding 150 guests)", () => {
    const input: PlanInput = {
      eventType: "wedding",
      title: "Ananya & Rohan Wedding",
      eventDate: "2027-10-15",
      guestCount: 150,
      budget: { currency: "USD", totalMinor: 3_000_000 },
      venueType: "banquet_hall",
      dietary: [],
      accessibilityNeeds: [],
      priorities: {},
    };

    const plan = allocateBudget(input);
    expect(plan.totalMinor).toBe(3_000_000);
    expect(plan.perGuestMinor).toBe(20_000); // 3,000,000 / 150

    const getLine = (cat: string) => plan.lines.find((l) => l.categoryId === cat)?.allocatedMinor;
    expect(getLine("catering")).toBe(900_000);
    expect(getLine("venue")).toBe(540_000);
    expect(getLine("decor")).toBe(300_000);
    expect(getLine("photo_video")).toBe(300_000);
    expect(getLine("entertainment")).toBe(240_000);
    expect(getLine("attire_beauty")).toBe(240_000);
    expect(getLine("contingency")).toBe(240_000);
    expect(getLine("logistics")).toBe(120_000);
    expect(getLine("stationery")).toBe(60_000);
    expect(getLine("gifts_favors")).toBe(60_000);

    const sum = plan.lines.reduce((acc, l) => acc + l.allocatedMinor, 0);
    expect(sum).toBe(3_000_000);
  });

  /*
   * WORKED EXAMPLE 2: Meera's Child Birthday
   * - Event: birthday
   * - Guests: 25 (< 30 -> venue x 0.8, catering x 1.15)
   * - Venue: home (venue x 0.2, catering x 1.1, logistics x 0.8)
   * - Priorities: entertainment = 5 (m = 1.5), others = 3 (m = 1.0)
   * - Budget: $1,000.00 USD (100,000 minor units)
   *
   * Arithmetic:
   * Base weights:
   *   venue: 15 * 0.2 * 0.8 = 2.4
   *   catering: 30 * 1.1 * 1.15 = 37.95
   *   decor: 12
   *   entertainment: 15 * 1.5 = 22.5
   *   photo_video: 5
   *   gifts_favors: 8
   *   stationery: 2
   *   logistics: 3 * 0.8 = 2.4
   * Non-contingency raw sum = 2.4 + 37.95 + 12 + 22.5 + 5 + 8 + 2 + 2.4 = 92.25
   * Contingency: 10% (target non-contingency = 90%)
   * Scaled by (90 / 92.25):
   *   catering: 37.02439... -> floor 37,024, rem 0.3902
   *   entertainment: 21.95121... -> floor 21,951, rem 0.2195
   *   decor: 11.70731... -> floor 11,707, rem 0.3170
   *   contingency: 10.0% -> floor 10,000, rem 0.0
   *   gifts_favors: 7.80487... -> floor 7,804, rem 0.8780 (wins +1) -> 7,805
   *   photo_video: 4.87804... -> floor 4,878, rem 0.0487
   *   logistics: 2.34146... -> floor 2,341, rem 0.4634 (wins +1 via tie break) -> 2,342
   *   venue: 2.34146... -> floor 2,341, rem 0.4634 (wins +1 via tie break) -> 2,342
   *   stationery: 1.95121... -> floor 1,951, rem 0.2195
   * Floor sum = 99,997. Remainder to distribute = 3 units.
   * Final allocations:
   *   catering 37,024 | entertainment 21,951 | decor 11,707 | contingency 10,000
   *   gifts_favors 7,805 | photo_video 4,878 | logistics 2,342 | venue 2,342 | stationery 1,951
   * Sum = 100,000
   */
  it("computes exact manual values for Worked Example 2 (Birthday 25 guests home)", () => {
    const input: PlanInput = {
      eventType: "birthday",
      title: "Maya's 7th Birthday",
      eventDate: "2027-04-10",
      guestCount: 25,
      budget: { currency: "USD", totalMinor: 100_000 },
      venueType: "home",
      dietary: [],
      accessibilityNeeds: [],
      priorities: { entertainment: 5 },
    };

    const plan = allocateBudget(input);
    expect(plan.totalMinor).toBe(100_000);
    expect(plan.perGuestMinor).toBe(4_000); // 100,000 / 25

    const getLine = (cat: string) => plan.lines.find((l) => l.categoryId === cat)?.allocatedMinor;
    expect(getLine("catering")).toBe(37_024);
    expect(getLine("entertainment")).toBe(21_951);
    expect(getLine("decor")).toBe(11_707);
    expect(getLine("contingency")).toBe(10_000);
    expect(getLine("gifts_favors")).toBe(7_805);
    expect(getLine("photo_video")).toBe(4_878);
    expect(getLine("logistics")).toBe(2_342);
    expect(getLine("venue")).toBe(2_342);
    expect(getLine("stationery")).toBe(1_951);

    const sum = plan.lines.reduce((acc, l) => acc + l.allocatedMinor, 0);
    expect(sum).toBe(100_000);
  });

  /*
   * WORKED EXAMPLE 3: Dev's Community Festival
   * - Event: community
   * - Guests: 400 (> 200 -> logistics x 1.2, staffing x 1.3)
   * - Venue: outdoor (venue x 0.9, logistics x 1.3, equipment_av x 1.2)
   * - Priorities: default 3
   * - Budget: $10,000.00 USD (1,000,000 minor units)
   *
   * Arithmetic:
   * Base weights:
   *   venue: 15 * 0.9 = 13.5
   *   catering: 25
   *   equipment_av: 15 * 1.2 = 18.0
   *   marketing: 10
   *   entertainment: 12
   *   staffing: 8 * 1.3 = 10.4
   *   permits_insurance: 5
   *   logistics: 5 * 1.3 * 1.2 = 7.8
   * Non-contingency raw sum = 101.7
   * Contingency: 5% (target non-contingency = 95%)
   * Scaled by (95 / 101.7):
   *   catering: 23.35299... -> floor 233,529, rem 0.99016 (gets +1) -> 233,530
   *   equipment_av: 16.81415... -> floor 168,141, rem 0.59292 (gets +1) -> 168,142
   *   venue: 12.61061... -> floor 126,106, rem 0.19469 -> 126,106
   *   entertainment: 11.20943... -> floor 112,094, rem 0.39528 -> 112,094
   *   staffing: 9.71484... -> floor 97,148, rem 0.47590 (gets +1) -> 97,149
   *   marketing: 9.34119... -> floor 93,411, rem 0.99606 (gets +1) -> 93,412
   *   logistics: 7.28613... -> floor 72,861, rem 0.35693 -> 72,861
   *   contingency: 5.0% -> floor 50,000, rem 0.0 -> 50,000
   *   permits_insurance: 4.67059... -> floor 46,705, rem 0.99803 (gets +1) -> 46,706
   * Floor sum = 999,995. Remainder count = 5 units.
   * Top 5 remainders: permits_insurance, marketing, catering, equipment_av, staffing
   * Sum = 1,000,000
   */
  it("computes exact manual values for Worked Example 3 (Community 400 guests outdoor)", () => {
    const input: PlanInput = {
      eventType: "community",
      title: "Greenwood Harvest Festival",
      eventDate: "2027-09-25",
      guestCount: 400,
      budget: { currency: "USD", totalMinor: 1_000_000 },
      venueType: "outdoor",
      dietary: [],
      accessibilityNeeds: [],
      priorities: {},
    };

    const plan = allocateBudget(input);
    expect(plan.totalMinor).toBe(1_000_000);
    expect(plan.perGuestMinor).toBe(2_500); // 1,000,000 / 400

    const getLine = (cat: string) => plan.lines.find((l) => l.categoryId === cat)?.allocatedMinor;
    expect(getLine("catering")).toBe(233_530);
    expect(getLine("equipment_av")).toBe(168_142);
    expect(getLine("venue")).toBe(126_106);
    expect(getLine("entertainment")).toBe(112_094);
    expect(getLine("staffing")).toBe(97_149);
    expect(getLine("marketing")).toBe(93_412);
    expect(getLine("logistics")).toBe(72_861);
    expect(getLine("contingency")).toBe(50_000);
    expect(getLine("permits_insurance")).toBe(46_706);

    const sum = plan.lines.reduce((acc, l) => acc + l.allocatedMinor, 0);
    expect(sum).toBe(1_000_000);
  });
});
