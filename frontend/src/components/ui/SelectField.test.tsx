import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { SelectField, type SelectOption } from "./SelectField";

const OPTIONS: readonly SelectOption[] = [
  { value: "wedding", label: "Wedding" },
  { value: "birthday", label: "Birthday Party" },
  { value: "community", label: "Community Festival" },
];

describe("SelectField component", () => {
  it("renders trigger and passes axe verification", async () => {
    const { container } = render(
      <SelectField aria-label="Event Type" options={OPTIONS} placeholder="Choose event type" />
    );

    const trigger = screen.getByRole("combobox", { name: "Event Type" });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent("Choose event type");

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("handles keyboard interaction and selection", async () => {
    const handleValueChange = vi.fn();
    const user = userEvent.setup();

    render(
      <SelectField
        aria-label="Event Type"
        options={OPTIONS}
        value="wedding"
        onValueChange={handleValueChange}
      />
    );

    const trigger = screen.getByRole("combobox", { name: "Event Type" });
    expect(trigger).toHaveTextContent("Wedding");

    await user.click(trigger);
    const birthdayOption = await screen.findByRole("option", { name: "Birthday Party" });
    await user.click(birthdayOption);

    expect(handleValueChange).toHaveBeenCalledWith("birthday");
  });
});
