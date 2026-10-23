import type { MilestoneStatus } from "../../contracts/enums.js";
import type { Milestone, PlanWarning } from "../../contracts/planComponents.js";
import { daysBetween, toIsoDate } from "./dateMath.js";
import type { ScheduledMilestone } from "./compress.js";

/**
 * Options for computing status and diagnostic warnings across scheduled milestones.
 */
export interface StatusOptions {
  readonly now: Date | string;
  readonly eventDate: string;
  readonly factor: number;
  readonly scheduled: readonly ScheduledMilestone[];
  readonly doneIds?: ReadonlySet<string>;
}

/**
 * Result containing fully realized milestones and schedule warnings.
 */
export interface RealizedTimeline {
  readonly milestones: readonly Milestone[];
  readonly warnings: readonly PlanWarning[];
}

function toDateString(val: Date | string): string {
  if (typeof val === "string") {
    return val.trim().slice(0, 10);
  }
  return toIsoDate(val);
}

function findOverdueIds(
  scheduled: readonly ScheduledMilestone[],
  nowIso: string,
  doneIds?: ReadonlySet<string>
): Set<string> {
  const overdueIds = new Set<string>();
  for (const s of scheduled) {
    const isDone = doneIds?.has(s.template.id) ?? false;
    if (!isDone && s.dueDate <= nowIso) {
      overdueIds.add(s.template.id);
    }
  }
  return overdueIds;
}

function deriveMilestoneStatus(
  dueDate: string,
  dependsOn: readonly string[],
  nowIso: string,
  isDone: boolean,
  overdueIds: ReadonlySet<string>
): MilestoneStatus {
  if (isDone) {
    return "done";
  }
  if (dueDate <= nowIso) {
    return "overdue";
  }
  const hasOverdueDep = dependsOn.some((depId) => overdueIds.has(depId));
  if (hasOverdueDep) {
    return "at_risk";
  }
  if (daysBetween(nowIso, dueDate) <= 7) {
    return "due_soon";
  }
  return "upcoming";
}

function realizeMilestones(
  scheduled: readonly ScheduledMilestone[],
  nowIso: string,
  doneIds?: ReadonlySet<string>
): Milestone[] {
  const overdueIds = findOverdueIds(scheduled, nowIso, doneIds);
  const milestones: Milestone[] = [];

  for (const s of scheduled) {
    const isDone = doneIds?.has(s.template.id) ?? false;
    const status = deriveMilestoneStatus(
      s.dueDate,
      s.template.dependsOn,
      nowIso,
      isDone,
      overdueIds
    );

    const milestone: Milestone = {
      id: s.template.id,
      title: s.template.titleKey,
      dueDate: s.dueDate,
      leadDays: s.leadDays,
      dependsOn: [...s.template.dependsOn],
      critical: s.template.critical,
      status,
      done: isDone,
    };
    if (s.template.categoryId) {
      milestone.categoryId = s.template.categoryId;
    }
    milestones.push(milestone);
  }

  return milestones;
}

function computeDiagnosticWarnings(
  milestones: readonly Milestone[],
  rawDiff: number,
  factor: number,
  nowIso: string
): PlanWarning[] {
  const warnings: PlanWarning[] = [];
  if (rawDiff < 0) {
    warnings.push({
      code: "EVENT_DATE_PAST",
      messageKey: "timeline.warning.event_date_past",
    });
  }
  if (factor < 1.0 && rawDiff >= 0) {
    warnings.push({
      code: "TIMELINE_COMPRESSED",
      messageKey: "timeline.warning.compressed",
      params: { factor: Math.round(factor * 100) / 100 },
    });
  }
  const immediateCount = milestones.filter((m) => !m.done && m.dueDate <= nowIso).length;
  if (immediateCount > 0) {
    warnings.push({
      code: "START_IMMEDIATELY",
      messageKey: "timeline.warning.start_immediately",
      params: { count: immediateCount },
    });
  }
  return warnings;
}

/**
 * Computes individual milestone statuses and global timeline diagnostics.
 *
 * @param options Timing, milestones, and user completion tracking options.
 * @returns Realized milestones with statuses and generated warnings.
 */
export function computeTimelineStatuses(options: StatusOptions): RealizedTimeline {
  const { now, eventDate, factor, scheduled, doneIds } = options;
  const nowIso = toDateString(now);

  const milestones = realizeMilestones(scheduled, nowIso, doneIds);
  const warnings = computeDiagnosticWarnings(
    milestones,
    daysBetween(nowIso, eventDate),
    factor,
    nowIso
  );

  return { milestones, warnings };
}
