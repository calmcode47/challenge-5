import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * Visual variant styles for the button component.
 */
export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

/**
 * Size variants for the button ensuring touch-target accessibility.
 */
export type ButtonSize = "sm" | "md" | "lg";

/**
 * Props for the Button component.
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual presentation variant */
  readonly variant?: ButtonVariant;
  /** Size tier; all tiers enforce minimum 44px touch targets */
  readonly size?: ButtonSize;
  /** Displays a loading spinner and sets aria-busy */
  readonly isLoading?: boolean;
  /** Content rendered inside the button */
  readonly children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-accent)] text-[var(--color-bg)] font-medium hover:brightness-105 active:brightness-95",
  secondary:
    "bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-line)] hover:bg-[var(--color-raised)] active:brightness-95",
  ghost:
    "bg-transparent text-[var(--color-text)] hover:bg-[var(--color-raised)] active:brightness-95",
  danger:
    "bg-[var(--color-danger)] text-[var(--color-bg)] font-medium hover:brightness-105 active:brightness-95",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-[44px] min-w-[44px] px-3.5 py-2 text-sm",
  md: "min-h-[44px] min-w-[44px] px-5 py-2.5 text-base",
  lg: "min-h-[48px] min-w-[48px] px-6 py-3 text-lg font-semibold",
};

/**
 * Accessible button component supporting variants, loading states, and WCAG 2.5.8 touch targets.
 *
 * @param props - ButtonProps
 * @returns JSX.Element
 */
export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  className = "",
  children,
  ...rest
}: ButtonProps): JSX.Element {
  const isEffectivelyDisabled = disabled || isLoading;

  return (
    <button
      type={rest.type ?? "button"}
      disabled={isEffectivelyDisabled}
      aria-busy={isLoading ? "true" : undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 select-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin text-current" aria-hidden="true" />}
      <span>{children}</span>
    </button>
  );
}
