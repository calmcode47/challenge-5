import { z } from "zod";
import type { WizardFormState } from "../features/wizard/wizardTypes.js";
import { apiBaseUrl } from "./apiConfig.js";

const eventTypeSchema = z.enum(["wedding", "milestone", "community", "anniversary"]);

const allocationSchema = z
  .object({
    category: z.string().trim().min(1).max(80),
    amount: z.number().nonnegative().max(5_000_000),
    percent: z.number().min(0).max(100),
  })
  .strict();

const timelineTaskSchema = z
  .object({
    phase: z.string().trim().min(1).max(80),
    due: z.iso.date(),
    task: z.string().trim().min(1).max(300),
    owner: z.string().trim().min(1).max(80),
  })
  .strict();

const generatedPlanSchema = z
  .object({
    id: z.string().trim().min(1).max(80),
    title: z.string().trim().min(1).max(120),
    eventType: eventTypeSchema,
    date: z.iso.date(),
    guestCount: z.number().int().min(2).max(5000),
    budget: z.number().positive().max(5_000_000),
    venue: z.string().trim().min(1).max(120),
    budgetAllocation: z.array(allocationSchema).min(1).max(12),
    timeline: z.array(timelineTaskSchema).min(1).max(12),
    personalizedIdeas: z.array(z.string().trim().min(1).max(220)).max(4),
    vendorChecklist: z.array(z.string().trim().min(1).max(220)).max(16),
    riskFlags: z.array(z.string().trim().min(1).max(220)).max(12),
    aiMode: z.enum(["live", "deterministic"]),
    generatedAt: z.iso.datetime(),
  })
  .strict();

const apiResponseSchema = z.object({ data: generatedPlanSchema }).strict();

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
      notes: form.notes.trim(),
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
