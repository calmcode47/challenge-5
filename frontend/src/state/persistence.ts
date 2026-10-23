import type { z } from "zod";

/**
 * Standard discriminated union result returned by storage operations.
 */
export type PersistenceResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: string; readonly quarantined?: boolean };

const STORAGE_PREFIX = "occasio:v1:";

/**
 * Normalizes a key name to guarantee the standard Occasio v1 namespace.
 *
 * @param key - Raw storage key or suffix
 * @returns Fully qualified namespaced storage key
 */
export function buildStorageKey(key: string): string {
  return key.startsWith(STORAGE_PREFIX) ? key : `${STORAGE_PREFIX}${key}`;
}

/**
 * Safely reads and validates a JSON value from localStorage using a Zod schema.
 * Corrupt or non-conforming entries are automatically quarantined to prevent repeated errors.
 *
 * @param key - Storage key name
 * @param schema - Zod validation schema for the expected payload
 * @returns Ok with parsed data or Error with failure reason and quarantine indicator
 */
export function readJson<T>(key: string, schema: z.ZodType<T>): PersistenceResult<T> {
  const fullKey = buildStorageKey(key);
  try {
    if (typeof window === "undefined") {
      return { ok: false, error: "STORAGE_UNAVAILABLE" };
    }
    const raw = window.localStorage.getItem(fullKey);
    if (raw === null) {
      return { ok: false, error: "KEY_NOT_FOUND" };
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(raw);
    } catch {
      quarantine(key);
      return { ok: false, error: "MALFORMED_JSON", quarantined: true };
    }

    const validation = schema.safeParse(parsedJson);
    if (!validation.success) {
      quarantine(key);
      return { ok: false, error: "VALIDATION_FAILED", quarantined: true };
    }

    return { ok: true, value: validation.data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Safely serializes and persists a value to localStorage under the Occasio namespace.
 * Catches QuotaExceededError and private-mode security exceptions without throwing.
 *
 * @param key - Storage key name
 * @param value - Value to serialize to JSON
 * @returns Ok on successful write or Error on quota/storage exception
 */
export function writeJson(key: string, value: unknown): PersistenceResult<void> {
  const fullKey = buildStorageKey(key);
  try {
    if (typeof window === "undefined") {
      return { ok: false, error: "STORAGE_UNAVAILABLE" };
    }
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(fullKey, serialized);
    return { ok: true, value: undefined };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "QUOTA_OR_PERMISSION_ERROR",
    };
  }
}

/**
 * Quarantines a corrupt or unparseable localStorage record by renaming it with a timestamp
 * and clearing the active key, preserving forensics without crashing subsequent boots.
 *
 * @param key - Storage key to quarantine
 * @returns True if existing data was quarantined, false otherwise
 */
export function quarantine(key: string): boolean {
  const fullKey = buildStorageKey(key);
  try {
    if (typeof window === "undefined") {
      return false;
    }
    const raw = window.localStorage.getItem(fullKey);
    if (raw === null) {
      return false;
    }
    const timestamp = Date.now().toString();
    const quarantinedKey = `${fullKey}:quarantined:${timestamp}`;
    window.localStorage.setItem(quarantinedKey, raw);
    window.localStorage.removeItem(fullKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Removes a specific key from localStorage.
 *
 * @param key - Storage key to remove
 * @returns Ok on completion or Error if storage access fails
 */
export function removeStorageKey(key: string): PersistenceResult<void> {
  const fullKey = buildStorageKey(key);
  try {
    if (typeof window === "undefined") {
      return { ok: false, error: "STORAGE_UNAVAILABLE" };
    }
    window.localStorage.removeItem(fullKey);
    return { ok: true, value: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Clears all Occasio-namespaced keys from localStorage, leaving other origin keys untouched.
 *
 * @returns Ok on completion or Error if storage access fails
 */
export function clearAllOccasioKeys(): PersistenceResult<void> {
  try {
    if (typeof window === "undefined") {
      return { ok: false, error: "STORAGE_UNAVAILABLE" };
    }
    const keysToRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const k = window.localStorage.key(i);
      if (k?.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(k);
      }
    }
    for (const k of keysToRemove) {
      window.localStorage.removeItem(k);
    }
    return { ok: true, value: undefined };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
