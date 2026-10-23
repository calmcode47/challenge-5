import { RouterProvider } from "react-router";
import { ErrorBoundary } from "./ErrorBoundary";
import { Providers } from "./providers";
import { router } from "./router";

/**
 * Root application component wrapping global error boundary, providers, and router.
 *
 * @returns JSX.Element
 */
export function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <Providers>
        <RouterProvider router={router} />
      </Providers>
    </ErrorBoundary>
  );
}
