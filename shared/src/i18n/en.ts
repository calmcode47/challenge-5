/**
 * English localization dictionary mapping deterministic domain identifiers and keys
 * to human-readable strings.
 */
export const en = {
  // Timeline Milestone Titles - Wedding
  "timeline.milestone.wedding.budget_and_guest_list.title":
    "Finalize overall budget & guest count target",
  "timeline.milestone.wedding.venue.title": "Select & reserve ceremony and reception venue",
  "timeline.milestone.wedding.photographer.title": "Book photographer and videographer",
  "timeline.milestone.wedding.caterer.title": "Contract caterer and arrange menu tasting",
  "timeline.milestone.wedding.save_the_dates.title": "Send out save-the-date notices",
  "timeline.milestone.wedding.attire.title": "Order wedding attire and schedule alterations",
  "timeline.milestone.wedding.invitations_out.title": "Mail official wedding invitations",
  "timeline.milestone.wedding.decor_florals.title": "Confirm florist and visual decor plan",
  "timeline.milestone.wedding.rsvp_deadline.title": "RSVP deadline: collect final responses",
  "timeline.milestone.wedding.final_headcount.title":
    "Submit final guest headcount to venue & caterer",
  "timeline.milestone.wedding.final_payments.title": "Process final vendor balance payments",
  "timeline.milestone.wedding.rehearsal_and_setup.title":
    "Hold ceremony rehearsal and review setup",
  "timeline.milestone.wedding.thank_you_notes.title":
    "Mail thank-you notes to attendees and vendors",

  // Timeline Milestone Titles - Birthday
  "timeline.milestone.birthday.guest_list_and_date.title":
    "Establish guest list and confirm celebration date",
  "timeline.milestone.birthday.venue.title": "Select venue or prepare home space",
  "timeline.milestone.birthday.invitations_out.title":
    "Send birthday invitations with RSVP deadline",
  "timeline.milestone.birthday.cake_and_catering.title":
    "Order birthday cake and arrange catering or food menu",
  "timeline.milestone.birthday.entertainment.title":
    "Book entertainment, games, or musical playlist",
  "timeline.milestone.birthday.decor_and_favors.title":
    "Purchase decorations, party favors, and tableware",
  "timeline.milestone.birthday.rsvp_deadline.title": "RSVP deadline: confirm attendee count",
  "timeline.milestone.birthday.confirm_vendors.title":
    "Confirm timing with food, entertainment, and hosts",
  "timeline.milestone.birthday.setup.title": "Complete party space decoration and setup",

  // Timeline Milestone Titles - Community
  "timeline.milestone.community.objectives_and_approvals.title":
    "Define event objectives and secure stakeholder approvals",
  "timeline.milestone.community.permits_and_insurance.title":
    "Submit municipal permit applications & secure liability insurance",
  "timeline.milestone.community.venue_and_av.title":
    "Secure community venue and reserve audiovisual equipment",
  "timeline.milestone.community.sponsors_and_partners.title":
    "Confirm community partners and sponsor commitments",
  "timeline.milestone.community.volunteer_recruitment.title":
    "Launch volunteer recruitment and roles assignment",
  "timeline.milestone.community.marketing_launch.title":
    "Initiate community marketing and public promotion",
  "timeline.milestone.community.safety_and_accessibility_plan.title":
    "Finalize event safety, first-aid, and accessibility plan",
  "timeline.milestone.community.run_of_show.title":
    "Distribute master schedule and run-of-show timeline",
  "timeline.milestone.community.volunteer_briefing.title":
    "Conduct volunteer briefing and emergency walkthrough",
  "timeline.milestone.community.setup.title": "Coordinate site setup, staging, and vendor load-in",
  "timeline.milestone.community.thank_you_and_report.title":
    "Publish post-event summary, thank volunteers, and reconcile accounts",

  // Timeline Milestone Titles - Other
  "timeline.milestone.other.plan_and_budget.title": "Establish event plan scope and target budget",
  "timeline.milestone.other.venue.title": "Confirm venue location and capacity",
  "timeline.milestone.other.invitations_out.title": "Send invitations to all attendees",
  "timeline.milestone.other.key_vendors.title": "Confirm key vendors and equipment suppliers",
  "timeline.milestone.other.confirm_vendors.title":
    "Reconfirm final schedule with all contributors",
  "timeline.milestone.other.setup.title": "Complete event space staging and preparation",

  // Timeline Warnings
  "timeline.warning.event_date_past":
    "Event date is in the past. Schedule cannot be back-calculated.",
  "timeline.warning.compressed":
    "Schedule compressed by {factor}x due to reduced lead time before event.",
  "timeline.warning.start_immediately": "{count} critical milestones require immediate action.",

  // Budget Warnings
  "budget.warning.catering_share_below_20pct":
    "Catering allocation is below 20% of budget. Review food service scope.",
  "budget.warning.contingency_below_min":
    "Contingency reserve was below minimum safety threshold and was reset to 5%.",
  "budget.warning.single_category_cap_applied":
    "One or more categories exceeded 50% of the total budget and were capped.",
  "budget.warning.priorities_conflict":
    "More than 3 categories were given highest priority (5). Rebalancing may occur.",
  "budget.warning.budget_over_by":
    "Category {categoryId} has committed expenditures exceeding allocation by {amount}.",
  "budget.warning.budget_total_over_by":
    "Total committed vendor costs exceed the total budget by {amount}.",

  // Checklist Items - Catering
  "checklist.catering.baseline_menu_proposal":
    "Request detailed course menu proposal with dietary breakdown",
  "checklist.catering.baseline_service_staffing": "Confirm waitstaff and bartending staff ratios",
  "checklist.catering.baseline_food_safety":
    "Verify vendor food safety licensing and temperature transport protocols",
  "checklist.catering.baseline_tasting_schedule":
    "Schedule menu tasting session prior to final signoff",
  "checklist.catering.dietary_allergens":
    "Establish clear allergen segregation and cross-contamination protocols",
  "checklist.catering.dietary_labelled_menus":
    "Require individually labelled meal cards for special dietary requirements",

  // Checklist Items - Venue
  "checklist.venue.baseline_capacity_layout":
    "Obtain certified floor plan and verify maximum seated capacity",
  "checklist.venue.baseline_access_hours": "Confirm vendor load-in and cleanup access window hours",
  "checklist.venue.baseline_contract_terms":
    "Review commercial venue lease agreement, cancellation, and refund terms",
  "checklist.venue.baseline_damage_deposit":
    "Document security damage deposit conditions and inspection schedule",
  "checklist.venue.outdoor_weather_contingency":
    "Establish bad-weather backup plan with tenting and drainage logistics",
  "checklist.venue.outdoor_power_supply":
    "Calculate electrical load and secure backup commercial generator supply",
  "checklist.venue.home_neighbour_notification":
    "Notify immediate neighbours in advance regarding event timing and guest traffic",
  "checklist.venue.home_noise_curfew":
    "Review municipal residential noise bylaws and set strict sound curfews",
  "checklist.venue.home_parking_logistics":
    "Establish street parking rules and designate driveway drop-off zones",

  // Checklist Items - Accessibility
  "checklist.venue.access_step_free":
    "Confirm step-free wheelchair access from parking through main celebration areas",
  "checklist.venue.access_seating":
    "Reserve dedicated, easily accessible seating with unobstructed stage sightlines",
  "checklist.venue.access_restrooms":
    "Verify fully compliant ADA/accessible restroom facilities within easy reach",
  "checklist.venue.access_signage":
    "Ensure high-contrast, large-print directional signage throughout the venue",
  "checklist.venue.access_quiet_space":
    "Designate a sensory-friendly, low-stimulation quiet respite space",

  // Checklist Items - Guest Size & Crowd Control
  "checklist.logistics.crowd_flow_management":
    "Establish clear one-way ingress/egress routes and queue management",
  "checklist.staffing.large_guest_ratio":
    "Ensure 1:25 dedicated staff-to-guest ratio for smooth coordination",

  // Checklist Items - Community Compliance & Safety
  "checklist.permits.municipal_event_permit":
    "Obtain municipal special event assembly permit and park permits",
  "checklist.permits.public_liability_insurance":
    "Secure comprehensive general liability event insurance certificate",
  "checklist.safety.first_aid_station":
    "Set up clearly marked first-aid station with certified emergency personnel",
  "checklist.staffing.safety_marshals":
    "Appoint designated high-visibility safety marshals with radio communication",
  "checklist.logistics.community_accessibility_plan":
    "Publish community public transit directions and accessibility map",

  // Checklist Items - Common / Specific Types
  "checklist.photo_video.baseline_shot_list":
    "Assemble comprehensive shot list highlighting key VIP moments",
  "checklist.entertainment.baseline_equipment_rider":
    "Review technical rider, sound limits, and electrical power needs",
  "checklist.decor.baseline_setup_timeline":
    "Coordinate decor delivery, assembly window, and post-event teardown",
  "checklist.wedding.officiant_licence_logistics":
    "Secure marriage licence documents and review legal ceremony vows",
  "checklist.wedding.ceremony_rehearsal_logistics":
    "Coordinate processional order and rehearsal walkthrough with bridal party",
  "checklist.birthday.child_safety_supervision":
    "Establish designated guardian check-in system and supervised play boundaries",
  "checklist.birthday.age_appropriate_entertainment":
    "Verify activities, games, and entertainment meet participant age guidelines",
} as const;

/**
 * Valid key in the English localization dictionary.
 */
export type EnKey = keyof typeof en;
