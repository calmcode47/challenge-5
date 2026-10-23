import type { InputHTMLAttributes } from "react";

/**
 * Props for the Input component.
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Visual error state indicator */
  readonly isInvalid?: boolean;
}

/**
 * Accessible text input with tokens, 44px min height, and WCAG focus indicators.
 *
 * @param props - InputProps
 * @returns JSX.Element
 */
export function Input({
  isInvalid = false,
  className = "",
  disabled = false,
  ...rest
}: InputProps): JSX.Element {
  const borderClass = isInvalid
    ? "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]"
    : "border-[var(--color-line)] focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]";

  return (
    <input
      disabled={disabled}
      aria-invalid={isInvalid ? "true" : undefined}
      className={`w-full min-h-[44px] rounded-[var(--radius-control)] bg-[var(--color-raised)] px-3.5 py-2.5 text-base text-[var(--color-text)] placeholder:text-[var(--color-muted)] border transition-colors outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[var(--color-bg)] disabled:opacity-50 disabled:cursor-not-allowed ${borderClass} ${className}`}
      {...rest}
    />
  );
}
