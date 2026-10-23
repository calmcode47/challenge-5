import { EventTypeSchema, type EventType } from "@occasio/shared";
import { useSearchParams } from "react-router";
import { Badge } from "../../components/ui/Badge";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

/**
 * Guided questionnaire wizard page for creating a new celebration plan.
 * Validates optional preselected event type from URL search parameters with EventTypeSchema.
 *
 * @returns JSX.Element
 */
export default function WizardPage(): JSX.Element {
  useDocumentTitle("Create New Plan");
  const [searchParams] = useSearchParams();

  const rawType = searchParams.get("type");
  const parseResult = EventTypeSchema.safeParse(rawType);
  const preselectedType: EventType | undefined = parseResult.success ? parseResult.data : undefined;

  return (
    <section className="py-8 space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-wide uppercase text-[var(--color-text)]">
          Create New Celebration Plan
        </h1>
        {preselectedType && (
          <Badge kind="calculated" className="capitalize text-sm py-1 px-3">
            Preselected: {preselectedType}
          </Badge>
        )}
      </div>

      <p className="text-base text-[var(--color-muted)] leading-relaxed max-w-2xl">
        Step-by-step guided questionnaire deriving custom budgets, timelines, and ideas based on
        your event context.
      </p>
    </section>
  );
}
