import type { Enrichment, SuggestedBudgetShift } from "../../contracts/enrichment.js";
import type { Plan, VendorBrief } from "../../contracts/plan.js";
import { PlanSchema } from "../../contracts/plan.js";
import { computeVendorVariance } from "../checklist/variance.js";
import { applyIdeaConstraints } from "../ideas/applyIdeaConstraints.js";
import { type ShiftRejectionReason, validateBudgetShift } from "./shiftBudgetValidator.js";

/**
 * Result record documenting the application status and diagnostics for a suggested budget shift.
 */
export interface ShiftApplicationResult {
  readonly shift: SuggestedBudgetShift;
  readonly applied: boolean;
  readonly reason?: ShiftRejectionReason;
}

/**
 * Complete outcome produced by merging an AI enrichment payload into an existing plan.
 */
export interface ApplyEnrichmentOutcome {
  readonly plan: Plan;
  readonly shiftResults: readonly ShiftApplicationResult[];
}

function mergeBriefs(
  existing: readonly VendorBrief[],
  incoming: readonly VendorBrief[]
): VendorBrief[] {
  const briefMap = new Map<string, VendorBrief>();
  for (const b of existing) {
    briefMap.set(b.categoryId, b);
  }
  for (const b of incoming) {
    briefMap.set(b.categoryId, b);
  }
  return Array.from(briefMap.values());
}

/**
 * Merges AI-generated enrichment recommendations into an established celebration plan.
 *
 * Security & Integrity Protections:
 * 1. AI cannot alter `input.budget.totalMinor` or `budget.totalMinor`.
 * 2. AI cannot alter `input.eventDate` or `timeline.eventDate`.
 * 3. AI cannot alter user-curated vendors or their stages, quotes, or expenditures.
 * 4. AI cannot alter completed `done` flags on milestones or checklist tasks.
 * 5. Suggested budget shifts are individually evaluated; invalid or invariant-breaking shifts
 *    are rejected with typed diagnostics, leaving the budget intact.
 * 6. Ideas are merged and clamped via `applyIdeaConstraints`, enforcing user context alignment
 *    and category headroom constraints.
 *
 * @param plan Current verified celebration plan.
 * @param enrichment Candidate enrichment recommendations from AI or fallback providers.
 * @param now Reference timestamp for pure execution and updatedAt stamping.
 * @returns Object containing the enriched Plan and detailed outcome of all shift proposals.
 */
function applyBudgetShifts(
  plan: Plan,
  shifts: readonly SuggestedBudgetShift[]
): { currentBudget: Plan["budget"]; shiftResults: ShiftApplicationResult[] } {
  let currentBudget = plan.budget;
  const shiftResults: ShiftApplicationResult[] = [];

  for (const shift of shifts) {
    const validation = validateBudgetShift(currentBudget, shift);
    if (!validation.valid) {
      shiftResults.push({
        shift,
        applied: false,
        reason: validation.reason,
      });
      continue;
    }

    currentBudget = computeVendorVariance({
      budget: {
        ...currentBudget,
        lines: validation.updatedLines,
      },
      vendors: plan.vendors,
    });

    shiftResults.push({
      shift,
      applied: true,
    });
  }

  return { currentBudget, shiftResults };
}

/**
 * Merges AI-generated enrichment recommendations into an established celebration plan.
 *
 * Security & Integrity Protections:
 * 1. AI cannot alter `input.budget.totalMinor` or `budget.totalMinor`.
 * 2. AI cannot alter `input.eventDate` or `timeline.eventDate`.
 * 3. AI cannot alter user-curated vendors or their stages, quotes, or expenditures.
 * 4. AI cannot alter completed `done` flags on milestones or checklist tasks.
 * 5. Suggested budget shifts are individually evaluated; invalid or invariant-breaking shifts
 *    are rejected with typed diagnostics, leaving the budget intact.
 * 6. Ideas are merged and clamped via `applyIdeaConstraints`, enforcing user context alignment
 *    and category headroom constraints.
 *
 * @param plan Current verified celebration plan.
 * @param enrichment Candidate enrichment recommendations from AI or fallback providers.
 * @param now Reference timestamp for pure execution and updatedAt stamping.
 * @returns Object containing the enriched Plan and detailed outcome of all shift proposals.
 */
export function applyEnrichment(
  plan: Plan,
  enrichment: Enrichment,
  now: Date | string
): ApplyEnrichmentOutcome {
  const updatedIso = typeof now === "string" ? new Date(now).toISOString() : now.toISOString();

  const { currentBudget, shiftResults } = applyBudgetShifts(plan, enrichment.suggestedBudgetShifts);

  const mergedBriefs = mergeBriefs(plan.briefs, enrichment.briefs);

  const mergedIdeas = applyIdeaConstraints([...plan.ideas, ...enrichment.ideas], {
    input: plan.input,
    budget: currentBudget,
    pinnedIdeaIds: plan.pinnedIdeaIds,
  });

  const narrative =
    enrichment.narrative && enrichment.narrative.trim().length > 0
      ? enrichment.narrative
      : plan.narrative;

  const rawEnrichedPlan: Plan = {
    id: plan.id,
    schemaVersion: plan.schemaVersion,
    createdAt: plan.createdAt,
    updatedAt: updatedIso,
    input: { ...plan.input },
    budget: currentBudget,
    timeline: { ...plan.timeline },
    vendors: [...plan.vendors],
    checklist: [...plan.checklist],
    briefs: mergedBriefs,
    ideas: mergedIdeas,
    pinnedIdeaIds: [...plan.pinnedIdeaIds],
    narrative,
    provenance: {
      baseline: plan.provenance.baseline,
      enrichment: enrichment.meta.source === "fallback" ? "none" : enrichment.meta.source,
    },
  };

  return {
    plan: PlanSchema.parse(rawEnrichedPlan),
    shiftResults,
  };
}
