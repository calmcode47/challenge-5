import type { Plan, Vendor } from "../../contracts/plan.js";
import { PlanSchema, VendorSchema } from "../../contracts/plan.js";
import { computeVendorVariance } from "../checklist/variance.js";
import { applyIdeaConstraints } from "../ideas/applyIdeaConstraints.js";

function refreshPlanAfterVendorMutation(
  plan: Plan,
  updatedVendors: readonly Vendor[],
  now: Date | string
): Plan {
  const reconciledBudget = computeVendorVariance({
    budget: plan.budget,
    vendors: updatedVendors,
  });

  const updatedIdeas = applyIdeaConstraints(plan.ideas, {
    input: plan.input,
    budget: reconciledBudget,
    pinnedIdeaIds: plan.pinnedIdeaIds,
  });

  const updatedIso = typeof now === "string" ? new Date(now).toISOString() : now.toISOString();

  const nextPlan: Plan = {
    ...plan,
    updatedAt: updatedIso,
    vendors: [...updatedVendors],
    budget: reconciledBudget,
    ideas: updatedIdeas,
  };

  return PlanSchema.parse(nextPlan);
}

/**
 * Pure mutation adding a user-curated vendor and refreshing budget actuals and idea compatibility.
 *
 * @param plan Active celebration plan.
 * @param vendor New vendor record to append.
 * @param now Reference timestamp for updatedAt.
 * @returns Updated Plan with reconciled expenditure variance.
 */
export function addVendor(plan: Plan, vendor: Vendor, now: Date | string): Plan {
  const validatedVendor = VendorSchema.parse(vendor);
  const nextVendors = [...plan.vendors, validatedVendor];
  return refreshPlanAfterVendorMutation(plan, nextVendors, now);
}

/**
 * Pure mutation updating an existing vendor record (stage, quote, payment, contact, or notes).
 *
 * @param plan Active celebration plan.
 * @param vendor Updated vendor record (matched by id).
 * @param now Reference timestamp for updatedAt.
 * @returns Updated Plan with reconciled expenditure variance.
 */
export function updateVendor(plan: Plan, vendor: Vendor, now: Date | string): Plan {
  const validatedVendor = VendorSchema.parse(vendor);
  const nextVendors = plan.vendors.map((v) => (v.id === validatedVendor.id ? validatedVendor : v));
  return refreshPlanAfterVendorMutation(plan, nextVendors, now);
}

/**
 * Pure mutation removing a vendor record from the plan.
 *
 * @param plan Active celebration plan.
 * @param vendorId Unique identifier of vendor to remove.
 * @param now Reference timestamp for updatedAt.
 * @returns Updated Plan with reconciled expenditure variance.
 */
export function removeVendor(plan: Plan, vendorId: string, now: Date | string): Plan {
  const nextVendors = plan.vendors.filter((v) => v.id !== vendorId);
  return refreshPlanAfterVendorMutation(plan, nextVendors, now);
}
