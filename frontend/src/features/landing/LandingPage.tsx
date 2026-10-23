import { useEffect } from "react";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { scrollStore } from "../../three/scrollStore";
import { ScrollProgressBar } from "./components/ScrollProgressBar";
import { EventTypesSection } from "./sections/EventTypesSection";
import { FinalCtaSection } from "./sections/FinalCtaSection";
import { HeroSection } from "./sections/HeroSection";
import { HowItWorksSection } from "./sections/HowItWorksSection";
import { SmartEngineSection } from "./sections/SmartEngineSection";
import { TrustPrivacySection } from "./sections/TrustPrivacySection";

/**
 * Cinematic, accessible landing page presenting Occasio's celebration planning workflow.
 * Connects scroll section observation to 3D background palette shifts without React state churn.
 *
 * @returns JSX.Element
 */
export default function LandingPage(): JSX.Element {
  useDocumentTitle("Plan the Day, Not the Spreadsheet");

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const sectionIds = [
      { id: "hero-heading", sectionIndex: 0 },
      { id: "event-types", sectionIndex: 1 },
      { id: "how-it-works", sectionIndex: 2 },
      { id: "smart-engine", sectionIndex: 2 },
      { id: "trust", sectionIndex: 3 },
      { id: "final-cta", sectionIndex: 3 },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const match = sectionIds.find((s) => s.id === entry.target.id);
            if (match) {
              scrollStore.section = match.sectionIndex;
            }
          }
        }
      },
      {
        rootMargin: "-20% 0px -40% 0px",
        threshold: 0.1,
      }
    );

    for (const item of sectionIds) {
      const el = document.getElementById(item.id);
      if (el) {
        observer.observe(el);
      }
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-16">
      <ScrollProgressBar />
      <HeroSection />
      <EventTypesSection />
      <HowItWorksSection />
      <SmartEngineSection />
      <TrustPrivacySection />
      <FinalCtaSection />
    </div>
  );
}
