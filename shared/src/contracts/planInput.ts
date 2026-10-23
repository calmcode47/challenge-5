import { z } from "zod";
import {
  boundedText,
  currencyCodeSchema,
  dateStringSchema,
  moneyAmountSchema,
} from "./primitives.js";
import { CategoryIdSchema, EventTypeSchema, VenueTypeSchema } from "./enums.js";

/**
 * Budget definition schema within plan input specifications.
 * Requires a positive non-zero total minor amount.
 */
export const PlanBudgetInputSchema = z.object({
  currency: currencyCodeSchema,
  totalMinor: moneyAmountSchema.refine((val) => val > 0, {
    message: "Total budget amount must be strictly greater than zero",
  }),
});

/**
 * Inferred type of the plan budget input.
 */
export type PlanBudgetInput = z.infer<typeof PlanBudgetInputSchema>;

/**
 * Rating scale (1 to 5) for category priority preference.
 */
export const PriorityValueSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);

/**
 * Priority value type from 1 (lowest) to 5 (highest).
 */
export type PriorityValue = z.infer<typeof PriorityValueSchema>;

/**
 * Comprehensive input specification for configuring and generating an event plan.
 * Strict bounds prevent memory exhaustion, while permitting Unicode and unconstrained regional context.
 */
export const PlanInputSchema = z.object({
  eventType: EventTypeSchema,
  title: boundedText({ min: 1, max: 80 }),
  eventDate: dateStringSchema,
  guestCount: z
    .number()
    .int("Guest count must be an integer")
    .min(1, "Guest count must be at least 1")
    .max(5000, "Guest count cannot exceed 5000 guests"),
  budget: PlanBudgetInputSchema,
  venueType: VenueTypeSchema,
  locationNote: boundedText({ min: 1, max: 120 }).optional(),
  cultureOrTradition: boundedText({ min: 1, max: 120 }).optional(),
  style: boundedText({ min: 1, max: 120 }).optional(),
  dietary: z
    .array(boundedText({ min: 1, max: 40 }))
    .max(10)
    .default([]),
  accessibilityNeeds: z
    .array(boundedText({ min: 1, max: 60 }))
    .max(10)
    .default([]),
  mustHaves: boundedText({ min: 1, max: 300, allowNewlines: true }).optional(),
  avoid: boundedText({ min: 1, max: 300, allowNewlines: true }).optional(),
  priorities: z.record(CategoryIdSchema, PriorityValueSchema).default({}),
  ageGroupNote: boundedText({ min: 1, max: 60 }).optional(),
  occasionNote: boundedText({ min: 1, max: 300, allowNewlines: true }).optional(),
});

/**
 * Inferred type of user event plan inputs.
 */
export type PlanInput = z.infer<typeof PlanInputSchema>;
