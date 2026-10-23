import { z } from "zod";

/**
 * Event types supported by the Occasio platform.
 */
export const EVENT_TYPES = ["wedding", "birthday", "community", "other"] as const;

/**
 * Zod schema validating supported event types.
 */
export const EventTypeSchema = z.enum(EVENT_TYPES);

/**
 * Supported event type value.
 */
export type EventType = z.infer<typeof EventTypeSchema>;

/**
 * Type guard for EventType.
 *
 * @param value Candidate value.
 * @returns True if value is a valid EventType.
 */
export function isEventType(value: unknown): value is EventType {
  return typeof value === "string" && (EVENT_TYPES as readonly string[]).includes(value);
}

/**
 * Supported venue arrangement categories.
 */
export const VENUE_TYPES = [
  "banquet_hall",
  "community_hall",
  "outdoor",
  "home",
  "restaurant",
  "undecided",
] as const;

/**
 * Zod schema validating venue categories.
 */
export const VenueTypeSchema = z.enum(VENUE_TYPES);

/**
 * Supported venue category value.
 */
export type VenueType = z.infer<typeof VenueTypeSchema>;

/**
 * Type guard for VenueType.
 *
 * @param value Candidate value.
 * @returns True if value is a valid VenueType.
 */
export function isVenueType(value: unknown): value is VenueType {
  return typeof value === "string" && (VENUE_TYPES as readonly string[]).includes(value);
}

/**
 * Budget and vendor management category identifiers.
 */
export const CATEGORY_IDS = [
  "venue",
  "catering",
  "decor",
  "entertainment",
  "photo_video",
  "attire_beauty",
  "stationery",
  "logistics",
  "gifts_favors",
  "equipment_av",
  "marketing",
  "staffing",
  "permits_insurance",
  "contingency",
] as const;

/**
 * Zod schema validating category identifiers.
 */
export const CategoryIdSchema = z.enum(CATEGORY_IDS);

/**
 * Supported category identifier.
 */
export type CategoryId = z.infer<typeof CategoryIdSchema>;

/**
 * Type guard for CategoryId.
 *
 * @param value Candidate value.
 * @returns True if value is a valid CategoryId.
 */
export function isCategoryId(value: unknown): value is CategoryId {
  return typeof value === "string" && (CATEGORY_IDS as readonly string[]).includes(value);
}

/**
 * Lifecycle stages for vendor procurement.
 */
export const VENDOR_STAGES = [
  "shortlist",
  "contacted",
  "quoted",
  "booked",
  "deposit_paid",
  "confirmed",
  "declined",
] as const;

/**
 * Zod schema validating vendor lifecycle stages.
 */
export const VendorStageSchema = z.enum(VENDOR_STAGES);

/**
 * Vendor procurement lifecycle stage.
 */
export type VendorStage = z.infer<typeof VendorStageSchema>;

/**
 * Action classifications for checklist items.
 */
export const CHECKLIST_KINDS = ["ask", "document", "contract", "logistics"] as const;

/**
 * Zod schema validating checklist kinds.
 */
export const ChecklistKindSchema = z.enum(CHECKLIST_KINDS);

/**
 * Checklist item classification.
 */
export type ChecklistKind = z.infer<typeof ChecklistKindSchema>;

/**
 * Complexity or effort rating for celebration ideas.
 */
export const IDEA_EFFORTS = ["low", "medium", "high"] as const;

/**
 * Zod schema validating idea effort ratings.
 */
export const IdeaEffortSchema = z.enum(IDEA_EFFORTS);

/**
 * Effort level classification for ideas.
 */
export type IdeaEffort = z.infer<typeof IdeaEffortSchema>;

/**
 * Schedule compression and calendar tightness levels.
 */
export const TIMELINE_TIGHTNESS = ["comfortable", "tight", "very_tight"] as const;

/**
 * Zod schema validating timeline tightness ratings.
 */
export const TimelineTightnessSchema = z.enum(TIMELINE_TIGHTNESS);

/**
 * Timeline schedule tightness tier.
 */
export type TimelineTightness = z.infer<typeof TimelineTightnessSchema>;

/**
 * Current milestone execution status.
 */
export const MILESTONE_STATUSES = ["done", "overdue", "due_soon", "upcoming", "at_risk"] as const;

/**
 * Zod schema validating milestone status.
 */
export const MilestoneStatusSchema = z.enum(MILESTONE_STATUSES);

/**
 * Milestone status value.
 */
export type MilestoneStatus = z.infer<typeof MilestoneStatusSchema>;

/**
 * Budget expenditure variance status relative to allocation.
 */
export const BUDGET_LINE_STATUSES = ["under", "on_track", "over"] as const;

/**
 * Zod schema validating budget line expenditure status.
 */
export const BudgetLineStatusSchema = z.enum(BUDGET_LINE_STATUSES);

/**
 * Budget variance line status.
 */
export type BudgetLineStatus = z.infer<typeof BudgetLineStatusSchema>;

/**
 * AI enrichment provenance level.
 */
export const PROVENANCE_ENRICHMENTS = ["none", "ai", "demo"] as const;

/**
 * Zod schema validating enrichment provenance levels.
 */
export const ProvenanceEnrichmentSchema = z.enum(PROVENANCE_ENRICHMENTS);

/**
 * Provenance enrichment classification.
 */
export type ProvenanceEnrichment = z.infer<typeof ProvenanceEnrichmentSchema>;

export { categoriesForEventType } from "./categories.js";
