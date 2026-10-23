import type { CategoryId } from "../../contracts/enums.js";

/**
 * Definition template for milestone generation before date scheduling and compression.
 */
export interface MilestoneTemplate {
  readonly id: string;
  readonly titleKey: string;
  readonly categoryId?: CategoryId;
  readonly leadDays: number;
  readonly dependsOn: readonly string[];
  readonly critical: boolean;
}

/**
 * Standard milestone scheduling templates for wedding celebrations.
 */
export const WEDDING_TEMPLATES: readonly MilestoneTemplate[] = [
  {
    id: "budget_and_guest_list",
    titleKey: "timeline.milestone.wedding.budget_and_guest_list.title",
    leadDays: 300,
    dependsOn: [],
    critical: true,
  },
  {
    id: "venue",
    titleKey: "timeline.milestone.wedding.venue.title",
    categoryId: "venue",
    leadDays: 270,
    dependsOn: [],
    critical: true,
  },
  {
    id: "photographer",
    titleKey: "timeline.milestone.wedding.photographer.title",
    categoryId: "photo_video",
    leadDays: 240,
    dependsOn: ["venue"],
    critical: true,
  },
  {
    id: "caterer",
    titleKey: "timeline.milestone.wedding.caterer.title",
    categoryId: "catering",
    leadDays: 210,
    dependsOn: ["venue"],
    critical: true,
  },
  {
    id: "save_the_dates",
    titleKey: "timeline.milestone.wedding.save_the_dates.title",
    categoryId: "stationery",
    leadDays: 180,
    dependsOn: ["budget_and_guest_list"],
    critical: false,
  },
  {
    id: "attire",
    titleKey: "timeline.milestone.wedding.attire.title",
    categoryId: "attire_beauty",
    leadDays: 150,
    dependsOn: [],
    critical: false,
  },
  {
    id: "invitations_out",
    titleKey: "timeline.milestone.wedding.invitations_out.title",
    categoryId: "stationery",
    leadDays: 90,
    dependsOn: ["venue"],
    critical: true,
  },
  {
    id: "decor_florals",
    titleKey: "timeline.milestone.wedding.decor_florals.title",
    categoryId: "decor",
    leadDays: 75,
    dependsOn: [],
    critical: false,
  },
  {
    id: "rsvp_deadline",
    titleKey: "timeline.milestone.wedding.rsvp_deadline.title",
    categoryId: "logistics",
    leadDays: 30,
    dependsOn: ["invitations_out"],
    critical: true,
  },
  {
    id: "final_headcount",
    titleKey: "timeline.milestone.wedding.final_headcount.title",
    categoryId: "catering",
    leadDays: 14,
    dependsOn: ["rsvp_deadline"],
    critical: true,
  },
  {
    id: "final_payments",
    titleKey: "timeline.milestone.wedding.final_payments.title",
    leadDays: 7,
    dependsOn: [],
    critical: false,
  },
  {
    id: "rehearsal_and_setup",
    titleKey: "timeline.milestone.wedding.rehearsal_and_setup.title",
    categoryId: "logistics",
    leadDays: 2,
    dependsOn: [],
    critical: true,
  },
  {
    id: "thank_you_notes",
    titleKey: "timeline.milestone.wedding.thank_you_notes.title",
    categoryId: "stationery",
    leadDays: -14,
    dependsOn: [],
    critical: false,
  },
];

/**
 * Standard milestone scheduling templates for birthday celebrations.
 */
export const BIRTHDAY_TEMPLATES: readonly MilestoneTemplate[] = [
  {
    id: "guest_list_and_date",
    titleKey: "timeline.milestone.birthday.guest_list_and_date.title",
    leadDays: 60,
    dependsOn: [],
    critical: true,
  },
  {
    id: "venue",
    titleKey: "timeline.milestone.birthday.venue.title",
    categoryId: "venue",
    leadDays: 45,
    dependsOn: [],
    critical: true,
  },
  {
    id: "invitations_out",
    titleKey: "timeline.milestone.birthday.invitations_out.title",
    categoryId: "stationery",
    leadDays: 30,
    dependsOn: ["venue"],
    critical: true,
  },
  {
    id: "cake_and_catering",
    titleKey: "timeline.milestone.birthday.cake_and_catering.title",
    categoryId: "catering",
    leadDays: 21,
    dependsOn: [],
    critical: true,
  },
  {
    id: "entertainment",
    titleKey: "timeline.milestone.birthday.entertainment.title",
    categoryId: "entertainment",
    leadDays: 21,
    dependsOn: [],
    critical: false,
  },
  {
    id: "decor_and_favors",
    titleKey: "timeline.milestone.birthday.decor_and_favors.title",
    categoryId: "decor",
    leadDays: 14,
    dependsOn: [],
    critical: false,
  },
  {
    id: "rsvp_deadline",
    titleKey: "timeline.milestone.birthday.rsvp_deadline.title",
    categoryId: "logistics",
    leadDays: 7,
    dependsOn: ["invitations_out"],
    critical: true,
  },
  {
    id: "confirm_vendors",
    titleKey: "timeline.milestone.birthday.confirm_vendors.title",
    leadDays: 3,
    dependsOn: [],
    critical: true,
  },
  {
    id: "setup",
    titleKey: "timeline.milestone.birthday.setup.title",
    categoryId: "logistics",
    leadDays: 1,
    dependsOn: [],
    critical: true,
  },
];
