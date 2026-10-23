import { describe, expect, it, vi } from "vitest";
import { formatDate, formatMoney, formatPercent } from "./format";

describe("formatMoney", () => {
  it("formats standard 2-decimal currencies (USD, EUR, GBP)", () => {
    const usd = formatMoney(250000, "USD", "en-US");
    expect(usd).toContain("2,500.00");
    expect(usd).toContain("$");

    const eur = formatMoney(123456, "EUR", "en-US");
    expect(eur).toContain("1,234.56");
  });

  it("formats zero-decimal currencies (JPY)", () => {
    const jpy = formatMoney(5000, "JPY", "en-US");
    expect(jpy).toContain("5,000");
    expect(jpy).not.toContain(".00");
  });

  it("formats 3-decimal currencies (KWD)", () => {
    const kwd = formatMoney(1500, "KWD", "en-US");
    expect(kwd).toContain("1.500");
  });

  it("formats INR with appropriate Indian numbering groups in hi-IN or en-IN", () => {
    const inr = formatMoney(10000000, "INR", "en-IN");
    expect(inr).toContain("1,00,000.00");
  });

  it("handles 0 and negative amounts gracefully", () => {
    expect(formatMoney(0, "USD", "en-US")).toBe("$0.00");
    expect(formatMoney(-5000, "USD", "en-US")).toContain("50.00");
  });

  it("handles non-finite numbers safely", () => {
    expect(formatMoney(Number.NaN, "USD")).toBe("USD 0.00");
    expect(formatMoney(Infinity, "EUR")).toBe("EUR 0.00");
  });

  it("falls back gracefully when Intl.NumberFormat throws an error", () => {
    const spy = vi.spyOn(Intl, "NumberFormat").mockImplementation(() => {
      throw new Error("Intl crashed");
    });

    try {
      const res = formatMoney(10000, "USD");
      expect(res).toBe("USD 100.00");
    } finally {
      spy.mockRestore();
    }
  });
});

describe("formatDate", () => {
  it("formats standard ISO date string without day shifts", () => {
    const formatted = formatDate("2026-10-24", "en-US");
    expect(formatted).toBe("Oct 24, 2026");
  });

  it("formats full ISO datetime strings", () => {
    const formatted = formatDate("2026-12-31T23:59:59.000Z", "en-US");
    expect(formatted).toBe("Dec 31, 2026");
  });

  it("returns input if invalid or empty", () => {
    expect(formatDate("")).toBe("");
    expect(formatDate("not-a-date")).toBe("not-a-date");
  });

  it("falls back gracefully when Intl.DateTimeFormat throws", () => {
    const spy = vi.spyOn(Intl, "DateTimeFormat").mockImplementation(() => {
      throw new Error("DateTimeFormat crashed");
    });

    try {
      const formatted = formatDate("2026-05-15T12:00:00Z");
      expect(formatted).toBe("2026-05-15");
    } finally {
      spy.mockRestore();
    }
  });
});

describe("formatPercent", () => {
  it("formats percentage with clean fraction digits", () => {
    expect(formatPercent(18.5, "en-US")).toBe("18.5%");
    expect(formatPercent(20, "en-US")).toBe("20%");
    expect(formatPercent(0, "en-US")).toBe("0%");
  });

  it("handles non-finite values safely", () => {
    expect(formatPercent(Number.NaN)).toBe("0%");
    expect(formatPercent(Infinity)).toBe("0%");
  });

  it("falls back gracefully when Intl.NumberFormat throws", () => {
    const spy = vi.spyOn(Intl, "NumberFormat").mockImplementation(() => {
      throw new Error("NumberFormat crashed");
    });

    try {
      const res = formatPercent(12.3);
      expect(res).toBe("12.3%");
    } finally {
      spy.mockRestore();
    }
  });
});
