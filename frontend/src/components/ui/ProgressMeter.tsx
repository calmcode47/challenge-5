import { useStableId } from "../../lib/a11y";

/**
 * Visual color variant for the ProgressMeter fill bar.
 */
export type ProgressMeterVariant = "accent" | "coral" | "teal" | "success" | "danger";

/**
 * Props for the ProgressMeter component.
 */
export interface ProgressMeterProps {
  /** Current numerical value */
  readonly value: number;
  /** Minimum range value (default: 0) */
  readonly min?: number;
  /** Maximum range value (default: 100) */
  readonly max?: number;
  /** Visible label displayed above the meter */
  readonly label?: string;
  /** Screen reader label when visible label is omitted */
  readonly "aria-label"?: string;
  /** Color tone variant */
  readonly variant?: ProgressMeterVariant;
  /** Optional extra styling classes */
  readonly className?: string;
}

const variantFills: Record<ProgressMeterVariant, string> = {
  accent: "bg-[var(--color-accent)]",
  coral: "bg-[var(--color-coral)]",
  teal: "bg-[var(--color-teal)]",
  success: "bg-[var(--color-success)]",
  danger: "bg-[var(--color-danger)]",
};

/**
 * Accessible progress bar conforming to WAI-ARIA progressbar role requirements (M07-A7).
 *
 * @param props - ProgressMeterProps
 * @returns JSX.Element
 */
export function ProgressMeter({
  value,
  min = 0,
  max = 100,
  label,
  variant = "accent",
  className = "",
  "aria-label": ariaLabel,
}: ProgressMeterProps): JSX.Element {
  const generatedId = useStableId("progress");
  const labelId = label ? `${generatedId}-label` : undefined;

  const clampedValue = Math.min(Math.max(value, min), max);
  const percentage = Math.round(((clampedValue - min) / (max - min || 1)) * 100);

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <div className="flex items-center justify-between text-xs font-medium text-[var(--color-text)]">
          <span id={labelId}>{label}</span>
          <span className="font-mono text-[var(--color-muted)] tabular-nums">{percentage}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-labelledby={labelId}
        aria-label={label ? undefined : ariaLabel}
        className="w-full h-2 rounded-full bg-[var(--color-raised)] border border-[var(--color-line)] overflow-hidden"
      >
        <div
          className={`h-full transition-all duration-300 ${variantFills[variant]}`}
          style={{ width: `${percentage.toString()}%` }}
        />
      </div>
    </div>
  );
}
