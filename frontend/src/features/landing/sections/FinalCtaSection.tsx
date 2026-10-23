import { Link } from "react-router";
import { LANDING_COPY } from "../copy";

/**
 * Final high-conversion call to action section directing users into the planner wizard.
 *
 * @returns JSX.Element
 */
export function FinalCtaSection(): JSX.Element {
  const copy = LANDING_COPY.finalCta;

  return (
    <section
      id="final-cta"
      aria-labelledby="final-cta-heading"
      className="py-20 sm:py-28 text-center"
      style={{ contentVisibility: "auto", containIntrinsicSize: "0 400px" }}
    >
      <div className="max-w-3xl mx-auto p-8 sm:p-12 rounded-[var(--radius-card)] bg-[var(--color-surface)]/80 backdrop-blur-lg border border-[var(--color-line)] shadow-2xl space-y-6">
        <h2
          id="final-cta-heading"
          className="text-4xl sm:text-6xl font-display font-bold uppercase tracking-wider text-[var(--color-text)]"
        >
          {copy.headline}
        </h2>
        <p className="text-base sm:text-lg text-[var(--color-muted)] max-w-xl mx-auto leading-relaxed">
          {copy.subtitle}
        </p>

        <div className="pt-4 flex flex-col items-center gap-3">
          <Link
            to="/plan/new"
            className="inline-flex items-center justify-center min-h-[52px] px-10 text-base font-semibold rounded-[var(--radius-control)] bg-[var(--color-accent)] text-[var(--color-bg)] hover:brightness-105 active:brightness-95 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] transition-colors select-none shadow-lg"
          >
            {copy.ctaButton}
          </Link>
          <span className="text-xs font-mono text-[var(--color-muted)] tracking-wider">
            {copy.finePrint}
          </span>
        </div>
      </div>
    </section>
  );
}
