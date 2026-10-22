import { describe, it, expect } from "vitest";
import { parseEnv, assertValidEnv, EnvValidationError } from "./env.js";

describe("Frontend environment validation", () => {
  it("defaults to live mode and /api/v1 base URL when variables are omitted", () => {
    const env = parseEnv({}, false);
    expect(env.VITE_API_BASE_URL).toBe("/api/v1");
    expect(env.VITE_API_MODE).toBe("live");
  });

  it("parses explicitly configured environment variables", () => {
    const env = parseEnv(
      {
        VITE_API_BASE_URL: "https://api.occasio.app/v1",
        VITE_API_MODE: "mock",
      },
      false
    );
    expect(env.VITE_API_BASE_URL).toBe("https://api.occasio.app/v1");
    expect(env.VITE_API_MODE).toBe("mock");
  });

  it("rejects invalid VITE_API_MODE with an EnvValidationError", () => {
    expect(() => {
      parseEnv({ VITE_API_MODE: "staging" }, false);
    }).toThrow(EnvValidationError);
  });

  it("rejects empty VITE_API_BASE_URL", () => {
    expect(() => {
      parseEnv({ VITE_API_BASE_URL: "" }, false);
    }).toThrow(EnvValidationError);
  });

  it("throws a security violation when mock mode is enabled in production", () => {
    expect(() => {
      assertValidEnv({ VITE_API_BASE_URL: "/api/v1", VITE_API_MODE: "mock" }, true);
    }).toThrow(/Mock mode .* cannot run in production/);
  });

  it("allows mock mode in development/testing environments", () => {
    expect(() => {
      assertValidEnv({ VITE_API_BASE_URL: "/api/v1", VITE_API_MODE: "mock" }, false);
    }).not.toThrow();
  });
});
