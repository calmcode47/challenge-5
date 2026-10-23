import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { ToastProvider } from "../components/ui/Toast";

/**
 * Root providers wrapping the application with MotionConfig reducedMotion="user"
 * and the Radix Toast notification context.
 *
 * @param props - { children: ReactNode }
 * @returns JSX.Element
 */
export function Providers({ children }: { readonly children: ReactNode }): JSX.Element {
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>{children}</ToastProvider>
    </MotionConfig>
  );
}
