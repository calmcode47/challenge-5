import { useDocumentTitle } from "../../hooks/useDocumentTitle";

/**
 * Privacy policy page detailing data handling, session encryption, and zero direct browser AI calls.
 *
 * @returns JSX.Element
 */
export default function PrivacyPage(): JSX.Element {
  useDocumentTitle("Privacy & Security");

  return (
    <section className="py-8 max-w-3xl">
      <h1 className="mb-4 text-3xl sm:text-5xl font-bold font-display tracking-wide uppercase text-[var(--color-text)]">
        Privacy & Security
      </h1>
      <p className="text-base text-[var(--color-muted)] leading-relaxed">
        Occasio operates with privacy-by-design: all deterministic calculations occur locally on
        your device, and no personal identifying information is sold or retained indefinitely.
      </p>
    </section>
  );
}
