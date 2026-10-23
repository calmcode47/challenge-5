import { useEffect } from "react";
import { useScroll } from "motion/react";

/**
 * Mutable scroll and pointer telemetry shared with Three.js scenes without React rerenders.
 */
export interface ScrollTelemetry {
  /** Normalized scroll progression from 0.0 to 1.0 */
  progress: number;
  /** Normalized pointer X coordinate in range [-1.0, 1.0] */
  pointerX: number;
  /** Normalized pointer Y coordinate in range [-1.0, 1.0] */
  pointerY: number;
  /** Active page section index derived from scroll progression */
  section: number;
}

/**
 * Singleton mutable telemetry state accessed by 3D render loops.
 */
export const scrollStore: ScrollTelemetry = {
  progress: 0,
  pointerX: 0,
  pointerY: 0,
  section: 0,
};

/**
 * Hook synchronizing native window scroll progression and fine pointer coordinates
 * directly into the mutable scrollStore, avoiding React component rerenders.
 */
export function useScrollSync(): void {
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      scrollStore.progress = latest;
      scrollStore.section = Math.min(3, Math.max(0, Math.floor(latest * 4)));
    });

    if (typeof window === "undefined") {
      return unsubscribe;
    }

    const finePointerQuery = window.matchMedia("(pointer: fine)");
    let frameId: number | null = null;
    let pendingX = 0;
    let pendingY = 0;

    const handlePointerMove = (e: MouseEvent): void => {
      if (!finePointerQuery.matches) {
        return;
      }
      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;
      pendingX = (e.clientX / width) * 2 - 1;
      pendingY = -(e.clientY / height) * 2 + 1;

      frameId ??= window.requestAnimationFrame(() => {
        scrollStore.pointerX = pendingX;
        scrollStore.pointerY = pendingY;
        frameId = null;
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      unsubscribe();
      window.removeEventListener("pointermove", handlePointerMove);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [scrollYProgress]);
}
