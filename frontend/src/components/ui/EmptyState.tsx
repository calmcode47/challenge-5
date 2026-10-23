import { Calendar } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Props for the EmptyState component.
 */
export interface EmptyStateProps {
  /** Decorative icon or illustration */
  readonly icon?: ReactNode;
  /** Primary headline */
  readonly title: string;
  /** Explanatory body copy explaining what to do next */
  readonly description: string;
  /** Optional interactive CTA action */
  readonly action?: ReactNode;
  /** Optional extra classes */
  readonly className?: string;
}

/**
 * Empty state placeholder guiding the user when no data or plans are present.
 *
 * @param props - EmptyStateProps
 * @returns JSX.Element
 */
export function EmptyState({
  icon = <Calendar className="h-10 w-10 text-[var(--color-muted)]" aria-hidden="true" />,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps): JSX.Element {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line-subtle)] ${className}`}
    >
      <div className="p-3 mb-4 rounded-full bg-[var(--color-raised)] text-[var(--color-accent)]">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">{title}</h3>
      <p className="max-w-md text-sm text-[var(--color-muted)] mb-6 leading-relaxed">
        {description}
      </p>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
}
