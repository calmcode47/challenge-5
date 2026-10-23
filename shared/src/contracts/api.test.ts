import { describe, expect, it } from "vitest";
import {
  ChatRequestSchema,
  ChatResponseSchema,
  EnrichPlanRequestSchema,
  EnrichPlanResponseSchema,
  GenerateIdeasRequestSchema,
  GenerateIdeasResponseSchema,
  HealthResponseSchema,
  SavePlanRequestSchema,
  SessionResponseSchema,
} from "./api.js";
import { PLAN_SCHEMA_VERSION, type Plan } from "./plan.js";

const samplePlan: Plan = {
  id: "plan-sample-1",
  schemaVersion: PLAN_SCHEMA_VERSION,
  createdAt: "2026-10-23T12:00:00.000Z",
  updatedAt: "2026-10-23T12:00:00.000Z",
  input: {
    eventType: "wedding",
    title: "Sample Wedding",
    eventDate: "2027-04-10",
    guestCount: 100,
    budget: { currency: "USD", totalMinor: 2_000_000 },
    venueType: "banquet_hall",
    dietary: [],
    accessibilityNeeds: [],
    priorities: {},
  },
  budget: {
    currency: "USD",
    totalMinor: 2_000_000,
    lines: [],
    perGuestMinor: 20_000,
    warnings: [],
  },
  timeline: {
    eventDate: "2027-04-10",
    daysAvailable: 150,
    compressionFactor: 1,
    tightness: "comfortable",
    milestones: [],
    warnings: [],
  },
  vendors: [],
  checklist: [],
  briefs: [],
  ideas: [],
  pinnedIdeaIds: [],
  provenance: {
    baseline: "calculated",
    enrichment: "none",
  },
};

describe("api - HealthResponseSchema", () => {
  it("parses valid health response and strips extra unknown fields", () => {
    const raw = {
      status: "ok",
      version: "1.0.0",
      mode: "live",
      extraDebugField: "should-be-stripped",
    };
    const parsed = HealthResponseSchema.parse(raw);
    expect(parsed.status).toBe("ok");
    expect(parsed.mode).toBe("live");
    expect((parsed as Record<string, unknown>).extraDebugField).toBeUndefined();
  });
});

describe("api - SessionResponseSchema", () => {
  it("parses session response and strips extra fields", () => {
    const raw = {
      sessionId: "sess-93ca6441",
      csrfToken: "abcdef0123456789abcdef0123456789",
      expiresAt: "2026-10-24T12:00:00.000Z",
      backendCluster: "us-central1",
    };
    const parsed = SessionResponseSchema.parse(raw);
    expect(parsed.sessionId).toBe("sess-93ca6441");
    expect((parsed as Record<string, unknown>).backendCluster).toBeUndefined();
  });
});

describe("api - Request strictness (.strict()) rejects unknown keys", () => {
  it("EnrichPlanRequestSchema rejects payload with unknown properties", () => {
    const payloadWithExtra = {
      input: samplePlan.input,
      baseline: samplePlan,
      unknownKey: "malicious_injection",
    };
    expect(() => EnrichPlanRequestSchema.parse(payloadWithExtra)).toThrow();

    // Prototype pollution attempt via JSON parsing with __proto__ key
    const protoPollutionPayload: unknown = JSON.parse(
      JSON.stringify({
        input: samplePlan.input,
        baseline: samplePlan,
        extraPollution: { admin: true },
      })
    );
    expect(() => EnrichPlanRequestSchema.parse(protoPollutionPayload)).toThrow();
  });

  it("GenerateIdeasRequestSchema rejects payload with unknown properties", () => {
    const payloadWithExtra = {
      plan: {
        id: samplePlan.id,
        schemaVersion: samplePlan.schemaVersion,
        createdAt: samplePlan.createdAt,
        updatedAt: samplePlan.updatedAt,
        input: samplePlan.input,
        budget: samplePlan.budget,
        timeline: samplePlan.timeline,
        vendors: samplePlan.vendors,
        checklist: samplePlan.checklist,
        pinnedIdeaIds: samplePlan.pinnedIdeaIds,
        provenance: samplePlan.provenance,
      },
      feedback: { pinned: [], rejected: [] },
      unexpectedFlag: true,
    };
    expect(() => GenerateIdeasRequestSchema.parse(payloadWithExtra)).toThrow();
  });

  it("ChatRequestSchema rejects unknown keys and enforces message limits", () => {
    const validChatRequest = {
      plan: {
        id: samplePlan.id,
        schemaVersion: samplePlan.schemaVersion,
        createdAt: samplePlan.createdAt,
        updatedAt: samplePlan.updatedAt,
        input: samplePlan.input,
        budget: samplePlan.budget,
        timeline: samplePlan.timeline,
        vendors: samplePlan.vendors,
        checklist: samplePlan.checklist,
        pinnedIdeaIds: samplePlan.pinnedIdeaIds,
        provenance: samplePlan.provenance,
      },
      messages: [
        {
          id: "msg-1",
          role: "user" as const,
          content: "Hello",
          timestamp: "2026-10-23T12:00:00.000Z",
        },
      ],
    };

    expect(ChatRequestSchema.parse(validChatRequest)).toBeDefined();

    expect(() =>
      ChatRequestSchema.parse({
        ...validChatRequest,
        injectedField: "exploit",
      })
    ).toThrow();

    const tooManyMessages = Array.from({ length: 21 }, (_, i) => ({
      id: `msg-${String(i)}`,
      role: "user" as const,
      content: `Message ${String(i)}`,
      timestamp: "2026-10-23T12:00:00.000Z",
    }));

    expect(() =>
      ChatRequestSchema.parse({
        ...validChatRequest,
        messages: tooManyMessages,
      })
    ).toThrow();
  });

  it("SavePlanRequestSchema rejects unknown keys", () => {
    const planWithExtra = {
      ...samplePlan,
      extraServerProperty: 123,
    };
    expect(() => SavePlanRequestSchema.parse(planWithExtra)).toThrow();
  });
});

describe("api - Response stripping (.strip()) permits safe forward evolution", () => {
  it("EnrichPlanResponseSchema strips backend additions gracefully", () => {
    const raw = {
      narrative: "Tailored overview",
      briefs: [],
      ideas: [],
      suggestedBudgetShifts: [],
      milestoneNotes: [],
      meta: {
        model: "gemini-2.5-flash",
        source: "ai" as const,
        requestId: "req-1",
      },
      futureBackendField: { experimentalScore: 99 },
    };
    const parsed = EnrichPlanResponseSchema.parse(raw);
    expect(parsed.meta.model).toBe("gemini-2.5-flash");
    expect((parsed as Record<string, unknown>).futureBackendField).toBeUndefined();
  });

  it("GenerateIdeasResponseSchema strips unexpected metadata", () => {
    const raw = {
      ideas: [],
      meta: {
        model: "gemini-2.5-flash",
        source: "ai" as const,
        requestId: "req-2",
      },
      serverLatencyMs: 142,
    };
    const parsed = GenerateIdeasResponseSchema.parse(raw);
    expect(parsed.ideas).toHaveLength(0);
    expect((parsed as Record<string, unknown>).serverLatencyMs).toBeUndefined();
  });

  it("ChatResponseSchema strips unexpected metadata and caps suggested actions at 5", () => {
    const raw = {
      reply: "Here are some ideas.",
      suggestedActions: [
        {
          type: "pin_idea" as const,
          label: "Pin Idea",
          ideaId: "idea-1",
        },
      ],
      meta: {
        model: "gemini-2.5-flash",
        source: "ai" as const,
        requestId: "req-3",
      },
      tokensUsed: 420,
    };
    const parsed = ChatResponseSchema.parse(raw);
    expect(parsed.suggestedActions).toHaveLength(1);
    expect((parsed as Record<string, unknown>).tokensUsed).toBeUndefined();
  });
});
