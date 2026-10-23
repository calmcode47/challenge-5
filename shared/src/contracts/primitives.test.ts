import { describe, expect, it } from "vitest";
import {
  boundedText,
  currencyCodeSchema,
  dateStringSchema,
  idSchema,
  isSupportedCurrency,
  isoDateTimeSchema,
  minorDigits,
  moneyAmountSchema,
  MoneySchema,
} from "./primitives.js";

describe("primitives - boundedText", () => {
  const standardText = boundedText({ min: 2, max: 20 });
  const multilineText = boundedText({ min: 1, max: 50, allowNewlines: true });

  it("accepts valid Unicode, emojis, accents, and RTL characters", () => {
    expect(standardText.parse("Zoë & Søren 🎉")).toBe("Zoë & Søren 🎉");
    expect(standardText.parse("مرحبا")).toBe("مرحبا");
    expect(standardText.parse("李雷")).toBe("李雷");
  });

  it("trims whitespace and performs NFC normalisation", () => {
    const rawWithSpaces = "  hello world  ";
    expect(standardText.parse(rawWithSpaces)).toBe("hello world");

    // Decomposed e + combining acute accent -> NFC composed é
    const decomposed = "Zo\u0065\u0301";
    const parsed = standardText.parse(decomposed);
    expect(parsed).toBe("Zoé");
  });

  it("rejects strings that are only whitespace or shorter than min", () => {
    expect(() => standardText.parse("   ")).toThrow();
    expect(() => standardText.parse("a")).toThrow();
  });

  it("rejects strings exceeding maximum character length", () => {
    expect(() => standardText.parse("a".repeat(21))).toThrow();
  });

  it("rejects control characters in standard text", () => {
    expect(() => standardText.parse("hello\u0000world")).toThrow();
    expect(() => standardText.parse("hello\u001Fworld")).toThrow();
    expect(() => standardText.parse("hello\u007Fworld")).toThrow();
    expect(() => standardText.parse("hello\nworld")).toThrow();
  });

  it("allows newlines when allowNewlines is true but rejects other control characters", () => {
    expect(multilineText.parse("Line 1\nLine 2")).toBe("Line 1\nLine 2");
    expect(() => multilineText.parse("Line 1\u0000Line 2")).toThrow();
  });

  it("handles hostile input strings (R6 probe) safely", () => {
    const wideText = boundedText({ min: 1, max: 200 });
    // Hostile payload strings are parsed as inert literal text
    expect(wideText.parse("<img src=x onerror=alert(1)>")).toBe("<img src=x onerror=alert(1)>");
    expect(wideText.parse("{{7*7}}")).toBe("{{7*7}}");
    expect(wideText.parse('=HYPERLINK("http://evil.com")')).toBe('=HYPERLINK("http://evil.com")');

    // 10,000 character strings are strictly rejected by max bound
    expect(() => wideText.parse("a".repeat(10000))).toThrow();
  });
});

describe("primitives - idSchema", () => {
  it("accepts alphanumeric, kebab-case, and snake_case IDs", () => {
    expect(idSchema.parse("plan-123_abc")).toBe("plan-123_abc");
    expect(idSchema.parse("uuid-93ca6441")).toBe("uuid-93ca6441");
  });

  it("rejects empty strings, whitespace, and invalid characters", () => {
    expect(() => idSchema.parse("")).toThrow();
    expect(() => idSchema.parse("plan 123")).toThrow();
    expect(() => idSchema.parse("<script>")).toThrow();
    expect(() => idSchema.parse("../../etc/passwd")).toThrow();
    expect(() => idSchema.parse("__proto__")).not.toThrow(); // valid chars, but handled as safe string
  });

  it("rejects identifiers exceeding 64 characters", () => {
    expect(() => idSchema.parse("a".repeat(65))).toThrow();
  });
});

describe("primitives - dateStringSchema", () => {
  it("accepts valid ISO calendar dates within year 2000-2200", () => {
    expect(dateStringSchema.parse("2026-10-23")).toBe("2026-10-23");
    expect(dateStringSchema.parse("2000-01-01")).toBe("2000-01-01");
    expect(dateStringSchema.parse("2200-12-31")).toBe("2200-12-31");
    expect(dateStringSchema.parse("2024-02-29")).toBe("2024-02-29"); // leap year
  });

  it("rejects non-existent calendar dates", () => {
    expect(() => dateStringSchema.parse("2023-02-29")).toThrow(); // not a leap year
    expect(() => dateStringSchema.parse("2026-04-31")).toThrow(); // April has 30 days
    expect(() => dateStringSchema.parse("2026-13-01")).toThrow(); // invalid month
    expect(() => dateStringSchema.parse("2026-00-10")).toThrow();
  });

  it("rejects years outside the 2000-2200 range", () => {
    expect(() => dateStringSchema.parse("1999-12-31")).toThrow();
    expect(() => dateStringSchema.parse("2201-01-01")).toThrow();
  });

  it("rejects malformed date strings", () => {
    expect(() => dateStringSchema.parse("10/23/2026")).toThrow();
    expect(() => dateStringSchema.parse("2026-1-1")).toThrow();
    expect(() => dateStringSchema.parse("today")).toThrow();
  });
});

describe("primitives - isoDateTimeSchema", () => {
  it("accepts valid ISO 8601 UTC date-time timestamps", () => {
    const timestamp = "2026-10-23T12:30:00.000Z";
    expect(isoDateTimeSchema.parse(timestamp)).toBe(timestamp);
  });

  it("rejects non-ISO datetime values", () => {
    expect(() => isoDateTimeSchema.parse("2026-10-23")).toThrow();
    expect(() => isoDateTimeSchema.parse("invalid-timestamp")).toThrow();
  });
});

describe("primitives - currency and money", () => {
  it("validates supported ISO 4217 currency codes", () => {
    expect(isSupportedCurrency("USD")).toBe(true);
    expect(isSupportedCurrency("INR")).toBe(true);
    expect(isSupportedCurrency("JPY")).toBe(true);
    expect(isSupportedCurrency("EUR")).toBe(true);
    expect(isSupportedCurrency("KWD")).toBe(true);

    expect(isSupportedCurrency("ZZZ")).toBe(false);
    expect(isSupportedCurrency("usd")).toBe(false);
    expect(isSupportedCurrency("US")).toBe(false);
    expect(isSupportedCurrency("123")).toBe(false);
  });

  it("currencyCodeSchema accepts supported codes and rejects invalid ones", () => {
    expect(currencyCodeSchema.parse("USD")).toBe("USD");
    expect(currencyCodeSchema.parse("INR")).toBe("INR");
    expect(() => currencyCodeSchema.parse("ZZZ")).toThrow();
    expect(() => currencyCodeSchema.parse("usd")).toThrow();
  });

  it("minorDigits returns correct decimal fraction counts and handles fallback", () => {
    expect(minorDigits("USD")).toBe(2);
    expect(minorDigits("EUR")).toBe(2);
    expect(minorDigits("JPY")).toBe(0);
    expect(minorDigits("KWD")).toBe(3);
    expect(minorDigits("INVALID")).toBe(2);
  });

  it("isSupportedCurrency safely returns false if Intl.supportedValuesOf throws", () => {
    const original = Intl.supportedValuesOf;
    // Simulate runtime where supportedValuesOf throws
    Intl.supportedValuesOf = () => {
      throw new Error("Intl error");
    };
    try {
      expect(isSupportedCurrency("USD")).toBe(false);
    } finally {
      Intl.supportedValuesOf = original;
    }
  });

  it("moneyAmountSchema enforces integer bounds and safe integer limits", () => {
    expect(moneyAmountSchema.parse(0)).toBe(0);
    expect(moneyAmountSchema.parse(500000)).toBe(500000);
    expect(moneyAmountSchema.parse(1_000_000_000_000)).toBe(1_000_000_000_000);

    expect(() => moneyAmountSchema.parse(-1)).toThrow();
    expect(() => moneyAmountSchema.parse(10.5)).toThrow();
    expect(() => moneyAmountSchema.parse(1_000_000_000_001)).toThrow();
    expect(() => moneyAmountSchema.parse(NaN)).toThrow();
    expect(() => moneyAmountSchema.parse(Infinity)).toThrow();
    expect(() => moneyAmountSchema.parse(1e21)).toThrow();
  });

  it("MoneySchema validates complete monetary structures", () => {
    const validMoney = { currency: "USD", amountMinor: 150000 };
    expect(MoneySchema.parse(validMoney)).toEqual(validMoney);
  });
});
