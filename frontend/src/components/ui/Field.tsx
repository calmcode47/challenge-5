import type { ReactNode } from "react";
import { mergeDescribedBy, useStableId } from "../../lib/a11y";

/**
 * Props passed to form input elements rendered inside a Field.
 */
export interface FieldInputProps {
  /** Generated accessible HTML id */
  readonly id: string;
  /** Space-separated references to hint and error message containers */
  readonly "aria-describedby"?: string;
  /** True when field has an active error */
  readonly "aria-invalid"?: boolean;
}

/**
 * Props for the Field form wrapper component.
 */
export interface FieldProps {
  /** Optional custom id; auto-generated if omitted */
  readonly id?: string;
  /** Visible label text */
  readonly label: string;
  /** Optional explanatory hint text */
  readonly hint?: string;
  /** Optional validation error message */
  readonly error?: string;
  /** Whether the field is mandatory */
  readonly required?: boolean;
  /** Optional extra classes */
  readonly className?: string;
  /** Child component or render function receiving accessibility props */
  readonly children: ReactNode | ((props: FieldInputProps) => ReactNode);
}

/**
 * Accessible form field container linking label, hint, and error descriptions
 * via aria-describedby and role=alert.
 *
 * @param props - FieldProps
 * @returns JSX.Element
 */
export function Field({
  id: customId,
  label,
  hint,
  error,
  required = false,
  className = "",
  children,
}: FieldProps): JSX.Element {
  const generatedId = useStableId("field");
  const fieldId = customId ?? generatedId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = mergeDescribedBy(hintId, errorId);

  const inputProps: FieldInputProps = {
    id: fieldId,
    "aria-describedby": describedBy,
    "aria-invalid": Boolean(error),
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label
        htmlFor={fieldId}
        className="text-sm font-medium text-[var(--color-text)] flex items-center gap-1"
      >
        <span>{label}</span>
        {required && (
          <span className="text-[var(--color-coral)]" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {hint && (
        <p id={hintId} className="text-xs text-[var(--color-muted)] leading-relaxed">
          {hint}
        </p>
      )}

      <div className="w-full">
        {typeof children === "function" ? children(inputProps) : children}
      </div>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-xs font-medium text-[var(--color-danger)] flex items-center gap-1"
        >
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
