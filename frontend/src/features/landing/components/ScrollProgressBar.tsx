import { motion, useScroll } from "motion/react";
import { useReducedMotionPref } from "../../../hooks/useReducedMotionPref";

/**
 * Top hairline progress bar visually communicating page scroll progression.
 * Automatically suppressed under reduced motion preference.
 *
 * @returns JSX.Element
 */
export function ScrollProgressBar(): JSX.Element {
  const { scrollYProgress } = useScroll();
  const prefersReduced = useReducedMotionPref();

  if (prefersReduced) {
    return <div className="hidden" aria-hidden="true" />;
  }

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-[var(--color-accent)] z-50 origin-left pointer-events-none"
      style={{ scaleX: scrollYProgress }}
      aria-hidden="true"
    />
  );
}
