import { z } from "zod";
import { boundedText, idSchema, isoDateTimeSchema, moneyAmountSchema } from "./primitives.js";
import { CategoryIdSchema, ChecklistKindSchema } from "./enums.js";
import { PriorityValueSchema } from "./planInput.js";

/**
 * Message participant roles in assistant conversations.
 */
export const ChatMessageRoleSchema = z.union([
  z.literal("user"),
  z.literal("assistant"),
  z.literal("system"),
]);

/**
 * Inferred type of chat participant role.
 */
export type ChatMessageRole = z.infer<typeof ChatMessageRoleSchema>;

/**
 * Single message exchange item in the planning assistant transcript.
 */
export const ChatMessageSchema = z.object({
  id: idSchema,
  role: ChatMessageRoleSchema,
  content: boundedText({ min: 1, max: 4000, allowNewlines: true }),
  timestamp: isoDateTimeSchema,
});

/**
 * Inferred type of a chat message.
 */
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

/**
 * Action proposing a budget reallocation between two categories.
 */
export const ShiftBudgetActionSchema = z.object({
  type: z.literal("shift_budget"),
  label: boundedText({ min: 1, max: 100 }),
  from: CategoryIdSchema,
  to: CategoryIdSchema,
  amountMinor: moneyAmountSchema.refine((val) => val > 0, {
    message: "Shift amount must be strictly greater than zero",
  }),
});

/**
 * Inferred type of a shift budget action.
 */
export type ShiftBudgetAction = z.infer<typeof ShiftBudgetActionSchema>;

/**
 * Action proposing the addition of a new timeline milestone.
 */
export const AddMilestoneActionSchema = z.object({
  type: z.literal("add_milestone"),
  label: boundedText({ min: 1, max: 100 }),
  title: boundedText({ min: 1, max: 120 }),
  categoryId: CategoryIdSchema.optional(),
  leadDays: z.number().int("Lead days must be an integer"),
});

/**
 * Inferred type of an add milestone action.
 */
export type AddMilestoneAction = z.infer<typeof AddMilestoneActionSchema>;

/**
 * Action proposing the addition of a checklist task.
 */
export const AddChecklistItemActionSchema = z.object({
  type: z.literal("add_checklist_item"),
  label: boundedText({ min: 1, max: 100 }),
  categoryId: CategoryIdSchema,
  kind: ChecklistKindSchema,
  text: boundedText({ min: 1, max: 200 }),
});

/**
 * Inferred type of an add checklist item action.
 */
export type AddChecklistItemAction = z.infer<typeof AddChecklistItemActionSchema>;

/**
 * Action proposing pinning an idea to the user's plan.
 */
export const PinIdeaActionSchema = z.object({
  type: z.literal("pin_idea"),
  label: boundedText({ min: 1, max: 100 }),
  ideaId: idSchema,
});

/**
 * Inferred type of a pin idea action.
 */
export type PinIdeaAction = z.infer<typeof PinIdeaActionSchema>;

/**
 * Action proposing setting priority rating for a category.
 */
export const SetPriorityActionSchema = z.object({
  type: z.literal("set_priority"),
  label: boundedText({ min: 1, max: 100 }),
  categoryId: CategoryIdSchema,
  value: PriorityValueSchema,
});

/**
 * Inferred type of a set priority action.
 */
export type SetPriorityAction = z.infer<typeof SetPriorityActionSchema>;

/**
 * Discriminated union of assistant proposed actions.
 * Evaluated and applied through pure domain engine functions upon user acceptance.
 */
export const SuggestedActionSchema = z.discriminatedUnion("type", [
  ShiftBudgetActionSchema,
  AddMilestoneActionSchema,
  AddChecklistItemActionSchema,
  PinIdeaActionSchema,
  SetPriorityActionSchema,
]);

/**
 * Inferred type of an assistant suggested action.
 */
export type SuggestedAction = z.infer<typeof SuggestedActionSchema>;
