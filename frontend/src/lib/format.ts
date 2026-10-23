/**
 * Resolves the number of decimal fraction digits for an ISO 4217 currency.
 *
 * @param currency - ISO 4217 currency code (e.g., 'USD', 'JPY', 'KWD')
 * @returns Number of fraction digits (e.g. 0 for JPY, 3 for KWD, 2 for USD)
 */
function getCurrencyFractionDigits(currency: string): number {
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

/**
 * Formats an integer amount in minor currency units (e.g., cents) into a localized currency string.
 *
 * @param minor - Integer amount in minor units (e.g. 10000 cents for $100.00, or 500 for ¥500)
 * @param currency - ISO 4217 3-letter currency code (e.g. 'USD', 'EUR', 'INR', 'JPY')
 * @param locale - Optional BCP-47 language tag (defaults to 'en-US')
 * @returns Localized currency string
 *
 * @example
 * ```ts
 * formatMoney(250000, 'USD'); // "$2,500.00"
 * formatMoney(5000, 'JPY');   // "¥5,000"
 * ```
 */
export function formatMoney(minor: number, currency: string, locale = "en-US"): string {
  if (!Number.isFinite(minor)) {
    return `${currency} 0.00`;
  }
  const digits = getCurrencyFractionDigits(currency);
  const major = minor / Math.pow(10, digits);

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(major);
  } catch {
    return `${currency} ${major.toFixed(digits)}`;
  }
}

/**
 * Formats an ISO 8601 date string into a localized human-readable date.
 * Uses UTC components to avoid timezone shift inconsistencies across client regions.
 *
 * @param isoDate - ISO date string (e.g. '2026-10-24' or '2026-10-24T00:00:00.000Z')
 * @param locale - Optional BCP-47 language tag (defaults to 'en-US')
 * @returns Localized date string (e.g. "Oct 24, 2026")
 */
export function formatDate(isoDate: string, locale = "en-US"): string {
  if (!isoDate || typeof isoDate !== "string") {
    return "";
  }
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }

  // Construct UTC midnight date to prevent timezone roll-back
  const utcDate = new Date(
    Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate(), 12, 0, 0)
  );

  try {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }).format(utcDate);
  } catch {
    return isoDate.split("T")[0] ?? isoDate;
  }
}

/**
 * Formats a percentage value (0 to 100) into a localized percentage string.
 *
 * @param sharePct - Percentage number from 0 to 100 (e.g. 18.5)
 * @param locale - Optional BCP-47 language tag (defaults to 'en-US')
 * @returns Localized percentage string (e.g. "18.5%")
 */
export function formatPercent(sharePct: number, locale = "en-US"): string {
  if (!Number.isFinite(sharePct)) {
    return "0%";
  }
  const ratio = sharePct / 100;
  try {
    return new Intl.NumberFormat(locale, {
      style: "percent",
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(ratio);
  } catch {
    return `${sharePct.toFixed(1)}%`;
  }
}
