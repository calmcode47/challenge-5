import { useEffect } from "react";

const APP_TITLE_SUFFIX = "Occasio — Event Planner";

/**
 * Hook to set the document title dynamically per route with automatic formatting.
 * Restores previous title when unmounting if specified.
 *
 * @param title - Unique page or route title (e.g. "Create New Plan")
 */
export function useDocumentTitle(title?: string): void {
  useEffect(() => {
    const previousTitle = document.title;
    if (title && title.trim().length > 0) {
      document.title = `${title} | ${APP_TITLE_SUFFIX}`;
    } else {
      document.title = APP_TITLE_SUFFIX;
    }

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}
