import type { Plan } from "../../contracts/plan.js";
import { PLAN_SCHEMA_VERSION, PlanSchema } from "../../contracts/plan.js";
import type { PlanInput } from "../../contracts/planInput.js";
import { PlanInputSchema } from "../../contracts/planInput.js";
import { allocateBudget } from "../budget/allocateBudget.js";
import { buildBaselineBriefs } from "../checklist/briefs.js";
import { buildChecklist } from "../checklist/buildChecklist.js";
import { buildTimeline } from "../timeline/buildTimeline.js";
import { fnv1a } from "./fnv1a.js";

/**
 * Constructs a comprehensive baseline celebration plan through deterministic domain algorithms.
 *
 * Execution Pipeline:
 * 1. Validates input schema.
 * 2. Back-schedules timeline from event date, deriving schedule tightness.
 * 3. Allocates contextual budget using event type, venue, guest count, and schedule tightness.
 * 4. Generates contextual vendor checklists matching event constraints and dietary/a11y needs.
 * 5. Assembles baseline category vendor evaluation briefs.
 * 6. Assigns a deterministic identifier derived from FNV-1a hash of title, date, and creation timestamp.
 *
 * @param input Validated user event parameters.
 * @param now Injected reference timestamp for pure date calculations and timestamps.
 * @returns Fully populated and validated Plan instance with provenance.enrichment set to 'none'.
 */
export function buildBaselinePlan(input: PlanInput, now: Date | string): Plan {
  const validatedInput = PlanInputSchema.parse(input);
  const nowIso = typeof now === "string" ? new Date(now).toISOString() : now.toISOString();

  const timeline = buildTimeline(validatedInput, now);
  const budget = allocateBudget(validatedInput, {
    tightness: timeline.tightness,
  });
  const checklist = buildChecklist(validatedInput);
  const briefs = buildBaselineBriefs(validatedInput);

  const hashKey = `${validatedInput.title}:${validatedInput.eventDate}:${nowIso}`;
  const planId = `plan_${fnv1a(hashKey)}`;

  const rawPlan: Plan = {
    id: planId,
    schemaVersion: PLAN_SCHEMA_VERSION,
    createdAt: nowIso,
    updatedAt: nowIso,
    input: validatedInput,
    budget,
    timeline,
    vendors: [],
    checklist,
    briefs,
    ideas: [],
    pinnedIdeaIds: [],
    provenance: {
      baseline: "calculated",
      enrichment: "none",
    },
  };

  return PlanSchema.parse(rawPlan);
}
