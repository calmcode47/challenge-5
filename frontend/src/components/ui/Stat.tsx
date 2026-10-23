import type { ReactNode } from "react";

/**
 * Props for the Stat component.
 */
export interface StatProps {
  /** Label describing the numerical metric */
  readonly label: string;
  /** Primary metric value rendered in monospace tabular numbers */
  readonly value: string | number;
  /** Optional secondary subtitle or context text */
  readonly helper?: string;
  /** Optional badge or trend indicator */
  readonly badge?: ReactNode;
  /** Optional extra classes */
  readonly className?: string;
}

/**
 * Metric summary card displaying a label, large tabular numeric value, and optional helper badge.
 *
 * @param props - StatProps
 * @returns JSX.Element
 */
export function Stat({ label, value, helper, badge, className = "" }: StatProps): JSX.Element {
  return (
    <div
      className={`flex flex-col p-4 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line-subtle)] ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
          {label}
        </span>
        {badge}
      </div>
      <span className="text-2xl sm:text-3xl font-mono font-bold text-[var(--color-text)] tabular-nums">
        {value}
      </span>
      {helper && <span className="text-xs text-[var(--color-muted)] mt-1">{helper}</span>}
    </div>
  );
}
