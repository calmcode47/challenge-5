import type { Enrichment } from "../../contracts/enrichment.js";
import type { Plan } from "../../contracts/plan.js";

/**
 * Baseline plan fixture for enrichment merge and invariant validation unit tests.
 */
export const BASE_PLAN: Plan = {
  id: "plan-test-123",
  schemaVersion: 1,
  createdAt: "2026-10-23T12:00:00.000Z",
  updatedAt: "2026-10-23T12:00:00.000Z",
  input: {
    eventType: "wedding",
    title: "Ananya & Rohan Vow Renewal",
    eventDate: "2027-08-20",
    guestCount: 100,
    budget: { currency: "USD", totalMinor: 1000000 },
    venueType: "outdoor",
    style: "traditional garden",
    dietary: ["vegan"],
    accessibilityNeeds: [],
    priorities: {},
  },
  budget: {
    currency: "USD",
    totalMinor: 1000000,
    perGuestMinor: 10000,
    lines: [
      {
        categoryId: "venue",
        allocatedMinor: 250000,
        sharePct: 25,
        actualMinor: 0,
        status: "under",
      },
      {
        categoryId: "catering",
        allocatedMinor: 350000,
        sharePct: 35,
        actualMinor: 0,
        status: "under",
      },
      {
        categoryId: "decor",
        allocatedMinor: 150000,
        sharePct: 15,
        actualMinor: 0,
        status: "under",
      },
      {
        categoryId: "entertainment",
        allocatedMinor: 150000,
        sharePct: 15,
        actualMinor: 0,
        status: "under",
      },
      {
        categoryId: "contingency",
        allocatedMinor: 100000,
        sharePct: 10,
        actualMinor: 0,
        status: "under",
      },
    ],
    warnings: [],
  },
  timeline: {
    eventDate: "2027-08-20",
    daysAvailable: 300,
    compressionFactor: 1,
    tightness: "comfortable",
    milestones: [
      {
        id: "m-venue",
        title: "Book Venue",
        dueDate: "2026-11-20",
        leadDays: 270,
        dependsOn: [],
        critical: true,
        status: "upcoming",
        done: true,
      },
    ],
    warnings: [],
  },
  vendors: [
    {
      id: "v-caterer",
      categoryId: "catering",
      name: "Green Leaf Organic Catering",
      stage: "booked",
      quoteMinor: 300000,
      paidMinor: 100000,
    },
  ],
  checklist: [
    {
      id: "chk-1",
      categoryId: "catering",
      kind: "ask",
      text: "Confirm vegan cross-contamination policy",
      done: true,
    },
  ],
  briefs: [],
  ideas: [],
  pinnedIdeaIds: [],
  provenance: {
    baseline: "calculated",
    enrichment: "none",
  },
};

/**
 * Sample AI enrichment payload fixture containing valid shifts, briefs, ideas, and notes.
 */
export const SAMPLE_ENRICHMENT: Enrichment = {
  narrative: "A breathtaking outdoor garden celebration honouring culinary traditions.",
  briefs: [
    {
      categoryId: "decor",
      whatToLookFor: ["Floral longevity in direct sun"],
      questionsToAsk: ["Do you provide backup shade canopies?"],
      redFlags: ["No weather contingency plan"],
      contractTerms: ["Setup completion 2 hours prior to arrival"],
    },
  ],
  ideas: [
    {
      id: "idea-enrich-1",
      categoryId: "decor",
      title: "Botanical Fairy Light Arches",
      description: "Organic wooden arches interwoven with climbing jasmine and warm lights.",
      rationale: "Matches outdoor traditional garden theme beautifully",
      estimateMinor: { min: 20000, max: 40000 },
      effort: "low",
      tags: ["lighting", "garden"],
      fitsBudget: true,
    },
  ],
  suggestedBudgetShifts: [
    {
      from: "entertainment",
      to: "decor",
      amountMinor: 50000,
      rationale: "Enhance visual atmosphere for photography",
    },
  ],
  milestoneNotes: [
    {
      milestoneId: "m-venue",
      note: "Ask venue manager about ambient sound curfews",
    },
  ],
  meta: {
    model: "gemini-2.5-pro",
    source: "ai",
    requestId: "req-enrich-456",
  },
};
