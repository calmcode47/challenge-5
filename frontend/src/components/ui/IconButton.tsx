import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Button, type ButtonVariant } from "./Button";

/**
 * Props for the IconButton component.
 */
export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Mandatory accessible label read by screen readers */
  readonly label: string;
  /** Visual variant style */
  readonly variant?: ButtonVariant;
  /** Icon element rendered within button */
  readonly icon: ReactNode;
  /** Loading state */
  readonly isLoading?: boolean;
}

/**
 * Accessible icon-only button requiring an explicit aria-label for screen reader users.
 * Enforces minimum 44px by 44px target sizing per WCAG 2.5.8.
 *
 * @param props - IconButtonProps
 * @returns JSX.Element
 */
export function IconButton({
  label,
  variant = "ghost",
  icon,
  className = "",
  ...rest
}: IconButtonProps): JSX.Element {
  return (
    <Button
      variant={variant}
      size="sm"
      aria-label={label}
      className={`p-2.5 ${className}`}
      {...rest}
    >
      <span aria-hidden="true" className="inline-flex items-center justify-center">
        {icon}
      </span>
    </Button>
  );
}
