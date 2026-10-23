import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "./Button";
import { Card } from "./Card";
import { DemoBanner } from "./DemoBanner";
import { EmptyState } from "./EmptyState";
import { ErrorSummary } from "./ErrorSummary";
import { Input } from "./Input";
import { LiveRegion } from "./LiveRegion";
import { Skeleton } from "./Skeleton";
import { Stat } from "./Stat";
import { Textarea } from "./Textarea";
import { VisuallyHidden } from "./VisuallyHidden";

describe("Auxiliary UI components", () => {
  it("renders Card container with and without interactivity", async () => {
    const { container, rerender } = render(
      <Card isInteractive>
        <p>Card interior</p>
      </Card>
    );
    expect(screen.getByText("Card interior")).toBeInTheDocument();
    let results = await axe(container);
    expect(results).toHaveNoViolations();

    rerender(
      <Card isInteractive={false}>
        <p>Static Card</p>
      </Card>
    );
    expect(screen.getByText("Static Card")).toBeInTheDocument();
    results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders Stat metric card and passes axe check", async () => {
    const { container } = render(
      <Stat label="Total Allocated" value="$25,000" helper="100% of budget" />
    );
    expect(screen.getByText("Total Allocated")).toBeInTheDocument();
    expect(screen.getByText("$25,000")).toBeInTheDocument();
    expect(screen.getByText("100% of budget")).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders EmptyState with and without action", async () => {
    const { container, rerender } = render(
      <EmptyState
        title="No Milestones Scheduled"
        description="Select an event date to generate a timeline."
        action={<Button>Create Date</Button>}
      />
    );
    expect(screen.getByText("No Milestones Scheduled")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create Date" })).toBeInTheDocument();
    let results = await axe(container);
    expect(results).toHaveNoViolations();

    rerender(<EmptyState title="Empty" description="Nothing here" />);
    results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders Skeleton in rectangle and circle shapes", async () => {
    const { container, rerender } = render(<Skeleton className="h-10 w-40" shape="rectangle" />);
    let results = await axe(container);
    expect(results).toHaveNoViolations();

    rerender(<Skeleton shape="circle" className="h-12 w-12" />);
    results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders Input and Textarea in invalid state", async () => {
    const { container } = render(
      <div>
        <Input aria-label="Invalid input" isInvalid />
        <Textarea aria-label="Invalid textarea" isInvalid />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders ErrorSummary with role=alert, autofocus, and jump links", async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(
      <div>
        <ErrorSummary
          errors={[
            { fieldId: "field-title", message: "Title is required" },
            { fieldId: "field-budget", message: "Budget must be positive" },
          ]}
        />
        <input id="field-title" aria-label="Title" />
        <input id="field-budget" aria-label="Budget" />
      </div>
    );

    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();

    const titleLink = screen.getByRole("link", { name: "Title is required" });
    await user.click(titleLink);
    expect(document.activeElement).toBe(screen.getByLabelText("Title"));

    const results = await axe(container);
    expect(results).toHaveNoViolations();

    rerender(<ErrorSummary errors={[]} />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("renders LiveRegion and VisuallyHidden in visible and hidden modes", () => {
    const { rerender } = render(
      <div>
        <LiveRegion
          message="AI generated 4 suggestions"
          role="status"
          ariaLive="polite"
          visuallyHidden
        />
        <VisuallyHidden>Screen reader exclusive note</VisuallyHidden>
      </div>
    );
    expect(screen.getByText("AI generated 4 suggestions")).toHaveAttribute("role", "status");
    expect(screen.getByText("Screen reader exclusive note")).toBeInTheDocument();

    rerender(<LiveRegion message="Visible status" visuallyHidden={false} />);
    expect(screen.getByText("Visible status")).not.toHaveClass("sr-only");
  });

  it("renders DemoBanner with role=status and passes axe check", async () => {
    const { container } = render(<DemoBanner />);
    const banner = screen.getByRole("status");
    expect(banner).toHaveTextContent(/demo data/i);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
