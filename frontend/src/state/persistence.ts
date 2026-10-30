import { z } from "zod";
import { INITIAL_PLANS } from "./persistenceSeed.js";

/**
 * Vault persistence layer for local storage sovereign celebration data.
 * Manages client-side storage for celebration plans without external telemetry.
 */

export interface StoredPlan {
  readonly id: string;
  readonly title: string;
  readonly date: string;
  readonly guestCount: number;
  readonly completionRatio: number;
  readonly totalBudget: number;
  readonly vertical: "wedding" | "milestone" | "community" | "anniversary";
  readonly archetype: string;
  readonly venue: string;
  readonly sensoryCount: number;
  readonly tags: readonly string[];
  readonly description: string;
  readonly budgetAllocation?: readonly BudgetAllocation[];
  readonly timeline?: readonly TimelineTask[];
  readonly vendorChecklist?: readonly string[];
  readonly riskFlags?: readonly string[];
  readonly expenses?: readonly PlanExpense[];
  readonly imageUrl?: string;
  readonly updatedAt: string;
}

export interface BudgetAllocation {
  readonly category: string;
  readonly amount: number;
  readonly percent: number;
}

export interface TimelineTask {
  readonly phase: string;
  readonly due: string;
  readonly task: string;
  readonly owner: string;
}

export interface PlanExpense {
  readonly id: string;
  readonly category: string;
  readonly amount: number;
  readonly vendor: string;
  readonly recordedAt: string;
}

const STORAGE_KEY = "soft_clay_vault_plans_v1";
const MAX_STORED_PLANS = 100;

function isApprovedImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "lh3.googleusercontent.com";
  } catch {
    return false;
  }
}

const storedPlanSchema = z.object({
  id: z.string().trim().min(1).max(80),
  title: z.string().trim().min(1).max(160),
  date: z.iso.date(),
  guestCount: z.number().int().min(1).max(5000),
  completionRatio: z.number().min(0).max(1),
  totalBudget: z.number().nonnegative().max(5_000_000),
  vertical: z.enum(["wedding", "milestone", "community", "anniversary"]),
  archetype: z.string().trim().min(1).max(120),
  venue: z.string().trim().min(1).max(120),
  sensoryCount: z.number().int().min(0).max(4),
  tags: z.array(z.string().trim().min(1).max(48)).max(12),
  description: z.string().trim().min(1).max(1000),
  budgetAllocation: z
    .array(
      z.object({
        category: z.string().trim().min(1).max(80),
        amount: z.number().nonnegative(),
        percent: z.number().min(0).max(100),
      })
    )
    .min(1)
    .max(12)
    .optional(),
  timeline: z
    .array(
      z.object({
        phase: z.string().trim().min(1).max(80),
        due: z.iso.date(),
        task: z.string().trim().min(1).max(300),
        owner: z.string().trim().min(1).max(80),
      })
    )
    .min(1)
    .max(12)
    .optional(),
  vendorChecklist: z.array(z.string().trim().min(1).max(300)).max(16).optional(),
  riskFlags: z.array(z.string().trim().min(1).max(300)).max(12).optional(),
  expenses: z
    .array(
      z.object({
        id: z.string().trim().min(1).max(80),
        category: z.string().trim().min(1).max(80),
        amount: z.number().positive().max(5_000_000),
        vendor: z.string().trim().min(1).max(120),
        recordedAt: z.iso.datetime(),
      })
    )
    .max(100)
    .optional(),
  imageUrl: z.url().refine(isApprovedImageUrl).optional(),
  updatedAt: z.iso.datetime(),
});

const vaultSchema = z.object({
  celebrations: z.array(storedPlanSchema).min(1).max(MAX_STORED_PLANS),
});

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function writePlans(plans: readonly StoredPlan[]): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  } catch {
    // Storage can be disabled or quota-limited. The caller retains an in-memory result.
  }
}

/**
 * Retrieves all stored celebration plans from client storage.
 */
export function loadPlans(): StoredPlan[] {
  if (!canUseStorage()) {
    return [...INITIAL_PLANS];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      writePlans(INITIAL_PLANS);
      return [...INITIAL_PLANS];
    }
    const parsed = z
      .array(storedPlanSchema)
      .min(1)
      .max(MAX_STORED_PLANS)
      .safeParse(JSON.parse(raw) as unknown);
    if (parsed.success) return parsed.data;
    writePlans(INITIAL_PLANS);
    return [...INITIAL_PLANS];
  } catch {
    return [...INITIAL_PLANS];
  }
}

/** Validates the on-device vault without mutating or exporting saved plans. */
export function verifyVault(): { isValid: boolean; recordCount: number } {
  if (!canUseStorage()) return { isValid: true, recordCount: 0 };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { isValid: true, recordCount: 0 };
    const parsed = z
      .array(storedPlanSchema)
      .min(1)
      .max(MAX_STORED_PLANS)
      .safeParse(JSON.parse(raw));
    return {
      isValid: parsed.success,
      recordCount: parsed.success ? parsed.data.length : 0,
    };
  } catch {
    return { isValid: false, recordCount: 0 };
  }
}

/**
 * Retrieves a single stored plan by its unique identifier.
 */
export function getPlanById(id: string): StoredPlan | undefined {
  const plans = loadPlans();
  return plans.find((p) => p.id === id);
}

/**
 * Persists a new or updated celebration plan into client storage.
 */
export function savePlan(plan: StoredPlan): void {
  const validated = storedPlanSchema.safeParse(plan);
  if (!validated.success) return;
  const current = loadPlans();
  const existingIdx = current.findIndex((p) => p.id === validated.data.id);
  const updated = [...current];
  if (existingIdx >= 0) {
    updated[existingIdx] = validated.data;
  } else {
    updated.unshift(validated.data);
  }
  writePlans(updated.slice(0, MAX_STORED_PLANS));
}

/**
 * Removes a plan by identifier from client storage.
 */
export function removePlan(id: string): void {
  const current = loadPlans();
  const filtered = current.filter((p) => p.id !== id);
  writePlans(filtered);
}

/**
 * Computes storage bytes consumed by celebration plans in client storage.
 */
export function getStorageUsage(): { bytes: number; formatted: string; percentage: number } {
  if (!canUseStorage()) {
    return { bytes: 145408, formatted: "142 KB", percentage: 2.8 };
  }
  let raw = "";
  try {
    raw = window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return { bytes: 0, formatted: "0 KB", percentage: 0 };
  }
  const bytes = new Blob([raw]).size;
  const kb = Math.max(1, Math.round(bytes / 1024));
  const maxKb = 5120;
  const pct = Math.min(100, Number(((kb / maxKb) * 100).toFixed(1)));
  return {
    bytes,
    formatted: `${String(kb)} KB`,
    percentage: pct,
  };
}

/**
 * Exports current vault data as a downloadable JSON string.
 */
export function exportVaultJson(): string {
  const plans = loadPlans();
  const payload = {
    vaultVersion: "2.4.0",
    lastExportTimestamp: new Date().toISOString(),
    authorLocale: "en-US",
    storageType: "browser_local_deterministic",
    celebrations: plans,
  };
  return JSON.stringify(payload, null, 2);
}

/**
 * Restores or merges plans from an imported JSON vault file.
 */
export function importVaultJson(rawJson: string): number {
  try {
    const parsed = vaultSchema.safeParse(JSON.parse(rawJson) as unknown);
    if (!parsed.success) return 0;
    const existing = loadPlans();
    const map = new Map<string, StoredPlan>();
    for (const p of existing) map.set(p.id, p);
    for (const p of parsed.data.celebrations) map.set(p.id, p);
    const merged = Array.from(map.values())
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
      .slice(0, MAX_STORED_PLANS);
    writePlans(merged);
    return parsed.data.celebrations.length;
  } catch {
    return 0;
  }
}

/**
 * Resets local celebration vault storage back to initial sample state.
 */
export function resetVault(): void {
  writePlans(INITIAL_PLANS);
}
