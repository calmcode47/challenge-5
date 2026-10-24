import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

describe("API", () => {
  it("exposes public and API-scoped health endpoints", async () => {
    const app = createApp();
    const server = app.listen();
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("Expected TCP address");
    const rootResponse = await fetch(`http://127.0.0.1:${String(address.port)}/health`);
    const apiResponse = await fetch(`http://127.0.0.1:${String(address.port)}/api/v1/health`);
    await new Promise<void>((resolve) => server.close(() => resolve()));
    expect(rootResponse.status).toBe(200);
    expect(apiResponse.status).toBe(200);
    await expect(apiResponse.json()).resolves.toMatchObject({ status: "ok" });
  });
});
