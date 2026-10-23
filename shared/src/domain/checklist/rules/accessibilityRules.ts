import type { ChecklistItem } from "../../../contracts/planComponents.js";
import type { PlanInput } from "../../../contracts/planInput.js";

/**
 * Generates venue accessibility checklist requirements whenever the user specifies
 * any accessibility needs, adding inquiries for step-free access, accessible seating,
 * compliant restrooms, clear signage, and sensory quiet spaces.
 *
 * @param input Validated user event configuration.
 * @returns Array of checklist items addressing accessibility requirements.
 */
export function accessibilityRules(input: PlanInput): ChecklistItem[] {
  if (input.accessibilityNeeds.length === 0) {
    return [];
  }

  return [
    {
      id: "venue-access-step-free",
      categoryId: "venue",
      kind: "ask",
      text: "checklist.venue.access_step_free",
      done: false,
    },
    {
      id: "venue-access-seating",
      categoryId: "venue",
      kind: "ask",
      text: "checklist.venue.access_seating",
      done: false,
    },
    {
      id: "venue-access-restrooms",
      categoryId: "venue",
      kind: "ask",
      text: "checklist.venue.access_restrooms",
      done: false,
    },
    {
      id: "venue-access-signage",
      categoryId: "venue",
      kind: "ask",
      text: "checklist.venue.access_signage",
      done: false,
    },
    {
      id: "venue-access-quiet-space",
      categoryId: "venue",
      kind: "ask",
      text: "checklist.venue.access_quiet_space",
      done: false,
    },
  ];
}
