import { z } from "zod";

/**
 * Validates whether a 3-letter currency code is supported by the runtime's Intl environment.
 * Accepts ISO 4217 standard currency codes.
 *
 * @param code Uppercase 3-letter currency candidate.
 * @returns True if the currency is supported in the ISO 4217 registry.
 */
export function isSupportedCurrency(code: string): boolean {
  if (!/^[A-Z]{3}$/.test(code)) {
    return false;
  }
  try {
    const supported = Intl.supportedValuesOf("currency");
    return supported.includes(code);
  } catch {
    return false;
  }
}

/**
 * Returns the minor fraction digits (e.g. 2 for USD, 0 for JPY, 3 for KWD) for a currency.
 *
 * @param currency ISO 4217 3-letter currency code.
 * @returns Integer number of decimal fraction digits.
 */
export function minorDigits(currency: string): number {
  try {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    });
    return formatter.resolvedOptions().maximumFractionDigits ?? 2;
  } catch {
    return 2;
  }
}

function hasStrictControlCharacters(val: string): boolean {
  for (let idx = 0; idx < val.length; idx += 1) {
    const code = val.charCodeAt(idx);
    if (code <= 0x1f || (code >= 0x7f && code <= 0x9f)) {
      return true;
    }
  }
  return false;
}

function hasControlCharactersWithNewlines(val: string): boolean {
  for (let idx = 0; idx < val.length; idx += 1) {
    const code = val.charCodeAt(idx);
    if (code === 0x09 || code === 0x0a || code === 0x0d) {
      continue;
    }
    if (code <= 0x1f || (code >= 0x7f && code <= 0x9f)) {
      return true;
    }
  }
  return false;
}

/**
 * Options configuring bounded text validation.
 */
export interface BoundedTextOptions {
  /** Minimum length in characters after trimming. Defaults to 1. */
  min?: number;
  /** Maximum length in characters. */
  max: number;
  /** Whether line breaks (\n and \r) are permitted. Defaults to false. */
  allowNewlines?: boolean;
}

/**
 * Creates a Zod string schema that trims, NFC-normalises, rejects control characters,
 * enforces length bounds, and supports full Unicode (emoji, diacritics, and RTL scripts).
 *
 * @param options Bounds and newline handling settings.
 * @returns A validated Zod string schema.
 */
export function boundedText(options: BoundedTextOptions): z.ZodType<string> {
  const min = options.min ?? 1;
  const max = options.max;
  const allowNewlines = options.allowNewlines ?? false;
  const hasDisallowedControl = allowNewlines
    ? hasControlCharactersWithNewlines
    : hasStrictControlCharacters;

  return z
    .string()
    .transform((val) => val.normalize("NFC").trim())
    .refine((val) => !hasDisallowedControl(val), {
      message: "Text contains disallowed control characters",
    })
    .refine((val) => val.length >= min, {
      message: `Text must be at least ${String(min)} characters long`,
    })
    .refine((val) => val.length <= max, {
      message: `Text must be at most ${String(max)} characters long`,
    });
}

/**
 * Schema for safe internal identifiers (slugs, UUIDs, deterministic keys).
 * Bounded between 1 and 64 characters, containing alphanumeric and safe separators.
 */
export const idSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "Identifier must contain only alphanumeric, dash, or underscore characters"
  );

/**
 * Inferred type of an identifier.
 */
export type Id = z.infer<typeof idSchema>;

/**
 * ISO calendar date schema (YYYY-MM-DD).
 * Validates calendar realism (leap years, month lengths) and bounds the year between 2000 and 2200.
 */
export const dateStringSchema = z
  .string()
  .regex(
    /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/,
    "Date must match ISO YYYY-MM-DD format"
  )
  .refine((val) => {
    const parts = val.split("-").map(Number);
    const year = parts[0] ?? 0;
    const month = parts[1] ?? 0;
    const day = parts[2] ?? 0;
    if (year < 2000 || year > 2200) {
      return false;
    }
    const date = new Date(Date.UTC(year, month - 1, day));
    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    );
  }, "Date must be a valid calendar date between the years 2000 and 2200");

/**
 * Inferred type of an ISO date string.
 */
export type DateString = z.infer<typeof dateStringSchema>;

/**
 * ISO 8601 UTC timestamp schema.
 */
export const isoDateTimeSchema = z
  .string()
  .datetime({ message: "Timestamp must be a valid ISO 8601 date-time string" });

/**
 * Inferred type of an ISO date-time string.
 */
export type IsoDateTime = z.infer<typeof isoDateTimeSchema>;

/**
 * Schema for ISO 4217 standard 3-letter uppercase currency codes.
 */
export const currencyCodeSchema = z
  .string()
  .regex(/^[A-Z]{3}$/, "Currency code must be 3 uppercase letters")
  .refine(isSupportedCurrency, "Currency code is not a supported ISO 4217 currency");

/**
 * Inferred type of an ISO 4217 currency code.
 */
export type CurrencyCode = z.infer<typeof currencyCodeSchema>;

/**
 * Schema for monetary amounts represented as integer minor units (e.g. cents, pence, yen).
 * Bounded between 0 and 10^12 minor units (Number.isSafeInteger enforced).
 */
export const moneyAmountSchema = z
  .number()
  .int("Monetary amount must be an integer minor unit")
  .min(0, "Monetary amount cannot be negative")
  .max(1_000_000_000_000, "Monetary amount cannot exceed 10^12 minor units")
  .refine((val) => Number.isSafeInteger(val), "Monetary amount must be a safe integer");

/**
 * Inferred type of a monetary minor amount.
 */
export type MoneyAmount = z.infer<typeof moneyAmountSchema>;

/**
 * Money schema combining currency and minor amount.
 */
export const MoneySchema = z.object({
  currency: currencyCodeSchema,
  amountMinor: moneyAmountSchema,
});

/**
 * Inferred type of a Money structure.
 */
export type Money = z.infer<typeof MoneySchema>;
