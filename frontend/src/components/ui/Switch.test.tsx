import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Switch } from "./Switch";

describe("Switch component", () => {
  it("renders switch with accessible label and passes axe verification", async () => {
    const { container } = render(<Switch label="Include Photography" checked={false} />);

    const toggle = screen.getByRole("switch", { name: "Include Photography" });
    expect(toggle).toBeInTheDocument();
    expect(toggle).not.toBeChecked();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("triggers onCheckedChange when clicked", async () => {
    const handleCheckedChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Switch label="Include Photography" checked={false} onCheckedChange={handleCheckedChange} />
    );

    const toggle = screen.getByRole("switch", { name: "Include Photography" });
    await user.click(toggle);

    expect(handleCheckedChange).toHaveBeenCalledWith(true);
  });
});
