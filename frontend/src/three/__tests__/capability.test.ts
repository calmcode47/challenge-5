import { describe, expect, it } from "vitest";
import {
  decideQuality,
  detectWebGL,
  isLiteParticles,
  readSignals,
  type HardwareSignals,
} from "../capability";

describe("capability ladder & signals detector (M07-T7)", () => {
  const baseSignals: HardwareSignals = {
    webgl: true,
    prefersReducedMotion: false,
    saveData: false,
    deviceMemory: 8,
    hardwareConcurrency: 8,
    userMode: "auto",
    isCoarsePointer: false,
  };

  it("forces static tier when userMode is 'off' regardless of hardware", () => {
    const quality = decideQuality({ ...baseSignals, userMode: "off" });
    expect(quality).toBe("static");
  });

  it("forces static tier when WebGL is unavailable even if user requested full", () => {
    const quality = decideQuality({ ...baseSignals, webgl: false, userMode: "full" });
    expect(quality).toBe("static");
  });

  it("honors userMode 'reduced' when WebGL is supported", () => {
    const quality = decideQuality({ ...baseSignals, userMode: "reduced" });
    expect(quality).toBe("reduced");
  });

  it("falls back to reduced tier when prefersReducedMotion is active in auto mode", () => {
    const quality = decideQuality({ ...baseSignals, prefersReducedMotion: true });
    expect(quality).toBe("reduced");
  });

  it("falls back to reduced tier when saveData is enabled in auto mode", () => {
    const quality = decideQuality({ ...baseSignals, saveData: true });
    expect(quality).toBe("reduced");
  });

  it("honors userMode 'full' when WebGL is supported", () => {
    const quality = decideQuality({ ...baseSignals, userMode: "full" });
    expect(quality).toBe("full");
  });

  it("degrades auto mode to reduced when deviceMemory is <= 4 GiB", () => {
    const quality = decideQuality({ ...baseSignals, deviceMemory: 4 });
    expect(quality).toBe("reduced");
  });

  it("degrades auto mode to reduced when hardwareConcurrency is <= 4 cores", () => {
    const quality = decideQuality({ ...baseSignals, hardwareConcurrency: 4 });
    expect(quality).toBe("reduced");
  });

  it("selects full tier in auto mode when device meets performance thresholds", () => {
    const quality = decideQuality(baseSignals);
    expect(quality).toBe("full");
  });

  it("correctly identifies lite particle mode for coarse pointers under full quality", () => {
    expect(isLiteParticles({ ...baseSignals, isCoarsePointer: true }, "full")).toBe(true);
    expect(isLiteParticles({ ...baseSignals, isCoarsePointer: false }, "full")).toBe(false);
    expect(isLiteParticles({ ...baseSignals, isCoarsePointer: true }, "reduced")).toBe(false);
  });

  it("safely probes WebGL support on detached canvas without throwing", () => {
    const supported = detectWebGL();
    expect(typeof supported).toBe("boolean");
  });

  it("reads live hardware and preference signals", () => {
    const signals = readSignals("auto");
    expect(signals.userMode).toBe("auto");
    expect(typeof signals.webgl).toBe("boolean");
    expect(typeof signals.prefersReducedMotion).toBe("boolean");
  });
});
