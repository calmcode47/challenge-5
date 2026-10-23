import { useDocumentTitle } from "../../hooks/useDocumentTitle";

/**
 * Plans library page displaying saved plans stored locally on device.
 *
 * @returns JSX.Element
 */
export default function PlansPage(): JSX.Element {
  useDocumentTitle("My Saved Plans");

  return (
    <section className="py-8">
      <h1 className="mb-4 text-3xl sm:text-5xl font-bold font-display tracking-wide uppercase text-[var(--color-text)]">
        My Saved Plans
      </h1>
      <p className="text-base text-[var(--color-muted)] leading-relaxed">
        Browse, review, and manage your saved celebration and event plans.
      </p>
    </section>
  );
}
