import type { Plan } from "../../contracts/plan.js";
import { minorDigits } from "../../contracts/primitives.js";

/**
 * Options configuring CSV generation.
 */
export interface CsvExportOptions {
  /** When true, prepends the UTF-8 Byte Order Mark (\\uFEFF) for Microsoft Excel compatibility. */
  bom?: boolean;
}

const FORMULA_TRIGGER_CHARS = new Set(["=", "+", "-", "@", "\t", "\r"]);

/**
 * Neutralizes active formula injection characters to safeguard spreadsheet applications against CWE-1236.
 * Prefixes a single quote (') if the content begins with dangerous command triggers (=, +, -, @, \\t, \\r).
 *
 * @param val Raw unescaped string value.
 * @returns Safe string neutralised against formula execution.
 */
export function sanitizeCsvFormula(val: string): string {
  if (val.length === 0) {
    return val;
  }
  const firstChar = val.charAt(0);
  if (FORMULA_TRIGGER_CHARS.has(firstChar)) {
    return `'${val}`;
  }
  return val;
}

/**
 * Formats a single cell according to RFC 4180 specification with formula injection neutralization.
 * Quotes the cell if it contains double quotes, commas, or line breaks, escaping inner quotes as `""`.
 *
 * @param val Cell string value.
 * @returns Safe RFC 4180 escaped cell content.
 */
export function formatCsvCell(val: string): string {
  const sanitized = sanitizeCsvFormula(val);
  const needsQuotes =
    sanitized.includes('"') ||
    sanitized.includes(",") ||
    sanitized.includes("\n") ||
    sanitized.includes("\r");

  if (needsQuotes) {
    const escaped = sanitized.replace(/"/g, '""');
    return `"${escaped}"`;
  }
  return sanitized;
}

function formatDecimalAmount(minor: number, currency: string): string {
  const digits = minorDigits(currency);
  const factor = Math.pow(10, digits);
  return (minor / factor).toFixed(digits);
}

/**
 * Generates an RFC 4180 compliant CSV spreadsheet of the plan's budget allocations and actuals.
 * Includes complete formula injection defense against CSV injection attacks.
 *
 * Headers: Category,Allocated,Actual,Variance,Share %,Status,Currency
 *
 * @param plan Active celebration plan.
 * @param options Export configuration (e.g. BOM prefix).
 * @returns Safe, RFC 4180 compliant CSV string with CRLF row breaks.
 */
export function buildBudgetCsv(plan: Plan, options?: CsvExportOptions): string {
  const { budget } = plan;
  const currency = budget.currency;

  const header = ["Category", "Allocated", "Actual", "Variance", "Share %", "Status", "Currency"]
    .map(formatCsvCell)
    .join(",");

  const rows: string[] = [header];

  let totalActual = 0;

  for (const line of budget.lines) {
    totalActual += line.actualMinor;
    const varianceMinor = line.actualMinor - line.allocatedMinor;

    const row = [
      formatCsvCell(line.categoryId),
      formatCsvCell(formatDecimalAmount(line.allocatedMinor, currency)),
      formatCsvCell(formatDecimalAmount(line.actualMinor, currency)),
      formatCsvCell(formatDecimalAmount(varianceMinor, currency)),
      formatCsvCell(line.sharePct.toFixed(2)),
      formatCsvCell(line.status),
      formatCsvCell(currency),
    ].join(",");

    rows.push(row);
  }

  // Summary Total Row
  const totalVarianceMinor = totalActual - budget.totalMinor;
  const totalRow = [
    formatCsvCell("Total"),
    formatCsvCell(formatDecimalAmount(budget.totalMinor, currency)),
    formatCsvCell(formatDecimalAmount(totalActual, currency)),
    formatCsvCell(formatDecimalAmount(totalVarianceMinor, currency)),
    formatCsvCell("100.00"),
    formatCsvCell(totalVarianceMinor > 0 ? "over" : "on_track"),
    formatCsvCell(currency),
  ].join(",");

  rows.push(totalRow);

  const csvBody = rows.join("\r\n") + "\r\n";
  return options?.bom ? `\uFEFF${csvBody}` : csvBody;
}
