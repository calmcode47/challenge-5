import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useMediaQuery } from "./useMediaQuery";

class FakeMediaEvent extends Event {
  readonly matches: boolean;
  constructor(matches: boolean) {
    super("change");
    this.matches = matches;
  }
}

function createMockMediaQueryList(target: EventTarget, query: string): MediaQueryList {
  Object.assign(target, {
    matches: false,
    media: query,
    onchange: null,
  });
  return target as MediaQueryList;
}

describe("useMediaQuery", () => {
  it("returns match state and listens to changes via addEventListener", () => {
    const target = new EventTarget();
    window.matchMedia = (query: string): MediaQueryList => {
      return createMockMediaQueryList(target, query);
    };

    const { result, unmount } = renderHook(() => {
      return useMediaQuery("(prefers-reduced-motion: reduce)");
    });
    expect(result.current).toBe(false);

    act(() => {
      target.dispatchEvent(new FakeMediaEvent(true));
    });

    expect(result.current).toBe(true);
    unmount();
  });

  it("handles missing matchMedia gracefully", () => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: undefined,
    });
    const { result } = renderHook(() => {
      return useMediaQuery("(min-width: 600px)");
    });
    expect(result.current).toBe(false);
  });
});
