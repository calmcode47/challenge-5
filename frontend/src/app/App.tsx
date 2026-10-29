import { useEffect, type ReactElement } from "react";
import { RouterProvider } from "react-router";
import { router } from "./router.js";
import { ErrorBoundary } from "./ErrorBoundary.js";
import { useUiStore } from "../state/uiStore.js";
import { MaterialIcon } from "../components/common/MaterialIcon.js";
import { warmPlannerApi } from "../services/apiConfig.js";

function GlobalToast(): ReactElement | null {
  const { notification, dismissNotification } = useUiStore();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dismissNotification();
      }, 4000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [notification, dismissNotification]);

  if (!notification) return null;

  return (
    <aside
      aria-label="Studio Notification"
      aria-live="polite"
      role="status"
      className="fixed bottom-6 right-6 z-50 bg-wine-deep text-cream-linen px-space-lg py-space-md rounded-2xl shadow-2xl flex items-center gap-space-sm border border-blush-petal/20 animate-fade-in"
    >
      <MaterialIcon
        name={notification.type === "success" ? "check_circle" : "info"}
        size={22}
        className={notification.type === "success" ? "text-butter-sun" : "text-blush-petal"}
      />
      <div className="flex flex-col">
        <span className="font-headline-sm text-headline-sm text-cream-linen font-bold">
          Studio Notification
        </span>
        <span className="font-body-sm text-body-sm text-cream-linen/90 font-medium">
          {notification.message}
        </span>
      </div>
      <button
        type="button"
        onClick={dismissNotification}
        className="ml-2 text-cream-linen/70 hover:text-cream-linen"
        aria-label="Dismiss notification"
      >
        <MaterialIcon name="close" size={18} />
      </button>
    </aside>
  );
}

/**
 * Root Application component providing ErrorBoundary, router, and toast provider.
 */
export function App(): ReactElement {
  useEffect(() => {
    void warmPlannerApi();
  }, []);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <GlobalToast />
    </ErrorBoundary>
  );
}

export default App;
