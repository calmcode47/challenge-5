import { describe, expect, it } from "vitest";
import type { Plan } from "../../contracts/plan.js";
import { foldIcsContent, foldIcsLine, getUtf8ByteLength } from "./foldIcs.js";
import { buildIcs, escapeIcsText } from "./ics.js";

const SAMPLE_PLAN: Plan = {
  id: "plan-ics-test",
  schemaVersion: 1,
  createdAt: "2026-10-23T12:00:00.000Z",
  updatedAt: "2026-10-23T12:00:00.000Z",
  input: {
    eventType: "wedding",
    title: "Ananya & Rohan's Wedding: Love, Joy & Celebrations! 🎉",
    eventDate: "2027-06-15",
    guestCount: 150,
    budget: { currency: "USD", totalMinor: 2500000 },
    venueType: "outdoor",
    style: "bohemian garden",
    cultureOrTradition: "South Asian",
    dietary: [],
    accessibilityNeeds: [],
    priorities: {},
  },
  budget: {
    currency: "USD",
    totalMinor: 2500000,
    perGuestMinor: 16666,
    lines: [],
    warnings: [],
  },
  timeline: {
    eventDate: "2027-06-15",
    daysAvailable: 300,
    compressionFactor: 1,
    tightness: "comfortable",
    milestones: [
      {
        id: "m-venue",
        title: "Book Venue; Check Deposit, Contracts & Backups\\Special",
        dueDate: "2026-11-15",
        leadDays: 212,
        dependsOn: [],
        critical: true,
        status: "upcoming",
        done: false,
      },
      {
        id: "m-long-desc",
        title:
          "Very long title exceeding seventy-five octets to verify RFC 5545 line folding with unicode characters like café and emojis 🌸✨🎊",
        dueDate: "2026-12-01",
        leadDays: 196,
        dependsOn: ["m-venue"],
        critical: false,
        status: "upcoming",
        done: false,
      },
    ],
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

describe("escapeIcsText", () => {
  it("escapes semicolons, commas, backslashes, and linebreaks per RFC 5545", () => {
    const raw = "Special: A, B; C\\D\nNext line";
    const escaped = escapeIcsText(raw);
    expect(escaped).toBe("Special: A\\, B\\; C\\\\D\\nNext line");
  });
});

describe("foldIcsLine", () => {
  it("leaves lines <= 75 octets untouched", () => {
    const line = "SUMMARY:Short text";
    expect(foldIcsLine(line, 75)).toBe(line);
  });

  it("folds long lines at 75 octets with space prefix without splitting multi-byte unicode", () => {
    // 80 characters of Japanese / emojis
    const longUnicode =
      "SUMMARY: 🎉 Celebration 🌸 ✨ 🎊 🌺 🌻 🌼 🌷 🌹 💐 🌾 🌿 ☘️ 🍀 🍃 🍂 🍁 🍄 🌾 💐 🌷 🌸 🌹";
    const folded = foldIcsLine(longUnicode, 75);
    const sublines = folded.split("\r\n");

    expect(sublines.length).toBeGreaterThan(1);
    for (let i = 0; i < sublines.length; i += 1) {
      const line = sublines[i] ?? "";
      expect(getUtf8ByteLength(line)).toBeLessThanOrEqual(75);
      if (i > 0) {
        expect(line.startsWith(" ")).toBe(true);
      }
    }
  });

  it("foldIcsContent normalizes line breaks and folds long content", () => {
    const input = "LINE1\n" + "A".repeat(100) + "\r\nLINE3";
    const folded = foldIcsContent(input);
    const lines = folded.split("\r\n");
    for (const l of lines) {
      expect(getUtf8ByteLength(l)).toBeLessThanOrEqual(75);
    }
  });
});

describe("buildIcs", () => {
  it("generates a structurally valid RFC 5545 calendar document", () => {
    const now = "2026-10-23T12:00:00.000Z";
    const ics = buildIcs(SAMPLE_PLAN, now);

    // Strict CRLF endings
    expect(ics).toContain("\r\n");
    expect(ics.includes("\n") && !ics.includes("\r\n")).toBe(false);

    // Header and footer
    expect(ics).toContain("BEGIN:VCALENDAR\r\n");
    expect(ics).toContain("VERSION:2.0\r\n");
    expect(ics).toContain("PRODID:-//Occasio//Occasio Event Planner//EN\r\n");
    expect(ics).toContain("END:VCALENDAR\r\n");

    // Milestone events and celebration day event
    expect(ics).toContain("UID:m-venue@occasio\r\n");
    expect(ics).toContain("UID:celebration-plan-ics-test@occasio\r\n");
    expect(ics).toContain("DTSTAMP:20261023T120000Z\r\n");

    // Every line must be <= 75 octets
    const rawLines = ics.split("\r\n");
    for (const line of rawLines) {
      expect(getUtf8ByteLength(line)).toBeLessThanOrEqual(75);
    }
  });

  it("structural parser test: parses events and validates fields", () => {
    const now = "2026-10-23T12:00:00.000Z";
    const ics = buildIcs(SAMPLE_PLAN, now);

    // Unfold lines per RFC 5545 section 3.1
    const unfolded = ics.replace(/\r\n /g, "");
    const lines = unfolded.split("\r\n");

    const events: Record<string, string>[] = [];
    let currentEvent: Record<string, string> | null = null;

    for (const line of lines) {
      if (line === "BEGIN:VEVENT") {
        currentEvent = {};
      } else if (line === "END:VEVENT") {
        if (currentEvent) events.push(currentEvent);
        currentEvent = null;
      } else if (currentEvent && line.includes(":")) {
        const colonIdx = line.indexOf(":");
        const key = line.slice(0, colonIdx);
        const val = line.slice(colonIdx + 1);
        currentEvent[key] = val;
      }
    }

    // 2 milestones + 1 celebration event = 3 events
    expect(events).toHaveLength(3);
    const celebration = events.find((e) => e.UID === "celebration-plan-ics-test@occasio");
    expect(celebration).toBeDefined();
    expect(celebration?.["DTSTART;VALUE=DATE"]).toBe("20270615");
    expect(celebration?.["DTEND;VALUE=DATE"]).toBe("20270616");
  });

  it("handles Date objects as now parameter and multi-continuation line folds", () => {
    const nowDate = new Date("2026-10-23T15:45:30.000Z");
    const ics = buildIcs(SAMPLE_PLAN, nowDate);
    expect(ics).toContain("DTSTAMP:20261023T154530Z\r\n");

    const hugeLine = "X-LONG:" + "word-".repeat(50);
    const folded = foldIcsLine(hugeLine, 75);
    const parts = folded.split("\r\n");
    expect(parts.length).toBeGreaterThan(2);
    for (let idx = 1; idx < parts.length; idx += 1) {
      expect(parts[idx]?.startsWith(" ")).toBe(true);
    }
  });
});
