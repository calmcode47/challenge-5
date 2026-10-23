import type { CategoryId, VenueType } from "../../contracts/enums.js";
import type { PriorityValue } from "../../contracts/planInput.js";

/**
 * Returns multiplicative weight adjustments based on the selected venue type.
 *
 * Mathematical adjustments:
 * - `home`: venue × 0.2, catering × 1.1, logistics × 0.8
 * - `community_hall`: venue × 0.5
 * - `outdoor`: venue × 0.9, logistics × 1.3, equipment_av × 1.2
 * - `restaurant`: venue × 0.6, catering × 1.1
 * - `banquet_hall` / `undecided`: all multipliers default to 1.0
 *
 * @param venueType The selected venue environment classification.
 * @returns Map of affected category IDs to their specific multiplier.
 */
export function getVenueModifiers(venueType: VenueType): Partial<Record<CategoryId, number>> {
  switch (venueType) {
    case "home":
      return { venue: 0.2, catering: 1.1, logistics: 0.8 };
    case "community_hall":
      return { venue: 0.5 };
    case "outdoor":
      return { venue: 0.9, logistics: 1.3, equipment_av: 1.2 };
    case "restaurant":
      return { venue: 0.6, catering: 1.1 };
    case "banquet_hall":
    case "undecided":
      return {};
  }
}

/**
 * Returns multiplicative weight adjustments based on total anticipated guest count.
 *
 * Mathematical adjustments:
 * - Large gatherings (`guestCount > 200`): logistics × 1.2, staffing × 1.3
 * - Intimate gatherings (`guestCount < 30`): venue × 0.8, catering × 1.15
 * - Standard gatherings (`30 <= guestCount <= 200`): all multipliers default to 1.0
 *
 * @param guestCount Expected number of attendees.
 * @returns Map of affected category IDs to their specific multiplier.
 */
export function getGuestSizeModifiers(guestCount: number): Partial<Record<CategoryId, number>> {
  if (guestCount > 200) {
    return { logistics: 1.2, staffing: 1.3 };
  }
  if (guestCount < 30) {
    return { venue: 0.8, catering: 1.15 };
  }
  return {};
}

/**
 * Calculates the priority multiplier for an individual category.
 *
 * Mathematical formula:
 * `multiplier = 1 + 0.25 * (priority - 3)`
 *
 * Scale mapping:
 * - Priority 1 (Lowest):  1 + 0.25 * (-2) = 0.50
 * - Priority 2 (Low):     1 + 0.25 * (-1) = 0.75
 * - Priority 3 (Default): 1 + 0.25 * (0)  = 1.00
 * - Priority 4 (High):    1 + 0.25 * (1)  = 1.25
 * - Priority 5 (Highest): 1 + 0.25 * (2)  = 1.50
 *
 * @param priority User priority preference from 1 to 5. Defaults to 3 if undefined.
 * @returns Multiplier between 0.5 and 1.5.
 */
export function getPriorityMultiplier(priority?: PriorityValue): number {
  const p = priority ?? 3;
  return 1 + 0.25 * (p - 3);
}
