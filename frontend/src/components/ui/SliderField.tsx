import { Slider } from "radix-ui";

/**
 * Props for the SliderField component.
 */
export interface SliderFieldProps {
  readonly value?: number;
  readonly onValueChange?: (val: number) => void;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly label?: string;
  readonly formatValue?: (val: number) => string;
  readonly disabled?: boolean;
  readonly "aria-label"?: string;
  readonly "aria-describedby"?: string;
  readonly className?: string;
}

interface SliderHeaderProps {
  readonly label?: string;
  readonly displayValue?: string;
}

function SliderHeader({ label, displayValue }: SliderHeaderProps): JSX.Element | null {
  if (!label && !displayValue) {
    return null;
  }
  return (
    <div className="flex items-center justify-between text-sm">
      {label && <span className="font-medium text-[var(--color-text)]">{label}</span>}
      {displayValue && (
        <span className="font-mono text-sm text-[var(--color-accent)] font-semibold tabular-nums">
          {displayValue}
        </span>
      )}
    </div>
  );
}

/**
 * Accessible slider component wrapping Radix Slider primitives with live numeric readout.
 *
 * @param props - SliderFieldProps
 * @returns JSX.Element
 */
export function SliderField({
  value = 0,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  formatValue,
  disabled = false,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedby,
  className = "",
}: SliderFieldProps): JSX.Element {
  const displayValue = formatValue ? formatValue(value) : label ? String(value) : undefined;

  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      <SliderHeader label={label} displayValue={displayValue} />
      <Slider.Root
        value={[value]}
        onValueChange={(vals) => {
          onValueChange?.(vals[0] ?? 0);
        }}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        aria-label={ariaLabel ?? label}
        aria-describedby={ariaDescribedby}
        className="relative flex items-center select-none touch-none w-full h-8 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Slider.Track className="relative bg-[var(--color-raised)] grow rounded-full h-2 border border-[var(--color-line)]">
          <Slider.Range className="absolute bg-[var(--color-accent)] rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-6 h-6 bg-[var(--color-text)] border-2 border-[var(--color-accent)] rounded-full shadow-md outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
          aria-label={ariaLabel ?? label}
        />
      </Slider.Root>
    </div>
  );
}
