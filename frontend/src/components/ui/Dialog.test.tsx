import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "./Button";
import { Dialog, DialogContent, DialogTrigger } from "./Dialog";

describe("Dialog component", () => {
  it("opens modal dialog on trigger click and passes axe accessibility test", async () => {
    const user = userEvent.setup();
    const { baseElement } = render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Settings</Button>
        </DialogTrigger>
        <DialogContent
          title="Celebration Settings"
          description="Update your event preferences and budget targets."
        >
          <p>Dialog interior content</p>
        </DialogContent>
      </Dialog>
    );

    const openBtn = screen.getByRole("button", { name: "Open Settings" });
    await user.click(openBtn);

    const dialog = await screen.findByRole("dialog", { name: "Celebration Settings" });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText("Dialog interior content")).toBeInTheDocument();

    const results = await axe(baseElement);
    expect(results).toHaveNoViolations();
  });

  it("closes dialog when close button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent title="Test Modal">
          <p>Interior</p>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: "Close dialog" });
    await user.click(closeBtn);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
