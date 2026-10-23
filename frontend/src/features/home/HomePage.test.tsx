import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { HomePage } from "./HomePage.js";
import { HomeHero } from "./HomeHero.js";
import { HomeTemplatesSection } from "./HomeTemplatesSection.js";
import { HomePiecesOfWeekSection } from "./HomePiecesOfWeekSection.js";
import { HomeStudioPicksSection } from "./HomeStudioPicksSection.js";
import { HomeBriefFormSection } from "./HomeBriefFormSection.js";
import { useUiStore } from "../../state/uiStore.js";

describe("home feature components", () => {
  it("renders HomeHero with call to action links", () => {
    render(
      <MemoryRouter>
        <HomeHero />
      </MemoryRouter>
    );

    expect(screen.getByText(/The Joy of/i)).toBeInTheDocument();
    expect(screen.getByText("Shape Your Celebration")).toBeInTheDocument();
  });

  it("renders HomeTemplatesSection with cards", () => {
    render(
      <MemoryRouter>
        <HomeTemplatesSection />
      </MemoryRouter>
    );

    expect(screen.getByText("Made Slowly, Shaped by Hand")).toBeInTheDocument();
    expect(screen.getByText("Petal Wedding")).toBeInTheDocument();
    expect(screen.getByText("Sunny Jubilee")).toBeInTheDocument();
  });

  it("renders HomePiecesOfWeekSection and handles reserve", () => {
    render(<HomePiecesOfWeekSection />);
    expect(screen.getByText("Pieces of the Week")).toBeInTheDocument();

    const reserveBtn = screen.getByText("Reserve into Plan");
    fireEvent.click(reserveBtn);
    expect(useUiStore.getState().notification?.message).toContain("Flora Candlestick set added");
  });

  it("renders HomeStudioPicksSection and toggles tabs", () => {
    render(
      <MemoryRouter>
        <HomeStudioPicksSection />
      </MemoryRouter>
    );

    expect(screen.getByText("Thoughtful Pieces for a Playful Event")).toBeInTheDocument();
    const budgetTab = screen.getByText("Slip Ledger");
    fireEvent.click(budgetTab);
    expect(budgetTab).toHaveClass("bg-cream-linen");
  });

  it("renders HomeBriefFormSection and submits brief", () => {
    vi.useFakeTimers();
    render(
      <MemoryRouter>
        <HomeBriefFormSection />
      </MemoryRouter>
    );

    expect(screen.getByText("Color Makes Every Gathering Feel New")).toBeInTheDocument();
    const occasionSelect = screen.getByLabelText(/occasion/i);
    fireEvent.change(occasionSelect, { target: { value: "community" } });

    const guestInput = screen.getByLabelText(/guest count/i);
    fireEvent.change(guestInput, { target: { value: "" } });
    fireEvent.change(guestInput, { target: { value: "65" } });

    const notesInput = screen.getByLabelText(/tactile wishes/i);
    fireEvent.change(notesInput, { target: { value: "Glazed terracotta bowls" } });

    const glazeBtn = screen.getByText("Sun Honey");
    fireEvent.click(glazeBtn);

    const submitBtn = screen.getByText("Generate Clay Blueprint");
    fireEvent.click(submitBtn);

    expect(screen.getByText("Firing Blueprint...")).toBeInTheDocument();
    act(() => {
      vi.runAllTimers();
    });
    vi.useRealTimers();
  });

  it("renders entire HomePage layout", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText("Tangible Event Alchemy")).toBeInTheDocument();
  });
});
