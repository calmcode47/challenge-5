import { z } from "zod";
import { boundedText, idSchema } from "./primitives.js";

/**
 * Standard API and client error codes across HTTP and network failures.
 */
export const API_ERROR_CODES = [
  "VALIDATION_FAILED",
  "SESSION_EXPIRED",
  "CSRF_INVALID",
  "NOT_FOUND",
  "RATE_LIMITED",
  "AI_UNAVAILABLE",
  "BAD_REQUEST",
  "INTERNAL",
  "NETWORK",
  "TIMEOUT",
  "BAD_RESPONSE",
  "ABORTED",
] as const;

/**
 * Zod schema validating API error codes.
 */
export const ApiErrorCodeSchema = z.enum(API_ERROR_CODES);

/**
 * Standard error code identifier.
 */
export type ApiErrorCode = z.infer<typeof ApiErrorCodeSchema>;

/**
 * Type guard for ApiErrorCode.
 *
 * @param value Candidate error code value.
 * @returns True if value is a valid ApiErrorCode.
 */
export function isApiErrorCode(value: unknown): value is ApiErrorCode {
  return typeof value === "string" && (API_ERROR_CODES as readonly string[]).includes(value);
}

/**
 * Detailed field-level validation error descriptor.
 */
export const ApiErrorDetailSchema = z.object({
  path: z.string().min(1).max(200),
  message: z.string().min(1).max(500),
});

/**
 * Inferred type of an API error detail entry.
 */
export type ApiErrorDetail = z.infer<typeof ApiErrorDetailSchema>;

/**
 * Error container schema returned by the backend and produced by client network layer.
 */
export const ApiErrorBodySchema = z.object({
  code: ApiErrorCodeSchema,
  message: boundedText({ min: 1, max: 500 }),
  requestId: idSchema.optional(),
  retryAfterSeconds: z.number().int().min(0).max(86400).optional(),
  details: z.array(ApiErrorDetailSchema).optional(),
});

/**
 * Inferred type of the inner API error body.
 */
export type ApiErrorBody = z.infer<typeof ApiErrorBodySchema>;

/**
 * Envelope schema enclosing API error payloads.
 */
export const ApiErrorPayloadSchema = z
  .object({
    error: ApiErrorBodySchema,
  })
  .strict();

/**
 * Inferred type of an API error payload envelope.
 */
export type ApiErrorPayload = z.infer<typeof ApiErrorPayloadSchema>;
