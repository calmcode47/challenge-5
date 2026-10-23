import { err, ok, type Result } from "../lib/result.js";
import { PLAN_SCHEMA_VERSION, type Plan, PlanSchema } from "./plan.js";

/**
 * Migration error classification codes.
 */
export type MigrationErrorCode = "UNSUPPORTED_VERSION" | "MISSING_VERSION" | "VALIDATION_FAILED";

/**
 * Structured error returned when plan schema migration fails.
 */
export interface MigrationError {
  /** Error classifier code. */
  readonly code: MigrationErrorCode;
  /** Human-readable explanatory message. */
  readonly message: string;
  /** Detected schema version, if present. */
  readonly detectedVersion?: number;
  /** Optional validation issues string if validation failed. */
  readonly details?: string;
}

/**
 * Inspects an untyped candidate plan payload, performs necessary schema migrations,
 * and parses it against the canonical PlanSchema.
 *
 * Currently, version 1 is canonical. Version values greater than 1 or missing versions
 * return typed migration errors for graceful degradation and error boundary handling.
 *
 * @param candidate Untyped candidate plan data (e.g. from local cache or untrusted network import).
 * @returns Result wrapping the migrated Plan on success, or a MigrationError on failure.
 */
export function migratePlan(candidate: unknown): Result<Plan, MigrationError> {
  if (typeof candidate !== "object" || candidate === null) {
    return err({
      code: "VALIDATION_FAILED",
      message: "Plan payload must be a non-null object",
    });
  }

  const rawObj = candidate as Record<string, unknown>;
  const version = rawObj.schemaVersion;

  if (typeof version !== "number") {
    return err({
      code: "MISSING_VERSION",
      message: "Plan payload is missing a numeric schemaVersion property",
    });
  }

  if (version !== PLAN_SCHEMA_VERSION) {
    return err({
      code: "UNSUPPORTED_VERSION",
      message: `Unsupported plan schema version: ${String(version)}. Current supported version is ${String(PLAN_SCHEMA_VERSION)}`,
      detectedVersion: version,
    });
  }

  const parseResult = PlanSchema.safeParse(candidate);
  if (!parseResult.success) {
    const errorDetails = parseResult.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    return err({
      code: "VALIDATION_FAILED",
      message: "Plan data failed schema v1 validation",
      detectedVersion: version,
      details: errorDetails,
    });
  }

  return ok(parseResult.data);
}
