import type { ChecklistItem } from "../../../contracts/planComponents.js";
import type { PlanInput } from "../../../contracts/planInput.js";

function getWeddingItems(): ChecklistItem[] {
  return [
    {
      id: "wedding-officiant-licence-logistics",
      categoryId: "logistics",
      kind: "document",
      text: "checklist.wedding.officiant_licence_logistics",
      done: false,
    },
    {
      id: "wedding-ceremony-rehearsal-logistics",
      categoryId: "logistics",
      kind: "logistics",
      text: "checklist.wedding.ceremony_rehearsal_logistics",
      done: false,
    },
  ];
}

function getBirthdayAgeItems(): ChecklistItem[] {
  return [
    {
      id: "birthday-child-safety-supervision",
      categoryId: "logistics",
      kind: "logistics",
      text: "checklist.birthday.child_safety_supervision",
      done: false,
    },
    {
      id: "birthday-age-appropriate-entertainment",
      categoryId: "entertainment",
      kind: "ask",
      text: "checklist.birthday.age_appropriate_entertainment",
      done: false,
    },
  ];
}

/**
 * Generates baseline cross-category checklist items (photo shot list, entertainment technical rider,
 * decor setup schedule), plus wedding ceremony/officiant logistics and birthday age-group items
 * (child safety supervision and age-appropriate entertainment only when ageGroupNote is present).
 *
 * @param input Validated user event configuration.
 * @returns Array of checklist items.
 */
export function commonRules(input: PlanInput): ChecklistItem[] {
  const items: ChecklistItem[] = [
    {
      id: "photo_video-baseline-shot-list",
      categoryId: "photo_video",
      kind: "document",
      text: "checklist.photo_video.baseline_shot_list",
      done: false,
    },
    {
      id: "entertainment-baseline-equipment-rider",
      categoryId: "entertainment",
      kind: "ask",
      text: "checklist.entertainment.baseline_equipment_rider",
      done: false,
    },
    {
      id: "decor-baseline-setup-timeline",
      categoryId: "decor",
      kind: "logistics",
      text: "checklist.decor.baseline_setup_timeline",
      done: false,
    },
  ];

  if (input.eventType === "wedding") {
    items.push(...getWeddingItems());
  }

  if (
    input.eventType === "birthday" &&
    input.ageGroupNote &&
    input.ageGroupNote.trim().length > 0
  ) {
    items.push(...getBirthdayAgeItems());
  }

  return items;
}
