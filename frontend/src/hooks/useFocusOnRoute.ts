import { useEffect, useRef } from "react";

/**
 * Moves keyboard focus to the primary route <h1> (or #main fallback) on pathname transitions.
 * Skips the initial page load to preserve natural document entry and skip-link positioning.
 *
 * @param pathname - Current route pathname string
 */
export function useFocusOnRoute(pathname: string): void {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const heading = document.querySelector("h1");
    if (heading instanceof HTMLElement) {
      if (!heading.hasAttribute("tabindex")) {
        heading.setAttribute("tabindex", "-1");
      }
      heading.focus();
      return;
    }

    const main = document.getElementById("main");
    if (main instanceof HTMLElement) {
      if (!main.hasAttribute("tabindex")) {
        main.setAttribute("tabindex", "-1");
      }
      main.focus();
    }
  }, [pathname]);
}
