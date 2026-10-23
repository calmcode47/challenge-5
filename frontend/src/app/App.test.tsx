import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { App } from "./App.js";
import { ErrorBoundary } from "./ErrorBoundary.js";
import { LoadingFallback, routes } from "./router.js";
import { useUiStore } from "../state/uiStore.js";

const FlawedComponent = (): never => {
  throw new Error("Kiln temperature exceeded bounds");
};

describe("App & ErrorBoundary", () => {
  it("renders App with home route by default", async () => {
    render(<App />);
    expect(await screen.findByText(/The Joy of/i)).toBeInTheDocument();
  });

  it("renders LoadingFallback skeleton", () => {
    render(<LoadingFallback />);
    expect(screen.getByText("Opening Studio Atelier...")).toBeInTheDocument();
  });

  it("renders notification banner when active in uiStore and auto-dismisses", () => {
    vi.useFakeTimers();
    useUiStore.getState().showNotification("Fired 12 clay plates", "success");

    const { unmount } = render(<App />);
    expect(screen.getByText("Fired 12 clay plates")).toBeInTheDocument();

    const closeBtn = screen.getByLabelText("Dismiss notification");
    fireEvent.click(closeBtn);
    expect(useUiStore.getState().notification).toBeNull();
    unmount();

    useUiStore.getState().showNotification("Information note", "info");
    render(<App />);
    expect(screen.getByText("Information note")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(useUiStore.getState().notification).toBeNull();
    vi.useRealTimers();
  });

  it("catches rendering errors in ErrorBoundary and allows navigation", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    render(
      <ErrorBoundary>
        <FlawedComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText("A Studio Glaze Flaw Occurred")).toBeInTheDocument();
    const returnBtn = screen.getByText("Return to Studio Home");
    expect(returnBtn).toBeInTheDocument();
    fireEvent.click(returnBtn);

    errorSpy.mockRestore();
  });

  it("verifies router configuration exports all paths and renders route elements", () => {
    const paths = routes.map((r) => r.path);
    expect(paths).toContain("/");
    expect(paths).toContain("/studio-home");
    expect(paths).toContain("/plan-wizard");
    expect(paths).toContain("/event-workspace");
    expect(paths).toContain("/my-plans-vault");
    expect(paths).toContain("*");

    for (const r of routes) {
      render(<MemoryRouter>{r.element}</MemoryRouter>);
    }
  });
});
