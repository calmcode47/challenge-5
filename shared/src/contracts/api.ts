import { z } from "zod";
import { boundedText, idSchema, isoDateTimeSchema } from "./primitives.js";
import { PlanInputSchema } from "./planInput.js";
import { IdeaSchema, PlanSchema, PlanSummarySchema } from "./plan.js";
import { EnrichmentMetaSchema, EnrichmentSchema } from "./enrichment.js";
import { ChatMessageSchema, SuggestedActionSchema } from "./assistant.js";

/**
 * Health check response schema for GET /health.
 * Unknown response properties are stripped to preserve forward compatibility.
 */
export const HealthResponseSchema = z
  .object({
    status: z.literal("ok"),
    version: boundedText({ min: 1, max: 50 }),
    mode: z.union([z.literal("live"), z.literal("degraded")]),
  })
  .strip();

/**
 * Inferred type of GET /health response.
 */
export type HealthResponse = z.infer<typeof HealthResponseSchema>;

/**
 * Session bootstrap response schema for GET /session.
 * Provides anonymous signed session identity and anti-CSRF token.
 * Unknown response properties are stripped to preserve forward compatibility.
 */
export const SessionResponseSchema = z
  .object({
    sessionId: idSchema,
    csrfToken: boundedText({ min: 16, max: 128 }),
    expiresAt: isoDateTimeSchema,
  })
  .strip();

/**
 * Inferred type of GET /session response.
 */
export type SessionResponse = z.infer<typeof SessionResponseSchema>;

/**
 * Request schema for POST /plans/enrich.
 * Rejects unknown keys (.strict()) to prevent payload tampering.
 */
export const EnrichPlanRequestSchema = z
  .object({
    input: PlanInputSchema,
    baseline: PlanSchema,
  })
  .strict();

/**
 * Inferred type of POST /plans/enrich request.
 */
export type EnrichPlanRequest = z.infer<typeof EnrichPlanRequestSchema>;

/**
 * Response schema for POST /plans/enrich.
 * Strips unknown properties (.strip()) to prevent client crashes upon backend evolution.
 */
export const EnrichPlanResponseSchema = EnrichmentSchema.strip();

/**
 * Inferred type of POST /plans/enrich response.
 */
export type EnrichPlanResponse = z.infer<typeof EnrichPlanResponseSchema>;

/**
 * Feedback parameters for targeted idea regeneration.
 */
export const IdeasFeedbackSchema = z.object({
  pinned: z.array(idSchema),
  rejected: z.array(idSchema),
  note: boundedText({ min: 1, max: 300 }).optional(),
});

/**
 * Inferred type of idea feedback.
 */
export type IdeasFeedback = z.infer<typeof IdeasFeedbackSchema>;

/**
 * Request schema for POST /plans/:planId/ideas.
 * Rejects unknown keys (.strict()).
 */
export const GenerateIdeasRequestSchema = z
  .object({
    plan: PlanSummarySchema,
    feedback: IdeasFeedbackSchema,
  })
  .strict();

/**
 * Inferred type of POST /plans/:planId/ideas request.
 */
export type GenerateIdeasRequest = z.infer<typeof GenerateIdeasRequestSchema>;

/**
 * Response schema for POST /plans/:planId/ideas.
 * Strips unknown properties (.strip()).
 */
export const GenerateIdeasResponseSchema = z
  .object({
    ideas: z.array(IdeaSchema),
    meta: EnrichmentMetaSchema,
  })
  .strip();

/**
 * Inferred type of POST /plans/:planId/ideas response.
 */
export type GenerateIdeasResponse = z.infer<typeof GenerateIdeasResponseSchema>;

/**
 * Request schema for POST /assistant/chat.
 * Restricts chat history to 20 messages and enforces strict payload keys.
 */
export const ChatRequestSchema = z
  .object({
    planId: idSchema.optional(),
    plan: PlanSummarySchema,
    messages: z.array(ChatMessageSchema).min(1).max(20),
  })
  .strict();

/**
 * Inferred type of POST /assistant/chat request.
 */
export type ChatRequest = z.infer<typeof ChatRequestSchema>;

/**
 * Response schema for POST /assistant/chat.
 * Limits suggested actions to 5 and strips unknown keys for forward compatibility.
 */
export const ChatResponseSchema = z
  .object({
    reply: boundedText({ min: 1, max: 4000, allowNewlines: true }),
    suggestedActions: z.array(SuggestedActionSchema).max(5),
    meta: EnrichmentMetaSchema,
  })
  .strip();

/**
 * Inferred type of POST /assistant/chat response.
 */
export type ChatResponse = z.infer<typeof ChatResponseSchema>;

/**
 * Response schema for GET /plans.
 * Strips unknown keys from elements.
 */
export const ListPlansResponseSchema = z.array(PlanSchema.strip());

/**
 * Inferred type of GET /plans response.
 */
export type ListPlansResponse = z.infer<typeof ListPlansResponseSchema>;

/**
 * Response schema for GET /plans/:id.
 * Strips unknown keys.
 */
export const GetPlanResponseSchema = PlanSchema.strip();

/**
 * Inferred type of GET /plans/:id response.
 */
export type GetPlanResponse = z.infer<typeof GetPlanResponseSchema>;

/**
 * Request schema for PUT /plans/:id.
 * Enforces strict keys on mutated plan payloads.
 */
export const SavePlanRequestSchema = PlanSchema.strict();

/**
 * Inferred type of PUT /plans/:id request.
 */
export type SavePlanRequest = z.infer<typeof SavePlanRequestSchema>;

/**
 * Response schema for PUT /plans/:id.
 * Strips unknown keys.
 */
export const SavePlanResponseSchema = PlanSchema.strip();

/**
 * Inferred type of PUT /plans/:id response.
 */
export type SavePlanResponse = z.infer<typeof SavePlanResponseSchema>;
