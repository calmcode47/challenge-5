import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

describe("API", () => {
  it("exposes a health endpoint", async () => {
    const app = createApp();
    const server = app.listen();
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("Expected TCP address");
    const response = await fetch(`http://127.0.0.1:${String(address.port)}/health`);
    await new Promise<void>((resolve) => server.close(() => resolve()));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ status: "ok" });
  });
});
