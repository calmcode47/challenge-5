import { create } from "zustand";
import { z } from "zod";
import { readJson, writeJson } from "./persistence";

/**
 * Valid 3D visual effects runtime modes for graceful degradation and WCAG 2.2.2 compliance.
 */
export const EffectsModeSchema = z.enum(["auto", "full", "reduced", "off"]);

/**
 * Type representing visual effects modes.
 */
export type EffectsMode = z.infer<typeof EffectsModeSchema>;

const UI_PERSISTENCE_KEY = "ui_state";

const StoredUiStateSchema = z.object({
  effectsMode: EffectsModeSchema,
});

/**
 * Interface definition for UI state store.
 */
export interface UiState {
  /** Current active visual effects level */
  readonly effectsMode: EffectsMode;
  /** Sets and persists visual effects level */
  readonly setEffectsMode: (mode: EffectsMode) => void;
}

/**
 * Reads initial effects mode from persisted storage with schema validation,
 * defaulting to 'auto' if not found or corrupted.
 */
function getInitialEffectsMode(): EffectsMode {
  const result = readJson(UI_PERSISTENCE_KEY, StoredUiStateSchema);
  return result.ok ? result.value.effectsMode : "auto";
}

/**
 * Global Zustand store managing UI preferences including visual effects degradation levels.
 */
export const useUiStore = create<UiState>((set) => ({
  effectsMode: getInitialEffectsMode(),
  setEffectsMode: (mode: EffectsMode) => {
    set({ effectsMode: mode });
    writeJson(UI_PERSISTENCE_KEY, { effectsMode: mode });
  },
}));
