import { useDocumentTitle } from "../../hooks/useDocumentTitle";

/**
 * Guided questionnaire wizard page for creating a new celebration plan.
 *
 * @returns JSX.Element
 */
export default function WizardPage(): JSX.Element {
  useDocumentTitle("Create New Plan");

  return (
    <section className="py-8">
      <h1 className="mb-4 text-3xl sm:text-5xl font-bold font-display tracking-wide uppercase text-[var(--color-text)]">
        Create New Celebration Plan
      </h1>
      <p className="text-base text-[var(--color-muted)] leading-relaxed">
        Step-by-step guided questionnaire deriving custom budgets, timelines, and ideas based on
        your event context.
      </p>
    </section>
  );
}
