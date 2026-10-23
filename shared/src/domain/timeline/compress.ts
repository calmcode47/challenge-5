import type { TimelineTightness } from "../../contracts/enums.js";
import { addDays, daysBetween } from "./dateMath.js";
import type { MilestoneTemplate } from "./templates.js";

/**
 * Result of scheduling milestone dates and compressing lead times.
 */
export interface CompressionResult {
  readonly factor: number;
  readonly tightness: TimelineTightness;
  readonly daysAvailable: number;
  readonly scheduledMilestones: readonly ScheduledMilestone[];
}

/**
 * Intermediate scheduled milestone with calculated dueDate and scaled leadDays.
 */
export interface ScheduledMilestone {
  readonly template: MilestoneTemplate;
  readonly dueDate: string;
  readonly leadDays: number;
}

/**
 * Topologically sorts milestone templates based on their dependency declarations.
 * Detects circular dependencies and throws an error if any cycle exists.
 *
 * @param templates Array of milestone templates.
 * @returns Topologically sorted array with dependencies preceding dependents.
 */
export function topologicalSortTemplates(
  templates: readonly MilestoneTemplate[]
): readonly MilestoneTemplate[] {
  const templateMap = new Map<string, MilestoneTemplate>(templates.map((t) => [t.id, t]));
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const sorted: MilestoneTemplate[] = [];

  function visit(id: string): void {
    if (visiting.has(id)) {
      throw new Error(`Circular dependency detected in milestone templates involving "${id}".`);
    }
    if (visited.has(id)) {
      return;
    }

    visiting.add(id);
    const item = templateMap.get(id);
    if (!item) {
      throw new Error(`Unknown dependency "${id}".`);
    }
    for (const depId of item.dependsOn) {
      visit(depId);
    }
    visited.add(id);
    sorted.push(item);
    visiting.delete(id);
  }

  for (const t of templates) {
    if (!visited.has(t.id)) {
      visit(t.id);
    }
  }

  return sorted;
}

function deriveTightness(factor: number): TimelineTightness {
  if (factor >= 0.75) {
    return "comfortable";
  }
  if (factor >= 0.4) {
    return "tight";
  }
  return "very_tight";
}

function computeRawDueDate(
  t: MilestoneTemplate,
  eventDate: string,
  daysAvailable: number,
  factor: number,
  isPast: boolean
): string {
  if (t.leadDays <= 0 || isPast) {
    return addDays(eventDate, -t.leadDays);
  }
  if (daysAvailable === 0) {
    return eventDate;
  }
  if (factor >= 1.0) {
    return addDays(eventDate, -t.leadDays);
  }
  const scaledLead = Math.min(daysAvailable, Math.max(1, Math.round(t.leadDays * factor)));
  return addDays(eventDate, -scaledLead);
}

function enforceDependencies(
  rawDueDate: string,
  t: MilestoneTemplate,
  eventDate: string,
  isPast: boolean,
  scheduledMap: Map<string, ScheduledMilestone>
): string {
  if (isPast || t.leadDays <= 0) {
    return rawDueDate;
  }
  let dueDate = rawDueDate;
  for (const depId of t.dependsOn) {
    const dep = scheduledMap.get(depId);
    if (dep && dueDate < dep.dueDate) {
      dueDate = dep.dueDate;
    }
  }
  if (dueDate > eventDate) {
    dueDate = eventDate;
  }
  return dueDate;
}

/**
 * Schedules milestones backwards from eventDate, scaling lead days when time is constrained
 * while strictly preserving dependency ordering (due(dependent) >= due(dependency)).
 *
 * @param templates Milestone templates for the event.
 * @param eventDate Target ISO event date.
 * @param now Reference current date or ISO date string.
 * @returns CompressionResult with factor, tightness, and scheduled milestones.
 */
export function compressTimeline(
  templates: readonly MilestoneTemplate[],
  eventDate: string,
  now: Date | string
): CompressionResult {
  const rawDiff = daysBetween(now, eventDate);
  const isPast = rawDiff < 0;
  const daysAvailable = Math.max(0, rawDiff);

  const positiveLeads = templates.filter((t) => t.leadDays > 0).map((t) => t.leadDays);
  const maxLead = positiveLeads.length > 0 ? Math.max(...positiveLeads) : 0;

  let factor = 1.0;
  if (isPast) {
    factor = 0.0;
  } else if (maxLead > 0) {
    factor = daysAvailable >= maxLead ? 1.0 : Math.max(0, daysAvailable / maxLead);
  }

  const tightness = deriveTightness(factor);
  const sortedTemplates = topologicalSortTemplates(templates);
  const scheduledMap = new Map<string, ScheduledMilestone>();
  const scheduledMilestones: ScheduledMilestone[] = [];

  for (const t of sortedTemplates) {
    const rawDue = computeRawDueDate(t, eventDate, daysAvailable, factor, isPast);
    const dueDate = enforceDependencies(rawDue, t, eventDate, isPast, scheduledMap);
    const effectiveLeadDays = daysBetween(dueDate, eventDate);
    const scheduled: ScheduledMilestone = {
      template: t,
      dueDate,
      leadDays: effectiveLeadDays,
    };
    scheduledMap.set(t.id, scheduled);
    scheduledMilestones.push(scheduled);
  }

  return {
    factor,
    tightness,
    daysAvailable,
    scheduledMilestones,
  };
}
