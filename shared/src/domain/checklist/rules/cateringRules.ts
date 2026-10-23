import type { ChecklistItem } from "../../../contracts/planComponents.js";
import type { PlanInput } from "../../../contracts/planInput.js";

/**
 * Generates catering checklist items including baseline menu/staffing requirements
 * and specific dietary allergen handling tasks when dietary restrictions are present.
 *
 * @param input Validated user event configuration.
 * @returns Array of checklist items relevant to food and catering service.
 */
export function cateringRules(input: PlanInput): ChecklistItem[] {
  const items: ChecklistItem[] = [
    {
      id: "catering-baseline-menu-proposal",
      categoryId: "catering",
      kind: "ask",
      text: "checklist.catering.baseline_menu_proposal",
      done: false,
    },
    {
      id: "catering-baseline-service-staffing",
      categoryId: "catering",
      kind: "ask",
      text: "checklist.catering.baseline_service_staffing",
      done: false,
    },
    {
      id: "catering-baseline-food-safety",
      categoryId: "catering",
      kind: "document",
      text: "checklist.catering.baseline_food_safety",
      done: false,
    },
    {
      id: "catering-baseline-tasting-schedule",
      categoryId: "catering",
      kind: "logistics",
      text: "checklist.catering.baseline_tasting_schedule",
      done: false,
    },
  ];

  if (input.dietary.length > 0) {
    items.push(
      {
        id: "catering-dietary-allergens",
        categoryId: "catering",
        kind: "ask",
        text: "checklist.catering.dietary_allergens",
        done: false,
      },
      {
        id: "catering-dietary-labelled-menus",
        categoryId: "catering",
        kind: "ask",
        text: "checklist.catering.dietary_labelled_menus",
        done: false,
      }
    );
  }

  return items;
}
