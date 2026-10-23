import { Switch as RadixSwitch } from "radix-ui";

/**
 * Props for the Switch component.
 */
export interface SwitchProps {
  readonly checked?: boolean;
  readonly onCheckedChange?: (checked: boolean) => void;
  readonly label?: string;
  readonly disabled?: boolean;
  readonly "aria-label"?: string;
  readonly "aria-describedby"?: string;
  readonly className?: string;
}

/**
 * Accessible toggle switch wrapping Radix Switch primitives with design tokens.
 *
 * @param props - SwitchProps
 * @returns JSX.Element
 */
export function Switch({
  checked = false,
  onCheckedChange,
  label,
  disabled = false,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedby,
  className = "",
}: SwitchProps): JSX.Element {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <RadixSwitch.Root
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-label={ariaLabel ?? label}
        aria-describedby={ariaDescribedby}
        className="w-12 h-7 bg-[var(--color-raised)] rounded-full border border-[var(--color-line)] relative cursor-pointer outline-none transition-colors data-[state=checked]:bg-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RadixSwitch.Thumb className="block w-5 h-5 bg-[var(--color-text)] rounded-full transition-transform duration-150 translate-x-1 will-change-transform data-[state=checked]:translate-x-6 data-[state=checked]:bg-[var(--color-bg)]" />
      </RadixSwitch.Root>
      {label && (
        <span className="text-sm font-medium text-[var(--color-text)] select-none">{label}</span>
      )}
    </div>
  );
}
