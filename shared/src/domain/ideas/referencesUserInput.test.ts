import { describe, expect, it } from "vitest";
import type { PlanInput } from "../../contracts/planInput.js";
import {
  extractMeaningfulTokens,
  collectUserInputTokens,
  referencesUserInput,
} from "./referencesUserInput.js";

const BASE_INPUT: PlanInput = {
  eventType: "wedding",
  title: "Ananya & Rohan Spring Celebration",
  eventDate: "2027-06-15",
  guestCount: 150,
  budget: { currency: "USD", totalMinor: 3500000 },
  venueType: "outdoor",
  locationNote: "Historic rose garden in Napa Valley",
  cultureOrTradition: "South Asian fusion",
  style: "Earthy bohemian chic with fairy lights",
  dietary: ["vegan", "nut-free"],
  accessibilityNeeds: ["step-free access", "quiet zone"],
  mustHaves: "Acoustic strings quartet during entry",
  avoid: "Plastic confetti",
  priorities: { venue: 5, catering: 4, photo_video: 4 },
  occasionNote: "10th year anniversary vow renewal",
};

describe("extractMeaningfulTokens", () => {
  it("extracts lowercase tokens and skips common stopwords", () => {
    const tokens = extractMeaningfulTokens("The quick brown fox jumps over with a dog");
    expect(tokens.has("the")).toBe(false);
    expect(tokens.has("with")).toBe(false);
    expect(tokens.has("over")).toBe(false);
    expect(tokens.has("quick")).toBe(true);
    expect(tokens.has("brown")).toBe(true);
    expect(tokens.has("fox")).toBe(true);
    expect(tokens.has("jumps")).toBe(true);
    expect(tokens.has("dog")).toBe(true);
  });

  it("handles undefined and empty text gracefully", () => {
    expect(extractMeaningfulTokens(undefined).size).toBe(0);
    expect(extractMeaningfulTokens("").size).toBe(0);
    expect(extractMeaningfulTokens("   ").size).toBe(0);
  });

  it("strips punctuation and supports unicode characters", () => {
    const tokens = extractMeaningfulTokens("Café, crème-brûlée & piñatas!");
    expect(tokens.has("café")).toBe(true);
    expect(tokens.has("crème")).toBe(true);
    expect(tokens.has("brûlée")).toBe(true);
    expect(tokens.has("piñatas")).toBe(true);
  });
});

describe("collectUserInputTokens", () => {
  it("aggregates tokens from all user configuration fields", () => {
    const tokens = collectUserInputTokens(BASE_INPUT);
    expect(tokens.has("ananya")).toBe(true);
    expect(tokens.has("rohan")).toBe(true);
    expect(tokens.has("napa")).toBe(true);
    expect(tokens.has("bohemian")).toBe(true);
    expect(tokens.has("vegan")).toBe(true);
    expect(tokens.has("step-free") || tokens.has("step")).toBe(true);
    expect(tokens.has("acoustic")).toBe(true);
    expect(tokens.has("confetti")).toBe(true);
    expect(tokens.has("wedding")).toBe(true);
    expect(tokens.has("outdoor")).toBe(true);
  });
});

describe("referencesUserInput", () => {
  it("returns true when rationale explicitly references cultural or dietary terms", () => {
    expect(
      referencesUserInput(
        "South Asian fusion desserts designed to accommodate vegan guests.",
        BASE_INPUT
      )
    ).toBe(true);
  });

  it("returns true when rationale references venue or styling keywords", () => {
    expect(
      referencesUserInput(
        "Fairy lights woven into outdoor foliage create a magical bohemian vibe.",
        BASE_INPUT
      )
    ).toBe(true);
  });

  it("returns false for completely generic ideas lacking user context overlap", () => {
    expect(
      referencesUserInput(
        "Standard event packages provided at affordable market rates.",
        BASE_INPUT
      )
    ).toBe(false);
  });

  it("returns false when rationale or user tokens are empty", () => {
    expect(referencesUserInput("", BASE_INPUT)).toBe(false);
    expect(referencesUserInput("   ", BASE_INPUT)).toBe(false);

    const emptyInput: PlanInput = {
      eventType: "other",
      title: "x",
      eventDate: "2027-01-01",
      guestCount: 1,
      budget: { currency: "USD", totalMinor: 100 },
      venueType: "home",
      dietary: [],
      accessibilityNeeds: [],
      priorities: {},
    };
    // "x" has length < 3 so tokens is empty
    expect(referencesUserInput("any standard concept", emptyInput)).toBe(false);
  });
});
