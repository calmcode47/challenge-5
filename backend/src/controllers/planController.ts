import type { RequestHandler } from "express";
import { planRequestSchema } from "../domain/contracts.js";
import {
  isUnsafePrompt,
  normalizeUserText,
} from "../guardrails/promptSafety.js";
import { TtlCache } from "../services/cache.js";
import { enrichWithAi } from "../services/llm.js";
import {
  createDeterministicPlan,
  requestFingerprint,
} from "../services/planner.js";
import type { GeneratedPlan } from "../domain/contracts.js";

const planCache = new TtlCache<GeneratedPlan>();

/** Clears process-local state between isolated integration tests. */
export function resetPlanCacheForTesting(): void {
  planCache.clear();
}

/** Creates a usable, structured event plan with optional Gemini enrichment. */
export const generatePlan: RequestHandler = async (request, response, next) => {
  try {
    const raw = planRequestSchema.parse(request.body);
    const notes = normalizeUserText(raw.notes);
    if (isUnsafePrompt(notes)) {
      response.status(422).json({
        error: {
          code: "UNSAFE_BRIEF",
          message:
            "Please describe the event without instructions directed at the planning assistant.",
        },
      });
      return;
    }
    const brief = { ...raw, notes };
    const key = requestFingerprint(brief);
    const cached = planCache.get(key);
    if (cached) {
      response.setHeader("X-Plan-Cache", "HIT");
      response.status(200).json({ data: cached });
      return;
    }
    const deterministic = createDeterministicPlan(brief);
    const enrichment = await enrichWithAi(brief);
    const plan: GeneratedPlan = enrichment
      ? {
          ...deterministic,
          personalizedIdeas: enrichment.personalizedIdeas,
          vendorChecklist: [
            ...deterministic.vendorChecklist,
            ...enrichment.vendorChecklist,
          ],
          aiMode: "live",
        }
      : deterministic;
    planCache.set(key, plan);
    response.status(201).json({ data: plan });
  } catch (error) {
    next(error);
  }
};
