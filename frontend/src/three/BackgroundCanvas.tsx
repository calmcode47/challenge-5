import { Canvas } from "@react-three/fiber";
import { Component, useEffect, useState, type ReactNode } from "react";
import { useEffects } from "./EffectsProvider";
import { SceneRoot } from "./SceneRoot";
import { useScrollSync } from "./scrollStore";

interface ErrorBoundaryProps {
  readonly fallback: ReactNode;
  readonly children: ReactNode;
}

interface ErrorBoundaryState {
  readonly hasError: boolean;
}

class CanvasErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public override componentDidCatch(): void {
    // Gracefully catch canvas crashes and switch to static background fallback
  }

  public override render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * Lazy-loaded persistent background canvas running Three.js scene graph.
 * Configured with power-conscious WebGL settings, dynamic DPR capping,
 * context loss recovery, and a complete fallback to CSS when disabled or degraded.
 *
 * @returns JSX.Element | null
 */
export default function BackgroundCanvas(): JSX.Element | null {
  useScrollSync();
  const { quality, paused, setUserMode } = useEffects();
  const [fadedIn, setFadedIn] = useState(false);

  // Smooth fade-in over static CSS backdrop
  useEffect(() => {
    const timer = setTimeout(() => {
      setFadedIn(true);
    }, 50);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (quality === "static") {
    return null;
  }

  const dpr: [number, number] | number = quality === "full" ? [1, 1.5] : 1;
  const frameloop = quality === "full" && !paused ? "always" : "demand";

  return (
    <CanvasErrorBoundary fallback={null}>
      <div
        ref={(el) => {
          if (el) {
            el.addEventListener("webglcontextlost", (e) => {
              e.preventDefault();
              setUserMode("off");
            });
          }
        }}
        className={`fixed inset-0 -z-10 pointer-events-none transition-opacity duration-400 ease-out ${
          fadedIn ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
        role="presentation"
        data-testid="background-canvas-container"
      >
        <Canvas
          dpr={dpr}
          frameloop={frameloop}
          camera={{ position: [0, 0, 6], fov: 45 }}
          gl={{
            antialias: false,
            powerPreference: "low-power",
            alpha: false,
          }}
          onCreated={({ gl }) => {
            const canvasEl = gl.domElement;
            const handleContextLost = (e: Event): void => {
              e.preventDefault();
              setUserMode("off");
            };
            canvasEl.addEventListener("webglcontextlost", handleContextLost);
          }}
          className="w-full h-full"
        >
          <SceneRoot />
        </Canvas>
      </div>
    </CanvasErrorBoundary>
  );
}
