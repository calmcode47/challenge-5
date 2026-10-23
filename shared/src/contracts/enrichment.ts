import { z } from "zod";
import { boundedText, idSchema, moneyAmountSchema } from "./primitives.js";
import { CategoryIdSchema } from "./enums.js";
import { IdeaSchema, VendorBriefSchema } from "./plan.js";

/**
 * Suggested re-allocation of funds between two domain categories.
 */
export const SuggestedBudgetShiftSchema = z.object({
  from: CategoryIdSchema,
  to: CategoryIdSchema,
  amountMinor: moneyAmountSchema.refine((val) => val > 0, {
    message: "Shift amount must be strictly greater than zero",
  }),
  rationale: boundedText({ min: 1, max: 300 }),
});

/**
 * Inferred type of a suggested budget reallocation.
 */
export type SuggestedBudgetShift = z.infer<typeof SuggestedBudgetShiftSchema>;

/**
 * Contextual annotation or tips attached to a scheduled milestone.
 */
export const MilestoneNoteSchema = z.object({
  milestoneId: idSchema,
  note: boundedText({ min: 1, max: 300 }),
});

/**
 * Inferred type of a milestone contextual note.
 */
export type MilestoneNote = z.infer<typeof MilestoneNoteSchema>;

/**
 * Metadata accompanying AI or fallback enrichment results.
 */
export const EnrichmentMetaSchema = z.object({
  model: boundedText({ min: 1, max: 80 }),
  source: z.union([z.literal("ai"), z.literal("fallback"), z.literal("demo")]),
  requestId: idSchema,
});

/**
 * Inferred type of enrichment response metadata.
 */
export type EnrichmentMeta = z.infer<typeof EnrichmentMetaSchema>;

/**
 * Complete AI plan enrichment payload.
 * Provides narrative framing, vendor briefs, personalized ideas, and optional budget shift proposals.
 */
export const EnrichmentSchema = z.object({
  narrative: boundedText({ min: 1, max: 2000, allowNewlines: true }).optional(),
  briefs: z.array(VendorBriefSchema),
  ideas: z.array(IdeaSchema),
  suggestedBudgetShifts: z.array(SuggestedBudgetShiftSchema),
  milestoneNotes: z.array(MilestoneNoteSchema),
  meta: EnrichmentMetaSchema,
});

/**
 * Inferred type of an enrichment structure.
 */
export type Enrichment = z.infer<typeof EnrichmentSchema>;
