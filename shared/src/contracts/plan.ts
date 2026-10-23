import { z } from "zod";
import { boundedText, idSchema, isoDateTimeSchema } from "./primitives.js";
import { PlanInputSchema } from "./planInput.js";
import {
  BudgetPlanSchema,
  ChecklistItemSchema,
  IdeaSchema,
  PlanProvenanceSchema,
  TimelinePlanSchema,
  VendorBriefSchema,
  VendorSchema,
} from "./planComponents.js";

export * from "./planComponents.js";

/**
 * Current version constant for persisted and transmitted plan contracts.
 */
export const PLAN_SCHEMA_VERSION = 1 as const;

/**
 * Inferred type of the plan schema version.
 */
export type PlanSchemaVersion = typeof PLAN_SCHEMA_VERSION;

/**
 * Root canonical celebration plan document schema.
 */
export const PlanSchema = z.object({
  id: idSchema,
  schemaVersion: z.literal(PLAN_SCHEMA_VERSION),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
  input: PlanInputSchema,
  budget: BudgetPlanSchema,
  timeline: TimelinePlanSchema,
  vendors: z.array(VendorSchema),
  checklist: z.array(ChecklistItemSchema),
  briefs: z.array(VendorBriefSchema),
  ideas: z.array(IdeaSchema),
  pinnedIdeaIds: z.array(idSchema),
  narrative: boundedText({ min: 1, max: 2000, allowNewlines: true }).optional(),
  provenance: PlanProvenanceSchema,
});

/**
 * Inferred type of a complete canonical plan.
 */
export type Plan = z.infer<typeof PlanSchema>;

/**
 * Lightweight summary projection of a plan omitting bulky arrays (ideas, briefs, narrative).
 * Used across network payload boundaries such as AI chat requests.
 */
export const PlanSummarySchema = z.object({
  id: idSchema,
  schemaVersion: z.literal(PLAN_SCHEMA_VERSION),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
  input: PlanInputSchema,
  budget: BudgetPlanSchema,
  timeline: TimelinePlanSchema,
  vendors: z.array(VendorSchema),
  checklist: z.array(ChecklistItemSchema),
  pinnedIdeaIds: z.array(idSchema),
  provenance: PlanProvenanceSchema,
});

/**
 * Inferred type of a plan summary projection.
 */
export type PlanSummary = z.infer<typeof PlanSummarySchema>;
