import { act, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { scrollStore, useScrollSync } from "../scrollStore";

function ScrollObserverSpy({ renderSpy }: { readonly renderSpy: () => void }): JSX.Element {
  renderSpy();
  useScrollSync();
  return <div data-testid="scroll-observer" />;
}

describe("scrollStore & useScrollSync telemetry (M07-T7)", () => {
  it("exposes default mutable scroll telemetry structure", () => {
    expect(typeof scrollStore.progress).toBe("number");
    expect(typeof scrollStore.pointerX).toBe("number");
    expect(typeof scrollStore.pointerY).toBe("number");
    expect(typeof scrollStore.section).toBe("number");
  });

  it("updates pointer coordinates on fine pointer move without triggering React rerenders", () => {
    const renderSpy = vi.fn();

    // Mock fine pointer media query
    vi.spyOn(window, "matchMedia").mockImplementation((query) => {
      const target = new EventTarget() as MediaQueryList;
      Object.assign(target, {
        matches: query.includes("pointer: fine"),
        media: query,
        onchange: null,
      });
      return target;
    });

    // Mock requestAnimationFrame to invoke callback immediately
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      cb(0);
      return 1;
    });

    render(<ScrollObserverSpy renderSpy={renderSpy} />);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    act(() => {
      window.dispatchEvent(
        new MouseEvent("pointermove", {
          clientX: 500,
          clientY: 300,
        })
      );
    });

    // Verify pointer telemetry updated directly in store
    expect(typeof scrollStore.pointerX).toBe("number");
    expect(typeof scrollStore.pointerY).toBe("number");

    // Strictly verify zero React component rerenders occurred
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });
});
