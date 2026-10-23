import type { MilestoneTemplate } from "./templatesDataPart1.js";

/**
 * Standard milestone scheduling templates for community festivals and events.
 */
export const COMMUNITY_TEMPLATES: readonly MilestoneTemplate[] = [
  {
    id: "objectives_and_approvals",
    titleKey: "timeline.milestone.community.objectives_and_approvals.title",
    leadDays: 120,
    dependsOn: [],
    critical: true,
  },
  {
    id: "permits_and_insurance",
    titleKey: "timeline.milestone.community.permits_and_insurance.title",
    categoryId: "permits_insurance",
    leadDays: 90,
    dependsOn: [],
    critical: true,
  },
  {
    id: "venue_and_av",
    titleKey: "timeline.milestone.community.venue_and_av.title",
    categoryId: "venue",
    leadDays: 75,
    dependsOn: [],
    critical: true,
  },
  {
    id: "sponsors_and_partners",
    titleKey: "timeline.milestone.community.sponsors_and_partners.title",
    categoryId: "marketing",
    leadDays: 75,
    dependsOn: [],
    critical: false,
  },
  {
    id: "volunteer_recruitment",
    titleKey: "timeline.milestone.community.volunteer_recruitment.title",
    categoryId: "staffing",
    leadDays: 60,
    dependsOn: [],
    critical: true,
  },
  {
    id: "marketing_launch",
    titleKey: "timeline.milestone.community.marketing_launch.title",
    categoryId: "marketing",
    leadDays: 45,
    dependsOn: ["venue_and_av"],
    critical: true,
  },
  {
    id: "safety_and_accessibility_plan",
    titleKey: "timeline.milestone.community.safety_and_accessibility_plan.title",
    categoryId: "permits_insurance",
    leadDays: 30,
    dependsOn: ["permits_and_insurance"],
    critical: true,
  },
  {
    id: "run_of_show",
    titleKey: "timeline.milestone.community.run_of_show.title",
    categoryId: "logistics",
    leadDays: 14,
    dependsOn: [],
    critical: true,
  },
  {
    id: "volunteer_briefing",
    titleKey: "timeline.milestone.community.volunteer_briefing.title",
    categoryId: "staffing",
    leadDays: 3,
    dependsOn: [],
    critical: true,
  },
  {
    id: "setup",
    titleKey: "timeline.milestone.community.setup.title",
    categoryId: "equipment_av",
    leadDays: 1,
    dependsOn: [],
    critical: true,
  },
  {
    id: "thank_you_and_report",
    titleKey: "timeline.milestone.community.thank_you_and_report.title",
    leadDays: -7,
    dependsOn: [],
    critical: false,
  },
];

/**
 * Standard milestone scheduling templates for general social and family events.
 */
export const OTHER_TEMPLATES: readonly MilestoneTemplate[] = [
  {
    id: "plan_and_budget",
    titleKey: "timeline.milestone.other.plan_and_budget.title",
    leadDays: 45,
    dependsOn: [],
    critical: true,
  },
  {
    id: "venue",
    titleKey: "timeline.milestone.other.venue.title",
    categoryId: "venue",
    leadDays: 35,
    dependsOn: [],
    critical: true,
  },
  {
    id: "invitations_out",
    titleKey: "timeline.milestone.other.invitations_out.title",
    categoryId: "stationery",
    leadDays: 21,
    dependsOn: [],
    critical: true,
  },
  {
    id: "key_vendors",
    titleKey: "timeline.milestone.other.key_vendors.title",
    leadDays: 21,
    dependsOn: [],
    critical: false,
  },
  {
    id: "confirm_vendors",
    titleKey: "timeline.milestone.other.confirm_vendors.title",
    leadDays: 5,
    dependsOn: [],
    critical: true,
  },
  {
    id: "setup",
    titleKey: "timeline.milestone.other.setup.title",
    categoryId: "logistics",
    leadDays: 1,
    dependsOn: [],
    critical: true,
  },
];
