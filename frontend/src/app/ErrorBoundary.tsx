import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  readonly children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Global React Error Boundary preventing application crashes from rendering exceptions.
 */
export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (error.name && errorInfo.componentStack) {
      // Diagnostic check without side effects
    }
  }

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-error-container text-error flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl">warning</span>
          </div>
          <h1 className="font-headline-md text-headline-md text-wine-deep font-bold mb-2">
            A Studio Glaze Flaw Occurred
          </h1>
          <p className="font-body-md text-body-md text-text-muted max-w-md mb-6">
            An unexpected error occurred while rendering this celebratory canvas.
          </p>
          <button
            type="button"
            onClick={() => {
              window.location.href = "/";
            }}
            className="px-6 py-2.5 rounded-full bg-wine-accent text-cream-linen font-label-lg font-bold hover:bg-wine-deep shadow-md"
          >
            Return to Studio Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
