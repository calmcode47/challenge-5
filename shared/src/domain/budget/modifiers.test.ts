import { describe, expect, it } from "vitest";
import { getGuestSizeModifiers, getPriorityMultiplier, getVenueModifiers } from "./modifiers.js";

describe("modifiers", () => {
  describe("getVenueModifiers", () => {
    it("returns correct multipliers for home venue", () => {
      expect(getVenueModifiers("home")).toEqual({
        venue: 0.2,
        catering: 1.1,
        logistics: 0.8,
      });
    });

    it("returns correct multipliers for community_hall venue", () => {
      expect(getVenueModifiers("community_hall")).toEqual({
        venue: 0.5,
      });
    });

    it("returns correct multipliers for outdoor venue", () => {
      expect(getVenueModifiers("outdoor")).toEqual({
        venue: 0.9,
        logistics: 1.3,
        equipment_av: 1.2,
      });
    });

    it("returns correct multipliers for restaurant venue", () => {
      expect(getVenueModifiers("restaurant")).toEqual({
        venue: 0.6,
        catering: 1.1,
      });
    });

    it("returns empty modifiers (default 1.0) for banquet_hall and undecided", () => {
      expect(getVenueModifiers("banquet_hall")).toEqual({});
      expect(getVenueModifiers("undecided")).toEqual({});
    });
  });

  describe("getGuestSizeModifiers", () => {
    it("adjusts logistics and staffing for gatherings over 200 guests", () => {
      expect(getGuestSizeModifiers(201)).toEqual({
        logistics: 1.2,
        staffing: 1.3,
      });
      expect(getGuestSizeModifiers(500)).toEqual({
        logistics: 1.2,
        staffing: 1.3,
      });
    });

    it("adjusts venue and catering for intimate gatherings under 30 guests", () => {
      expect(getGuestSizeModifiers(29)).toEqual({
        venue: 0.8,
        catering: 1.15,
      });
      expect(getGuestSizeModifiers(10)).toEqual({
        venue: 0.8,
        catering: 1.15,
      });
    });

    it("returns empty modifiers for standard gatherings between 30 and 200 guests", () => {
      expect(getGuestSizeModifiers(30)).toEqual({});
      expect(getGuestSizeModifiers(100)).toEqual({});
      expect(getGuestSizeModifiers(200)).toEqual({});
    });
  });

  describe("getPriorityMultiplier", () => {
    it("evaluates exact priority multipliers according to m = 1 + 0.25*(p-3)", () => {
      expect(getPriorityMultiplier(1)).toBe(0.5);
      expect(getPriorityMultiplier(2)).toBe(0.75);
      expect(getPriorityMultiplier(3)).toBe(1.0);
      expect(getPriorityMultiplier(4)).toBe(1.25);
      expect(getPriorityMultiplier(5)).toBe(1.5);
    });

    it("defaults to priority 3 (multiplier 1.0) when undefined", () => {
      expect(getPriorityMultiplier(undefined)).toBe(1.0);
    });
  });
});
