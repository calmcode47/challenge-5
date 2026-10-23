import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { NumberField } from "./NumberField";

describe("NumberField component", () => {
  it("renders with currency prefix and handles value changes", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    const { container } = render(
      <NumberField
        aria-label="Catering Budget"
        currencyPrefix="$"
        value={1500}
        onValueChange={handleChange}
        min={0}
        max={10000}
      />
    );

    const input = screen.getByRole("spinbutton", { name: "Catering Budget" });
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(1500);
    expect(screen.getByText("$")).toBeInTheDocument();

    await user.clear(input);
    expect(handleChange).toHaveBeenCalledWith(0);

    await user.type(input, "2500");
    expect(handleChange).toHaveBeenCalled();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
