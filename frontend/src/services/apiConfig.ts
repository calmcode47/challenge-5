export function apiBaseUrl(): string {
  const configured = (import.meta.env as { readonly VITE_API_BASE_URL?: string }).VITE_API_BASE_URL;
  return configured ?? "/api/v1";
}

const WAKEUP_STORAGE_KEY = "occasio_planner_wakeup_v1";
let wakeupInFlight: Promise<void> | undefined;

function canUseSessionStorage(): boolean {
  try {
    return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
  } catch {
    return false;
  }
}

/**
 * Starts a low-priority health request as the studio opens. This wakes a sleeping
 * Render instance before the visitor reaches the plan wizard, without exposing
 * event data or delaying the page.
 */
export function warmPlannerApi(): Promise<void> {
  if (canUseSessionStorage() && window.sessionStorage.getItem(WAKEUP_STORAGE_KEY) === "warmed") {
    return Promise.resolve();
  }
  if (wakeupInFlight) return wakeupInFlight;

  wakeupInFlight = fetch(`${apiBaseUrl()}/health`, {
    method: "GET",
    cache: "no-store",
    credentials: "omit",
    signal: AbortSignal.timeout(8_000),
  })
    .then((response) => {
      if (response.ok && canUseSessionStorage()) {
        window.sessionStorage.setItem(WAKEUP_STORAGE_KEY, "warmed");
      }
    })
    .catch(() => undefined)
    .finally(() => {
      wakeupInFlight = undefined;
    });
  return wakeupInFlight;
}
