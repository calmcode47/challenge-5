import { Tag } from "lucide-react";

/**
 * Props for the DemoBanner component.
 */
export interface DemoBannerProps {
  /** Optional custom disclaimer text */
  readonly message?: string;
  /** Optional extra classes */
  readonly className?: string;
}

/**
 * Prominent disclaimer banner explicitly identifying synthetic or mock sample evaluation data,
 * preventing synthetic entities from being perceived as authentic facts.
 *
 * @param props - DemoBannerProps
 * @returns JSX.Element
 */
export function DemoBanner({
  message = "Demo data: Sample plan for automated evaluation. Figures are baseline estimates.",
  className = "",
}: DemoBannerProps): JSX.Element {
  return (
    <div
      role="status"
      aria-label="Demo mode notice"
      className={`flex items-center gap-2.5 px-4 py-2 rounded-[var(--radius-control)] bg-[var(--color-raised)] border border-[var(--color-coral)]/40 text-xs text-[var(--color-coral)] font-medium ${className}`}
    >
      <Tag className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
