import type { EventType } from "@occasio/shared";

/**
 * Three-color hex palette tuple driving shaders and instanced confetti meshes.
 */
export type PaletteTuple = readonly [string, string, string];

const BASE_PALETTES: Record<EventType | "neutral", PaletteTuple> = {
  wedding: ["#9A8CFF", "#F2C879", "#2E1A47"],
  birthday: ["#FF7A6B", "#F2C879", "#4A1820"],
  community: ["#5EEAD4", "#F2C879", "#113834"],
  other: ["#F2C879", "#9A8CFF", "#252033"],
  neutral: ["#F2C879", "#9A8CFF", "#5EEAD4"],
};

const SECTION_SHIFTS: readonly PaletteTuple[] = [
  ["#F2C879", "#9A8CFF", "#5EEAD4"], // Hero
  ["#9A8CFF", "#5EEAD4", "#F2C879"], // Features
  ["#5EEAD4", "#FF7A6B", "#9A8CFF"], // Value
  ["#FF7A6B", "#F2C879", "#5EEAD4"], // CTA
];

/**
 * Returns a 3-color palette tuple derived from event type and scroll section.
 *
 * @param eventType - Target event category or 'neutral'
 * @param section - Optional section index (0-3)
 * @returns Three-color hex tuple [uA, uB, uC]
 */
export function paletteFor(
  eventType: EventType | "neutral" = "neutral",
  section?: number
): PaletteTuple {
  if (section !== undefined && eventType === "neutral") {
    const safeIndex = Math.min(SECTION_SHIFTS.length - 1, Math.max(0, Math.floor(section)));
    const shifted = SECTION_SHIFTS[safeIndex];
    if (shifted) {
      return shifted;
    }
  }
  return BASE_PALETTES[eventType];
}

/**
 * Parses a hex color string into 0-1 floating point RGB components.
 */
function parseHexRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * Converts integer RGB values into standard 6-digit hex string with leading #.
 */
function toHexRgb(r: number, g: number, b: number): string {
  const clampR = Math.max(0, Math.min(255, Math.round(r)));
  const clampG = Math.max(0, Math.min(255, Math.round(g)));
  const clampB = Math.max(0, Math.min(255, Math.round(b)));
  return (
    "#" +
    clampR.toString(16).padStart(2, "0") +
    clampG.toString(16).padStart(2, "0") +
    clampB.toString(16).padStart(2, "0")
  );
}

/**
 * Pure linear interpolation between two hex colors.
 */
function lerpHex(a: string, b: string, t: number): string {
  const [ar, ag, ab] = parseHexRgb(a);
  const [br, bg, bb] = parseHexRgb(b);
  const clampedT = Math.max(0, Math.min(1, t));
  return toHexRgb(ar + (br - ar) * clampedT, ag + (bg - ag) * clampedT, ab + (bb - ab) * clampedT);
}

/**
 * Linearly interpolates between two 3-color palette tuples.
 *
 * @param a - Starting palette tuple
 * @param b - Ending palette tuple
 * @param t - Normalized blend factor between 0.0 and 1.0
 * @returns Interpolated palette tuple
 */
export function lerpPalette(a: PaletteTuple, b: PaletteTuple, t: number): PaletteTuple {
  return [lerpHex(a[0], b[0], t), lerpHex(a[1], b[1], t), lerpHex(a[2], b[2], t)];
}
