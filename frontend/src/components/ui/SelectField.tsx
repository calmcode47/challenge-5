import { Check, ChevronDown } from "lucide-react";
import { Select } from "radix-ui";

/**
 * Option descriptor for the SelectField component.
 */
export interface SelectOption {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
}

/**
 * Props for the SelectField component.
 */
export interface SelectFieldProps {
  readonly id?: string;
  readonly value?: string;
  readonly onValueChange?: (val: string) => void;
  readonly options: readonly SelectOption[];
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly isInvalid?: boolean;
  readonly "aria-label"?: string;
  readonly "aria-describedby"?: string;
  readonly className?: string;
}

/**
 * Accessible dropdown select component wrapping Radix Select primitives with token styling.
 *
 * @param props - SelectFieldProps
 * @returns JSX.Element
 */
export function SelectField({
  id,
  value,
  onValueChange,
  options,
  placeholder = "Select an option...",
  disabled = false,
  isInvalid = false,
  className = "",
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedby,
}: SelectFieldProps): JSX.Element {
  const borderClass = isInvalid
    ? "border-[var(--color-danger)] focus:border-[var(--color-danger)]"
    : "border-[var(--color-line)] focus:border-[var(--color-accent)]";

  return (
    <Select.Root value={value} onValueChange={onValueChange} disabled={disabled}>
      <Select.Trigger
        id={id}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedby}
        aria-invalid={isInvalid ? "true" : undefined}
        className={`inline-flex items-center justify-between w-full min-h-[44px] rounded-[var(--radius-control)] bg-[var(--color-raised)] px-3.5 py-2.5 text-base text-[var(--color-text)] border transition-colors outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[var(--color-bg)] focus:ring-[var(--color-accent)] disabled:opacity-50 disabled:cursor-not-allowed ${borderClass} ${className}`}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon asChild>
          <ChevronDown className="h-4 w-4 text-[var(--color-muted)]" aria-hidden="true" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={4}
          className="z-50 min-w-[200px] overflow-hidden rounded-[var(--radius-control)] bg-[var(--color-surface)] border border-[var(--color-line)] shadow-xl"
        >
          <Select.Viewport className="p-1.5">
            {options.map((opt) => (
              <Select.Item
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className="relative flex items-center justify-between min-h-[40px] px-3 py-2 text-sm text-[var(--color-text)] rounded-[var(--radius-control)] cursor-pointer outline-none select-none data-[highlighted]:bg-[var(--color-raised)] data-[highlighted]:text-[var(--color-accent)] data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed"
              >
                <Select.ItemText>{opt.label}</Select.ItemText>
                <Select.ItemIndicator className="ml-2">
                  <Check className="h-4 w-4 text-[var(--color-accent)]" aria-hidden="true" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
