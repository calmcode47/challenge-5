import type { CategoryId } from "../../contracts/enums.js";
import type { Plan } from "../../contracts/plan.js";
import { minorDigits } from "../../contracts/primitives.js";

/**
 * Printable representation of a single budget line row.
 */
export interface PrintBudgetLine {
  readonly categoryId: CategoryId;
  readonly categoryLabel: string;
  readonly allocatedFormatted: string;
  readonly actualFormatted: string;
  readonly sharePctFormatted: string;
  readonly status: string;
}

/**
 * Printable representation of a scheduled timeline milestone.
 */
export interface PrintMilestone {
  readonly id: string;
  readonly title: string;
  readonly dueDate: string;
  readonly leadDays: number;
  readonly status: string;
  readonly done: boolean;
  readonly critical: boolean;
}

/**
 * Printable representation of a category-specific checklist item.
 */
export interface PrintChecklistItem {
  readonly id: string;
  readonly categoryId: CategoryId;
  readonly text: string;
  readonly kind: string;
  readonly done: boolean;
}

/**
 * Printable representation of a curated vendor record.
 */
export interface PrintVendor {
  readonly id: string;
  readonly name: string;
  readonly categoryId: CategoryId;
  readonly stage: string;
  readonly quoteFormatted?: string;
  readonly paidFormatted?: string;
  readonly contact?: string;
}

/**
 * Printable representation of a pinned celebration idea.
 */
export interface PrintIdea {
  readonly id: string;
  readonly title: string;
  readonly categoryId: CategoryId;
  readonly rationale: string;
  readonly estimateFormatted: string;
  readonly effort: string;
}

/**
 * Structured plain-data projection of a celebration plan optimized for print and PDF generation.
 * Contains pre-formatted currency amounts and grouped domain sections with zero HTML or DOM dependencies.
 */
export interface PrintModel {
  readonly meta: {
    readonly title: string;
    readonly eventType: string;
    readonly eventDate: string;
    readonly guestCount: number;
    readonly venueType: string;
    readonly locationNote?: string;
    readonly style?: string;
    readonly cultureOrTradition?: string;
    readonly dietary: readonly string[];
    readonly accessibilityNeeds: readonly string[];
  };
  readonly budget: {
    readonly currency: string;
    readonly totalFormatted: string;
    readonly perGuestFormatted: string;
    readonly lines: readonly PrintBudgetLine[];
  };
  readonly timeline: {
    readonly eventDate: string;
    readonly daysAvailable: number;
    readonly tightness: string;
    readonly milestones: readonly PrintMilestone[];
  };
  readonly checklist: {
    readonly totalTasks: number;
    readonly completedTasks: number;
    readonly items: readonly PrintChecklistItem[];
  };
  readonly vendors: readonly PrintVendor[];
  readonly pinnedIdeas: readonly PrintIdea[];
  readonly narrative?: string;
  readonly provenance: {
    readonly baseline: string;
    readonly enrichment: string;
  };
}

function formatCurrency(minor: number, currency: string): string {
  const digits = minorDigits(currency);
  const factor = Math.pow(10, digits);
  const decimal = (minor / factor).toFixed(digits);
  return `${currency} ${decimal}`;
}

function formatCategoryLabel(cat: string): string {
  return cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildPrintBudget(budget: Plan["budget"]): PrintModel["budget"] {
  const currency = budget.currency;
  const lines: PrintBudgetLine[] = budget.lines.map((l) => ({
    categoryId: l.categoryId,
    categoryLabel: formatCategoryLabel(l.categoryId),
    allocatedFormatted: formatCurrency(l.allocatedMinor, currency),
    actualFormatted: formatCurrency(l.actualMinor, currency),
    sharePctFormatted: `${l.sharePct.toFixed(1)}%`,
    status: l.status,
  }));

  return {
    currency,
    totalFormatted: formatCurrency(budget.totalMinor, currency),
    perGuestFormatted: formatCurrency(budget.perGuestMinor, currency),
    lines,
  };
}

function buildPrintTimeline(timeline: Plan["timeline"]): PrintModel["timeline"] {
  const milestones: PrintMilestone[] = timeline.milestones.map((m) => ({
    id: m.id,
    title: m.title,
    dueDate: m.dueDate,
    leadDays: m.leadDays,
    status: m.status,
    done: m.done,
    critical: m.critical,
  }));

  return {
    eventDate: timeline.eventDate,
    daysAvailable: timeline.daysAvailable,
    tightness: timeline.tightness,
    milestones,
  };
}

function buildPrintChecklist(checklist: Plan["checklist"]): PrintModel["checklist"] {
  const items: PrintChecklistItem[] = checklist.map((c) => ({
    id: c.id,
    categoryId: c.categoryId,
    text: c.text,
    kind: c.kind,
    done: c.done,
  }));

  return {
    totalTasks: checklist.length,
    completedTasks: checklist.filter((i) => i.done).length,
    items,
  };
}

function buildPrintVendors(vendors: Plan["vendors"], currency: string): readonly PrintVendor[] {
  return vendors.map((v) => ({
    id: v.id,
    name: v.name,
    categoryId: v.categoryId,
    stage: v.stage,
    quoteFormatted: v.quoteMinor !== undefined ? formatCurrency(v.quoteMinor, currency) : undefined,
    paidFormatted: v.paidMinor !== undefined ? formatCurrency(v.paidMinor, currency) : undefined,
    contact: v.contact,
  }));
}

function buildPrintPinnedIdeas(
  ideas: Plan["ideas"],
  pinnedIdeaIds: readonly string[],
  currency: string
): readonly PrintIdea[] {
  const pinnedSet = new Set(pinnedIdeaIds);
  return ideas
    .filter((idea) => pinnedSet.has(idea.id))
    .map((idea) => {
      const minFmt = formatCurrency(idea.estimateMinor.min, currency);
      const maxFmt = formatCurrency(idea.estimateMinor.max, currency);
      return {
        id: idea.id,
        title: idea.title,
        categoryId: idea.categoryId,
        rationale: idea.rationale,
        estimateFormatted: `${minFmt} - ${maxFmt}`,
        effort: idea.effort,
      };
    });
}

/**
 * Pure projection transforming a Plan into a decoupled, structured PrintModel.
 *
 * @param plan Active celebration plan.
 * @returns Fully formatted PrintModel data structure ready for print rendering.
 */
export function buildPrintModel(plan: Plan): PrintModel {
  const currency = plan.budget.currency;

  return {
    meta: {
      title: plan.input.title,
      eventType: plan.input.eventType,
      eventDate: plan.input.eventDate,
      guestCount: plan.input.guestCount,
      venueType: plan.input.venueType,
      locationNote: plan.input.locationNote,
      style: plan.input.style,
      cultureOrTradition: plan.input.cultureOrTradition,
      dietary: [...plan.input.dietary],
      accessibilityNeeds: [...plan.input.accessibilityNeeds],
    },
    budget: buildPrintBudget(plan.budget),
    timeline: buildPrintTimeline(plan.timeline),
    checklist: buildPrintChecklist(plan.checklist),
    vendors: buildPrintVendors(plan.vendors, currency),
    pinnedIdeas: buildPrintPinnedIdeas(plan.ideas, plan.pinnedIdeaIds, currency),
    narrative: plan.narrative,
    provenance: {
      baseline: plan.provenance.baseline,
      enrichment: plan.provenance.enrichment,
    },
  };
}
