import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Field } from "./Field";
import { Input } from "./Input";
import { NumberField } from "./NumberField";
import { Textarea } from "./Textarea";

describe("Field & Form Input components", () => {
  it("renders Field with label, hint, and links via aria-describedby", async () => {
    const { container } = render(
      <Field
        id="wedding-title"
        label="Event Title"
        hint="Give your celebration a memorable name"
        required
      >
        {(inputProps) => <Input {...inputProps} placeholder="Summer Gala" />}
      </Field>
    );

    const input = screen.getByRole("textbox", { name: /event title/i });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("id", "wedding-title");

    const hint = screen.getByText("Give your celebration a memorable name");
    expect(input).toHaveAttribute("aria-describedby", "wedding-title-hint");
    expect(hint).toHaveAttribute("id", "wedding-title-hint");

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders validation error with role=alert and sets aria-invalid", async () => {
    const { container } = render(
      <Field id="budget-input" label="Total Budget" error="Budget must be greater than zero">
        {(inputProps) => <NumberField {...inputProps} currencyPrefix="$" />}
      </Field>
    );

    const input = screen.getByRole("spinbutton", { name: /total budget/i });
    expect(input).toHaveAttribute("aria-invalid", "true");

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Budget must be greater than zero");
    expect(input).toHaveAttribute("aria-describedby", "budget-input-error");

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("handles Textarea inside Field with user typing", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Field id="dietary-notes" label="Dietary Requirements">
        {(inputProps) => <Textarea {...inputProps} />}
      </Field>
    );

    const textarea = screen.getByRole("textbox", { name: /dietary requirements/i });
    await user.type(textarea, "Gluten-free for 12 guests");
    expect(textarea).toHaveValue("Gluten-free for 12 guests");

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
