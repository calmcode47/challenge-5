/**
 * | Rule Function | Trigger Condition | Categories Affected | Behavior & Output Description |
 * |---|---|---|---|
 * | `cateringRules` | Baseline + `dietary.length > 0` | `catering` | Adds menu proposal, staffing, food safety, tasting. When dietary present, adds allergen handling & labelled menu asks. |
 * | `venueRules` | Baseline + `venueType` | `venue` | Adds capacity layout, access hours, contract & damage deposit. `outdoor` adds weather contingency & power. `home` removes venue contracts and adds neighbour notice, noise curfew, parking. |
 * | `accessibilityRules` | `accessibilityNeeds.length > 0` | `venue` | Adds step-free access, priority seating, accessible restrooms, directional signage, and sensory quiet respite space asks. |
 * | `guestSizeRules` | `guestCount > 200` | `logistics`, `staffing` | Adds crowd-flow & queue ingress/egress planning and dedicated staffing ratio verification. |
 * | `communityRules` | `eventType === 'community'` | `permits_insurance`, `logistics`, `staffing` | Adds municipal assembly permits, liability insurance certificate, first-aid station, safety marshals, and transit accessibility plan. |
 * | `commonRules` | Baseline + `eventType` | `photo_video`, `entertainment`, `decor`, `logistics` | Adds shot list, tech rider, decor timeline. `wedding` adds officiant licence & ceremony logistics. `birthday` adds child safety & age-appropriate activities when `ageGroupNote` present. |
 */

import { ChecklistItemSchema, type ChecklistItem } from "../../contracts/planComponents.js";
import type { PlanInput } from "../../contracts/planInput.js";
import { cateringRules } from "./rules/cateringRules.js";
import { venueRules } from "./rules/venueRules.js";
import { accessibilityRules } from "./rules/accessibilityRules.js";
import { guestSizeRules } from "./rules/guestSizeRules.js";
import { communityRules } from "./rules/communityRules.js";
import { commonRules } from "./rules/commonRules.js";

/**
 * Type signature for a composable checklist rule.
 */
export type ChecklistRule = (input: PlanInput) => ChecklistItem[];

/**
 * Ordered sequence of modular checklist rule evaluators.
 */
const ACTIVE_RULES: readonly ChecklistRule[] = [
  cateringRules,
  venueRules,
  accessibilityRules,
  guestSizeRules,
  communityRules,
  commonRules,
];

/**
 * Constructs an event checklist by composing pure rule functions based on user configuration.
 *
 * Requirements enforced:
 * 1. Concatenates active modular rule outputs in stable order.
 * 2. Deduplicates items by unique `id`, keeping the first occurrence.
 * 3. When `venueType === 'home'`, strips commercial venue contracts (`categoryId: 'venue'`, `kind: 'contract'`).
 * 4. Preserves user task completion state via optional `doneIds`.
 *
 * @param input Validated user event configuration.
 * @param doneIds Optional set of checklist item IDs marked as completed.
 * @returns Array of validated, deduplicated checklist items.
 */
export function buildChecklist(
  input: PlanInput,
  doneIds?: ReadonlySet<string>,
  rules: readonly ChecklistRule[] = ACTIVE_RULES
): ChecklistItem[] {
  const rawItems: ChecklistItem[] = [];

  for (const rule of rules) {
    const items = rule(input);
    rawItems.push(...items);
  }

  // Enforce home venue contract removal
  const filtered =
    input.venueType === "home"
      ? rawItems.filter((item) => !(item.categoryId === "venue" && item.kind === "contract"))
      : rawItems;

  // Deduplicate by item.id preserving stable first-seen order
  const seenIds = new Set<string>();
  const deduped: ChecklistItem[] = [];

  for (const item of filtered) {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id);
      const isDone = doneIds?.has(item.id) ?? false;
      deduped.push({
        ...item,
        done: isDone,
      });
    }
  }

  return deduped.map((item) => ChecklistItemSchema.parse(item));
}
