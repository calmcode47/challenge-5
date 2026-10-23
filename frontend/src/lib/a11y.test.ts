import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { mergeDescribedBy, useStableId } from "./a11y";

describe("useStableId", () => {
  it("generates a clean id without colons", () => {
    const { result } = renderHook(() => useStableId());
    expect(result.current).toMatch(/^id-[a-zA-Z0-9]+$/);
    expect(result.current).not.toContain(":");
  });

  it("applies the provided prefix", () => {
    const { result } = renderHook(() => useStableId("input-email"));
    expect(result.current).toMatch(/^input-email-[a-zA-Z0-9]+$/);
  });
});

describe("mergeDescribedBy", () => {
  it("combines valid string IDs separated by space", () => {
    expect(mergeDescribedBy("hint-id", "error-id")).toBe("hint-id error-id");
  });

  it("filters out undefined, null, false, and empty strings", () => {
    expect(mergeDescribedBy("hint-id", undefined, "", null, false, "error-id")).toBe(
      "hint-id error-id"
    );
  });

  it("returns undefined if no valid IDs remain", () => {
    expect(mergeDescribedBy(undefined, null, false, "")).toBeUndefined();
    expect(mergeDescribedBy()).toBeUndefined();
  });
});
