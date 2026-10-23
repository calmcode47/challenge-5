import { useEffect, useState } from "react";

/**
 * SSR-safe, defensive media query hook with dynamic change listener.
 * Conforms to modern and legacy matchMedia APIs without crashing during SSR.
 *
 * @param query - CSS media query string (e.g., '(prefers-reduced-motion: reduce)')
 * @returns Boolean indicating whether the media query currently matches
 */
export function useMediaQuery(query: string): boolean {
  const getMatches = (q: string): boolean => {
    if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
      return window.matchMedia(q).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(() => getMatches(query));

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", listener);
      return () => {
        mql.removeEventListener("change", listener);
      };
    }
  }, [query]);

  return matches;
}
