import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useDocumentTitle } from "./useDocumentTitle";

describe("useDocumentTitle", () => {
  it("sets formatted document title with suffix", () => {
    renderHook(() => {
      useDocumentTitle("Wizard");
    });
    expect(document.title).toBe("Wizard | Occasio — Event Planner");
  });

  it("sets default suffix title if empty string or undefined", () => {
    renderHook(() => {
      useDocumentTitle();
    });
    expect(document.title).toBe("Occasio — Event Planner");
  });
});
