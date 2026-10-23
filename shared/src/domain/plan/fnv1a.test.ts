import { describe, expect, it } from "vitest";
import { fnv1a } from "./fnv1a.js";

describe("fnv1a", () => {
  it("produces deterministic, stable 8-character hex strings", () => {
    const hash1 = fnv1a("Ananya & Rohan Celebration:2027-06-15:2026-10-23T12:00:00.000Z");
    const hash2 = fnv1a("Ananya & Rohan Celebration:2027-06-15:2026-10-23T12:00:00.000Z");
    expect(hash1).toBe(hash2);
    expect(hash1).toMatch(/^[0-9a-f]{8}$/);
  });

  it("produces distinct hashes for differing inputs", () => {
    const hashA = fnv1a("inputA");
    const hashB = fnv1a("inputB");
    expect(hashA).not.toBe(hashB);
  });

  it("handles empty string correctly", () => {
    const hashEmpty = fnv1a("");
    expect(hashEmpty).toBe("811c9dc5");
  });
});
