import { AlertCircle } from "lucide-react";
import { useEffect, useRef } from "react";

/**
 * Field-level error descriptor for the summary banner.
 */
export interface SummaryErrorItem {
  readonly fieldId: string;
  readonly message: string;
}

/**
 * Props for the ErrorSummary component.
 */
export interface ErrorSummaryProps {
  /** Optional custom title heading */
  readonly title?: string;
  /** List of errors with target HTML field ids */
  readonly errors: readonly SummaryErrorItem[];
  /** Whether to automatically move focus to the summary on mount */
  readonly autoFocus?: boolean;
  /** Optional extra classes */
  readonly className?: string;
}

/**
 * Accessible error summary banner placed at top of forms conforming to WCAG 3.3.1 (M07-A6).
 *
 * @param props - ErrorSummaryProps
 * @returns JSX.Element | null
 */
export function ErrorSummary({
  title = "There is a problem with your submission",
  errors,
  autoFocus = true,
  className = "",
}: ErrorSummaryProps): JSX.Element | null {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoFocus && errors.length > 0 && containerRef.current) {
      containerRef.current.focus();
    }
  }, [autoFocus, errors]);

  if (errors.length === 0) {
    return null;
  }

  const handleLinkClick = (fieldId: string) => {
    const target = document.getElementById(fieldId);
    if (target instanceof HTMLElement) {
      target.focus();
    }
  };

  return (
    <div
      ref={containerRef}
      role="alert"
      tabIndex={-1}
      aria-labelledby="error-summary-title"
      className={`p-4 rounded-[var(--radius-card)] bg-[var(--color-surface)] border-2 border-[var(--color-danger)] outline-none focus:ring-2 focus:ring-[var(--color-danger)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] ${className}`}
    >
      <div className="flex items-center gap-2 mb-2 text-[var(--color-danger)] font-semibold">
        <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
        <h2 id="error-summary-title" className="text-base">
          {title}
        </h2>
      </div>
      <ul className="list-disc list-inside space-y-1 text-sm text-[var(--color-text)]">
        {errors.map((err) => (
          <li key={err.fieldId}>
            <a
              href={`#${err.fieldId}`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(err.fieldId);
              }}
              className="underline hover:text-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            >
              {err.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
