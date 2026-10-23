import type { VendorStage } from "../../contracts/enums.js";

/**
 * Valid stage transitions for vendor procurement lifecycle.
 * Declines are always valid except from the terminal declined stage.
 * Illegal jumps (e.g. declined -> booked, shortlist -> confirmed) are strictly disallowed.
 */
const ALLOWED_STAGE_TRANSITIONS: Record<VendorStage, readonly VendorStage[]> = {
  shortlist: ["contacted", "quoted", "declined"],
  contacted: ["quoted", "declined"],
  quoted: ["booked", "declined"],
  booked: ["deposit_paid", "confirmed", "declined"],
  deposit_paid: ["confirmed", "declined"],
  confirmed: ["declined"],
  declined: [],
};

/**
 * Returns the list of permitted destination stages that a vendor may advance to from their current stage.
 *
 * @param current Current vendor lifecycle stage.
 * @returns Readonly array of allowed next stages.
 */
export function nextStages(current: VendorStage): readonly VendorStage[] {
  return ALLOWED_STAGE_TRANSITIONS[current];
}

/**
 * Validates whether a vendor transition from an initial stage to a target stage is legally permissible.
 *
 * @param from Current stage of the vendor.
 * @param to Desired next stage of the vendor.
 * @returns True if the transition is allowed according to the procurement lifecycle state machine.
 */
export function canAdvance(from: VendorStage, to: VendorStage): boolean {
  if (from === to) {
    return false;
  }
  return ALLOWED_STAGE_TRANSITIONS[from].includes(to);
}
