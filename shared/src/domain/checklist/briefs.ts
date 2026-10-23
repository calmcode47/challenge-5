import type { PlanInput } from "../../contracts/planInput.js";
import { VendorBriefSchema, type VendorBrief } from "../../contracts/planComponents.js";
import { categoriesForEventType } from "../../contracts/categories.js";
import {
  BRIEF_CATALOG_PART_1,
  type BriefContent,
  type BriefCatalogPart1Key,
} from "./briefCatalogPart1.js";
import { BRIEF_CATALOG_PART_2, type BriefCatalogPart2Key } from "./briefCatalogPart2.js";

const BASELINE_BRIEFS: Record<BriefCatalogPart1Key | BriefCatalogPart2Key, BriefContent> = {
  ...BRIEF_CATALOG_PART_1,
  ...BRIEF_CATALOG_PART_2,
};

/**
 * Builds baseline vendor evaluation briefs for all active categories in an event plan.
 * Does not emit business entities, URLs, or prices.
 *
 * @param input Validated user event configuration.
 * @returns Array of VendorBrief objects for active vendor categories.
 */
export function buildBaselineBriefs(input: PlanInput): VendorBrief[] {
  const activeCategories = categoriesForEventType(input.eventType);
  const briefs: VendorBrief[] = [];

  for (const cat of activeCategories) {
    if (cat === "contingency") {
      continue;
    }
    const template = BASELINE_BRIEFS[cat];
    const brief: VendorBrief = {
      categoryId: cat,
      whatToLookFor: [...template.whatToLookFor],
      questionsToAsk: [...template.questionsToAsk],
      redFlags: [...template.redFlags],
      contractTerms: [...template.contractTerms],
    };
    briefs.push(VendorBriefSchema.parse(brief));
  }

  return briefs;
}
