import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { useCallback, type MouseEvent } from "react";
import { Link } from "react-router";
import { useReducedMotionPref } from "../../../hooks/useReducedMotionPref";
import { LANDING_COPY } from "../copy";

interface HeroCtasProps {
  readonly ctaPrimary: string;
  readonly ctaSecondary: string;
  readonly ctaSecondaryAria: string;
  readonly onSeeHowItWorks: (e: MouseEvent<HTMLAnchorElement>) => void;
  readonly itemVariants: Variants;
}

function HeroCtas({
  ctaPrimary,
  ctaSecondary,
  ctaSecondaryAria,
  onSeeHowItWorks,
  itemVariants,
}: HeroCtasProps): JSX.Element {
  return (
    <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 pt-2">
      <Link
        to="/plan/new"
        className="inline-flex items-center justify-center min-h-[48px] px-8 text-base font-semibold rounded-[var(--radius-control)] bg-[var(--color-accent)] text-[var(--color-bg)] hover:brightness-105 active:brightness-95 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] transition-colors select-none shadow-md"
      >
        {ctaPrimary}
      </Link>

      <a
        href="#how-it-works"
        onClick={onSeeHowItWorks}
        aria-label={ctaSecondaryAria}
        className="inline-flex items-center justify-center min-h-[48px] px-6 text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-accent)] rounded-[var(--radius-control)] border border-[var(--color-line)] hover:border-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] transition-colors select-none"
      >
        {ctaSecondary} ↓
      </a>
    </motion.div>
  );
}

function HeroHeadline({
  eyebrow,
  headline,
  subhead,
  itemVariants,
}: {
  readonly eyebrow: string;
  readonly headline: string;
  readonly subhead: string;
  readonly itemVariants: Variants;
}): JSX.Element {
  return (
    <>
      <motion.div variants={itemVariants}>
        <span className="inline-flex items-center px-3 py-1 text-xs font-mono font-medium rounded-[var(--radius-pill)] border border-[var(--color-accent)]/30 text-[var(--color-accent)] bg-[var(--color-raised)]">
          {eyebrow}
        </span>
      </motion.div>

      <motion.h1
        id="hero-heading"
        variants={itemVariants}
        className="text-4xl sm:text-6xl md:text-7xl font-display font-bold uppercase tracking-wider text-[var(--color-text)] leading-[0.95]"
      >
        {headline}
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="text-lg sm:text-xl text-[var(--color-muted)] leading-relaxed max-w-2xl"
      >
        {subhead}
      </motion.p>
    </>
  );
}

/**
 * Hero section of the Occasio landing page featuring the Bebas headline,
 * contrast scrim over the 3D scene, and high-conversion accessible CTAs.
 *
 * @returns JSX.Element
 */
export function HeroSection(): JSX.Element {
  const prefersReduced = useReducedMotionPref();
  const copy = LANDING_COPY.hero;

  const handleSeeHowItWorks = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("how-it-works-heading");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.focus({ preventScroll: true });
    }
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.08 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-center py-12 sm:py-20"
    >
      <div className="max-w-3xl rounded-[var(--radius-card)] p-6 sm:p-10 bg-[var(--color-bg)]/75 backdrop-blur-lg border border-[var(--color-line-subtle)] shadow-2xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-6"
        >
          <HeroHeadline
            eyebrow={copy.eyebrow}
            headline={copy.headline}
            subhead={copy.subhead}
            itemVariants={itemVariants}
          />
          <HeroCtas
            ctaPrimary={copy.ctaPrimary}
            ctaSecondary={copy.ctaSecondary}
            ctaSecondaryAria={copy.ctaSecondaryAria}
            onSeeHowItWorks={handleSeeHowItWorks}
            itemVariants={itemVariants}
          />
        </motion.div>
      </div>
    </section>
  );
}
