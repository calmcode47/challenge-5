export type WizardVertical = "wedding" | "milestone" | "community" | "anniversary";

export type WizardVenue = "Botanical Orchard" | "Ceramic Loft" | "Wildflower Meadow";

export interface WizardFormState {
  vertical: WizardVertical;
  title: string;
  notes: string;
  date: string;
  venue: WizardVenue;
  budgetTotal: number;
  guestCount: number;
  sensoryAda: boolean;
  sensoryAllergen: boolean;
  sensoryPavilion: boolean;
  sensoryAcoustic: boolean;
}

/** Returns a stable ISO date safely ahead of today for a new planning brief. */
export function defaultEventDate(now = new Date()): string {
  const date = new Date(now);
  date.setDate(date.getDate() + 90);
  return date.toISOString().slice(0, 10);
}
