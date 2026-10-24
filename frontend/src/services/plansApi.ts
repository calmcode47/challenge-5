import { z } from "zod";
import type { WizardFormState } from "../features/wizard/wizardTypes.js";

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

export function apiBaseUrl(): string {
  const configured = (import.meta.env as { readonly VITE_API_BASE_URL?: string }).VITE_API_BASE_URL;
  return configured ?? "/api/v1";
}

function timeoutSignal(): AbortSignal {
  return AbortSignal.timeout(10_000);
}

const WAKEUP_STORAGE_KEY = "occasio_planner_wakeup_v1";
let wakeupInFlight: Promise<void> | undefined;

function canUseSessionStorage(): boolean {
  try {
    return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
  } catch {
    return false;
  }
}

/**
 * Starts a low-priority health request as the studio opens. This wakes a sleeping
 * Render instance before the visitor reaches the plan wizard, without exposing
 * event data or delaying the page.
 */
export function warmPlannerApi(): Promise<void> {
  if (canUseSessionStorage() && window.sessionStorage.getItem(WAKEUP_STORAGE_KEY) === "warmed") {
    return Promise.resolve();
  }
  if (wakeupInFlight) return wakeupInFlight;

  wakeupInFlight = fetch(`${apiBaseUrl()}/health`, {
    method: "GET",
    cache: "no-store",
    credentials: "omit",
    signal: AbortSignal.timeout(8_000),
  })
    .then((response) => {
      if (response.ok && canUseSessionStorage()) {
        window.sessionStorage.setItem(WAKEUP_STORAGE_KEY, "warmed");
      }
    })
    .catch(() => undefined)
    .finally(() => {
      wakeupInFlight = undefined;
    });
  return wakeupInFlight;
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
