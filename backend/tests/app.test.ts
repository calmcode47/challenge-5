import express from "express";
import { afterEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { env } from "../src/config/env.js";
import {
  resetRateLimitBucketsForTesting,
  rateLimit,
} from "../src/middleware/rateLimit.js";

const originalNodeEnv = env.NODE_ENV;
const originalAllowedOrigins = env.allowedOrigins;

async function withServer<T>(
  app: express.Express,
  work: (baseUrl: string) => Promise<T>,
): Promise<T> {
  const server = app.listen();
  const address = server.address();
  if (!address || typeof address === "string")
    throw new Error("Expected TCP address");
  try {
    return await work(`http://127.0.0.1:${String(address.port)}`);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}

afterEach(() => {
  env.NODE_ENV = originalNodeEnv;
  env.allowedOrigins = originalAllowedOrigins;
  resetRateLimitBucketsForTesting();
});

describe("API", () => {
  it("exposes public and API-scoped health endpoints", async () => {
    const app = createApp();
    const server = app.listen();
    const address = server.address();
    if (!address || typeof address === "string")
      throw new Error("Expected TCP address");
    const rootResponse = await fetch(
      `http://127.0.0.1:${String(address.port)}/health`,
    );
    const apiResponse = await fetch(
      `http://127.0.0.1:${String(address.port)}/api/v1/health`,
    );
    await new Promise<void>((resolve) => server.close(() => resolve()));
    expect(rootResponse.status).toBe(200);
    expect(apiResponse.status).toBe(200);
    await expect(apiResponse.json()).resolves.toMatchObject({ status: "ok" });
  });

  it("rejects browser origins outside the production allowlist with a stable error", async () => {
    env.NODE_ENV = "production";
    env.allowedOrigins = ["https://studio.example"];

    await withServer(createApp(), async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/v1/health`, {
        headers: { Origin: "https://untrusted.example" },
      });
      expect(response.status).toBe(403);
      await expect(response.json()).resolves.toMatchObject({
        error: { code: "ORIGIN_NOT_ALLOWED" },
      });
    });
  });

  it("bounds distinct rate-limit buckets to prevent unbounded in-memory growth", async () => {
    const app = express();
    app.set("trust proxy", 1);
    app.get("/limited", rateLimit(5, 60_000, 2), (_request, response) => {
      response.status(200).json({ status: "ok" });
    });

    await withServer(app, async (baseUrl) => {
      for (const address of ["203.0.113.1", "203.0.113.2"]) {
        const response = await fetch(`${baseUrl}/limited`, {
          headers: { "X-Forwarded-For": address },
        });
        expect(response.status).toBe(200);
      }
      const response = await fetch(`${baseUrl}/limited`, {
        headers: { "X-Forwarded-For": "203.0.113.3" },
      });
      expect(response.status).toBe(429);
      await expect(response.json()).resolves.toMatchObject({
        error: { code: "RATE_LIMIT_CAPACITY" },
      });
    });
  });
});
