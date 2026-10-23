import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "./Button";
import { ToastProvider, useToast } from "./Toast";

function TriggerToastConsumer(): JSX.Element {
  const { showToast } = useToast();
  return (
    <Button
      onClick={() => {
        showToast({
          title: "Plan Saved",
          description: "Your updates were persisted locally.",
          variant: "success",
        });
      }}
    >
      Show Alert
    </Button>
  );
}

function OrphanConsumer(): JSX.Element {
  useToast();
  return <div>Orphan</div>;
}

describe("Toast component", () => {
  it("renders toast when triggered and passes axe check", async () => {
    const user = userEvent.setup();
    const { baseElement } = render(
      <ToastProvider>
        <TriggerToastConsumer />
      </ToastProvider>
    );

    const btn = screen.getByRole("button", { name: "Show Alert" });
    await user.click(btn);

    const title = await screen.findByText("Plan Saved");
    expect(title).toBeInTheDocument();
    expect(screen.getByText("Your updates were persisted locally.")).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: "Close notification" });
    await user.click(closeBtn);

    const results = await axe(baseElement);
    expect(results).toHaveNoViolations();
  });

  it("throws descriptive error when useToast is used outside ToastProvider", () => {
    expect(() => render(<OrphanConsumer />)).toThrow(
      "useToast must be used within a ToastProvider"
    );
  });
});
