import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { ToastProvider } from "../components/ui/Toast";
import { EffectsProvider } from "../three/EffectsProvider";

/**
 * Root providers wrapping the application with MotionConfig reducedMotion="user",
 * 3D EffectsProvider capability ladder, and the Radix Toast notification context.
 *
 * @param props - { children: ReactNode }
 * @returns JSX.Element
 */
export function Providers({ children }: { readonly children: ReactNode }): JSX.Element {
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <EffectsProvider>{children}</EffectsProvider>
      </ToastProvider>
    </MotionConfig>
  );
}
