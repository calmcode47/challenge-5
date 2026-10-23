import { describe, expect, it } from "vitest";
import { lerpPalette, paletteFor } from "../palette";

describe("3D Palette System (M04 / M07-T7)", () => {
  it("returns distinct curated 3-color palettes for each event type", () => {
    const wedding = paletteFor("wedding");
    const birthday = paletteFor("birthday");
    const community = paletteFor("community");
    const other = paletteFor("other");

    expect(wedding).toHaveLength(3);
    expect(birthday).toHaveLength(3);
    expect(community).toHaveLength(3);
    expect(other).toHaveLength(3);

    expect(wedding[0]).toBe("#9A8CFF");
    expect(birthday[0]).toBe("#FF7A6B");
    expect(community[0]).toBe("#5EEAD4");
    expect(other[0]).toBe("#F2C879");
  });

  it("returns section-shifted neutral palettes according to scroll progress", () => {
    const sec0 = paletteFor("neutral", 0);
    const sec1 = paletteFor("neutral", 1);
    const sec2 = paletteFor("neutral", 2);
    const sec3 = paletteFor("neutral", 3);

    expect(sec0).toHaveLength(3);
    expect(sec1).toHaveLength(3);
    expect(sec2).toHaveLength(3);
    expect(sec3).toHaveLength(3);

    expect(sec0[0]).toBe("#F2C879");
    expect(sec1[0]).toBe("#9A8CFF");
    expect(sec2[0]).toBe("#5EEAD4");
    expect(sec3[0]).toBe("#FF7A6B");
  });

  it("clamps out-of-range section numbers safely", () => {
    const negative = paletteFor("neutral", -5);
    const excessive = paletteFor("neutral", 99);

    expect(negative[0]).toBe("#F2C879");
    expect(excessive[0]).toBe("#FF7A6B");
  });

  it("linearly interpolates between palette tuples at boundary values", () => {
    const palA: readonly [string, string, string] = ["#000000", "#101010", "#202020"];
    const palB: readonly [string, string, string] = ["#FFFFFF", "#EEEEEE", "#DDDDDD"];

    const atZero = lerpPalette(palA, palB, 0);
    expect(atZero).toEqual(["#000000", "#101010", "#202020"]);

    const atOne = lerpPalette(palA, palB, 1);
    expect(atOne).toEqual(["#ffffff", "#eeeeee", "#dddddd"]);
  });

  it("linearly interpolates intermediate colors at t=0.5", () => {
    const palA: readonly [string, string, string] = ["#000000", "#000000", "#000000"];
    const palB: readonly [string, string, string] = ["#FFFFFF", "#FFFFFF", "#FFFFFF"];

    const mid = lerpPalette(palA, palB, 0.5);
    expect(mid[0]).toBe("#808080");
    expect(mid[1]).toBe("#808080");
    expect(mid[2]).toBe("#808080");
  });
});
