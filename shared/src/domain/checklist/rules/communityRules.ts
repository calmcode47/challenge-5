import type { ChecklistItem } from "../../../contracts/planComponents.js";
import type { PlanInput } from "../../../contracts/planInput.js";

/**
 * Generates community celebration checklist requirements including municipal permits,
 * public liability insurance, first-aid stations, safety marshals, and transit accessibility plans.
 *
 * @param input Validated user event configuration.
 * @returns Array of checklist items addressing community event requirements.
 */
export function communityRules(input: PlanInput): ChecklistItem[] {
  if (input.eventType !== "community") {
    return [];
  }

  return [
    {
      id: "permits-municipal-event-permit",
      categoryId: "permits_insurance",
      kind: "document",
      text: "checklist.permits.municipal_event_permit",
      done: false,
    },
    {
      id: "permits-public-liability-insurance",
      categoryId: "permits_insurance",
      kind: "contract",
      text: "checklist.permits.public_liability_insurance",
      done: false,
    },
    {
      id: "safety-first-aid-station",
      categoryId: "logistics",
      kind: "logistics",
      text: "checklist.safety.first_aid_station",
      done: false,
    },
    {
      id: "staffing-safety-marshals",
      categoryId: "staffing",
      kind: "ask",
      text: "checklist.staffing.safety_marshals",
      done: false,
    },
    {
      id: "logistics-community-accessibility-plan",
      categoryId: "logistics",
      kind: "document",
      text: "checklist.logistics.community_accessibility_plan",
      done: false,
    },
  ];
}
