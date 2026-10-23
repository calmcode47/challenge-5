import { RadioGroup } from "radix-ui";

/**
 * Option descriptor for individual radio card items.
 */
export interface RadioCardOption {
  readonly value: string;
  readonly label: string;
  readonly description?: string;
  readonly badge?: string;
}

/**
 * Props for the RadioCardGroup component.
 */
export interface RadioCardGroupProps {
  readonly value?: string;
  readonly onValueChange?: (val: string) => void;
  readonly options: readonly RadioCardOption[];
  readonly disabled?: boolean;
  readonly "aria-label"?: string;
  readonly "aria-describedby"?: string;
  readonly className?: string;
}

/**
 * Accessible card-styled radio group wrapping Radix RadioGroup primitives.
 *
 * @param props - RadioCardGroupProps
 * @returns JSX.Element
 */
export function RadioCardGroup({
  value,
  onValueChange,
  options,
  disabled = false,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedby,
  className = "",
}: RadioCardGroupProps): JSX.Element {
  return (
    <RadioGroup.Root
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${className}`}
    >
      {options.map((opt) => (
        <RadioGroup.Item
          key={opt.value}
          value={opt.value}
          className="relative flex flex-col p-4 text-left rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-line)] cursor-pointer outline-none transition-colors data-[state=checked]:border-[var(--color-accent)] data-[state=checked]:bg-[var(--color-raised)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
        >
          <div className="flex items-center justify-between w-full mb-1">
            <span className="font-medium text-base text-[var(--color-text)]">{opt.label}</span>
            <div className="h-4 w-4 rounded-full border border-[var(--color-line)] flex items-center justify-center data-[state=checked]:border-[var(--color-accent)]">
              <RadioGroup.Indicator className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
            </div>
          </div>
          {opt.description && (
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">{opt.description}</p>
          )}
          {opt.badge && (
            <span className="mt-2 inline-flex items-center text-xs font-mono px-2 py-0.5 rounded-[var(--radius-pill)] bg-[var(--color-raised)] text-[var(--color-accent)] border border-[var(--color-line)] w-fit">
              {opt.badge}
            </span>
          )}
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
}
