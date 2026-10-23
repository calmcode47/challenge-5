import { useDocumentTitle } from "../../hooks/useDocumentTitle";

/**
 * Landing page introducing Occasio celebration and event planner.
 *
 * @returns JSX.Element
 */
export default function LandingPage(): JSX.Element {
  useDocumentTitle("Plan the Day, Not the Spreadsheet");

  return (
    <section className="flex flex-col items-center justify-center py-12 text-center">
      <h1 className="mb-4 text-4xl sm:text-6xl font-bold font-display tracking-wide uppercase text-[var(--color-text)]">
        Plan the Day, Not the Spreadsheet
      </h1>
      <p className="max-w-2xl text-lg text-[var(--color-muted)] leading-relaxed">
        Occasio is an AI celebration planner that creates dynamic budgets, back-scheduled timelines,
        vendor checklists, and personalized ideas.
      </p>
    </section>
  );
}
