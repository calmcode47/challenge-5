import { AlertCircle, AlertTriangle, Bot, Calculator, Check, Info, Tag } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Supported provenance and status variants for Badge.
 */
export type BadgeKind = "calculated" | "ai" | "demo" | "neutral" | "success" | "warning" | "danger";

/**
 * Props for the Badge component.
 */
export interface BadgeProps {
  /** Canonical provenance or status kind */
  readonly kind?: BadgeKind;
  /** Optional custom leading icon */
  readonly icon?: ReactNode;
  /** Badge text content */
  readonly children: ReactNode;
  /** Optional extra classes */
  readonly className?: string;
}

const defaultIcons: Record<BadgeKind, ReactNode> = {
  calculated: <Calculator className="h-3 w-3" aria-hidden="true" />,
  ai: <Bot className="h-3 w-3" aria-hidden="true" />,
  demo: <Tag className="h-3 w-3" aria-hidden="true" />,
  neutral: <Info className="h-3 w-3" aria-hidden="true" />,
  success: <Check className="h-3 w-3" aria-hidden="true" />,
  warning: <AlertTriangle className="h-3 w-3" aria-hidden="true" />,
  danger: <AlertCircle className="h-3 w-3" aria-hidden="true" />,
};

const kindStyles: Record<BadgeKind, string> = {
  calculated: "bg-[var(--color-raised)] text-[var(--color-text)] border-[var(--color-line)]",
  ai: "bg-[var(--color-raised)] text-[var(--color-violet)] border-[var(--color-violet)]/40",
  demo: "bg-[var(--color-raised)] text-[var(--color-coral)] border-[var(--color-coral)]/40",
  neutral: "bg-[var(--color-raised)] text-[var(--color-muted)] border-[var(--color-line)]",
  success: "bg-[var(--color-raised)] text-[var(--color-success)] border-[var(--color-success)]/40",
  warning: "bg-[var(--color-raised)] text-[var(--color-accent)] border-[var(--color-accent)]/40",
  danger: "bg-[var(--color-raised)] text-[var(--color-danger)] border-[var(--color-danger)]/40",
};

/**
 * Accessible status and provenance badge combining text and icon per WCAG 1.4.1 (M07-A7).
 *
 * @param props - BadgeProps
 * @returns JSX.Element
 */
export function Badge({
  kind = "neutral",
  icon,
  className = "",
  children,
}: BadgeProps): JSX.Element {
  const renderedIcon = icon ?? defaultIcons[kind];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-[var(--radius-pill)] border select-none ${kindStyles[kind]} ${className}`}
    >
      <span className="shrink-0">{renderedIcon}</span>
      <span>{children}</span>
    </span>
  );
}
