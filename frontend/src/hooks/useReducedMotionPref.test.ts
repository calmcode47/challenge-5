import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useUiStore } from "../state/uiStore";
import { useReducedMotionPref } from "./useReducedMotionPref";

describe("useReducedMotionPref hook", () => {
  beforeEach(() => {
    act(() => {
      useUiStore.getState().setEffectsMode("auto");
    });
  });

  it("returns false under default auto settings in jsdom", () => {
    const { result } = renderHook(() => useReducedMotionPref());
    expect(result.current).toBe(false);
  });

  it("returns true when in-app effectsMode is set to reduced", () => {
    const { result } = renderHook(() => useReducedMotionPref());
    expect(result.current).toBe(false);

    act(() => {
      useUiStore.getState().setEffectsMode("reduced");
    });

    expect(result.current).toBe(true);
  });

  it("returns true when in-app effectsMode is set to off", () => {
    const { result } = renderHook(() => useReducedMotionPref());

    act(() => {
      useUiStore.getState().setEffectsMode("off");
    });

    expect(result.current).toBe(true);
  });
});
