import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Sparkles } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "./Button";
import { IconButton } from "./IconButton";

describe("Button component", () => {
  it("renders accessible button with children and passes axe check", async () => {
    const handleClick = vi.fn();
    const { container } = render(
      <Button variant="primary" onClick={handleClick}>
        Create Plan
      </Button>
    );

    const btn = screen.getByRole("button", { name: "Create Plan" });
    expect(btn).toBeInTheDocument();
    expect(btn).not.toBeDisabled();

    const user = userEvent.setup();
    await user.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("handles loading state by disabling and setting aria-busy", () => {
    render(
      <Button variant="secondary" isLoading>
        Saving
      </Button>
    );

    const btn = screen.getByRole("button", { name: "Saving" });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-busy", "true");
  });

  it("renders danger variant and ghost variant cleanly", async () => {
    const { container } = render(
      <div>
        <Button variant="danger">Delete</Button>
        <Button variant="ghost">Cancel</Button>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("IconButton component", () => {
  it("renders accessible icon-only button with required aria-label", async () => {
    const handleClick = vi.fn();
    const { container } = render(
      <IconButton
        label="Celebration Options"
        icon={<Sparkles data-testid="icon" />}
        onClick={handleClick}
      />
    );

    const btn = screen.getByRole("button", { name: "Celebration Options" });
    expect(btn).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
