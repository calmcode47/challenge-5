import type { CategoryId, EventType } from "./enums.js";

/**
 * Predefined active category allocations per event type.
 */
const CATEGORIES_BY_EVENT_TYPE: Record<EventType, readonly CategoryId[]> = {
  wedding: [
    "venue",
    "catering",
    "decor",
    "photo_video",
    "entertainment",
    "attire_beauty",
    "stationery",
    "logistics",
    "gifts_favors",
    "contingency",
  ],
  birthday: [
    "venue",
    "catering",
    "decor",
    "entertainment",
    "photo_video",
    "gifts_favors",
    "stationery",
    "logistics",
    "contingency",
  ],
  community: [
    "venue",
    "catering",
    "equipment_av",
    "marketing",
    "entertainment",
    "staffing",
    "permits_insurance",
    "logistics",
    "contingency",
  ],
  other: [
    "venue",
    "catering",
    "decor",
    "entertainment",
    "logistics",
    "stationery",
    "photo_video",
    "contingency",
  ],
};

/**
 * Returns the relevant domain category identifiers associated with a specific event type.
 *
 * @param eventType Selected celebration type.
 * @returns Array of active CategoryId values relevant to the event type.
 */
export function categoriesForEventType(eventType: EventType): readonly CategoryId[] {
  return CATEGORIES_BY_EVENT_TYPE[eventType];
}
