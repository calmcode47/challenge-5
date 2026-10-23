import type { VendorBrief } from "../../contracts/planComponents.js";

export type BriefContent = Omit<VendorBrief, "categoryId">;

export type BriefCatalogPart1Key =
  "venue" | "catering" | "photo_video" | "entertainment" | "decor" | "attire_beauty" | "stationery";

/**
 * Catalog part 1 of baseline vendor guidance briefs (venue, catering, decor, entertainment, photo_video, attire_beauty, stationery).
 * Strictest invariant: Absolutely no business names, URLs, email addresses, or price claims.
 */
export const BRIEF_CATALOG_PART_1: Record<BriefCatalogPart1Key, BriefContent> = {
  venue: {
    whatToLookFor: [
      "Adequate square footage for seated layout and circulation",
      "Valid occupancy permits and modern life-safety systems",
      "Flexible load-in windows and clear noise restrictions",
    ],
    questionsToAsk: [
      "What is the exact maximum certified occupancy for our seating style?",
      "Are there exclusive preferred vendor restrictions or buyout fees?",
      "What is the precise access window for setup and teardown?",
    ],
    redFlags: [
      "Vague overtime penalty terms or unwritten cleanup expectations",
      "Refusal to provide certificates of structural and fire safety",
      "Mandatory unvetted suppliers with zero flexibility",
    ],
    contractTerms: [
      "Detailed force majeure clause covering natural emergencies",
      "Explicit schedule for refundable damage deposit return",
      "Itemized breakdown of included tables, chairs, and cleaning",
    ],
  },
  catering: {
    whatToLookFor: [
      "Commercial food handler licensing and cold-chain compliance",
      "Dedicated allergen segregation and cross-contact protocols",
      "Experienced on-site service staffing with professional ratios",
    ],
    questionsToAsk: [
      "How do your staff manage acute food allergies during service?",
      "Can we conduct an advance menu tasting prior to final signoff?",
      "What is the staff-to-guest ratio during peak meal courses?",
    ],
    redFlags: [
      "Reluctance to document ingredient sources and allergen practices",
      "No written guarantee of backup staff for absent team members",
      "Inability to hold food at safe regulatory temperatures on-site",
    ],
    contractTerms: [
      "Strict final guest headcount confirmation deadline date",
      "Explicit handling of leftover food and disposal standards",
      "Guaranteed menu substitutions in event of ingredient shortages",
    ],
  },
  decor: {
    whatToLookFor: [
      "Portfolio demonstrating scale consistency and cohesive color palettes",
      "Flame-retardant fabric certifications and weighted rigging safety",
      "Reliable delivery vehicle access and post-event strike crew",
    ],
    questionsToAsk: [
      "How many hours do you require for complete installation and strike?",
      "Do your decorative installations require ceiling hanging points?",
      "What contingency elements exist for damaged floral or rental items?",
    ],
    redFlags: [
      "Unfamiliarity with venue hanging restrictions and candle policies",
      "Lack of structural ballast for freestanding backdrop frames",
      "Demands for full upfront payment without mock-up drawings",
    ],
    contractTerms: [
      "Clear delivery, setup, and strike schedule timeline",
      "Itemized inventory of rental items versus consumable materials",
      "Defined damage liability policy for wind or guest accidents",
    ],
  },
  entertainment: {
    whatToLookFor: [
      "Demonstrated ability to pace celebration energy and announcements",
      "Professional-grade audio equipment with wireless microphones",
      "Diverse repertoire tailored to guest age distribution",
    ],
    questionsToAsk: [
      "What are your electrical power and staging circuit requirements?",
      "Do you provide a formal master of ceremonies service if needed?",
      "What backup sound equipment is kept on site in case of failure?",
    ],
    redFlags: [
      "Refusal to accommodate a mandatory 'do not play' selection list",
      "Unwillingness to inspect room acoustics prior to the celebration",
      "Inability to provide proof of equipment electrical safety testing",
    ],
    contractTerms: [
      "Performance duration with scheduled intermission lengths",
      "Guaranteed backup performer clause in case of acute illness",
      "Sound level limit adherence clause aligned with venue bylaws",
    ],
  },
  photo_video: {
    whatToLookFor: [
      "Full event gallery samples showing varied challenging lighting",
      "Dual memory card recording cameras and secondary backup bodies",
      "Clear communication style and discrete documentary approach",
    ],
    questionsToAsk: [
      "What is your turnaround timeframe for final processed delivery?",
      "How are digital master files archived and protected against loss?",
      "Will the principal photographer attend personally or assign staff?",
    ],
    redFlags: [
      "Only showing selected portfolio highlights without complete galleries",
      "Operating with single-card cameras with no redundant capture",
      "Ambiguous copyright ownership and print reproduction permissions",
    ],
    contractTerms: [
      "Minimum hours of coverage and presence of second shooter",
      "Delivery format, minimum image count, and high-resolution rights",
      "Turnaround timeline for preview teasers and final delivery",
    ],
  },
  attire_beauty: {
    whatToLookFor: [
      "Experienced tailors and certified stylists with bridal/formal tenure",
      "Dedicated trial sessions scheduled well in advance of the date",
      "Clean sanitation practices for all cosmetics and hair appliances",
    ],
    questionsToAsk: [
      "How many alteration fittings are included in the garment schedule?",
      "What is the day-of timing per person for hair and makeup styling?",
      "Can you accommodate sensitive skin or cruelty-free product needs?",
    ],
    redFlags: [
      "Refusal to conduct an advance hair or makeup trial run",
      "Unrealistic fitting timelines that leave zero buffer for rework",
      "No sanitation standards documented for reusable brushes and sponges",
    ],
    contractTerms: [
      "Scheduled arrival time and departure milestone on celebration day",
      "Specified number of attendants receiving beauty or styling services",
      "Clear timeline for final garment alterations and collection",
    ],
  },
  stationery: {
    whatToLookFor: [
      "High paper stock weights and crisp typographic proofing",
      "Comprehensive proofing workflows with signoff stages",
      "Coordinated design aesthetic across save-the-dates and day-of items",
    ],
    questionsToAsk: [
      "How many digital revision rounds are included before printing?",
      "What is the physical printing and delivery production lead time?",
      "Can you provide physical paper samples and color swatches?",
    ],
    redFlags: [
      "Printing without receiving explicit client proof approval",
      "No allowance for extra envelopes or addressing misprints",
      "Inflexible turnaround times that risk missing mailing deadlines",
    ],
    contractTerms: [
      "Explicit digital print proof approval clause before production",
      "Guaranteed delivery dates for mailing and day-of paper items",
      "Reprint obligations at printer expense for typographic errors",
    ],
  },
};
