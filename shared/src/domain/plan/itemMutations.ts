import type { Plan } from "../../contracts/plan.js";
import { PlanSchema } from "../../contracts/plan.js";
import { applyIdeaConstraints } from "../ideas/applyIdeaConstraints.js";
import { buildTimeline } from "../timeline/buildTimeline.js";

/**
 * Pure mutation toggling the completion status of a timeline milestone.
 * Automatically recalculates milestone execution statuses (e.g. overdue, due_soon, at_risk).
 *
 * @param plan Active celebration plan.
 * @param milestoneId Target milestone identifier.
 * @param now Reference timestamp for status evaluation and updatedAt.
 * @returns Updated Plan with refreshed milestone statuses.
 */
export function toggleMilestone(plan: Plan, milestoneId: string, now: Date | string): Plan {
  const updatedIso = typeof now === "string" ? new Date(now).toISOString() : now.toISOString();

  const nextMilestones = plan.timeline.milestones.map((m) =>
    m.id === milestoneId ? { ...m, done: !m.done } : m
  );

  const doneIds = new Set(nextMilestones.filter((m) => m.done).map((m) => m.id));
  const nextTimeline = buildTimeline(plan.input, now, doneIds);

  const nextPlan: Plan = {
    ...plan,
    updatedAt: updatedIso,
    timeline: nextTimeline,
  };

  return PlanSchema.parse(nextPlan);
}

/**
 * Pure mutation toggling the completion status of a vendor checklist task.
 *
 * @param plan Active celebration plan.
 * @param itemId Checklist item identifier.
 * @param now Reference timestamp for updatedAt.
 * @returns Updated Plan with modified checklist state.
 */
export function toggleChecklistItem(plan: Plan, itemId: string, now: Date | string): Plan {
  const updatedIso = typeof now === "string" ? new Date(now).toISOString() : now.toISOString();

  const nextChecklist = plan.checklist.map((item) =>
    item.id === itemId ? { ...item, done: !item.done } : item
  );

  const nextPlan: Plan = {
    ...plan,
    updatedAt: updatedIso,
    checklist: nextChecklist,
  };

  return PlanSchema.parse(nextPlan);
}

/**
 * Pure mutation toggling the pinned state of an idea and re-ranking the ideas list.
 *
 * @param plan Active celebration plan.
 * @param ideaId Target idea identifier.
 * @param now Reference timestamp for updatedAt.
 * @returns Updated Plan with prioritized idea order.
 */
export function pinIdea(plan: Plan, ideaId: string, now: Date | string): Plan {
  const isPinned = plan.pinnedIdeaIds.includes(ideaId);
  const nextPinnedIds = isPinned
    ? plan.pinnedIdeaIds.filter((id) => id !== ideaId)
    : [...plan.pinnedIdeaIds, ideaId];

  const updatedIdeas = applyIdeaConstraints(plan.ideas, {
    input: plan.input,
    budget: plan.budget,
    pinnedIdeaIds: nextPinnedIds,
  });

  const updatedIso = typeof now === "string" ? new Date(now).toISOString() : now.toISOString();

  const nextPlan: Plan = {
    ...plan,
    updatedAt: updatedIso,
    pinnedIdeaIds: nextPinnedIds,
    ideas: updatedIdeas,
  };

  return PlanSchema.parse(nextPlan);
}

/**
 * Pure mutation rejecting/discarding an idea from the plan's recommendation list.
 *
 * @param plan Active celebration plan.
 * @param ideaId Unique identifier of idea to discard.
 * @param now Reference timestamp for updatedAt.
 * @returns Updated Plan omitting the rejected idea.
 */
export function rejectIdea(plan: Plan, ideaId: string, now: Date | string): Plan {
  const nextIdeas = plan.ideas.filter((i) => i.id !== ideaId);
  const nextPinnedIds = plan.pinnedIdeaIds.filter((id) => id !== ideaId);

  const updatedIso = typeof now === "string" ? new Date(now).toISOString() : now.toISOString();

  const nextPlan: Plan = {
    ...plan,
    updatedAt: updatedIso,
    ideas: nextIdeas,
    pinnedIdeaIds: nextPinnedIds,
  };

  return PlanSchema.parse(nextPlan);
}
