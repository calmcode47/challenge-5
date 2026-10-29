import { afterEach, describe, expect, it, vi } from "vitest";
import { env } from "../src/config/env.js";
import { CircuitBreaker } from "../src/services/circuitBreaker.js";
import { TtlCache } from "../src/services/cache.js";
import { enrichWithAi, resetAiCircuitForTesting } from "../src/services/llm.js";

const request = {
  title: "Accessible Garden Supper",
  eventType: "community" as const,
  date: "2027-10-12",
  guestCount: 80,
  budget: 12000,
  venue: "Riverside Pavilion",
  notes: "A welcoming accessible supper.",
  accessibility: {
    stepFreeAccess: true,
    allergenAware: true,
    weatherBackup: true,
    lowSensoryOption: false,
  },
};

const originalKey = env.GEMINI_API_KEY;
const originalModel = env.GEMINI_MODEL;

afterEach(() => {
  env.GEMINI_API_KEY = originalKey;
  env.GEMINI_MODEL = originalModel;
  resetAiCircuitForTesting();
  vi.unstubAllGlobals();
});

describe("resilience services", () => {
  it("evicts stale and least-recently-used cache values", () => {
    const cache = new TtlCache<string>(1, 60_000);
    cache.set("first", "one");
    expect(cache.get("first")).toBe("one");
    cache.set("second", "two");
    expect(cache.get("first")).toBeUndefined();
    expect(cache.get("second")).toBe("two");

    const expired = new TtlCache<string>(1, 0);
    expired.set("expired", "value");
    expect(expired.get("expired")).toBeUndefined();
  });

  it("opens and recovers a circuit breaker", () => {
    const breaker = new CircuitBreaker(2, 60_000);
    expect(breaker.canRun).toBe(true);
    breaker.recordFailure();
    expect(breaker.canRun).toBe(true);
    breaker.recordFailure();
    expect(breaker.canRun).toBe(false);
    breaker.recordSuccess();
    expect(breaker.canRun).toBe(true);
  });

  it("uses Gemini only for validated optional enrichment and degrades safely", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            candidates: [
              {
                content: {
                  parts: [
                    {
                      text: JSON.stringify({
                        personalizedIdeas: [
                          "Welcome guests with a local maker table.",
                          "Create a quiet overlooking reset area.",
                        ],
                        vendorChecklist: [
                          "Confirm step-free loading access and backup power.",
                          "Ask for the named on-site emergency contact.",
                        ],
                      }),
                    },
                  ],
                },
              },
            ],
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValue(new Response("{}", { status: 500 }));
    vi.stubGlobal("fetch", fetchMock);
    env.GEMINI_API_KEY = "test-key";
    env.GEMINI_MODEL = "test-model";

    await expect(enrichWithAi(request)).resolves.toMatchObject({
      personalizedIdeas: expect.arrayContaining([
        expect.stringContaining("maker table"),
      ]),
    });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("models/test-model:generateContent?key=test-key"),
      expect.objectContaining({ method: "POST" }),
    );

    await expect(enrichWithAi(request)).resolves.toBeUndefined();
    await expect(enrichWithAi(request)).resolves.toBeUndefined();
    await expect(enrichWithAi(request)).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("does not call an AI service when no API key is configured", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    env.GEMINI_API_KEY = undefined;

    await expect(enrichWithAi(request)).resolves.toBeUndefined();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
