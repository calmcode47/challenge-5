import type { EventType } from "../../contracts/enums.js";
import {
  type MilestoneTemplate,
  WEDDING_TEMPLATES,
  BIRTHDAY_TEMPLATES,
} from "./templatesDataPart1.js";
import { COMMUNITY_TEMPLATES, OTHER_TEMPLATES } from "./templatesDataPart2.js";

export type { MilestoneTemplate };
export { WEDDING_TEMPLATES, BIRTHDAY_TEMPLATES };
export { COMMUNITY_TEMPLATES, OTHER_TEMPLATES };

const TEMPLATES_BY_EVENT_TYPE: Record<EventType, readonly MilestoneTemplate[]> = {
  wedding: WEDDING_TEMPLATES,
  birthday: BIRTHDAY_TEMPLATES,
  community: COMMUNITY_TEMPLATES,
  other: OTHER_TEMPLATES,
};

/**
 * Retrieves the standard milestone templates for a specific celebration event type.
 *
 * @param eventType Selected celebration type.
 * @returns Array of milestone templates defined for that event type.
 */
export function getMilestoneTemplates(eventType: EventType): readonly MilestoneTemplate[] {
  return TEMPLATES_BY_EVENT_TYPE[eventType];
}

/**
 * Returns all milestone templates across all supported event types.
 *
 * @returns Combined array of all defined templates.
 */
export function getAllMilestoneTemplates(): readonly MilestoneTemplate[] {
  return [...WEDDING_TEMPLATES, ...BIRTHDAY_TEMPLATES, ...COMMUNITY_TEMPLATES, ...OTHER_TEMPLATES];
}
