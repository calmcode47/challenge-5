import { describe, expect, it } from "vitest";
import { ChatMessageSchema, SuggestedActionSchema, type SuggestedAction } from "./assistant.js";

describe("assistant - ChatMessageSchema", () => {
  it("validates messages across supported roles", () => {
    const userMsg = {
      id: "msg-1",
      role: "user" as const,
      content: "Can you help optimize my catering budget?",
      timestamp: "2026-10-23T14:00:00.000Z",
    };
    expect(ChatMessageSchema.parse(userMsg)).toEqual(userMsg);

    const assistantMsg = {
      id: "msg-2",
      role: "assistant" as const,
      content: "I recommend shifting 5% from decor to catering.\nHere is the plan.",
      timestamp: "2026-10-23T14:00:05.000Z",
    };
    expect(ChatMessageSchema.parse(assistantMsg)).toEqual(assistantMsg);

    const systemMsg = {
      id: "msg-3",
      role: "system" as const,
      content: "Session initialized in local mode.",
      timestamp: "2026-10-23T14:00:00.000Z",
    };
    expect(ChatMessageSchema.parse(systemMsg)).toEqual(systemMsg);
  });

  it("rejects invalid roles or empty content", () => {
    const invalidRoleMsg: unknown = {
      id: "msg-4",
      role: "admin",
      content: "Hello",
      timestamp: "2026-10-23T14:00:00.000Z",
    };
    expect(() => ChatMessageSchema.parse(invalidRoleMsg)).toThrow();

    expect(() =>
      ChatMessageSchema.parse({
        id: "msg-5",
        role: "user",
        content: "   ",
        timestamp: "2026-10-23T14:00:00.000Z",
      })
    ).toThrow();
  });
});

describe("assistant - SuggestedActionSchema discriminated union round-trip", () => {
  it("round-trips shift_budget action", () => {
    const action: SuggestedAction = {
      type: "shift_budget",
      label: "Shift $300 to Catering",
      from: "decor",
      to: "catering",
      amountMinor: 30000,
    };
    const parsed = SuggestedActionSchema.parse(action);
    expect(parsed).toEqual(action);
    expect(parsed.type).toBe("shift_budget");
  });

  it("round-trips add_milestone action", () => {
    const action: SuggestedAction = {
      type: "add_milestone",
      label: "Add Menu Tasting Milestone",
      title: "Schedule Menu Tasting",
      categoryId: "catering",
      leadDays: 90,
    };
    const parsed = SuggestedActionSchema.parse(action);
    expect(parsed).toEqual(action);
    expect(parsed.type).toBe("add_milestone");
  });

  it("round-trips add_checklist_item action", () => {
    const action: SuggestedAction = {
      type: "add_checklist_item",
      label: "Add Cake Tasting Checklist",
      categoryId: "catering",
      kind: "logistics",
      text: "Confirm dietary restrictions with bakery",
    };
    const parsed = SuggestedActionSchema.parse(action);
    expect(parsed).toEqual(action);
    expect(parsed.type).toBe("add_checklist_item");
  });

  it("round-trips pin_idea action", () => {
    const action: SuggestedAction = {
      type: "pin_idea",
      label: "Pin Acoustic Duo Idea",
      ideaId: "idea-duo-123",
    };
    const parsed = SuggestedActionSchema.parse(action);
    expect(parsed).toEqual(action);
    expect(parsed.type).toBe("pin_idea");
  });

  it("round-trips set_priority action", () => {
    const action: SuggestedAction = {
      type: "set_priority",
      label: "Set Venue Priority to High",
      categoryId: "venue",
      value: 5,
    };
    const parsed = SuggestedActionSchema.parse(action);
    expect(parsed).toEqual(action);
    expect(parsed.type).toBe("set_priority");
  });

  it("rejects unknown action types or invalid action payloads", () => {
    expect(() =>
      SuggestedActionSchema.parse({
        type: "unknown_action",
        label: "Do something",
      })
    ).toThrow();

    expect(() =>
      SuggestedActionSchema.parse({
        type: "shift_budget",
        label: "Shift Zero",
        from: "decor",
        to: "catering",
        amountMinor: 0,
      })
    ).toThrow();
  });
});
