import { describe, expect, it } from "vitest";
import {
  API_ERROR_CODES,
  ApiErrorCodeSchema,
  ApiErrorPayloadSchema,
  isApiErrorCode,
} from "./errors.js";

describe("errors - ApiErrorCode", () => {
  it("validates all standard and client error codes", () => {
    for (const code of API_ERROR_CODES) {
      expect(ApiErrorCodeSchema.parse(code)).toBe(code);
      expect(isApiErrorCode(code)).toBe(true);
    }
  });

  it("rejects non-standard error codes", () => {
    expect(() => ApiErrorCodeSchema.parse("UNKNOWN_ERR")).toThrow();
    expect(isApiErrorCode("UNKNOWN_ERR")).toBe(false);
    expect(isApiErrorCode(null)).toBe(false);
    expect(isApiErrorCode(500)).toBe(false);
  });
});

describe("errors - ApiErrorPayloadSchema", () => {
  it("validates full structured error envelope", () => {
    const errorEnvelope = {
      error: {
        code: "RATE_LIMITED" as const,
        message: "Too many AI enrichment requests. Please wait before retrying.",
        requestId: "req-err-123",
        retryAfterSeconds: 30,
        details: [
          {
            path: "budget.totalMinor",
            message: "Amount is outside acceptable bounds",
          },
        ],
      },
    };
    const parsed = ApiErrorPayloadSchema.parse(errorEnvelope);
    expect(parsed.error.code).toBe("RATE_LIMITED");
    expect(parsed.error.retryAfterSeconds).toBe(30);
  });

  it("rejects error payload with unknown properties (.strict())", () => {
    const invalidEnvelope = {
      error: {
        code: "INTERNAL" as const,
        message: "An internal server error occurred",
      },
      unauthorizedField: "leaked_internal_state",
    };
    expect(() => ApiErrorPayloadSchema.parse(invalidEnvelope)).toThrow();
  });
});
