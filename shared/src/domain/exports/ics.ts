import type { Plan } from "../../contracts/plan.js";
import { addDays } from "../timeline/dateMath.js";
import { foldIcsContent } from "./foldIcs.js";

/**
 * Escapes characters with special syntactic meaning in RFC 5545 iCalendar TEXT values.
 *
 * Escaping rules:
 * - Backslash \ -> \\
 * - Semicolon ; -> \;
 * - Comma , -> \,
 * - Line break \n -> \n
 *
 * @param text Raw unescaped text.
 * @returns RFC 5545 escaped text value.
 */
export function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n/g, "\\n")
    .replace(/[\r\n]/g, "\\n");
}

function formatUtcTimestamp(dateOrIso: Date | string): string {
  const date = typeof dateOrIso === "string" ? new Date(dateOrIso) : dateOrIso;
  const pad = (n: number): string => String(n).padStart(2, "0");
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const mins = pad(date.getUTCMinutes());
  const secs = pad(date.getUTCSeconds());
  return `${String(year)}${month}${day}T${hours}${mins}${secs}Z`;
}

function compactDate(isoDate: string): string {
  return isoDate.replace(/-/g, "");
}

function getNextDayCompact(isoDate: string): string {
  const nextDayIso = addDays(isoDate, 1);
  return compactDate(nextDayIso);
}

/**
 * Builds a valid RFC 5545 iCalendar (.ics) string containing all scheduled milestones and event day.
 *
 * Standards Compliance:
 * 1. Line endings strictly CRLF (\r\n).
 * 2. All-day events specified via `VALUE=DATE` parameters.
 * 3. Line folding at 75 UTF-8 octets preserving code-point integrity.
 * 4. Deterministic UIDs bound to `@occasio` domain.
 * 5. Full escaping of semicolons, commas, backslashes, and newlines.
 *
 * @param plan Active celebration plan.
 * @param now Reference timestamp for injected DTSTAMP header.
 * @returns Fully formatted RFC 5545 .ics payload string.
 */
export function buildIcs(plan: Plan, now: Date | string): string {
  const dtstamp = formatUtcTimestamp(now);
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Occasio//Occasio Event Planner//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  // Milestone events
  for (const milestone of plan.timeline.milestones) {
    const startCompact = compactDate(milestone.dueDate);
    const endCompact = getNextDayCompact(milestone.dueDate);

    lines.push(
      "BEGIN:VEVENT",
      `UID:${milestone.id}@occasio`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;VALUE=DATE:${startCompact}`,
      `DTEND;VALUE=DATE:${endCompact}`,
      `SUMMARY:${escapeIcsText(milestone.title)}`,
      `DESCRIPTION:${escapeIcsText(milestone.title)}`,
      "STATUS:CONFIRMED",
      "END:VEVENT"
    );
  }

  // Celebration Day event
  const eventStart = compactDate(plan.timeline.eventDate);
  const eventEnd = getNextDayCompact(plan.timeline.eventDate);

  lines.push(
    "BEGIN:VEVENT",
    `UID:celebration-${plan.id}@occasio`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;VALUE=DATE:${eventStart}`,
    `DTEND;VALUE=DATE:${eventEnd}`,
    `SUMMARY:${escapeIcsText(plan.input.title)}`,
    "DESCRIPTION:Occasio Celebration Day",
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR"
  );

  const rawDocument = lines.join("\r\n") + "\r\n";
  return foldIcsContent(rawDocument);
}
