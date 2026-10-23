import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { ProgressMeter } from "./ProgressMeter";

describe("ProgressMeter component", () => {
  it("renders accessible progressbar with label and value percentage", async () => {
    const { container } = render(
      <ProgressMeter label="Checklist Completed" value={75} max={100} />
    );

    const progressbar = screen.getByRole("progressbar", { name: "Checklist Completed" });
    expect(progressbar).toBeInTheDocument();
    expect(progressbar).toHaveAttribute("aria-valuenow", "75");
    expect(progressbar).toHaveAttribute("aria-valuemin", "0");
    expect(progressbar).toHaveAttribute("aria-valuemax", "100");
    expect(screen.getByText("75%")).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("clamps out-of-range values defensively", () => {
    render(<ProgressMeter aria-label="Budget Utilization" value={150} max={100} />);
    const progressbar = screen.getByRole("progressbar", { name: "Budget Utilization" });
    expect(progressbar).toHaveAttribute("aria-valuenow", "100");
  });
});
