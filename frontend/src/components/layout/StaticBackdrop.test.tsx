import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { StaticBackdrop } from "./StaticBackdrop";

describe("StaticBackdrop component", () => {
  it("renders with bg-static class and accessibility presentation attributes", async () => {
    const { container } = render(<StaticBackdrop />);
    const backdrop = screen.getByTestId("static-backdrop");

    expect(backdrop).toBeInTheDocument();
    expect(backdrop).toHaveClass("bg-static");
    expect(backdrop).toHaveAttribute("aria-hidden", "true");
    expect(backdrop).toHaveAttribute("role", "presentation");

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
