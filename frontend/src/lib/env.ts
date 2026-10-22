import { z } from "zod";

/**
 * Zod schema defining permitted frontend environment variables.
 */
export const EnvSchema = z.object({
  VITE_API_BASE_URL: z.string().min(1).default("/api/v1"),
  VITE_API_MODE: z.enum(["live", "mock"]).default("live"),
});

/**
 * Inferred type representing the parsed and validated environment.
 */
export type AppEnv = z.infer<typeof EnvSchema>;

/**
 * Custom error thrown when environment variable validation fails.
 */
export class EnvValidationError extends Error {
  public readonly issues: z.ZodIssue[];

  /**
   * Initializes a new instance of EnvValidationError.
   * @param message Explanatory error message.
   * @param issues Detailed Zod validation issues.
   */
  constructor(message: string, issues: z.ZodIssue[] = []) {
    super(message);
    this.name = "EnvValidationError";
    this.issues = issues;
  }
}

/**
 * Ensures that mock mode is never enabled in a production environment (M07 S13).
 *
 * @param env Parsed application environment.
 * @param isProd Boolean indicating whether the runtime is production.
 * @throws {EnvValidationError} If mock mode is active in production.
 */
export function assertValidEnv(env: AppEnv, isProd: boolean): void {
  if (isProd && env.VITE_API_MODE === "mock") {
    throw new EnvValidationError(
      "CRITICAL SECURITY VIOLATION: Mock mode (VITE_API_MODE=mock) cannot run in production builds."
    );
  }
}

/**
 * Parses raw environment record against EnvSchema and enforces security invariants.
 *
 * @param raw Key-value record of environment variables.
 * @param isProd Whether current execution context is production (defaults to import.meta.env.PROD).
 * @returns Fully validated and defaulted AppEnv.
 * @throws {EnvValidationError} If validation fails or mock mode is used in production.
 */
export function parseEnv(
  raw: Record<string, unknown> = import.meta.env,
  isProd = import.meta.env.PROD
): AppEnv {
  const result = EnvSchema.safeParse(raw);
  if (!result.success) {
    const errorDetails = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ");
    throw new EnvValidationError(
      `Invalid frontend environment configuration: ${errorDetails}`,
      result.error.issues
    );
  }

  assertValidEnv(result.data, isProd);
  return result.data;
}
