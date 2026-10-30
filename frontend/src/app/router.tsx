import { lazy, Suspense, type ReactElement } from "react";
import { createBrowserRouter } from "react-router";

const HomePage = lazy(() => import("../features/home/HomePage.js"));
const WizardPage = lazy(() => import("../features/wizard/WizardPage.js"));
const WorkspacePage = lazy(() => import("../features/workspace/WorkspacePage.js"));
const VaultPage = lazy(() => import("../features/vault/VaultPage.js"));
const NotFoundPage = lazy(() => import("../features/not-found/NotFoundPage.js"));

/**
 * Visual loading skeleton shown while lazy-loaded route views stream into memory.
 */
export function LoadingFallback(): ReactElement {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center text-wine-deep">
      <span
        className="material-symbols-outlined text-4xl animate-spin text-wine-accent"
        aria-hidden="true"
      >
        progress_activity
      </span>
      <span className="font-label-md text-label-md mt-3 tracking-wider uppercase font-bold text-secondary">
        Opening Studio Atelier...
      </span>
    </div>
  );
}

/**
 * Studio route tree configuration mapping application paths to lazy components.
 */
export const routes = [
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <HomePage />
      </Suspense>
    ),
  },
  {
    path: "/studio-home",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <HomePage />
      </Suspense>
    ),
  },
  {
    path: "/plan-wizard",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <WizardPage />
      </Suspense>
    ),
  },
  {
    path: "/wizard",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <WizardPage />
      </Suspense>
    ),
  },
  {
    path: "/event-workspace",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <WorkspacePage />
      </Suspense>
    ),
  },
  {
    path: "/workspace",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <WorkspacePage />
      </Suspense>
    ),
  },
  {
    path: "/my-plans-vault",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <VaultPage />
      </Suspense>
    ),
  },
  {
    path: "/plans",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <VaultPage />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
];

/**
 * Main application router defining routes for Studio Home, Wizard, Workspace, and Vault.
 */
export const router = createBrowserRouter(routes);
