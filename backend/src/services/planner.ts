import { createHash, randomUUID } from "node:crypto";
import type {
  BudgetAllocation,
  GeneratedPlan,
  PlanRequest,
  TimelineTask,
} from "../domain/contracts.js";

const BASE_SPLITS = [
  ["Venue & rentals", 0.26],
  ["Food & beverage", 0.28],
  ["Design & florals", 0.1],
  ["Photography & entertainment", 0.12],
  ["Stationery & guest care", 0.05],
  ["Contingency", 0.12],
] as const;

function roundCurrency(amount: number): number {
  return Math.round(amount * 100) / 100;
}

function safeDate(date: string): Date {
  return new Date(`${date}T12:00:00.000Z`);
}

function dateBefore(date: Date, days: number): string {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() - days);
  return copy.toISOString().slice(0, 10);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Keeps urgent plans actionable by never assigning a milestone to an already-past date. */
function actionableDueDate(eventDate: Date, daysBefore: number): string {
  return [dateBefore(eventDate, daysBefore), today()].sort().at(-1) ?? today();
}

function allocationFor(request: PlanRequest): BudgetAllocation[] {
  const shifts: Record<PlanRequest["eventType"], readonly [number, number]> = {
    wedding: [0.01, -0.01],
    milestone: [-0.02, 0.02],
    community: [-0.04, 0.04],
    anniversary: [0.02, -0.02],
  };
  const [venueShift, foodShift] = shifts[request.eventType];
  const totalPercent = BASE_SPLITS.reduce((total, [, percent], index) => {
    if (index === 0) return total + percent + venueShift;
    if (index === 1) return total + percent + foodShift;
    return total + percent;
  }, 0);

  const allocations = BASE_SPLITS.map(([category, basePercent], index) => {
    const percent =
      index === 0
        ? basePercent + venueShift
        : index === 1
          ? basePercent + foodShift
          : basePercent;
    return {
      category,
      percent: Math.round(percent * 100),
      amount: roundCurrency(request.budget * (percent / totalPercent)),
    };
  });
  const finalAllocation = allocations.at(-1);
  if (finalAllocation) {
    const roundingDifference = roundCurrency(
      request.budget - allocations.reduce((sum, item) => sum + item.amount, 0),
    );
    finalAllocation.amount = roundCurrency(
      finalAllocation.amount + roundingDifference,
    );
  }
  return allocations;
}

function timelineFor(request: PlanRequest): TimelineTask[] {
  const eventDate = safeDate(request.date);
  return [
    {
      phase: "Foundation",
      due: actionableDueDate(eventDate, 180),
      task: "Confirm venue terms, capacity, access route, and deposit schedule.",
      owner: "Planner",
    },
    {
      phase: "Supplier lock",
      due: actionableDueDate(eventDate, 120),
      task: "Compare insured vendors against the brief and secure priority contracts.",
      owner: "Planner",
    },
    {
      phase: "Guest care",
      due: actionableDueDate(eventDate, 75),
      task: `Publish RSVP flow and collect dietary and access needs for ${String(request.guestCount)} guests.`,
      owner: "Host",
    },
    {
      phase: "Experience",
      due: actionableDueDate(eventDate, 45),
      task: "Approve floor plan, run-of-show, weather response, and communications tree.",
      owner: "Coordinator",
    },
    {
      phase: "Final pass",
      due: actionableDueDate(eventDate, 14),
      task: "Reconfirm vendors, balances, contacts, transport, and emergency kit.",
      owner: "Planner",
    },
    {
      phase: "Event day",
      due: request.date,
      task: "Run the host briefing, vendor check-in, and closing reconciliation.",
      owner: "Coordinator",
    },
  ];
}

function vendorsFor(request: PlanRequest): string[] {
  const tasks = [
    "Request a written quote with taxes, service fees, cancellation terms, and payment milestones.",
    "Verify insurance, permits, accessibility readiness, and a named on-site contact.",
    "Ask for a setup and strike schedule that protects the venue and guest flow.",
    "Document dietary, safeguarding, and emergency escalation procedures before final payment.",
  ];
  if (request.accessibility.allergenAware)
    tasks.push(
      "Require an allergen matrix, cross-contact plan, and clearly labeled service layout.",
    );
  if (request.accessibility.stepFreeAccess)
    tasks.push(
      "Confirm step-free arrival, restroom access, seating clearances, and an accessible evacuation path.",
    );
  if (request.accessibility.weatherBackup)
    tasks.push(
      "Obtain a weather pivot plan with trigger time, rain-site layout, and equipment responsibility.",
    );
  return tasks;
}

function ideasFor(request: PlanRequest): string[] {
  const theme =
    request.eventType === "community"
      ? "neighbourhood maker table"
      : request.eventType === "milestone"
        ? "memory-table ritual"
        : request.eventType === "anniversary"
          ? "shared-story toast"
          : "welcome-note keepsake";
  const ideas = [
    `Create a ${theme} that lets guests contribute a small, meaningful detail without slowing the schedule.`,
    `Use ${request.venue} as a planning anchor: frame one arrival moment, one gathering moment, and one quiet reset area.`,
    `Keep the experience intentional with a per-guest working budget of $${(request.budget / request.guestCount).toFixed(2)} and one protected contingency envelope.`,
  ];
  const normalizedNotes = request.notes.toLowerCase();
  if (/\b(cultural|tradition|heritage|ceremony)\b/u.test(normalizedNotes)) {
    ideas.push(
      "Reserve a named place in the run-of-show for a host-led tradition, with timing and participation confirmed in advance.",
    );
  } else if (/\b(children|family|kid|child)\b/u.test(normalizedNotes)) {
    ideas.push(
      "Create a supervised family-friendly activity zone that stays visible from the main gathering without interrupting the programme.",
    );
  } else if (
    /\b(sustainable|sustainability|local|low[ -]?waste)\b/u.test(
      normalizedNotes,
    )
  ) {
    ideas.push(
      "Prioritize reusable serviceware, local sourcing, and a clear vendor plan for donating or composting safe surplus.",
    );
  }
  return ideas;
}

function risksFor(request: PlanRequest): string[] {
  const flags = [
    "Hold at least 12% of the budget as contingency until final vendor balances are confirmed.",
  ];
  if (request.budget / request.guestCount < 45)
    flags.push(
      "The per-guest budget is lean; prioritize food, safety, and essentials before decorative upgrades.",
    );
  if (request.accessibility.lowSensoryOption)
    flags.push(
      "Assign a clearly signed low-sensory reset area and keep the audio escalation contact in the run-of-show.",
    );
  if (safeDate(request.date).getTime() - Date.now() < 1000 * 60 * 60 * 24 * 30)
    flags.push(
      "The date is within 30 days; confirm vendor availability and payment due dates immediately.",
    );
  return flags;
}

export function requestFingerprint(request: PlanRequest): string {
  return createHash("sha256").update(JSON.stringify(request)).digest("hex");
}

/** Produces the operational plan deterministically, so it remains usable during AI outages. */
export function createDeterministicPlan(request: PlanRequest): GeneratedPlan {
  return {
    id: randomUUID(),
    title: request.title,
    eventType: request.eventType,
    date: request.date,
    guestCount: request.guestCount,
    budget: request.budget,
    venue: request.venue,
    budgetAllocation: allocationFor(request),
    timeline: timelineFor(request),
    vendorChecklist: vendorsFor(request),
    personalizedIdeas: ideasFor(request),
    riskFlags: risksFor(request),
    aiMode: "deterministic",
    generatedAt: new Date().toISOString(),
  };
}
