import { describe, expect, it } from "vitest";
import type { Plan } from "../../contracts/plan.js";
import { buildBudgetCsv, formatCsvCell, sanitizeCsvFormula } from "./csv.js";

const TEST_PLAN: Plan = {
  id: "plan-csv-test",
  schemaVersion: 1,
  createdAt: "2026-10-23T12:00:00.000Z",
  updatedAt: "2026-10-23T12:00:00.000Z",
  input: {
    eventType: "wedding",
    title: "Ananya & Rohan Celebration",
    eventDate: "2027-06-15",
    guestCount: 100,
    budget: { currency: "USD", totalMinor: 1000000 },
    venueType: "outdoor",
    style: "garden",
    dietary: [],
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
        allocatedMinor: 400000,
        sharePct: 40,
        actualMinor: 450000,
        status: "over",
      },
      {
        categoryId: "catering",
        allocatedMinor: 500000,
        sharePct: 50,
        actualMinor: 300000,
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
    eventDate: "2027-06-15",
    daysAvailable: 300,
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

describe("sanitizeCsvFormula", () => {
  it("prefixes dangerous formula trigger characters with single quote", () => {
    expect(sanitizeCsvFormula('=HYPERLINK("http://evil.com")')).toBe(
      '\'=HYPERLINK("http://evil.com")'
    );
    expect(sanitizeCsvFormula("+1+1")).toBe("'+1+1");
    expect(sanitizeCsvFormula("-2+3")).toBe("'-2+3");
    expect(sanitizeCsvFormula("@SUM(1,2)")).toBe("'@SUM(1,2)");
    expect(sanitizeCsvFormula("\tTAB_TEXT")).toBe("'\tTAB_TEXT");
    expect(sanitizeCsvFormula("\rCR_TEXT")).toBe("'\rCR_TEXT");
  });

  it("leaves benign strings untouched", () => {
    expect(sanitizeCsvFormula("Standard Category")).toBe("Standard Category");
    expect(sanitizeCsvFormula("مرحبا بالعالم")).toBe("مرحبا بالعالم");
    expect(sanitizeCsvFormula("")).toBe("");
  });
});

describe("formatCsvCell", () => {
  it("wraps cells containing commas, quotes, or newlines in double quotes and escapes internal quotes", () => {
    expect(formatCsvCell('Hello, "World"')).toBe('"Hello, ""World"""');
    expect(formatCsvCell("Multi\nLine")).toBe('"Multi\nLine"');
    expect(formatCsvCell("Simple")).toBe("Simple");
  });

  it("neutralizes formula injection inside quoted fields", () => {
    const malicious = '=CMD|"/C calc"!A0';
    const cell = formatCsvCell(malicious);
    expect(cell.startsWith("\"'=CMD")).toBe(true);
  });
});

describe("buildBudgetCsv", () => {
  it("generates an RFC 4180 spreadsheet with lines, decimal amounts, and summary total row", () => {
    const csv = buildBudgetCsv(TEST_PLAN);
    const rows = csv.split("\r\n").filter((r) => r.length > 0);

    expect(rows[0]).toBe("Category,Allocated,Actual,Variance,Share %,Status,Currency");

    // Venue row: allocated 4000.00, actual 4500.00, variance 500.00, 40.00%, over, USD
    expect(rows[1]).toBe("venue,4000.00,4500.00,500.00,40.00,over,USD");

    // Catering row: allocated 5000.00, actual 3000.00, variance '-2000.00, 50.00%, under, USD
    expect(rows[2]).toBe("catering,5000.00,3000.00,'-2000.00,50.00,under,USD");

    // Contingency row
    expect(rows[3]).toBe("contingency,1000.00,0.00,'-1000.00,10.00,under,USD");

    // Total row: 10000.00, 7500.00, '-2500.00, 100.00, on_track, USD
    expect(rows[4]).toBe("Total,10000.00,7500.00,'-2500.00,100.00,on_track,USD");
  });

  it("prepends UTF-8 BOM when requested in options", () => {
    const withBom = buildBudgetCsv(TEST_PLAN, { bom: true });
    expect(withBom.charCodeAt(0)).toBe(0xfeff);

    const withoutBom = buildBudgetCsv(TEST_PLAN, { bom: false });
    expect(withoutBom.charCodeAt(0)).not.toBe(0xfeff);
  });

  it("marks total row as over when total committed actuals exceed budget", () => {
    const overBudgetPlan: Plan = {
      ...TEST_PLAN,
      budget: {
        ...TEST_PLAN.budget,
        lines: [
          {
            categoryId: "venue",
            allocatedMinor: 400000,
            sharePct: 40,
            actualMinor: 1500000, // 15,000 > 10,000 total
            status: "over",
          },
        ],
      },
    };
    const csv = buildBudgetCsv(overBudgetPlan);
    expect(csv).toContain("Total,10000.00,15000.00,5000.00,100.00,over,USD");
  });
});
