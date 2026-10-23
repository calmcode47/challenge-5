import type { BriefContent } from "./briefCatalogPart1.js";

export type BriefCatalogPart2Key =
  "logistics" | "gifts_favors" | "equipment_av" | "marketing" | "staffing" | "permits_insurance";

/**
 * Catalog part 2 of baseline vendor guidance briefs (logistics, gifts_favors, equipment_av, marketing, staffing, permits_insurance).
 * Strictest invariant: Absolutely no business names, URLs, email addresses, or price claims.
 */
export const BRIEF_CATALOG_PART_2: Record<BriefCatalogPart2Key, BriefContent> = {
  logistics: {
    whatToLookFor: [
      "Logistics coordination experience in multi-vendor environments",
      "Detailed run-of-show templates and load-in schedules",
      "Clear radio and digital communication protocols for dispatch",
    ],
    questionsToAsk: [
      "How do you coordinate simultaneous arrivals of multiple vendors?",
      "What is the incident escalation path for delays or schedule shifts?",
      "What parking and vehicle staging arrangements are managed?",
    ],
    redFlags: [
      "No structured master timeline or vendor contact sheet",
      "Single-point-of-failure dispatch with no backup coordinator",
      "Lack of contingency plans for inclement weather delays",
    ],
    contractTerms: [
      "Specified coordinator attendance hours from load-in to strike",
      "Authority boundaries for emergency operational decisions on site",
      "Vendor coordination scope and communication commitments",
    ],
  },
  gifts_favors: {
    whatToLookFor: [
      "Meaningful, culturally resonant, or eco-conscious gift concepts",
      "Hygienic individual packaging for edible or keepsake items",
      "Sample availability before bulk production commitment",
    ],
    questionsToAsk: [
      "What is the shelf life and storage requirement for edible items?",
      "Can we receive a physical pre-production sample before bulk run?",
      "What is the minimum lead time required for final quantity updates?",
    ],
    redFlags: [
      "Excessive minimum order quantities with no sample availability",
      "Perishable products with no allergen labeling or expiration dates",
      "Inability to guarantee arrival well before celebration setup",
    ],
    contractTerms: [
      "Final quantity adjustment cutoff date",
      "Replacement terms for items damaged during transit",
      "Confirmed bulk delivery arrival date to event coordination team",
    ],
  },
  equipment_av: {
    whatToLookFor: [
      "Modern sound, projection, and lighting gear in flight cases",
      "Dedicated on-site sound and lighting technician during speeches",
      "Tested electrical distribution boxes with circuit breaker safety",
    ],
    questionsToAsk: [
      "Will a dedicated AV technician remain on site for the duration?",
      "How do you handle backup power or sudden microphone failure?",
      "Are all cables safely taped down and wheelchair-accessible ramped?",
    ],
    redFlags: [
      "Unsupervised drop-off rental with no technical support staff",
      "Exposed cables across guest walking paths without safety covers",
      "Outdated audio equipment lacking feedback suppression circuits",
    ],
    contractTerms: [
      "Inventory list of all microphones, speakers, and cables provided",
      "Guaranteed on-site technician coverage hours",
      "Fast replacement protocol for malfunctioning electronic gear",
    ],
  },
  marketing: {
    whatToLookFor: [
      "Track record in community outreach and local engagement",
      "Multi-channel distribution across digital and physical flyers",
      "Clear accessibility considerations in promotional imagery",
    ],
    questionsToAsk: [
      "What communication channels will be mobilized for event outreach?",
      "How do you ensure promotional materials are digitally accessible?",
      "What cadence of reminders will be sent to registered guests?",
    ],
    redFlags: [
      "Promotion lacking accessibility accommodation notices",
      "Unsubstantiated audience reach claims without verifiable metrics",
      "Failure to provide draft promotional materials for sponsor signoff",
    ],
    contractTerms: [
      "Scheduled publication dates for digital and print announcements",
      "Brand guideline compliance for co-organizers and sponsors",
      "Ownership rights of created media assets and attendee lists",
    ],
  },
  staffing: {
    whatToLookFor: [
      "Background-checked personnel with formal hospitality training",
      "Clear uniform standards and professional personal grooming",
      "Trained event supervisor present on site at all times",
    ],
    questionsToAsk: [
      "What training do staff receive in emergency egress and first-aid?",
      "What is your replacement policy if an assigned staffer is delayed?",
      "How is staff time tracked during the shift?",
    ],
    redFlags: [
      "Staff dispatched with no designated lead supervisor",
      "No worker compensation coverage or general liability policy",
      "Ambiguous break schedules that leave key stations unmanned",
    ],
    contractTerms: [
      "Staff-to-guest ratios and specific station assignments",
      "Overtime rate terms and minimum shift hour guarantees",
      "Mandatory liability coverage and safety compliance warranty",
    ],
  },
  permits_insurance: {
    whatToLookFor: [
      "Licensed insurance broker and municipal permit expediter experience",
      "Familiarity with local council assembly and sound regulations",
      "Active broker standing with verified underwriter credentials",
    ],
    questionsToAsk: [
      "Does the policy name the venue and municipality as additional insured?",
      "What specific exclusions or deductible thresholds apply?",
      "What is the processing timeline for municipal permit approvals?",
    ],
    redFlags: [
      "Policy exclusions for standard celebration activities",
      "Late permit filings that risk municipal stop-work orders",
      "Failure to issue formal certificates of insurance to venue",
    ],
    contractTerms: [
      "Total liability coverage limits specified in writing",
      "Timely issuance of certificates to required third parties",
      "Policy activation and expiration matching full event rental hours",
    ],
  },
};
