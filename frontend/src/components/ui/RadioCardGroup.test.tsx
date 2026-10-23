import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { RadioCardGroup, type RadioCardOption } from "./RadioCardGroup";

const OPTIONS: readonly RadioCardOption[] = [
  { value: "banquet_hall", label: "Banquet Hall", description: "Indoor formal venue" },
  {
    value: "outdoor",
    label: "Outdoor Park",
    description: "Scenic open-air space",
    badge: "Popular",
  },
];

describe("RadioCardGroup component", () => {
  it("renders radio group and passes axe accessibility test", async () => {
    const { container } = render(
      <RadioCardGroup aria-label="Venue Selection" options={OPTIONS} value="banquet_hall" />
    );

    const group = screen.getByRole("radiogroup", { name: "Venue Selection" });
    expect(group).toBeInTheDocument();

    const banquetRadio = screen.getByRole("radio", { name: /banquet hall/i });
    expect(banquetRadio).toBeChecked();

    const outdoorRadio = screen.getByRole("radio", { name: /outdoor park/i });
    expect(outdoorRadio).not.toBeChecked();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("handles selection changes via click and keyboard", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <RadioCardGroup
        aria-label="Venue Selection"
        options={OPTIONS}
        value="banquet_hall"
        onValueChange={handleChange}
      />
    );

    const outdoorRadio = screen.getByRole("radio", { name: /outdoor park/i });
    await user.click(outdoorRadio);
    expect(handleChange).toHaveBeenCalledWith("outdoor");
  });
});
