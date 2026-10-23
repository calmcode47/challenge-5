import { useEffect, useState } from "react";
import { useUiStore } from "../state/uiStore";

/**
 * Hook determining whether reduced motion should be applied, honoring both
 * OS-level prefers-reduced-motion and in-app visual effects controls (WCAG 2.2.2).
 *
 * @returns boolean - True if motion should be suppressed or reduced.
 */
export function useReducedMotionPref(): boolean {
  const userEffectsMode = useUiStore((s) => s.effectsMode);
  const [systemReduced, setSystemReduced] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent): void => {
      setSystemReduced(e.matches);
    };
    mql.addEventListener("change", handler);
    return () => {
      mql.removeEventListener("change", handler);
    };
  }, []);

  return systemReduced || userEffectsMode === "reduced" || userEffectsMode === "off";
}
