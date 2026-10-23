import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDoubleEscape } from "./useDoubleEscape";

describe("useDoubleEscape", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    const existing = document.getElementById("main");
    if (existing) {
      existing.remove();
    }
  });

  it("fires onSingleEscape when Escape is pressed once and timer elapses", () => {
    const onSingle = vi.fn();
    const onDouble = vi.fn();

    renderHook(() => {
      useDoubleEscape({
        onSingleEscape: onSingle,
        onDoubleEscape: onDouble,
        thresholdMs: 600,
      });
    });

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    expect(onSingle).not.toHaveBeenCalled();
    expect(onDouble).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(onSingle).toHaveBeenCalledTimes(1);
    expect(onDouble).not.toHaveBeenCalled();
  });

  it("fires onDoubleEscape and shifts focus to #main when Escape is pressed twice within 600ms", () => {
    const onSingle = vi.fn();
    const onDouble = vi.fn();

    const mainEl = document.createElement("main");
    mainEl.id = "main";
    document.body.appendChild(mainEl);

    renderHook(() => {
      useDoubleEscape({
        onSingleEscape: onSingle,
        onDoubleEscape: onDouble,
        thresholdMs: 600,
      });
    });

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    act(() => {
      vi.advanceTimersByTime(200);
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    expect(onDouble).toHaveBeenCalledTimes(1);
    expect(onSingle).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(mainEl);

    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(onSingle).not.toHaveBeenCalled();
  });

  it("ignores non-Escape keys", () => {
    const onSingle = vi.fn();
    renderHook(() => {
      useDoubleEscape({
        onSingleEscape: onSingle,
      });
    });

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      vi.advanceTimersByTime(700);
    });

    expect(onSingle).not.toHaveBeenCalled();
  });

  it("does nothing when enabled is false", () => {
    const onSingle = vi.fn();
    renderHook(() => {
      useDoubleEscape({
        onSingleEscape: onSingle,
        enabled: false,
      });
    });

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      vi.advanceTimersByTime(700);
    });

    expect(onSingle).not.toHaveBeenCalled();
  });

  it("fires two onSingleEscape calls when Escapes are separated by > 600ms", () => {
    const onSingle = vi.fn();
    const onDouble = vi.fn();

    renderHook(() => {
      useDoubleEscape({
        onSingleEscape: onSingle,
        onDoubleEscape: onDouble,
        thresholdMs: 600,
      });
    });

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    act(() => {
      vi.advanceTimersByTime(650);
    });

    expect(onSingle).toHaveBeenCalledTimes(1);

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    act(() => {
      vi.advanceTimersByTime(650);
    });

    expect(onSingle).toHaveBeenCalledTimes(2);
    expect(onDouble).not.toHaveBeenCalled();
  });
});
