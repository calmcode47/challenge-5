import type { CategoryId, IdeaEffort } from "../../contracts/enums.js";
import type { Idea } from "../../contracts/planComponents.js";
import type { PlanInput } from "../../contracts/planInput.js";
import { referencesUserInput } from "./referencesUserInput.js";

/**
 * Minimal structural slice of a celebration plan required to enforce idea domain constraints.
 */
export interface PlanContextForIdeas {
  readonly input: PlanInput;
  readonly budget: {
    readonly lines: readonly {
      readonly categoryId: CategoryId;
      readonly allocatedMinor: number;
      readonly actualMinor: number;
    }[];
  };
  readonly pinnedIdeaIds: readonly string[];
}

/**
 * Maximum quantity of ideas retained in a plan to bound DOM rendering and payload footprint.
 */
export const MAX_IDEAS_LIMIT = 50;

const EFFORT_RANK: Record<IdeaEffort, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

function normalizeTitleKey(title: string): string {
  return title.trim().toLowerCase().replace(/\s+/g, " ");
}

function calculateCategoryHeadroom(plan: PlanContextForIdeas): Map<CategoryId, number> {
  const headroomMap = new Map<CategoryId, number>();
  for (const line of plan.budget.lines) {
    const unallocated = Math.max(0, line.allocatedMinor - line.actualMinor);
    headroomMap.set(line.categoryId, unallocated);
  }
  return headroomMap;
}

function compareIdeas(a: Idea, b: Idea, pinnedSet: ReadonlySet<string>): number {
  const aPinned = pinnedSet.has(a.id) ? 1 : 0;
  const bPinned = pinnedSet.has(b.id) ? 1 : 0;
  if (aPinned !== bPinned) {
    return bPinned - aPinned;
  }

  const aFits = a.fitsBudget ? 1 : 0;
  const bFits = b.fitsBudget ? 1 : 0;
  if (aFits !== bFits) {
    return bFits - aFits;
  }

  const aEffort = EFFORT_RANK[a.effort];
  const bEffort = EFFORT_RANK[b.effort];
  if (aEffort !== bEffort) {
    return aEffort - bEffort;
  }

  return a.title.localeCompare(b.title);
}

/**
 * Applies deterministic business rules and budget constraints to celebration ideas.
 *
 * Invariants & Transformations:
 * 1. Drops any idea whose rationale fails to reference at least one user context token.
 * 2. Recomputes `fitsBudget` based on category headroom (allocatedMinor - actualMinor).
 * 3. Deduplicates ideas by normalized title (case-insensitive, whitespace-collapsed).
 * 4. Limits retained ideas to `maxIdeas` (default 50) to prevent denial-of-service / oversized payloads.
 * 5. Sorts results deterministically: pinned first -> fits budget -> lower effort -> alphabetical title.
 *
 * @param ideas Candidate ideas from baseline logic or AI enrichment.
 * @param plan Context containing user inputs, allocated budget lines, and pinned selections.
 * @param maxIdeas Maximum number of constrained ideas to return (default: 50).
 * @returns Array of validated, deduplicated, and ranked Idea objects.
 */
export function applyIdeaConstraints(
  ideas: readonly Idea[],
  plan: PlanContextForIdeas,
  maxIdeas: number = MAX_IDEAS_LIMIT
): Idea[] {
  const categoryHeadroom = calculateCategoryHeadroom(plan);
  const pinnedSet = new Set(plan.pinnedIdeaIds);
  const seenTitles = new Set<string>();
  const processed: Idea[] = [];

  for (const idea of ideas) {
    if (!referencesUserInput(idea.rationale, plan.input)) {
      continue;
    }

    const titleKey = normalizeTitleKey(idea.title);
    if (seenTitles.has(titleKey)) {
      continue;
    }
    seenTitles.add(titleKey);

    const headroom = categoryHeadroom.get(idea.categoryId) ?? 0;
    const fitsBudget = idea.estimateMinor.max <= headroom;

    processed.push({
      ...idea,
      fitsBudget,
    });
  }

  processed.sort((a, b) => compareIdeas(a, b, pinnedSet));

  if (processed.length > maxIdeas) {
    return processed.slice(0, maxIdeas);
  }
  return processed;
}
