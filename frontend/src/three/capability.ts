import type { EffectsMode } from "../state/uiStore";

/**
 * Three-tier visual effects quality level for graphics rendering.
 */
export type QualityLevel = "full" | "reduced" | "static";

/**
 * Hardware and user preference telemetry signals used to decide 3D rendering tier.
 */
export interface HardwareSignals {
  /** Indicates if WebGL context creation succeeded */
  readonly webgl: boolean;
  /** True if user has prefers-reduced-motion media query enabled */
  readonly prefersReducedMotion: boolean;
  /** True if user has data saving preference enabled in network api */
  readonly saveData: boolean;
  /** Device RAM in GiB if reported by browser */
  readonly deviceMemory?: number;
  /** Logical processor count if reported by browser */
  readonly hardwareConcurrency?: number;
  /** User-selected visual effects mode preference */
  readonly userMode: EffectsMode;
  /** True if primary pointer is coarse (e.g. touch display) */
  readonly isCoarsePointer: boolean;
}

interface NetworkInformationExtended {
  readonly saveData?: boolean;
}

interface NavigatorExtended extends Navigator {
  readonly deviceMemory?: number;
  readonly connection?: NetworkInformationExtended;
}

/**
 * Pure function evaluating hardware capabilities and user preferences to select quality level.
 *
 * @param signals - Captured hardware and preference signals
 * @returns QualityLevel ('full' | 'reduced' | 'static')
 */
export function decideQuality(signals: HardwareSignals): QualityLevel {
  if (signals.userMode === "off" || !signals.webgl) {
    return "static";
  }
  if (signals.userMode === "reduced") {
    return "reduced";
  }
  if (signals.prefersReducedMotion || signals.saveData) {
    return "reduced";
  }
  if (signals.userMode === "full") {
    return "full";
  }
  // Auto mode resolution based on hardware thresholds
  const lowRam = signals.deviceMemory !== undefined && signals.deviceMemory <= 4;
  const lowCores = signals.hardwareConcurrency !== undefined && signals.hardwareConcurrency <= 4;
  if (lowRam || lowCores) {
    return "reduced";
  }
  return "full";
}

/**
 * Determines whether particle counts should be throttled to lite/mobile limits.
 *
 * @param signals - Captured hardware signals
 * @param quality - Resolved quality level
 * @returns True if lite particle budget (180) should be applied
 */
export function isLiteParticles(signals: HardwareSignals, quality: QualityLevel): boolean {
  return quality === "full" && signals.isCoarsePointer;
}

/**
 * Probes browser support for WebGL2 or WebGL on a detached canvas, safely releasing context.
 *
 * @returns True if WebGL is supported and context created successfully
 */
export function detectWebGL(): boolean {
  if (typeof document === "undefined") {
    return false;
  }
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) {
      return false;
    }
    const ext = gl.getExtension("WEBGL_lose_context");
    if (ext) {
      ext.loseContext();
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Reads live browser and hardware signals to determine runtime capabilities.
 *
 * @param userMode - Active user mode preference
 * @returns HardwareSignals snapshot
 */
export function readSignals(userMode: EffectsMode = "auto"): HardwareSignals {
  if (typeof window === "undefined") {
    return {
      webgl: false,
      prefersReducedMotion: false,
      saveData: false,
      userMode,
      isCoarsePointer: false,
    };
  }

  const nav = navigator as NavigatorExtended;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isCoarse = window.matchMedia("(pointer: coarse)").matches;
  const saveData = Boolean(nav.connection?.saveData);

  return {
    webgl: detectWebGL(),
    prefersReducedMotion: prefersReduced,
    saveData,
    deviceMemory: nav.deviceMemory,
    hardwareConcurrency: nav.hardwareConcurrency,
    userMode,
    isCoarsePointer: isCoarse,
  };
}
