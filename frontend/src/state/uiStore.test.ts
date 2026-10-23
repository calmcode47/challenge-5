import { act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { clearAllOccasioKeys, writeJson } from "./persistence";
import { useUiStore } from "./uiStore";

describe("useUiStore", () => {
  beforeEach(() => {
    clearAllOccasioKeys();
    useUiStore.setState({ effectsMode: "auto" });
  });

  afterEach(() => {
    clearAllOccasioKeys();
  });

  it("initializes with default auto mode", () => {
    expect(useUiStore.getState().effectsMode).toBe("auto");
  });

  it("updates and persists effectsMode changes", () => {
    act(() => {
      useUiStore.getState().setEffectsMode("reduced");
    });
    expect(useUiStore.getState().effectsMode).toBe("reduced");

    act(() => {
      useUiStore.getState().setEffectsMode("off");
    });
    expect(useUiStore.getState().effectsMode).toBe("off");
  });

  it("persists valid mode to storage", () => {
    writeJson("ui_state", { effectsMode: "full" });
    act(() => {
      useUiStore.getState().setEffectsMode("full");
    });
    expect(useUiStore.getState().effectsMode).toBe("full");
  });
});
