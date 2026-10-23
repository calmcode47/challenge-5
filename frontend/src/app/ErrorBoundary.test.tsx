import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ErrorBoundary } from "./ErrorBoundary";

function ProblematicComponent({ shouldThrow }: { readonly shouldThrow: boolean }): JSX.Element {
  if (shouldThrow) {
    throw new Error("SecretInternalDatabaseException: passwords leaked");
  }
  return <div>Clean Component Content</div>;
}

describe("ErrorBoundary", () => {
  it("renders children when no error occurs", () => {
    render(
      <ErrorBoundary>
        <ProblematicComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Clean Component Content")).toBeInTheDocument();
  });

  it("catches render error, displays role=alert, and prevents raw stack leakage", () => {
    render(
      <ErrorBoundary>
        <ProblematicComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    // Verifies M07-S11: raw error message and stack trace must NOT appear in DOM
    expect(screen.queryByText(/SecretInternalDatabaseException/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/passwords leaked/i)).not.toBeInTheDocument();
  });

  it("recovers via Try Again button", async () => {
    const user = userEvent.setup();
    let shouldThrow = true;

    function Flaky(): JSX.Element {
      if (shouldThrow) {
        throw new Error("Temporary crash");
      }
      return <div>Recovered Successfully</div>;
    }

    const { rerender } = render(
      <ErrorBoundary>
        <Flaky />
      </ErrorBoundary>
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();

    shouldThrow = false;
    const tryAgainBtn = screen.getByRole("button", { name: /try again/i });
    await user.click(tryAgainBtn);

    rerender(
      <ErrorBoundary>
        <Flaky />
      </ErrorBoundary>
    );

    expect(screen.getByText("Recovered Successfully")).toBeInTheDocument();
  });

  it("handles Reload and Go to Home buttons", async () => {
    const user = userEvent.setup();
    const reloadMock = vi.fn();
    Object.defineProperty(window, "location", {
      writable: true,
      value: { reload: reloadMock, href: "" },
    });

    render(
      <ErrorBoundary>
        <ProblematicComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    const reloadBtn = screen.getByRole("button", { name: /reload app/i });
    await user.click(reloadBtn);
    expect(reloadMock).toHaveBeenCalled();

    const homeBtn = screen.getByRole("button", { name: /go to home/i });
    await user.click(homeBtn);
    expect(window.location.href).toBe("/");
  });

  it("renders custom fallback prop when provided", () => {
    render(
      <ErrorBoundary fallback={<div>Custom Error Screen</div>}>
        <ProblematicComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText("Custom Error Screen")).toBeInTheDocument();
  });
});
