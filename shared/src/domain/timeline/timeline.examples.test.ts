import { describe, expect, it } from "vitest";
import type { PlanInput } from "../../contracts/planInput.js";
import { buildTimeline } from "./buildTimeline.js";

describe("buildTimeline — Worked Examples", () => {
  /*
   * WORKED EXAMPLE 1: Ananya & Rohan Wedding
   * - Event: wedding
   * - eventDate: 2027-10-15
   * - now: 2026-12-19 (300 days prior -> factor 1.0, uncompressed)
   */
  it("computes exact manual milestone dates for Worked Example 1 (Wedding)", () => {
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

    const timeline = buildTimeline(input, "2026-12-19");
    expect(timeline.daysAvailable).toBe(300);
    expect(timeline.compressionFactor).toBe(1.0);
    expect(timeline.tightness).toBe("comfortable");

    const dates = new Map(timeline.milestones.map((m) => [m.id, m.dueDate]));
    const expected: Record<string, string> = {
      budget_and_guest_list: "2026-12-19",
      venue: "2027-01-18",
      photographer: "2027-02-17",
      caterer: "2027-03-19",
      save_the_dates: "2027-04-18",
      attire: "2027-05-18",
      invitations_out: "2027-07-17",
      decor_florals: "2027-08-01",
      rsvp_deadline: "2027-09-15",
      final_headcount: "2027-10-01",
      final_payments: "2027-10-08",
      rehearsal_and_setup: "2027-10-13",
      thank_you_notes: "2027-10-29",
    };

    for (const [id, expDate] of Object.entries(expected)) {
      expect(dates.get(id)).toBe(expDate);
    }

    const budgetM = timeline.milestones.find((m) => m.id === "budget_and_guest_list");
    expect(budgetM?.status).toBe("overdue");
  });

  /*
   * WORKED EXAMPLE 2: Maya's 7th Birthday
   * - Event: birthday
   * - eventDate: 2027-04-10
   * - now: 2027-02-09 (60 days prior -> factor 1.0, uncompressed)
   */
  it("computes exact manual milestone dates for Worked Example 2 (Birthday)", () => {
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

    const timeline = buildTimeline(input, "2027-02-09");
    expect(timeline.daysAvailable).toBe(60);
    expect(timeline.compressionFactor).toBe(1.0);
    expect(timeline.tightness).toBe("comfortable");

    const dates = new Map(timeline.milestones.map((m) => [m.id, m.dueDate]));
    const expected: Record<string, string> = {
      guest_list_and_date: "2027-02-09",
      venue: "2027-02-24",
      invitations_out: "2027-03-11",
      cake_and_catering: "2027-03-20",
      entertainment: "2027-03-20",
      decor_and_favors: "2027-03-27",
      rsvp_deadline: "2027-04-03",
      confirm_vendors: "2027-04-07",
      setup: "2027-04-09",
    };

    for (const [id, expDate] of Object.entries(expected)) {
      expect(dates.get(id)).toBe(expDate);
    }
  });

  /*
   * WORKED EXAMPLE 3: Greenwood Harvest Festival
   * - Event: community
   * - eventDate: 2027-09-25
   * - now: 2027-05-28 (120 days prior -> factor 1.0, uncompressed)
   */
  it("computes exact manual milestone dates for Worked Example 3 (Community)", () => {
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

    const timeline = buildTimeline(input, "2027-05-28");
    expect(timeline.daysAvailable).toBe(120);
    expect(timeline.compressionFactor).toBe(1.0);
    expect(timeline.tightness).toBe("comfortable");

    const dates = new Map(timeline.milestones.map((m) => [m.id, m.dueDate]));
    const expected: Record<string, string> = {
      objectives_and_approvals: "2027-05-28",
      permits_and_insurance: "2027-06-27",
      venue_and_av: "2027-07-12",
      sponsors_and_partners: "2027-07-12",
      volunteer_recruitment: "2027-07-27",
      marketing_launch: "2027-08-11",
      safety_and_accessibility_plan: "2027-08-26",
      run_of_show: "2027-09-11",
      volunteer_briefing: "2027-09-22",
      setup: "2027-09-24",
      thank_you_and_report: "2027-10-02",
    };

    for (const [id, expDate] of Object.entries(expected)) {
      expect(dates.get(id)).toBe(expDate);
    }
  });
});
