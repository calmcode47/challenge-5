import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useFocusOnRoute } from "../hooks/useFocusOnRoute";

/**
 * Accessible route announcer providing polite live-region notifications on navigation (M07-A3).
 * Simultaneously triggers keyboard focus management to move focus to the route's primary <h1>.
 *
 * @returns JSX.Element
 */
export function RouteAnnouncer(): JSX.Element {
  const location = useLocation();
  const [announcement, setAnnouncement] = useState("");

  useFocusOnRoute(location.pathname);

  useEffect(() => {
    // Delay slightly to allow the child page useDocumentTitle hook to execute
    const timer = setTimeout(() => {
      const pageTitle = document.title || "Occasio";
      setAnnouncement(`Navigated to ${pageTitle}`);
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname]);

  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {announcement}
    </div>
  );
}
