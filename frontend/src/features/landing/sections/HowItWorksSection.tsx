import { motion, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useReducedMotionPref } from "../../../hooks/useReducedMotionPref";
import { ScrollytellingPreview } from "../components/ScrollytellingPreview";
import { LANDING_COPY, type StepCopy } from "../copy";

function StepBlock({
  step,
  isActive,
  isStatic = false,
}: {
  readonly step: StepCopy;
  readonly isActive: boolean;
  readonly isStatic?: boolean;
}): JSX.Element {
  return (
    <div
      className={`p-6 sm:p-8 rounded-[var(--radius-card)] border transition-all duration-300 ${
        isActive || isStatic
          ? "bg-[var(--color-surface)] border-[var(--color-accent)]/60 shadow-lg"
          : "bg-[var(--color-surface)]/50 border-[var(--color-line-subtle)] opacity-60"
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="font-mono text-sm font-bold text-[var(--color-accent)] px-2 py-0.5 rounded bg-[var(--color-raised)] border border-[var(--color-line-subtle)]">
          {step.number}
        </span>
        <h3 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-wide text-[var(--color-text)]">
          {step.title}
        </h3>
      </div>
      <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed pl-10">
        {step.description}
      </p>
    </div>
  );
}

function ReducedMotionSteps({ steps }: { readonly steps: readonly StepCopy[] }): JSX.Element {
  return (
    <div data-testid="how-it-works-reduced" className="space-y-8">
      {steps.map((step, idx) => (
        <div key={step.number} className="space-y-4">
          <StepBlock step={step} isActive={true} isStatic={true} />
          <div className="max-w-md mx-auto sm:mx-0">
            <ScrollytellingPreview activeStep={idx} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ScrollytellingSteps({
  steps,
  activeStep,
}: {
  readonly steps: readonly StepCopy[];
  readonly activeStep: number;
}): JSX.Element {
  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="space-y-12 py-4">
        {steps.map((step, idx) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: activeStep === idx ? 1 : 0.6 }}
            transition={{ duration: 0.3 }}
          >
            <StepBlock step={step} isActive={activeStep === idx} />
          </motion.div>
        ))}
      </div>

      <div className="hidden md:block sticky top-28 py-4">
        <ScrollytellingPreview activeStep={activeStep} />
      </div>

      <div className="md:hidden">
        <ScrollytellingPreview activeStep={activeStep} />
      </div>
    </div>
  );
}

/**
 * Pinned scrollytelling section with 4 interactive workflow steps and live UI previews.
 * Gracefully degrades to a static vertical stacked list under reduced motion or on mobile.
 *
 * @returns JSX.Element
 */
export function HowItWorksSection(): JSX.Element {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotionPref();
  const copy = LANDING_COPY.howItWorks;
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 30%"],
  });

  useEffect(() => {
    if (prefersReduced) return;
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const step = Math.min(3, Math.max(0, Math.floor(latest * 4)));
      setActiveStep(step);
    });
    return unsubscribe;
  }, [scrollYProgress, prefersReduced]);

  return (
    <section
      ref={containerRef}
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="py-16 sm:py-24 space-y-12"
      style={{ contentVisibility: "auto", containIntrinsicSize: "0 900px" }}
    >
      <div className="max-w-3xl space-y-4">
        <h2
          id="how-it-works-heading"
          tabIndex={-1}
          className="text-3xl sm:text-5xl font-display font-bold uppercase tracking-wide text-[var(--color-text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
        >
          {copy.sectionTitle}
        </h2>
        <p className="text-base sm:text-lg text-[var(--color-muted)] leading-relaxed">
          {copy.sectionSubtitle}
        </p>
      </div>

      {prefersReduced ? (
        <ReducedMotionSteps steps={copy.steps} />
      ) : (
        <ScrollytellingSteps steps={copy.steps} activeStep={activeStep} />
      )}
    </section>
  );
}
