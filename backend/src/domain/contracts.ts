import { z } from "zod";

export const eventTypeSchema = z.enum(["wedding", "milestone", "community", "anniversary"]);

export const planRequestSchema = z.object({
  title: z.string().trim().min(2).max(120),
  eventType: eventTypeSchema,
  date: z.string().date(),
  guestCount: z.coerce.number().int().min(2).max(5000),
  budget: z.coerce.number().positive().max(5_000_000),
  venue: z.string().trim().min(2).max(120),
  notes: z.string().trim().max(1500).default(""),
  accessibility: z.object({
    stepFreeAccess: z.boolean().default(false),
    allergenAware: z.boolean().default(false),
    weatherBackup: z.boolean().default(false),
    lowSensoryOption: z.boolean().default(false),
  }).default({
    stepFreeAccess: false,
    allergenAware: false,
    weatherBackup: false,
    lowSensoryOption: false,
  }),
});

export type PlanRequest = z.infer<typeof planRequestSchema>;

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

export interface GeneratedPlan {
  readonly id: string;
  readonly title: string;
  readonly eventType: PlanRequest["eventType"];
  readonly date: string;
  readonly guestCount: number;
  readonly budget: number;
  readonly venue: string;
  readonly budgetAllocation: readonly BudgetAllocation[];
  readonly timeline: readonly TimelineTask[];
  readonly vendorChecklist: readonly string[];
  readonly personalizedIdeas: readonly string[];
  readonly riskFlags: readonly string[];
  readonly aiMode: "live" | "deterministic";
  readonly generatedAt: string;
}
