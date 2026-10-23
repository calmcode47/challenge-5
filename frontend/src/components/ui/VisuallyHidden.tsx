import type { ReactNode } from "react";
import { VisuallyHidden as RadixVisuallyHidden } from "radix-ui";

/**
 * Props for the VisuallyHidden component.
 */
export interface VisuallyHiddenProps {
  /** Screen-reader only text or elements */
  readonly children: ReactNode;
  /** Delegate rendering to the child element */
  readonly asChild?: boolean;
}

/**
 * Accessible visually hidden wrapper hiding content visually while keeping it available
 * to assistive technologies and screen readers.
 *
 * @param props - VisuallyHiddenProps
 * @returns JSX.Element
 */
export function VisuallyHidden({ children, asChild = false }: VisuallyHiddenProps): JSX.Element {
  return <RadixVisuallyHidden.Root asChild={asChild}>{children}</RadixVisuallyHidden.Root>;
}
