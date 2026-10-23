import type { ChangeEvent, InputHTMLAttributes } from "react";
import { Input } from "./Input";

/**
 * Props for the NumberField component.
 */
export interface NumberFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange"
> {
  /** Numerical value */
  readonly value?: number;
  /** Callback invoked when numerical value changes */
  readonly onValueChange?: (val: number) => void;
  /** Optional currency symbol or prefix (e.g. '$', '€', '₹') */
  readonly currencyPrefix?: string;
  /** Validation error indicator */
  readonly isInvalid?: boolean;
}

/**
 * Accessible numeric input supporting currency prefixes, step adjustments, and validation limits.
 *
 * @param props - NumberFieldProps
 * @returns JSX.Element
 */
export function NumberField({
  value,
  onValueChange,
  currencyPrefix,
  isInvalid = false,
  className = "",
  min,
  max,
  step = 1,
  ...rest
}: NumberFieldProps): JSX.Element {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") {
      onValueChange?.(0);
      return;
    }
    const parsed = Number(raw);
    if (!Number.isNaN(parsed)) {
      onValueChange?.(parsed);
    }
  };

  return (
    <div className="relative flex items-center w-full">
      {currencyPrefix && (
        <span
          aria-hidden="true"
          className="absolute left-3.5 text-base font-medium text-[var(--color-muted)] select-none pointer-events-none"
        >
          {currencyPrefix}
        </span>
      )}
      <Input
        type="number"
        value={value ?? ""}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        isInvalid={isInvalid}
        className={`${currencyPrefix ? "pl-8" : ""} tabular-nums ${className}`}
        {...rest}
      />
    </div>
  );
}
