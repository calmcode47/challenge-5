/**
 * Typed, centralized copy strings for the Occasio landing page sections.
 * Supports future i18n localization with zero string concatenations.
 */

export interface StepCopy {
  readonly number: string;
  readonly title: string;
  readonly description: string;
  readonly previewAlt: string;
}

export interface EventTypeCopy {
  readonly id: "wedding" | "birthday" | "community";
  readonly title: string;
  readonly tagline: string;
  readonly whatYouGet: readonly string[];
  readonly badgeText: string;
  readonly accentColor: string;
}

export interface TrustPillarCopy {
  readonly title: string;
  readonly description: string;
}

export interface LandingCopy {
  readonly hero: {
    readonly eyebrow: string;
    readonly headline: string;
    readonly subhead: string;
    readonly ctaPrimary: string;
    readonly ctaSecondary: string;
    readonly ctaSecondaryAria: string;
  };
  readonly eventTypes: {
    readonly sectionTitle: string;
    readonly sectionSubtitle: string;
    readonly cards: readonly EventTypeCopy[];
  };
  readonly howItWorks: {
    readonly sectionTitle: string;
    readonly sectionSubtitle: string;
    readonly steps: readonly StepCopy[];
  };
  readonly smartEngine: {
    readonly sectionTitle: string;
    readonly sectionSubtitle: string;
    readonly stats: readonly {
      readonly label: string;
      readonly value: string;
      readonly helper: string;
    }[];
    readonly liveDemoTitle: string;
    readonly liveDemoDescription: string;
  };
  readonly trustPrivacy: {
    readonly sectionTitle: string;
    readonly sectionSubtitle: string;
    readonly pillars: readonly TrustPillarCopy[];
    readonly linkText: string;
  };
  readonly finalCta: {
    readonly headline: string;
    readonly subtitle: string;
    readonly ctaButton: string;
    readonly finePrint: string;
  };
}

/**
 * Production copy dictionary for the Occasio landing page.
 */
export const LANDING_COPY: LandingCopy = {
  hero: {
    eyebrow: "AI Celebration & Event Planner",
    headline: "PLAN THE DAY, NOT THE SPREADSHEET",
    subhead:
      "Occasio is an AI celebration planner that creates dynamic budgets, back-scheduled timelines, vendor checklists, and personalized ideas.",
    ctaPrimary: "Create my plan",
    ctaSecondary: "See how it works",
    ctaSecondaryAria: "Scroll to how Occasio works section",
  },
  eventTypes: {
    sectionTitle: "Tailored to Your Celebration",
    sectionSubtitle:
      "Whether you are planning an intimate milestone or a massive community festival, Occasio adapts its planning algorithms to your specific context.",
    cards: [
      {
        id: "wedding",
        title: "Weddings",
        tagline:
          "For couples balancing large guest lists, diverse vendors, and family expectations.",
        whatYouGet: [
          "Weighted multi-category budget allocation",
          "Back-scheduled 9+ month vendor milestone timeline",
          "Allergen & accessibility vendor checklists",
          "Personalized themes with fit-to-budget badges",
        ],
        badgeText: "Violet & Champagne",
        accentColor: "var(--color-violet)",
      },
      {
        id: "birthday",
        title: "Birthdays",
        tagline: "For milestone birthdays focused on joy, entertainment, and zero planning stress.",
        whatYouGet: [
          "Entertainment & catering-weighted budget priorities",
          "Condensed 5-week party-pace milestone schedule",
          "Favors, decor, and dietary vendor questions",
          "Personalized party concepts & games tailored to age group",
        ],
        badgeText: "Coral & Champagne",
        accentColor: "var(--color-coral)",
      },
      {
        id: "community",
        title: "Community Events",
        tagline:
          "For festivals, fundraisers, and neighborhood gatherings with safety and volunteer needs.",
        whatYouGet: [
          "AV equipment, marketing & permits budget weighting",
          "Permit filings, crowd safety & sponsor timeline milestones",
          "Public safety & first-aid requirement checklists",
          "Engaging public activity & volunteer coordination ideas",
        ],
        badgeText: "Teal & Champagne",
        accentColor: "var(--color-teal)",
      },
    ],
  },
  howItWorks: {
    sectionTitle: "How Occasio Works",
    sectionSubtitle:
      "From your first thought to the final celebration, our dual-engine architecture guides every single decision.",
    steps: [
      {
        number: "01",
        title: "Tell us about your day",
        description:
          "Answer a short 5-step questionnaire about your event type, date, budget, guest count, and preferences.",
        previewAlt: "Questionnaire step illustration preview",
      },
      {
        number: "02",
        title: "See the plan instantly",
        description:
          "Our pure deterministic engine calculates your custom budget breakdown and back-scheduled timeline in milliseconds.",
        previewAlt: "Instant calculated plan breakdown preview",
      },
      {
        number: "03",
        title: "Get personalised ideas",
        description:
          "AI suggests curated celebration ideas with explicit fit rationales and budget badges matched to your parameters.",
        previewAlt: "Personalized ideas with budget badge preview",
      },
      {
        number: "04",
        title: "Refine with the assistant",
        description:
          "Collaborate with the planning assistant to adjust categories, add milestones, or refine details with one click.",
        previewAlt: "Interactive planning assistant preview",
      },
    ],
  },
  smartEngine: {
    sectionTitle: "Smart by Design: Pure Math Core + AI Enrichment",
    sectionSubtitle:
      "Never trust critical budgets and dates to unconstrained LLMs. Occasio splits deterministic financial/scheduling rules from creative AI assistance.",
    stats: [
      {
        label: "Calculation speed",
        value: "0 ms",
        helper: "Pure offline mathematical engine",
      },
      {
        label: "Budget sum accuracy",
        value: "100%",
        helper: "Hare-Niemeyer exact penny distribution",
      },
      {
        label: "Hallucinated businesses",
        value: "0",
        helper: "No fake directories or commercial bias",
      },
    ],
    liveDemoTitle: "Live Deterministic Engine Run",
    liveDemoDescription:
      "This live card is generated at runtime by invoking buildBaselinePlan directly on a sample 120-guest wedding with a $40,000 budget.",
  },
  trustPrivacy: {
    sectionTitle: "Privacy & Control by Design",
    sectionSubtitle:
      "Your personal celebration moments deserve uncompromising respect and absolute transparency.",
    pillars: [
      {
        title: "No account required",
        description:
          "Start planning immediately. We use secure anonymous session tokens without demanding your email or password.",
      },
      {
        title: "Local-first storage",
        description:
          "All your celebration plans are saved directly in your browser. Nothing leaves your device without your explicit action.",
      },
      {
        title: "Export & erase anytime",
        description:
          "Download ICS calendars, CSV budgets, or complete JSON backups at any moment, or wipe every trace with a single click.",
      },
      {
        title: "Transparent provenance",
        description:
          "Every figure is clearly labeled as Calculated or AI estimate. We never invent fake vendor names or price quotes.",
      },
    ],
    linkText: "Read our full Privacy & Security policy",
  },
  finalCta: {
    headline: "READY TO PLAN YOUR CELEBRATION?",
    subtitle:
      "Create your personalized budget, timeline, vendor checklist, and ideas in less than 2 minutes.",
    ctaButton: "Create my plan",
    finePrint: "Free • No sign-up required • 100% private",
  },
};
