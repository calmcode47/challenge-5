import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { EffectsProvider, useEffects } from "../EffectsProvider";

function EffectsConsumer(): JSX.Element {
  const { quality, userMode, setUserMode, paused, setPaused } = useEffects();
  return (
    <div>
      <span data-testid="quality">{quality}</span>
      <span data-testid="user-mode">{userMode}</span>
      <span data-testid="paused">{paused ? "paused" : "running"}</span>
      <button
        type="button"
        onClick={() => {
          setUserMode("off");
        }}
      >
        Turn Off
      </button>
      <button
        type="button"
        onClick={() => {
          setPaused((p) => !p);
        }}
      >
        Toggle Pause
      </button>
    </div>
  );
}

describe("EffectsProvider context & degradation ladder (M07-T7)", () => {
  it("throws descriptive error when useEffects is called outside EffectsProvider", () => {
    expect(() => renderHook(() => useEffects())).toThrow(
      "useEffects must be used within an EffectsProvider"
    );
  });

  it("provides quality level, userMode, and pause state to children", () => {
    render(
      <EffectsProvider>
        <EffectsConsumer />
      </EffectsProvider>
    );

    expect(screen.getByTestId("quality")).toBeInTheDocument();
    expect(screen.getByTestId("user-mode")).toHaveTextContent(/auto|full|reduced|off/);
    expect(screen.getByTestId("paused")).toHaveTextContent("running");
  });

  it("updates quality to static when user mode is switched to off", async () => {
    const user = userEvent.setup();
    render(
      <EffectsProvider>
        <EffectsConsumer />
      </EffectsProvider>
    );

    const offBtn = screen.getByRole("button", { name: "Turn Off" });
    await user.click(offBtn);

    expect(screen.getByTestId("user-mode")).toHaveTextContent("off");
    expect(screen.getByTestId("quality")).toHaveTextContent("static");
  });

  it("toggles pause state when setPaused is invoked", async () => {
    const user = userEvent.setup();
    render(
      <EffectsProvider>
        <EffectsConsumer />
      </EffectsProvider>
    );

    const pauseBtn = screen.getByRole("button", { name: "Toggle Pause" });
    expect(screen.getByTestId("paused")).toHaveTextContent("running");

    await user.click(pauseBtn);
    expect(screen.getByTestId("paused")).toHaveTextContent("paused");

    await user.click(pauseBtn);
    expect(screen.getByTestId("paused")).toHaveTextContent("running");
  });

  it("pauses animation loop when document becomes hidden", () => {
    render(
      <EffectsProvider>
        <EffectsConsumer />
      </EffectsProvider>
    );

    expect(screen.getByTestId("paused")).toHaveTextContent("running");

    act(() => {
      Object.defineProperty(document, "hidden", { value: true, configurable: true });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(screen.getByTestId("paused")).toHaveTextContent("paused");

    act(() => {
      Object.defineProperty(document, "hidden", { value: false, configurable: true });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(screen.getByTestId("paused")).toHaveTextContent("running");
  });
});
