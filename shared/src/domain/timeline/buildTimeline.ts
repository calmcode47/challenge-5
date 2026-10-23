import type { PlanInput } from "../../contracts/planInput.js";
import { TimelinePlanSchema, type TimelinePlan } from "../../contracts/planComponents.js";
import { getMilestoneTemplates } from "./templates.js";
import { compressTimeline } from "./compress.js";
import { computeTimelineStatuses } from "./status.js";

/**
 * Builds a complete timeline plan backward from the user's event date.
 * Compress lead days if timeline is constrained while strictly preserving topological dependency
 * order (due(dependent) >= due(dependency)) and assigns execution statuses.
 *
 * @param input Validated user event configuration and target date.
 * @param now Reference current date or ISO date string (for pure time injection).
 * @param doneIds Optional set of milestone IDs already completed by the user.
 * @returns Fully validated TimelinePlan conforming to TimelinePlanSchema.
 */
export function buildTimeline(
  input: PlanInput,
  now: Date | string,
  doneIds?: ReadonlySet<string>
): TimelinePlan {
  const templates = getMilestoneTemplates(input.eventType);
  const compression = compressTimeline(templates, input.eventDate, now);

  const { milestones, warnings } = computeTimelineStatuses({
    now,
    eventDate: input.eventDate,
    factor: compression.factor,
    scheduled: compression.scheduledMilestones,
    doneIds,
  });

  // Sort milestones by dueDate ascending; stable sort preserves template order for equal dates
  const sortedMilestones = [...milestones].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const rawPlan: TimelinePlan = {
    eventDate: input.eventDate,
    daysAvailable: compression.daysAvailable,
    compressionFactor: compression.factor,
    tightness: compression.tightness,
    milestones: sortedMilestones,
    warnings: [...warnings],
  };

  return TimelinePlanSchema.parse(rawPlan);
}
