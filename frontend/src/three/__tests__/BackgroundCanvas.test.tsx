import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { useUiStore } from "../../state/uiStore";
import BackgroundCanvas from "../BackgroundCanvas";
import { EffectsProvider } from "../EffectsProvider";

describe("BackgroundCanvas rendering & WebGL recovery (M07-T7)", () => {
  it("renders container with aria-hidden='true' and role='presentation' when quality is full", () => {
    useUiStore.setState({ effectsMode: "full" });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <EffectsProvider>
          <BackgroundCanvas />
        </EffectsProvider>
      </MemoryRouter>
    );

    const container = screen.getByTestId("background-canvas-container");
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute("aria-hidden", "true");
    expect(container).toHaveAttribute("role", "presentation");
  });

  it("does not render canvas when quality tier is static ('off')", () => {
    useUiStore.setState({ effectsMode: "off" });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <EffectsProvider>
          <BackgroundCanvas />
        </EffectsProvider>
      </MemoryRouter>
    );

    expect(screen.queryByTestId("background-canvas-container")).not.toBeInTheDocument();
    expect(screen.queryByTestId("r3f-canvas")).not.toBeInTheDocument();
  });

  it("switches effectsMode to 'off' on webglcontextlost event", () => {
    useUiStore.setState({ effectsMode: "full" });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <EffectsProvider>
          <BackgroundCanvas />
        </EffectsProvider>
      </MemoryRouter>
    );

    const container = screen.getByTestId("background-canvas-container");
    expect(container).toBeInTheDocument();

    act(() => {
      const lostEvent = new Event("webglcontextlost", { cancelable: true });
      container.dispatchEvent(lostEvent);
    });

    expect(useUiStore.getState().effectsMode).toBe("off");
  });
});
