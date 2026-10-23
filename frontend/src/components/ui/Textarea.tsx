import type { TextareaHTMLAttributes } from "react";

/**
 * Props for the Textarea component.
 */
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Visual error state indicator */
  readonly isInvalid?: boolean;
}

/**
 * Accessible multi-line textarea with design system tokens and WCAG focus states.
 *
 * @param props - TextareaProps
 * @returns JSX.Element
 */
export function Textarea({
  isInvalid = false,
  className = "",
  rows = 4,
  disabled = false,
  ...rest
}: TextareaProps): JSX.Element {
  const borderClass = isInvalid
    ? "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]"
    : "border-[var(--color-line)] focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]";

  return (
    <textarea
      rows={rows}
      disabled={disabled}
      aria-invalid={isInvalid ? "true" : undefined}
      className={`w-full rounded-[var(--radius-control)] bg-[var(--color-raised)] px-3.5 py-2.5 text-base text-[var(--color-text)] placeholder:text-[var(--color-muted)] border transition-colors outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[var(--color-bg)] disabled:opacity-50 disabled:cursor-not-allowed resize-y ${borderClass} ${className}`}
      {...rest}
    />
  );
}
