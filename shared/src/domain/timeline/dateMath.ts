/**
 * UTC-midnight date math utilities for deterministic event scheduling.
 * All operations operate strictly in UTC at 00:00:00.000Z to eliminate Daylight Saving Time (DST)
 * discontinuities and local timezone offsets.
 */

const MILLISECONDS_PER_DAY = 86_400_000;

/**
 * Parses an ISO 8601 calendar date string (YYYY-MM-DD) into a UTC Date object
 * positioned at midnight (00:00:00.000Z).
 *
 * @param iso ISO formatted date string (YYYY-MM-DD).
 * @returns Date object in UTC midnight.
 * @throws Error if the string does not conform to YYYY-MM-DD format.
 */
export function parseIsoDate(iso: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) {
    throw new Error(`Invalid ISO date format: "${iso}". Expected YYYY-MM-DD.`);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  // Verify date didn't roll over (e.g. Feb 31 or invalid leap day)
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error(`Invalid calendar date: "${iso}".`);
  }

  return date;
}

/**
 * Converts a UTC Date object into a standard ISO calendar date string (YYYY-MM-DD).
 *
 * @param date Date instance to format using its UTC components.
 * @returns ISO calendar date string (YYYY-MM-DD).
 */
export function toIsoDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${String(year)}-${month}-${day}`;
}

/**
 * Normalizes a candidate date representation (string or Date) into UTC midnight.
 */
function normalizeToUtcMidnight(val: string | Date): Date {
  if (typeof val === "string") {
    return parseIsoDate(val);
  }
  return new Date(Date.UTC(val.getUTCFullYear(), val.getUTCMonth(), val.getUTCDate(), 0, 0, 0, 0));
}

/**
 * Calculates the exact integer day difference between two dates (to - from).
 * Result is positive if `to` is later than `from`, 0 if identical day, or negative if earlier.
 *
 * @param from Starting date or ISO string.
 * @param to Target date or ISO string.
 * @returns Number of full 24-hour UTC days between the two dates.
 */
export function daysBetween(from: string | Date, to: string | Date): number {
  const fromUtc = normalizeToUtcMidnight(from);
  const toUtc = normalizeToUtcMidnight(to);
  const diffMs = toUtc.getTime() - fromUtc.getTime();
  return Math.round(diffMs / MILLISECONDS_PER_DAY);
}

/**
 * Adds (or subtracts) a specified integer number of days to a base date,
 * returning the resulting date formatted as an ISO string (YYYY-MM-DD).
 *
 * @param base Starting date or ISO string.
 * @param days Integer number of days to advance (or regress if negative).
 * @returns New ISO calendar date string (YYYY-MM-DD).
 */
export function addDays(base: string | Date, days: number): string {
  const baseUtc = normalizeToUtcMidnight(base);
  const result = new Date(baseUtc.getTime());
  result.setUTCDate(result.getUTCDate() + Math.round(days));
  return toIsoDate(result);
}
