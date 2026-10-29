import { useRef, type ReactElement } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useDialogAccessibility } from "./useDialogAccessibility.js";

interface DialogHarnessProps {
  readonly includeControls?: boolean;
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

function DialogHarness({
  includeControls = true,
  isOpen,
  onClose,
}: DialogHarnessProps): ReactElement {
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstControlRef = useRef<HTMLButtonElement>(null);
  useDialogAccessibility(isOpen, onClose, dialogRef, firstControlRef);
  if (!isOpen) return <span>Closed</span>;

  return (
    <div ref={dialogRef} role="dialog" tabIndex={-1}>
      {includeControls && <button ref={firstControlRef}>First</button>}
      <button hidden>Hidden</button>
      <button aria-hidden="true">Hidden from assistive tech</button>
      {includeControls && <button>Last</button>}
    </div>
  );
}

function NullRefHarness({ onClose }: { readonly onClose: () => void }): ReactElement {
  const dialogRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLButtonElement>(null);
  useDialogAccessibility(true, onClose, dialogRef, initialFocusRef);
  return <span>Dialog has not mounted</span>;
}

describe("useDialogAccessibility", () => {
  it("does nothing while a dialog is closed", () => {
    render(<DialogHarness isOpen={false} onClose={vi.fn()} />);
    expect(screen.getByText("Closed")).toBeInTheDocument();
  });

  it("focuses the first control, traps Tab, closes on Escape, and restores focus", () => {
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    trigger.focus();
    const onClose = vi.fn();
    const { unmount } = render(<DialogHarness isOpen={true} onClose={onClose} />);

    const first = screen.getByText("First");
    const last = screen.getByText("Last");
    expect(first).toHaveFocus();

    last.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(first).toHaveFocus();

    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(last).toHaveFocus();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
    unmount();
    expect(trigger).toHaveFocus();
    trigger.remove();
  });

  it("keeps focus on a dialog that has no usable controls", () => {
    render(<DialogHarness includeControls={false} isOpen={true} onClose={vi.fn()} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveFocus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(dialog).toHaveFocus();
  });

  it("handles an open state before a dialog element exists", () => {
    render(<NullRefHarness onClose={vi.fn()} />);
    expect(screen.getByText("Dialog has not mounted")).toBeInTheDocument();
  });
});
