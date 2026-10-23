import { useDocumentTitle } from "../../hooks/useDocumentTitle";

/**
 * User data management page offering complete JSON export and one-click data erasure.
 *
 * @returns JSX.Element
 */
export default function MyDataPage(): JSX.Element {
  useDocumentTitle("My Data & Erasure");

  return (
    <section className="py-8 max-w-3xl">
      <h1 className="mb-4 text-3xl sm:text-5xl font-bold font-display tracking-wide uppercase text-[var(--color-text)]">
        My Data & Privacy Controls
      </h1>
      <p className="text-base text-[var(--color-muted)] leading-relaxed">
        Export all your saved celebration data in structured JSON format or permanently erase all
        records from local storage.
      </p>
    </section>
  );
}
