import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { Header } from "./Header.js";
import { Footer } from "./Footer.js";
import { WorkspaceHeader } from "./WorkspaceHeader.js";
import { WorkspaceSidebar } from "./WorkspaceSidebar.js";
import { useUiStore } from "../../state/uiStore.js";

describe("layout components", () => {
  it("renders Header and navigates links", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText("Soft Clay")).toBeInTheDocument();
    expect(screen.getByText("Studio Home")).toBeInTheDocument();
    expect(screen.getByText("Plan Wizard")).toBeInTheDocument();

    const searchBtn = screen.getByLabelText("Search studio");
    fireEvent.click(searchBtn);
    expect(useUiStore.getState().isSearchOpen).toBe(true);
  });

  it("renders Footer with copyright and links", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByText(/2025 Soft Clay Celebrations/i)).toBeInTheDocument();
    expect(screen.getByText("Weddings & Elopements")).toBeInTheDocument();
  });

  it("renders WorkspaceHeader with title and status badge", () => {
    render(
      <MemoryRouter>
        <WorkspaceHeader planTitle="Garden Solstice" />
      </MemoryRouter>
    );

    expect(screen.getByText(/Garden Solstice/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Search project")).toBeInTheDocument();
    expect(screen.getByLabelText("View notifications")).toBeInTheDocument();
  });

  it("renders WorkspaceSidebar and handles module selection", () => {
    const handleSelect = vi.fn();
    render(
      <MemoryRouter>
        <WorkspaceSidebar activeModule="overview" onSelectModule={handleSelect} />
      </MemoryRouter>
    );

    expect(screen.getByText("Overview")).toBeInTheDocument();
    const timelineBtn = screen.getByText("Timeline & Waves");
    fireEvent.click(timelineBtn);
    expect(handleSelect).toHaveBeenCalledWith("timeline");
  });
});
