import { Component, type ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "../components/ui/Button";

/**
 * Props for the ErrorBoundary component.
 */
export interface ErrorBoundaryProps {
  /** Optional fallback UI render function */
  readonly fallback?: ReactNode;
  /** Wrapped child tree */
  readonly children: ReactNode;
}

interface ErrorBoundaryState {
  readonly hasError: boolean;
}

/**
 * Global boundary catching render exceptions without leaking raw stack traces
 * or sensitive user data (M07-S11).
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public override componentDidCatch(): void {
    // Sanitized boundary hook: intentionally omits logging or telemetry of user input
  }

  private handleReset = (): void => {
    this.setState({ hasError: false });
  };

  private handleReload = (): void => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  private handleGoHome = (): void => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  public override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center"
        >
          <div className="p-4 mb-4 rounded-full bg-[var(--color-raised)] text-[var(--color-danger)]">
            <AlertCircle className="h-10 w-10" aria-hidden="true" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display uppercase tracking-wide font-bold text-[var(--color-text)] mb-3">
            Something went wrong
          </h1>
          <p className="max-w-md text-sm text-[var(--color-muted)] mb-8 leading-relaxed">
            An unexpected error occurred while loading this view. You can retry the action, reload
            the application, or return to the main home screen.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="primary" onClick={this.handleReset}>
              Try Again
            </Button>
            <Button variant="secondary" onClick={this.handleReload}>
              Reload App
            </Button>
            <Button variant="ghost" onClick={this.handleGoHome}>
              Go to Home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
