import type { ChecklistItem } from "../../../contracts/planComponents.js";
import type { PlanInput } from "../../../contracts/planInput.js";

/**
 * Generates crowd management and operational staffing checklist items
 * when the event guest count exceeds 200 attendees.
 *
 * @param input Validated user event configuration.
 * @returns Array of checklist items addressing large crowd operations.
 */
export function guestSizeRules(input: PlanInput): ChecklistItem[] {
  if (input.guestCount <= 200) {
    return [];
  }

  return [
    {
      id: "logistics-crowd-flow-management",
      categoryId: "logistics",
      kind: "logistics",
      text: "checklist.logistics.crowd_flow_management",
      done: false,
    },
    {
      id: "staffing-large-guest-ratio",
      categoryId: "staffing",
      kind: "ask",
      text: "checklist.staffing.large_guest_ratio",
      done: false,
    },
  ];
}
