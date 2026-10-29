import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { axe } from "vitest-axe";
import { MaterialIcon } from "./MaterialIcon.js";
import { DaisySvg } from "./DaisySvg.js";
import { WavyDivider } from "./WavyDivider.js";
import { ScallopMask } from "./ScallopMask.js";
import { SearchDialog } from "./SearchDialog.js";
import { useUiStore } from "../../state/uiStore.js";

describe("common components", () => {
  it("renders MaterialIcon with given properties", () => {
    const { container } = render(
      <MaterialIcon name="favorite" size={28} filled className="text-red-500" />
    );
    const icon = container.querySelector(".material-symbols-outlined");
    expect(icon).toBeInTheDocument();
    expect(icon?.textContent).toBe("favorite");
    expect(icon).toHaveClass("text-red-500");
  });

  it("renders DaisySvg with custom colors and size", () => {
    const { container } = render(<DaisySvg size={40} petalColor="#FFFFFF" centerColor="#FFAA00" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "40");
    expect(svg).toHaveAttribute("height", "40");
  });

  it("renders WavyDivider", () => {
    const { container } = render(<WavyDivider className="custom-wavy" />);
    expect(container.firstChild).toHaveClass("custom-wavy");
  });

  it("renders ScallopMask", () => {
    const { container } = render(<ScallopMask />);
    const mask = container.querySelector("div");
    expect(mask).toBeInTheDocument();
  });

  it("renders an accessible SearchDialog, focuses it, filters plans, and closes with Escape", async () => {
    useUiStore.setState({ isSearchOpen: true });
    const { container } = render(
      <MemoryRouter>
        <SearchDialog />
      </MemoryRouter>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    const searchInput = screen.getByPlaceholderText(/search celebrations/i);
    expect(searchInput).toHaveFocus();
    fireEvent.change(searchInput, { target: { value: "Elena" } });
    expect(screen.getByText(/Elena & Marcus/i)).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "NonExistentTermXYZ" } });
    expect(screen.getByText(/No matching celebrations found/i)).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(useUiStore.getState().isSearchOpen).toBe(false);
    expect(
      (await axe(container, { rules: { "color-contrast": { enabled: false } } })).violations
    ).toHaveLength(0);
  });
});
