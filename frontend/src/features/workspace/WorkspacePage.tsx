import { useParams } from "react-router";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

/**
 * Event plan workspace page presenting budget, timeline, vendors, and AI assistant tabs.
 *
 * @returns JSX.Element
 */
export default function WorkspacePage(): JSX.Element {
  const { planId } = useParams();
  useDocumentTitle(`Plan Workspace ${planId ?? ""}`);

  return (
    <section className="py-8">
      <h1 className="mb-4 text-3xl sm:text-5xl font-bold font-display tracking-wide uppercase text-[var(--color-text)]">
        Plan Workspace
      </h1>
      <p className="text-base text-[var(--color-muted)] leading-relaxed">
        Interactive workspace for plan {planId}: inspect allocations, track milestones, manage
        vendors, and consult the AI assistant.
      </p>
    </section>
  );
}
