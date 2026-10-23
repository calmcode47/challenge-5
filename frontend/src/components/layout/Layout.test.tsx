import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { AppShell } from "./AppShell";
import { EffectsToggle } from "./EffectsToggle";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ShortcutsDialog } from "./ShortcutsDialog";
import { SkipLink } from "./SkipLink";

describe("Layout components", () => {
  it("renders SkipLink targeting #main and passes axe check", async () => {
    const { container } = render(<SkipLink />);
    const link = screen.getByRole("link", { name: "Skip to main content" });
    expect(link).toHaveAttribute("href", "#main");
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders Header with main navigation and passes axe check", async () => {
    const { container } = render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByRole("navigation", { name: "Main Navigation" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /occasio/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "New Plan" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Plans" })).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders Footer with privacy and data links passing axe check", async () => {
    const { container } = render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: "Privacy Policy" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "My Data & Export" })).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("opens ShortcutsDialog and lists key navigation commands passing axe check", async () => {
    const user = userEvent.setup();
    const { baseElement } = render(<ShortcutsDialog />);

    const helpBtn = screen.getByRole("button", { name: "Keyboard help" });
    await user.click(helpBtn);

    const dialog = await screen.findByRole("dialog", {
      name: "Keyboard Navigation & Shortcuts",
    });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText(/Double-Esc/i)).toBeInTheDocument();

    const results = await axe(baseElement);
    expect(results).toHaveNoViolations();
  });

  it("opens EffectsToggle dialog and allows changing effects mode", async () => {
    const user = userEvent.setup();
    const { baseElement } = render(<EffectsToggle />);

    const toggleBtn = screen.getByRole("button", { name: /visual effects setting/i });
    await user.click(toggleBtn);

    const dialog = await screen.findByRole("dialog", {
      name: "Visual Effects & Motion Settings",
    });
    expect(dialog).toBeInTheDocument();

    const reducedRadio = screen.getByRole("radio", { name: /reduced motion/i });
    await user.click(reducedRadio);
    expect(reducedRadio).toBeChecked();

    const results = await axe(baseElement);
    expect(results).toHaveNoViolations();
  });

  it("renders AppShell with landmarks conforming to WCAG 2.4.1 and handles double-escape", async () => {
    const { container } = render(
      <MemoryRouter>
        <AppShell />
      </MemoryRouter>
    );

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveAttribute("id", "main");
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
