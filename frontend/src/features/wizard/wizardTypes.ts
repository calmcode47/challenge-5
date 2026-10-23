export type WizardVertical = "wedding" | "milestone" | "community" | "anniversary";

export type WizardVenue = "Botanical Orchard" | "Ceramic Loft" | "Wildflower Meadow";

export interface WizardFormState {
  vertical: WizardVertical;
  title: string;
  date: string;
  venue: WizardVenue;
  budgetTotal: number;
  guestCount: number;
  sensoryAda: boolean;
  sensoryAllergen: boolean;
  sensoryPavilion: boolean;
  sensoryAcoustic: boolean;
}
