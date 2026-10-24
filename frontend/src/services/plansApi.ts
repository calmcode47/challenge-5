import { z } from "zod";
import type { WizardFormState } from "../features/wizard/wizardTypes.js";
import { apiBaseUrl } from "./apiConfig.js";

const eventTypeSchema = z.enum(["wedding", "milestone", "community", "anniversary"]);

const generatedPlanSchema = z.object({
  id: z.string(),
  title: z.string(),
  eventType: eventTypeSchema,
  date: z.string(),
  guestCount: z.number(),
  budget: z.number(),
  venue: z.string(),
  personalizedIdeas: z.array(z.string()),
  vendorChecklist: z.array(z.string()),
  riskFlags: z.array(z.string()),
  aiMode: z.enum(["live", "deterministic"]),
});

const apiResponseSchema = z.object({ data: generatedPlanSchema });

export type GeneratedPlan = z.infer<typeof generatedPlanSchema>;

function timeoutSignal(): AbortSignal {
  return AbortSignal.timeout(10_000);
}

/** Calls the planning API while keeping the interface usable if the service is offline. */
export async function generatePlan(form: WizardFormState): Promise<GeneratedPlan> {
  const response = await fetch(`${apiBaseUrl()}/plans/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: form.title || "Custom Gathering",
      eventType: form.vertical,
      date: form.date,
      guestCount: form.guestCount,
      budget: form.budgetTotal,
      venue: form.venue,
      notes: "",
      accessibility: {
        stepFreeAccess: form.sensoryAda,
        allergenAware: form.sensoryAllergen,
        weatherBackup: form.sensoryPavilion,
        lowSensoryOption: form.sensoryAcoustic,
      },
    }),
    signal: timeoutSignal(),
  });
  if (!response.ok) throw new Error("The planner could not complete the brief.");
  return apiResponseSchema.parse(await response.json()).data;
}
