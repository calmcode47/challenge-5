import { describe, it, expect } from "vitest";
import { ok, err, isOk, isErr, map, mapErr, unwrapOr } from "./result.js";

describe("Result utility", () => {
  it("creates and inspects successful results", () => {
    const res = ok(42);
    expect(res.ok).toBe(true);
    expect(isOk(res)).toBe(true);
    expect(isErr(res)).toBe(false);
    if (isOk(res)) {
      expect(res.value).toBe(42);
    }
  });

  it("creates and inspects error results", () => {
    const res = err("INVALID_INPUT");
    expect(res.ok).toBe(false);
    expect(isOk(res)).toBe(false);
    expect(isErr(res)).toBe(true);
    if (isErr(res)) {
      expect(res.error).toBe("INVALID_INPUT");
    }
  });

  it("maps value when ok, ignores error", () => {
    const success = ok(10);
    const mapped = map(success, (n) => n * 2);
    expect(unwrapOr(mapped, 0)).toBe(20);

    const failure = err("FAILED");
    const mappedFail = map(failure, (n: number) => n * 2);
    expect(isErr(mappedFail)).toBe(true);
  });

  it("maps error when err, ignores value", () => {
    const failure = err("NOT_FOUND");
    const mapped = mapErr(failure, (msg) => `ERR: ${msg}`);
    if (isErr(mapped)) {
      expect(mapped.error).toBe("ERR: NOT_FOUND");
    }

    const success = ok("DATA");
    const mappedSuccess = mapErr(success, (msg: string) => `ERR: ${msg}`);
    expect(unwrapOr(mappedSuccess, "FALLBACK")).toBe("DATA");
  });

  it("unwraps with fallback correctly", () => {
    expect(unwrapOr(ok("HELLO"), "WORLD")).toBe("HELLO");
    expect(unwrapOr(err("NOPE"), "DEFAULT")).toBe("DEFAULT");
  });
});
