import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import {
  clearAllOccasioKeys,
  quarantine,
  readJson,
  removeStorageKey,
  writeJson,
} from "./persistence";

const UserPrefsSchema = z.object({
  theme: z.enum(["dark", "light"]),
  volume: z.number().min(0).max(100),
});

describe("persistence layer", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("writes and reads valid JSON data with Zod schema verification", () => {
    const data = { theme: "dark" as const, volume: 80 };
    const writeRes = writeJson("prefs", data);
    expect(writeRes.ok).toBe(true);

    const readRes = readJson("prefs", UserPrefsSchema);
    expect(readRes.ok).toBe(true);
    if (readRes.ok) {
      expect(readRes.value).toEqual(data);
    }
  });

  it("returns KEY_NOT_FOUND when key does not exist", () => {
    const readRes = readJson("non_existent", UserPrefsSchema);
    expect(readRes.ok).toBe(false);
    if (!readRes.ok) {
      expect(readRes.error).toBe("KEY_NOT_FOUND");
    }
  });

  it("quarantines corrupt/malformed JSON without throwing", () => {
    window.localStorage.setItem("occasio:v1:corrupt", "{invalid json");
    const readRes = readJson("corrupt", UserPrefsSchema);

    expect(readRes.ok).toBe(false);
    if (!readRes.ok) {
      expect(readRes.error).toBe("MALFORMED_JSON");
      expect(readRes.quarantined).toBe(true);
    }

    expect(window.localStorage.getItem("occasio:v1:corrupt")).toBeNull();

    let foundQuarantine = false;
    for (let i = 0; i < window.localStorage.length; i += 1) {
      if (window.localStorage.key(i)?.startsWith("occasio:v1:corrupt:quarantined:")) {
        foundQuarantine = true;
        break;
      }
    }
    expect(foundQuarantine).toBe(true);
  });

  it("quarantines data that fails Zod schema validation", () => {
    window.localStorage.setItem(
      "occasio:v1:invalid_schema",
      JSON.stringify({ theme: "neon", volume: 999 })
    );

    const readRes = readJson("invalid_schema", UserPrefsSchema);
    expect(readRes.ok).toBe(false);
    if (!readRes.ok) {
      expect(readRes.error).toBe("VALIDATION_FAILED");
      expect(readRes.quarantined).toBe(true);
    }
    expect(window.localStorage.getItem("occasio:v1:invalid_schema")).toBeNull();
  });

  it("quarantine returns false if key does not exist", () => {
    expect(quarantine("does_not_exist")).toBe(false);
  });

  it("removes single key correctly", () => {
    writeJson("to_delete", { theme: "dark" as const, volume: 50 });
    expect(readJson("to_delete", UserPrefsSchema).ok).toBe(true);

    removeStorageKey("to_delete");
    expect(readJson("to_delete", UserPrefsSchema).ok).toBe(false);
  });

  it("clears all occasio keys while preserving foreign keys", () => {
    window.localStorage.setItem("occasio:v1:item1", "test1");
    window.localStorage.setItem("occasio:v1:item2", "test2");
    window.localStorage.setItem("unrelated_app:setting", "preserved");

    clearAllOccasioKeys();

    expect(window.localStorage.getItem("occasio:v1:item1")).toBeNull();
    expect(window.localStorage.getItem("occasio:v1:item2")).toBeNull();
    expect(window.localStorage.getItem("unrelated_app:setting")).toBe("preserved");
  });

  it("catches storage exceptions in writeJson gracefully", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });

    const res = writeJson("overflow", { theme: "dark" as const, volume: 50 });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.error).toBe("QuotaExceededError");
    }
  });

  it("catches storage exceptions in readJson gracefully", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });

    const res = readJson("blocked", UserPrefsSchema);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.error).toBe("SecurityError");
    }
  });

  it("catches storage exceptions in removeStorageKey and clearAllOccasioKeys", () => {
    window.localStorage.setItem("occasio:v1:temp", "val");
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("DiskAccessError");
    });

    const removeRes = removeStorageKey("some_key");
    expect(removeRes.ok).toBe(false);

    const clearRes = clearAllOccasioKeys();
    expect(clearRes.ok).toBe(false);
  });
});
