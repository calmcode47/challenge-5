import { describe, expect, it } from "vitest";
import {
  CATEGORY_IDS,
  categoriesForEventType,
  CategoryIdSchema,
  EVENT_TYPES,
  EventTypeSchema,
  isCategoryId,
  isEventType,
  isVenueType,
  VENUE_TYPES,
  VenueTypeSchema,
} from "./enums.js";

describe("enums - EventType", () => {
  it("parses all registered event types", () => {
    for (const type of EVENT_TYPES) {
      expect(EventTypeSchema.parse(type)).toBe(type);
      expect(isEventType(type)).toBe(true);
    }
  });

  it("rejects unknown event types", () => {
    expect(() => EventTypeSchema.parse("corporate_party")).toThrow();
    expect(isEventType("corporate_party")).toBe(false);
    expect(isEventType(123)).toBe(false);
    expect(isEventType(null)).toBe(false);
  });
});

describe("enums - VenueType", () => {
  it("parses all registered venue types", () => {
    for (const venue of VENUE_TYPES) {
      expect(VenueTypeSchema.parse(venue)).toBe(venue);
      expect(isVenueType(venue)).toBe(true);
    }
  });

  it("rejects unknown venue types", () => {
    expect(() => VenueTypeSchema.parse("cruise_ship")).toThrow();
    expect(isVenueType("cruise_ship")).toBe(false);
    expect(isVenueType(undefined)).toBe(false);
  });
});

describe("enums - CategoryId", () => {
  it("parses all registered category identifiers", () => {
    for (const cat of CATEGORY_IDS) {
      expect(CategoryIdSchema.parse(cat)).toBe(cat);
      expect(isCategoryId(cat)).toBe(true);
    }
  });

  it("rejects unregistered category names", () => {
    expect(() => CategoryIdSchema.parse("flights")).toThrow();
    expect(isCategoryId("flights")).toBe(false);
  });
});

describe("enums - categoriesForEventType", () => {
  it("returns distinct domain categories for each event type", () => {
    const weddingCats = categoriesForEventType("wedding");
    const birthdayCats = categoriesForEventType("birthday");
    const communityCats = categoriesForEventType("community");
    const otherCats = categoriesForEventType("other");

    expect(weddingCats).toContain("attire_beauty");
    expect(communityCats).toContain("permits_insurance");
    expect(communityCats).toContain("marketing");
    expect(birthdayCats).toContain("gifts_favors");

    // All configurations must retain contingency
    expect(weddingCats).toContain("contingency");
    expect(birthdayCats).toContain("contingency");
    expect(communityCats).toContain("contingency");
    expect(otherCats).toContain("contingency");
  });

  it("ensures every returned category is a valid CategoryId", () => {
    for (const type of EVENT_TYPES) {
      const cats = categoriesForEventType(type);
      for (const cat of cats) {
        expect(isCategoryId(cat)).toBe(true);
        expect(CategoryIdSchema.parse(cat)).toBe(cat);
      }
    }
  });
});
