import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter, type RouteObject } from "react-router";
import { AppShell } from "../components/layout/AppShell";
import { Skeleton } from "../components/ui/Skeleton";
import { RouteAnnouncer } from "./RouteAnnouncer";

const LandingPage = lazy(() => import("../features/landing/LandingPage"));
const WizardPage = lazy(() => import("../features/wizard/WizardPage"));
const PlansPage = lazy(() => import("../features/plans/PlansPage"));
const WorkspacePage = lazy(() => import("../features/workspace/WorkspacePage"));
const PrivacyPage = lazy(() => import("../features/settings/PrivacyPage"));
const MyDataPage = lazy(() => import("../features/settings/MyDataPage"));
const NotFoundPage = lazy(() => import("../features/not-found/NotFoundPage"));

function RouteSuspenseFallback(): JSX.Element {
  return (
    <div className="py-8 space-y-4 w-full" aria-busy="true">
      <Skeleton className="h-10 w-2/3 max-w-md" />
      <Skeleton className="h-5 w-full max-w-lg" />
      <Skeleton className="h-48 w-full mt-6" />
    </div>
  );
}

function withSuspense(component: ReactNode): JSX.Element {
  return <Suspense fallback={<RouteSuspenseFallback />}>{component}</Suspense>;
}

/**
 * Route objects configuration for Occasio application layout and pages.
 */
export const routes: RouteObject[] = [
  {
    element: (
      <>
        <RouteAnnouncer />
        <AppShell />
      </>
    ),
    children: [
      { path: "/", element: withSuspense(<LandingPage />) },
      { path: "/plan/new", element: withSuspense(<WizardPage />) },
      { path: "/plans", element: withSuspense(<PlansPage />) },
      { path: "/plan/:planId", element: withSuspense(<WorkspacePage />) },
      { path: "/privacy", element: withSuspense(<PrivacyPage />) },
      { path: "/my-data", element: withSuspense(<MyDataPage />) },
      { path: "*", element: withSuspense(<NotFoundPage />) },
    ],
  },
];

/**
 * Declarative application router matching M03 layout with lazy-loaded route splits.
 */
export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter(routes);
