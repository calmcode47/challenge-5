import { lazy, Suspense, useEffect, useState } from "react";
import { Outlet } from "react-router";
import { useDoubleEscape } from "../../hooks/useDoubleEscape";
import { EffectsProvider, useEffects } from "../../three/EffectsProvider";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { SkipLink } from "./SkipLink";
import { StaticBackdrop } from "./StaticBackdrop";

const LazyBackgroundCanvas = lazy(() => import("../../three/BackgroundCanvas"));

function AppShellInner(): JSX.Element {
  const { quality } = useEffects();
  const [shouldLoad3D, setShouldLoad3D] = useState(false);

  useDoubleEscape({
    onDoubleEscape: () => {
      // Focus shift to main is automatically performed by useDoubleEscape
    },
  });

  // Defer 3D canvas loading until after initial paint via requestIdleCallback
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if ("requestIdleCallback" in window) {
      const handle = window.requestIdleCallback(
        () => {
          setShouldLoad3D(true);
        },
        { timeout: 1500 }
      );
      return () => {
        window.cancelIdleCallback(handle);
      };
    }
    const timer = setTimeout(() => {
      setShouldLoad3D(true);
    }, 200);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-transparent text-[var(--color-text)]">
      <StaticBackdrop />
      {shouldLoad3D && quality !== "static" && (
        <Suspense fallback={null}>
          <LazyBackgroundCanvas />
        </Suspense>
      )}
      <SkipLink />
      <Header />
      <main
        id="main"
        tabIndex={-1}
        className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 outline-none"
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

/**
 * Primary layout shell establishing landmark hierarchy (WCAG 2.4.1), skip links,
 * global double-escape handling, 3D effects capability ladder, and nested route outlets.
 *
 * @returns JSX.Element
 */
export function AppShell(): JSX.Element {
  return (
    <EffectsProvider>
      <AppShellInner />
    </EffectsProvider>
  );
}
