import type { Plan } from "../../contracts/plan.js";
import { PlanSchema } from "../../contracts/plan.js";
import { type Result, err, ok } from "../../lib/result.js";

/**
 * Maximum permissible JSON payload size (1 megabyte) accepted across import boundaries.
 */
export const MAX_PLAN_JSON_BYTES = 1048576; // 1 MB

/**
 * Serializes a canonical celebration plan into a standard JSON string.
 *
 * @param plan Active celebration plan.
 * @param pretty If true, indents output with 2 spaces for human legibility.
 * @returns JSON string containing all plan domain structures.
 */
export function buildPlanJson(plan: Plan, pretty = false): string {
  return JSON.stringify(plan, null, pretty ? 2 : undefined);
}

/**
 * Parses and validates an imported JSON string into a strictly verified Plan instance.
 * Enforces a strict 1 megabyte size guard to thwart memory exhaustion denial-of-service vectors.
 *
 * @param jsonText Raw JSON string from file import or network response.
 * @returns Result containing the validated Plan or string validation diagnostics.
 */
export function parsePlanJson(jsonText: string): Result<Plan, string> {
  const byteLength = new TextEncoder().encode(jsonText).length;
  if (byteLength > MAX_PLAN_JSON_BYTES) {
    return err(`Payload size (${String(byteLength)} bytes) exceeds 1 MB limit`);
  }

  let parsedUnknown: unknown;
  try {
    parsedUnknown = JSON.parse(jsonText);
  } catch (e) {
    return err(`Invalid JSON syntax: ${String(e)}`);
  }

  const result = PlanSchema.safeParse(parsedUnknown);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    return err(`Schema validation failed: ${issues}`);
  }

  return ok(result.data);
}
