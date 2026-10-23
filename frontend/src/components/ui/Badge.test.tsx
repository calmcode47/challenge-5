import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Badge } from "./Badge";

describe("Badge component", () => {
  it("renders canonical provenance badges with icon and text per M00 and M07-A7", async () => {
    const { container } = render(
      <div className="flex gap-2">
        <Badge kind="calculated">Calculated</Badge>
        <Badge kind="ai">AI estimate</Badge>
        <Badge kind="demo">Demo data</Badge>
      </div>
    );

    expect(screen.getByText("Calculated")).toBeInTheDocument();
    expect(screen.getByText("AI estimate")).toBeInTheDocument();
    expect(screen.getByText("Demo data")).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders status badges with icons", async () => {
    const { container } = render(
      <div className="flex gap-2">
        <Badge kind="success">Confirmed</Badge>
        <Badge kind="warning">Due Soon</Badge>
        <Badge kind="danger">Over Budget</Badge>
      </div>
    );

    expect(screen.getByText("Confirmed")).toBeInTheDocument();
    expect(screen.getByText("Due Soon")).toBeInTheDocument();
    expect(screen.getByText("Over Budget")).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
