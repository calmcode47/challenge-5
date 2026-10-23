import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { SliderField } from "./SliderField";

describe("SliderField component", () => {
  it("renders slider with label, readout and passes axe check", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    const { container, rerender } = render(
      <SliderField
        label="Catering Priority"
        value={4}
        min={1}
        max={5}
        formatValue={(val) => `Priority ${String(val)}/5`}
        onValueChange={handleChange}
      />
    );

    const slider = screen.getByRole("slider", { name: "Catering Priority" });
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute("aria-valuenow", "4");
    expect(screen.getByText("Priority 4/5")).toBeInTheDocument();

    slider.focus();
    await user.keyboard("{ArrowRight}");

    let results = await axe(container);
    expect(results).toHaveNoViolations();

    rerender(<SliderField aria-label="Volume" value={50} />);
    results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
