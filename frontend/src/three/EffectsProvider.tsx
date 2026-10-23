import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useUiStore, type EffectsMode } from "../state/uiStore";
import { decideQuality, readSignals, type QualityLevel } from "./capability";

/**
 * Interface contract provided by the 3D visual effects context.
 */
export interface EffectsContextValue {
  /** Active calculated quality level ('full' | 'reduced' | 'static') */
  readonly quality: QualityLevel;
  /** User-configured effects mode ('auto' | 'full' | 'reduced' | 'off') */
  readonly userMode: EffectsMode;
  /** Sets user-configured effects preference */
  readonly setUserMode: (mode: EffectsMode) => void;
  /** Indicates if 3D animation loop is paused (by user or tab visibility) */
  readonly paused: boolean;
  /** Toggles or sets animation loop pause state */
  readonly setPaused: (pausedOrUpdater: boolean | ((prev: boolean) => boolean)) => void;
}

const EffectsContext = createContext<EffectsContextValue | null>(null);

/**
 * Props for EffectsProvider component.
 */
export interface EffectsProviderProps {
  /** Child component subtree */
  readonly children: ReactNode;
}

/**
 * Context provider managing 3D visual quality degradation ladder, motion preferences,
 * and WCAG 2.2.2 animation pause controls.
 *
 * @param props - EffectsProviderProps
 * @returns JSX.Element
 */
export function EffectsProvider({ children }: EffectsProviderProps): JSX.Element {
  const userMode = useUiStore((s) => s.effectsMode);
  const setEffectsMode = useUiStore((s) => s.setEffectsMode);

  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [documentHidden, setDocumentHidden] = useState(() =>
    typeof document !== "undefined" ? document.hidden : false
  );

  // Monitor document visibility to throttle animation loop when backgrounded
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const handleVisibilityChange = (): void => {
      setDocumentHidden(document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const [signals, setSignals] = useState(() => readSignals(userMode));

  // Re-read signals when userMode or media query changes
  useEffect(() => {
    setSignals(readSignals(userMode));

    if (typeof window === "undefined") {
      return;
    }
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (): void => {
      setSignals(readSignals(userMode));
    };
    motionQuery.addEventListener("change", handleMotionChange);
    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, [userMode]);

  const quality = useMemo(() => decideQuality(signals), [signals]);
  const paused = manuallyPaused || documentHidden;

  const setPaused = useCallback((pausedOrUpdater: boolean | ((prev: boolean) => boolean)): void => {
    setManuallyPaused((prev) =>
      typeof pausedOrUpdater === "function" ? pausedOrUpdater(prev) : pausedOrUpdater
    );
  }, []);

  const value = useMemo<EffectsContextValue>(
    () => ({
      quality,
      userMode,
      setUserMode: setEffectsMode,
      paused,
      setPaused,
    }),
    [quality, userMode, setEffectsMode, paused, setPaused]
  );

  return <EffectsContext.Provider value={value}>{children}</EffectsContext.Provider>;
}

/**
 * Accesses active 3D effects quality settings and pause state.
 *
 * @throws Error if called outside EffectsProvider
 * @returns EffectsContextValue
 */
export function useEffects(): EffectsContextValue {
  const ctx = useContext(EffectsContext);
  if (!ctx) {
    throw new Error("useEffects must be used within an EffectsProvider");
  }
  return ctx;
}
