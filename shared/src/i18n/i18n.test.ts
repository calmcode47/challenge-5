import { describe, expect, it } from "vitest";
import { en } from "./en.js";
import { getAllMilestoneTemplates } from "../domain/timeline/templates.js";
import { cateringRules } from "../domain/checklist/rules/cateringRules.js";
import { venueRules } from "../domain/checklist/rules/venueRules.js";
import { accessibilityRules } from "../domain/checklist/rules/accessibilityRules.js";
import { guestSizeRules } from "../domain/checklist/rules/guestSizeRules.js";
import { communityRules } from "../domain/checklist/rules/communityRules.js";
import { commonRules } from "../domain/checklist/rules/commonRules.js";
import type { PlanInput } from "../contracts/planInput.js";

describe("i18n Localization Integrity", () => {
  const baseInput: PlanInput = {
    eventType: "wedding",
    title: "Test Celebration",
    eventDate: "2027-10-15",
    guestCount: 250,
    budget: { currency: "USD", totalMinor: 5_000_000 },
    venueType: "outdoor",
    dietary: ["vegan", "nut-free"],
    accessibilityNeeds: ["wheelchair"],
    ageGroupNote: "Kids age 5-10",
    priorities: {},
  };

  function collectEmittedKeys(): Set<string> {
    const keys = new Set<string>();

    // Milestone template titles
    for (const t of getAllMilestoneTemplates()) {
      keys.add(t.titleKey);
    }

    // Checklist item texts across multiple configurations
    const testInputs: PlanInput[] = [
      baseInput,
      { ...baseInput, eventType: "birthday", venueType: "home", guestCount: 50 },
      { ...baseInput, eventType: "community", venueType: "community_hall", guestCount: 400 },
      { ...baseInput, eventType: "other", venueType: "restaurant", guestCount: 20 },
    ];

    for (const inp of testInputs) {
      for (const item of cateringRules(inp)) keys.add(item.text);
      for (const item of venueRules(inp)) keys.add(item.text);
      for (const item of accessibilityRules(inp)) keys.add(item.text);
      for (const item of guestSizeRules(inp)) keys.add(item.text);
      for (const item of communityRules(inp)) keys.add(item.text);
      for (const item of commonRules(inp)) keys.add(item.text);
    }

    // Known diagnostic warning keys emitted by timeline and budget engines
    const warningKeys = [
      "timeline.warning.event_date_past",
      "timeline.warning.compressed",
      "timeline.warning.start_immediately",
      "budget.warning.catering_share_below_20pct",
      "budget.warning.contingency_below_min",
      "budget.warning.single_category_cap_applied",
      "budget.warning.priorities_conflict",
      "budget.warning.budget_over_by",
      "budget.warning.budget_total_over_by",
    ];
    for (const k of warningKeys) {
      keys.add(k);
    }

    return keys;
  }

  it("asserts every emitted key exists in en.ts dictionary", () => {
    const emitted = collectEmittedKeys();
    const dictionaryKeys = new Set(Object.keys(en));

    for (const key of emitted) {
      expect(
        dictionaryKeys.has(key),
        `Emitted key "${key}" was not found in shared/src/i18n/en.ts`
      ).toBe(true);
    }
  });

  it("asserts every key in en.ts is either emitted by domain or explicitly whitelisted", () => {
    const emitted = collectEmittedKeys();
    const dictionaryKeys = Object.keys(en);

    // Whitelist is empty because our dictionary strictly contains domain keys
    const whitelist = new Set<string>();

    for (const key of dictionaryKeys) {
      const isKnown = emitted.has(key) || whitelist.has(key);
      expect(
        isKnown,
        `Dictionary key "${key}" in en.ts is never emitted and not whitelisted.`
      ).toBe(true);
    }
  });
});
