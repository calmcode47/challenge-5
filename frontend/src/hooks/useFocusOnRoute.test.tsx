import { render, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useFocusOnRoute } from "./useFocusOnRoute";

describe("useFocusOnRoute", () => {
  it("skips focus shift on initial mount", () => {
    const { container } = render(
      <div>
        <h1>Page Title</h1>
      </div>
    );
    const h1 = container.querySelector("h1");
    expect(document.activeElement).not.toBe(h1);

    renderHook(
      ({ path }) => {
        useFocusOnRoute(path);
      },
      {
        initialProps: { path: "/" },
      }
    );

    expect(document.activeElement).not.toBe(h1);
  });

  it("shifts focus to h1 on pathname change", () => {
    const { container } = render(
      <div>
        <h1>Page Title</h1>
      </div>
    );
    const h1 = container.querySelector("h1");

    const { rerender } = renderHook(
      ({ path }) => {
        useFocusOnRoute(path);
      },
      {
        initialProps: { path: "/initial" },
      }
    );

    rerender({ path: "/next-page" });
    expect(document.activeElement).toBe(h1);
    expect(h1?.getAttribute("tabindex")).toBe("-1");
  });

  it("falls back to #main if no h1 exists", () => {
    const { container } = render(
      <main id="main">
        <p>No heading here</p>
      </main>
    );
    const main = container.querySelector("#main");

    const { rerender } = renderHook(
      ({ path }) => {
        useFocusOnRoute(path);
      },
      {
        initialProps: { path: "/first" },
      }
    );

    rerender({ path: "/second" });
    expect(document.activeElement).toBe(main);
    expect(main?.getAttribute("tabindex")).toBe("-1");
  });
});
