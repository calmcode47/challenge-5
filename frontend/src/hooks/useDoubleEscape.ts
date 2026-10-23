import { useEffect, useRef } from "react";

/**
 * Configuration options for the useDoubleEscape hook.
 */
export interface UseDoubleEscapeOptions {
  /** Callback fired when a single Escape is pressed (after threshold without a second press) */
  readonly onSingleEscape?: () => void;
  /** Callback fired when two Escape keys are pressed within thresholdMs */
  readonly onDoubleEscape?: () => void;
  /** Maximum window in milliseconds between Escape presses to register a double-escape (default: 600ms) */
  readonly thresholdMs?: number;
  /** Whether the escape listener is currently active (default: true) */
  readonly enabled?: boolean;
}

/**
 * Accessible keyboard hook conforming to WCAG 2.1.4 and M07-A11.
 * Distinguishes single Esc (dismiss top overlay) from double-Esc within <= 600ms
 * (dismiss all overlays and shift focus back to #main).
 *
 * @param options - Configuration options and callbacks
 */
export function useDoubleEscape(options: UseDoubleEscapeOptions = {}): void {
  const { onSingleEscape, onDoubleEscape, thresholdMs = 600, enabled = true } = options;

  const lastEscapeTimeRef = useRef<number>(0);
  const singleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      const now = Date.now();
      const elapsed = now - lastEscapeTimeRef.current;

      if (singleTimerRef.current !== null) {
        clearTimeout(singleTimerRef.current);
        singleTimerRef.current = null;
      }

      if (elapsed > 0 && elapsed <= thresholdMs) {
        lastEscapeTimeRef.current = 0;
        onDoubleEscape?.();
        const main = document.getElementById("main");
        if (main instanceof HTMLElement) {
          if (!main.hasAttribute("tabindex")) {
            main.setAttribute("tabindex", "-1");
          }
          main.focus();
        }
      } else {
        lastEscapeTimeRef.current = now;
        singleTimerRef.current = setTimeout(() => {
          onSingleEscape?.();
          singleTimerRef.current = null;
        }, thresholdMs);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (singleTimerRef.current !== null) {
        clearTimeout(singleTimerRef.current);
        singleTimerRef.current = null;
      }
    };
  }, [enabled, onSingleEscape, onDoubleEscape, thresholdMs]);
}
