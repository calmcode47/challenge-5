import { describe, expect, it } from "vitest";
import type { PlanInput } from "../../contracts/planInput.js";
import { cateringRules } from "./rules/cateringRules.js";
import { venueRules } from "./rules/venueRules.js";
import { accessibilityRules } from "./rules/accessibilityRules.js";
import { guestSizeRules } from "./rules/guestSizeRules.js";
import { communityRules } from "./rules/communityRules.js";
import { commonRules } from "./rules/commonRules.js";

const baseInput: PlanInput = {
  eventType: "wedding",
  title: "Test Celebration",
  eventDate: "2027-10-15",
  guestCount: 150,
  budget: { currency: "USD", totalMinor: 3_000_000 },
  venueType: "banquet_hall",
  dietary: [],
  accessibilityNeeds: [],
  priorities: {},
};

describe("Checklist Modular Rules", () => {
  it("dietary restrictions add allergen-handling & labelled-menu asks to catering", () => {
    const withoutDietary = cateringRules(baseInput);
    expect(withoutDietary.some((i) => i.id === "catering-dietary-allergens")).toBe(false);
    expect(withoutDietary.some((i) => i.id === "catering-dietary-labelled-menus")).toBe(false);

    const withDietary = cateringRules({
      ...baseInput,
      dietary: ["gluten-free", "nut allergy"],
    });
    expect(withDietary.some((i) => i.id === "catering-dietary-allergens")).toBe(true);
    expect(withDietary.some((i) => i.id === "catering-dietary-labelled-menus")).toBe(true);
  });

  it("any accessibilityNeeds adds step-free access, seating, restroom, signage, quiet space asks to venue", () => {
    const withoutAccess = accessibilityRules(baseInput);
    expect(withoutAccess.length).toBe(0);

    const withAccess = accessibilityRules({
      ...baseInput,
      accessibilityNeeds: ["wheelchair user"],
    });
    const ids = withAccess.map((i) => i.id);
    expect(ids).toContain("venue-access-step-free");
    expect(ids).toContain("venue-access-seating");
    expect(ids).toContain("venue-access-restrooms");
    expect(ids).toContain("venue-access-signage");
    expect(ids).toContain("venue-access-quiet-space");

    for (const item of withAccess) {
      expect(item.categoryId).toBe("venue");
      expect(item.kind).toBe("ask");
    }
  });

  it("outdoor venue adds weather contingency & power supply asks/logistics", () => {
    const indoor = venueRules(baseInput);
    expect(indoor.some((i) => i.id === "venue-outdoor-weather-contingency")).toBe(false);
    expect(indoor.some((i) => i.id === "venue-outdoor-power-supply")).toBe(false);

    const outdoor = venueRules({ ...baseInput, venueType: "outdoor" });
    expect(outdoor.some((i) => i.id === "venue-outdoor-weather-contingency")).toBe(true);
    expect(outdoor.some((i) => i.id === "venue-outdoor-power-supply")).toBe(true);
  });

  it("home venue removes venue-contract items but adds neighbours/noise/parking", () => {
    const home = venueRules({ ...baseInput, venueType: "home" });

    // Commercial contracts removed
    expect(home.some((i) => i.kind === "contract")).toBe(false);
    expect(home.some((i) => i.id === "venue-baseline-contract-terms")).toBe(false);
    expect(home.some((i) => i.id === "venue-baseline-damage-deposit")).toBe(false);

    // Neighbour notice, noise curfew, and parking logistics added
    expect(home.some((i) => i.id === "venue-home-neighbour-notification")).toBe(true);
    expect(home.some((i) => i.id === "venue-home-noise-curfew")).toBe(true);
    expect(home.some((i) => i.id === "venue-home-parking-logistics")).toBe(true);
  });

  it("guest count > 200 adds crowd-flow & staffing ratio items", () => {
    const small = guestSizeRules({ ...baseInput, guestCount: 150 });
    expect(small.length).toBe(0);

    const large = guestSizeRules({ ...baseInput, guestCount: 250 });
    expect(large.some((i) => i.id === "logistics-crowd-flow-management")).toBe(true);
    expect(large.some((i) => i.id === "staffing-large-guest-ratio")).toBe(true);
  });

  it("community adds permits, liability insurance, first-aid, safety marshals, accessibility plan", () => {
    const wedding = communityRules(baseInput);
    expect(wedding.length).toBe(0);

    const community = communityRules({ ...baseInput, eventType: "community" });
    const ids = community.map((i) => i.id);
    expect(ids).toContain("permits-municipal-event-permit");
    expect(ids).toContain("permits-public-liability-insurance");
    expect(ids).toContain("safety-first-aid-station");
    expect(ids).toContain("staffing-safety-marshals");
    expect(ids).toContain("logistics-community-accessibility-plan");
  });

  it("wedding adds officiant/ceremony logistics", () => {
    const wedding = commonRules(baseInput);
    expect(wedding.some((i) => i.id === "wedding-officiant-licence-logistics")).toBe(true);
    expect(wedding.some((i) => i.id === "wedding-ceremony-rehearsal-logistics")).toBe(true);

    const other = commonRules({ ...baseInput, eventType: "other" });
    expect(other.some((i) => i.id === "wedding-officiant-licence-logistics")).toBe(false);
  });

  it("birthday adds child-safety/age-appropriate items only when ageGroupNote is present", () => {
    const birthdayNoNote = commonRules({
      ...baseInput,
      eventType: "birthday",
      ageGroupNote: undefined,
    });
    expect(birthdayNoNote.some((i) => i.id === "birthday-child-safety-supervision")).toBe(false);
    expect(birthdayNoNote.some((i) => i.id === "birthday-age-appropriate-entertainment")).toBe(
      false
    );

    const birthdayEmptyNote = commonRules({
      ...baseInput,
      eventType: "birthday",
      ageGroupNote: "   ",
    });
    expect(birthdayEmptyNote.some((i) => i.id === "birthday-child-safety-supervision")).toBe(false);

    const birthdayWithNote = commonRules({
      ...baseInput,
      eventType: "birthday",
      ageGroupNote: "Children ages 6 to 9",
    });
    expect(birthdayWithNote.some((i) => i.id === "birthday-child-safety-supervision")).toBe(true);
    expect(birthdayWithNote.some((i) => i.id === "birthday-age-appropriate-entertainment")).toBe(
      true
    );
  });
});
