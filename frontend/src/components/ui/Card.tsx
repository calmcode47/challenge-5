import type { HTMLAttributes, ReactNode } from "react";

/**
 * Props for the Card surface container.
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional interactive hover/elevated state */
  readonly isInteractive?: boolean;
  /** Card children content */
  readonly children: ReactNode;
}

/**
 * Surface card container using design tokens (--color-surface, --radius-card, hairline border).
 *
 * @param props - CardProps
 * @returns JSX.Element
 */
export function Card({
  isInteractive = false,
  className = "",
  children,
  ...rest
}: CardProps): JSX.Element {
  const interactiveClasses = isInteractive
    ? "cursor-pointer hover:border-[var(--color-accent)] hover:bg-[var(--color-raised)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
    : "";

  return (
    <div
      className={`rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line-subtle)] p-6 shadow-sm ${interactiveClasses} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
