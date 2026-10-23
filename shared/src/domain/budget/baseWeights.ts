import type { CategoryId, EventType } from "../../contracts/enums.js";

/**
 * Baseline budget allocation weight tables by event type.
 *
 * NOTE: These baseline weights represent starting heuristics derived from industry
 * planning practices, not definitive market claims or factual price quotes.
 * They serve as the foundational starting distribution before venue, guest count,
 * and user priorities adjust the final proportion.
 * All base tables sum to exactly 100 (including contingency).
 */
export const BASE_BUDGET_WEIGHTS: Record<EventType, Readonly<Record<string, number>>> = {
  wedding: {
    venue: 18,
    catering: 30,
    decor: 10,
    photo_video: 10,
    entertainment: 8,
    attire_beauty: 8,
    stationery: 2,
    logistics: 4,
    gifts_favors: 2,
    contingency: 8,
  },
  birthday: {
    venue: 15,
    catering: 30,
    decor: 12,
    entertainment: 15,
    photo_video: 5,
    gifts_favors: 8,
    stationery: 2,
    logistics: 3,
    contingency: 10,
  },
  community: {
    venue: 15,
    catering: 25,
    equipment_av: 15,
    marketing: 10,
    entertainment: 12,
    staffing: 8,
    permits_insurance: 5,
    logistics: 5,
    contingency: 5,
  },
  other: {
    venue: 20,
    catering: 30,
    decor: 10,
    entertainment: 10,
    logistics: 5,
    stationery: 3,
    photo_video: 7,
    contingency: 15,
  },
};

/**
 * Returns a copy of the baseline budget weights for the specified event type.
 *
 * @param eventType Selected event category.
 * @returns Map of CategoryId to baseline percentage weight (summing to 100).
 */
export function getBaseWeights(eventType: EventType): Record<CategoryId, number> {
  const table = BASE_BUDGET_WEIGHTS[eventType];
  const weights: Partial<Record<CategoryId, number>> = {};
  for (const [key, val] of Object.entries(table)) {
    weights[key as CategoryId] = val;
  }
  return weights as Record<CategoryId, number>;
}
