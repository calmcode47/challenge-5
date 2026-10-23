import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { AppShell } from "../../components/layout/AppShell";
import { EffectsToggle } from "../../components/layout/EffectsToggle";
import { useUiStore } from "../../state/uiStore";
import { detectWebGL } from "../capability";
import { EffectsProvider, useEffects } from "../EffectsProvider";
import { SceneRoot } from "../SceneRoot";
import { scrollStore, useScrollSync } from "../scrollStore";

function TelemetrySpy(): JSX.Element {
  useScrollSync();
  const { setPaused, paused, quality } = useEffects();
  return (
    <div>
      <span data-testid="paused-state">{String(paused)}</span>
      <span data-testid="quality-state">{quality}</span>
      <button
        type="button"
        data-testid="toggle-pause-btn"
        onClick={() => {
          setPaused((p) => !p);
        }}
      >
        Toggle
      </button>
    </div>
  );
}

describe("3D branches & edge cases coverage boost (M07-T7)", () => {
  it("covers SceneRoot particle counts for reduced quality and coarse pointers", () => {
    useUiStore.setState({ effectsMode: "reduced" });

    const { unmount } = render(
      <MemoryRouter>
        <EffectsProvider>
          <SceneRoot />
        </EffectsProvider>
      </MemoryRouter>
    );
    expect(screen.queryByTestId("hero-group")).not.toBeInTheDocument();
    unmount();

    // Mock pointer: coarse media query without deprecated methods
    vi.spyOn(window, "matchMedia").mockImplementation((query) => {
      const target = new EventTarget() as MediaQueryList;
      Object.assign(target, {
        matches: query.includes("pointer: coarse"),
        media: query,
        onchange: null,
      });
      return target;
    });

    useUiStore.setState({ effectsMode: "full" });
    render(
      <MemoryRouter>
        <EffectsProvider>
          <SceneRoot />
        </EffectsProvider>
      </MemoryRouter>
    );
    expect(screen.getByTestId("confetti-mesh")).toBeInTheDocument();
  });

  it("handles document visibility changes and functional setPaused in EffectsProvider", async () => {
    const user = userEvent.setup();
    render(
      <EffectsProvider>
        <TelemetrySpy />
      </EffectsProvider>
    );

    const toggleBtn = screen.getByTestId("toggle-pause-btn");
    expect(screen.getByTestId("paused-state")).toHaveTextContent("false");

    await user.click(toggleBtn);
    expect(screen.getByTestId("paused-state")).toHaveTextContent("true");

    await user.click(toggleBtn);
    expect(screen.getByTestId("paused-state")).toHaveTextContent("false");

    // Simulate document visibilitychange
    act(() => {
      Object.defineProperty(document, "hidden", { value: true, configurable: true });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(screen.getByTestId("paused-state")).toHaveTextContent("true");

    act(() => {
      Object.defineProperty(document, "hidden", { value: false, configurable: true });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(screen.getByTestId("paused-state")).toHaveTextContent("false");
  });

  it("covers detectWebGL error and null context branches", () => {
    const spy = vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(() => null);

    expect(detectWebGL()).toBe(false);

    spy.mockImplementation(() => {
      throw new Error("Context creation blocked");
    });

    expect(detectWebGL()).toBe(false);
    spy.mockRestore();
  });

  it("ignores pointer moves when fine pointer query does not match", () => {
    vi.spyOn(window, "matchMedia").mockImplementation((query) => {
      const target = new EventTarget() as MediaQueryList;
      Object.assign(target, {
        matches: false,
        media: query,
        onchange: null,
      });
      return target;
    });

    const initialX = scrollStore.pointerX;
    window.dispatchEvent(new MouseEvent("pointermove", { clientX: 100, clientY: 100 }));
    expect(scrollStore.pointerX).toBe(initialX);
  });

  it("clicks WCAG 2.2.2 pause button in EffectsToggle", async () => {
    const user = userEvent.setup();
    render(
      <EffectsProvider>
        <EffectsToggle />
      </EffectsProvider>
    );

    const pauseBtn = screen.getByRole("button", { name: "Pause background animation" });
    await user.click(pauseBtn);

    const resumeBtn = screen.getByRole("button", { name: "Resume background animation" });
    expect(resumeBtn).toBeInTheDocument();
  });

  it("falls back to setTimeout in AppShell when requestIdleCallback is absent", () => {
    const originalRIC = window.requestIdleCallback.bind(window);
    Reflect.deleteProperty(window, "requestIdleCallback");

    vi.useFakeTimers();
    render(
      <MemoryRouter>
        <AppShell />
      </MemoryRouter>
    );

    act(() => {
      vi.advanceTimersByTime(250);
    });

    vi.useRealTimers();
    window.requestIdleCallback = originalRIC;
  });
});
