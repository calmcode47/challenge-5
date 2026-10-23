import type { Plan } from "../../contracts/plan.js";
import { PlanSchema } from "../../contracts/plan.js";
import type { PlanInput } from "../../contracts/planInput.js";
import { PlanInputSchema } from "../../contracts/planInput.js";
import { type Result, err, ok } from "../../lib/result.js";
import { allocateBudget } from "../budget/allocateBudget.js";
import { buildBaselineBriefs } from "../checklist/briefs.js";
import { buildChecklist } from "../checklist/buildChecklist.js";
import { computeVendorVariance } from "../checklist/variance.js";
import { applyIdeaConstraints } from "../ideas/applyIdeaConstraints.js";
import { buildTimeline } from "../timeline/buildTimeline.js";

/**
 * Pure mutation updating plan input parameters (dates, guests, budget, venue, dietary, etc.).
 *
 * Re-execution & Preservation Invariants:
 * 1. Validates patched input against PlanInputSchema; returns error Result if invalid.
 * 2. Re-runs timeline scheduler with new date, strictly preserving user completed milestone `done` flags.
 * 3. Re-allocates budget with updated guests, venue, priorities, and timeline tightness.
 * 4. Reconciles existing vendor expenditures against new budget allocations.
 * 5. Re-builds category checklists, preserving user completed task `done` flags.
 * 6. Refreshes baseline vendor guidance briefs.
 * 7. Re-evaluates idea constraints and headroom against new budget, preserving pinned selections.
 *
 * @param plan Current celebration plan.
 * @param patch Partial input modifications.
 * @param now Reference timestamp for timeline calculations and updatedAt.
 * @returns Result containing the updated Plan or string validation error message.
 */
export function updateInput(
  plan: Plan,
  patch: Partial<PlanInput>,
  now: Date | string
): Result<Plan, string> {
  const mergedInput = {
    ...plan.input,
    ...patch,
    priorities: {
      ...plan.input.priorities,
      ...(patch.priorities ?? {}),
    },
  };

  const parsed = PlanInputSchema.safeParse(mergedInput);
  if (!parsed.success) {
    return err(parsed.error.issues.map((i) => i.message).join("; "));
  }
  const nextInput = parsed.data;

  const doneMilestoneIds = new Set(plan.timeline.milestones.filter((m) => m.done).map((m) => m.id));
  const nextTimeline = buildTimeline(nextInput, now, doneMilestoneIds);

  const reallocatedBudget = allocateBudget(nextInput, {
    tightness: nextTimeline.tightness,
  });

  const reconciledBudget = computeVendorVariance({
    budget: reallocatedBudget,
    vendors: plan.vendors,
  });

  const rawChecklist = buildChecklist(nextInput);
  const doneChecklistIds = new Set(
    plan.checklist.filter((item) => item.done).map((item) => item.id)
  );
  const nextChecklist = rawChecklist.map((item) => ({
    ...item,
    done: doneChecklistIds.has(item.id),
  }));

  const nextBriefs = buildBaselineBriefs(nextInput);

  const nextIdeas = applyIdeaConstraints(plan.ideas, {
    input: nextInput,
    budget: reconciledBudget,
    pinnedIdeaIds: plan.pinnedIdeaIds,
  });

  const updatedIso = typeof now === "string" ? new Date(now).toISOString() : now.toISOString();

  const nextPlan: Plan = {
    ...plan,
    updatedAt: updatedIso,
    input: nextInput,
    budget: reconciledBudget,
    timeline: nextTimeline,
    checklist: nextChecklist,
    briefs: nextBriefs,
    ideas: nextIdeas,
  };

  return ok(PlanSchema.parse(nextPlan));
}
