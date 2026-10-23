import type { ChecklistItem } from "../../../contracts/planComponents.js";
import type { PlanInput } from "../../../contracts/planInput.js";

function getOutdoorItems(): ChecklistItem[] {
  return [
    {
      id: "venue-outdoor-weather-contingency",
      categoryId: "venue",
      kind: "logistics",
      text: "checklist.venue.outdoor_weather_contingency",
      done: false,
    },
    {
      id: "venue-outdoor-power-supply",
      categoryId: "venue",
      kind: "logistics",
      text: "checklist.venue.outdoor_power_supply",
      done: false,
    },
  ];
}

function getHomeItems(): ChecklistItem[] {
  return [
    {
      id: "venue-home-neighbour-notification",
      categoryId: "venue",
      kind: "logistics",
      text: "checklist.venue.home_neighbour_notification",
      done: false,
    },
    {
      id: "venue-home-noise-curfew",
      categoryId: "venue",
      kind: "ask",
      text: "checklist.venue.home_noise_curfew",
      done: false,
    },
    {
      id: "venue-home-parking-logistics",
      categoryId: "venue",
      kind: "logistics",
      text: "checklist.venue.home_parking_logistics",
      done: false,
    },
  ];
}

function getCommercialContractItems(): ChecklistItem[] {
  return [
    {
      id: "venue-baseline-contract-terms",
      categoryId: "venue",
      kind: "contract",
      text: "checklist.venue.baseline_contract_terms",
      done: false,
    },
    {
      id: "venue-baseline-damage-deposit",
      categoryId: "venue",
      kind: "contract",
      text: "checklist.venue.baseline_damage_deposit",
      done: false,
    },
  ];
}

/**
 * Generates venue checklist items adapting for venue configuration:
 * - standard commercial venues include lease contracts and damage deposits
 * - outdoor venues add weather contingencies and power supplies
 * - home venues omit commercial contracts and add neighbour notifications, noise curfews, and parking
 *
 * @param input Validated user event configuration.
 * @returns Array of checklist items relevant to venue logistics.
 */
export function venueRules(input: PlanInput): ChecklistItem[] {
  const items: ChecklistItem[] = [
    {
      id: "venue-baseline-capacity-layout",
      categoryId: "venue",
      kind: "ask",
      text: "checklist.venue.baseline_capacity_layout",
      done: false,
    },
    {
      id: "venue-baseline-access-hours",
      categoryId: "venue",
      kind: "logistics",
      text: "checklist.venue.baseline_access_hours",
      done: false,
    },
  ];

  if (input.venueType !== "home") {
    items.push(...getCommercialContractItems());
  }
  if (input.venueType === "outdoor") {
    items.push(...getOutdoorItems());
  }
  if (input.venueType === "home") {
    items.push(...getHomeItems());
  }

  return items;
}
