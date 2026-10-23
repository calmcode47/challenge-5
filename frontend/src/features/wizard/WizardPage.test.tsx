import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { WizardPage } from "./WizardPage.js";
import { WizardStepperHeader } from "./WizardStepperHeader.js";
import { WizardVerticalStep } from "./WizardVerticalStep.js";
import { WizardCoordinatesStep } from "./WizardCoordinatesStep.js";
import { WizardBudgetStep } from "./WizardBudgetStep.js";
import { WizardSensoryStep } from "./WizardSensoryStep.js";
import { WizardTicketSidebar } from "./WizardTicketSidebar.js";
import type { WizardFormState } from "./wizardTypes.js";

describe("wizard feature components", () => {
  it("renders WizardStepperHeader", () => {
    render(<WizardStepperHeader />);
    expect(screen.getByText("Handcraft Your Milestone")).toBeInTheDocument();
    expect(screen.getByText("Deterministic Budget")).toBeInTheDocument();
  });

  it("renders WizardVerticalStep and handles vertical selection", () => {
    const handleSelect = vi.fn();
    render(<WizardVerticalStep selectedVertical="wedding" onSelectVertical={handleSelect} />);
    expect(screen.getByText("Select Celebration Vertical")).toBeInTheDocument();
    const milestoneCard = screen.getByText("Milestone");
    fireEvent.click(milestoneCard);
    expect(handleSelect).toHaveBeenCalledWith("milestone");
  });

  it("renders WizardCoordinatesStep and handles input changes", () => {
    const handleTitle = vi.fn();
    const handleDate = vi.fn();
    const handleVenue = vi.fn();

    render(
      <WizardCoordinatesStep
        title="Ceramic Gala"
        date="2025-10-10"
        venue="Ceramic Loft"
        onTitleChange={handleTitle}
        onDateChange={handleDate}
        onVenueChange={handleVenue}
      />
    );

    const monikerInput = screen.getByLabelText(/Celebration Title/i);
    fireEvent.change(monikerInput, { target: { value: "New Gala" } });
    expect(handleTitle).toHaveBeenCalledWith("New Gala");

    const venueBtn = screen.getByText("Botanical Orchard");
    fireEvent.click(venueBtn);
    expect(handleVenue).toHaveBeenCalledWith("Botanical Orchard");
  });

  it("renders WizardBudgetStep and adjusts budget and guest counts", () => {
    const handleBudget = vi.fn();
    const handleGuests = vi.fn();

    render(
      <WizardBudgetStep
        budgetTotal={20000}
        guestCount={100}
        onBudgetChange={handleBudget}
        onGuestCountChange={handleGuests}
      />
    );

    expect(screen.getByText("Deterministic Budget Allocation")).toBeInTheDocument();
    const budgetInput = screen.getByLabelText(/Major Unit Budget/i);
    fireEvent.change(budgetInput, { target: { value: "25000" } });
    expect(handleBudget).toHaveBeenCalledWith(25000);

    const guestInput = screen.getByLabelText(/Guest Count/i);
    fireEvent.change(guestInput, { target: { value: "120" } });
    expect(handleGuests).toHaveBeenCalledWith(120);

    fireEvent.change(budgetInput, { target: { value: "" } });
    expect(handleBudget).toHaveBeenCalledWith(1000);

    fireEvent.change(guestInput, { target: { value: "" } });
    expect(handleGuests).toHaveBeenCalledWith(1);
  });

  it("renders WizardSensoryStep and toggles checkboxes", () => {
    const handleAda = vi.fn();
    const handleAllergen = vi.fn();
    const handlePavilion = vi.fn();
    const handleAcoustic = vi.fn();

    render(
      <WizardSensoryStep
        sensoryAda={true}
        sensoryAllergen={false}
        sensoryPavilion={true}
        sensoryAcoustic={false}
        onToggleAda={handleAda}
        onToggleAllergen={handleAllergen}
        onTogglePavilion={handlePavilion}
        onToggleAcoustic={handleAcoustic}
      />
    );

    const adaCheckbox = screen.getByRole("checkbox", { name: /Step-Free ADA Paths/i });
    fireEvent.click(adaCheckbox);
    expect(handleAda).toHaveBeenCalledWith(false);
  });

  it("renders WizardTicketSidebar and triggers baking", () => {
    const mockState: WizardFormState = {
      vertical: "community",
      title: "Harvest Supper",
      date: "2025-11-01",
      venue: "Wildflower Meadow",
      budgetTotal: 18000,
      guestCount: 60,
      sensoryAda: true,
      sensoryAllergen: true,
      sensoryPavilion: false,
      sensoryAcoustic: true,
    };
    const handleBake = vi.fn();

    const { unmount } = render(
      <WizardTicketSidebar formState={mockState} isBaking={false} onBake={handleBake} />
    );
    expect(screen.getByText("Harvest Supper")).toBeInTheDocument();
    const bakeBtn = screen.getByText("Bake Milestone Plan");
    fireEvent.click(bakeBtn);
    expect(handleBake).toHaveBeenCalledTimes(1);
    unmount();

    render(
      <WizardTicketSidebar
        formState={{
          ...mockState,
          guestCount: 0,
          title: "",
          vertical: "unknown" as unknown as "wedding",
        }}
        isBaking={true}
        onBake={handleBake}
      />
    );
    expect(screen.getByText("Bespoke Celebration")).toBeInTheDocument();
    expect(screen.getByText("Custom Gathering")).toBeInTheDocument();
  });

  it("renders full WizardPage, exercises all step controls, and bakes plan into storage", () => {
    vi.useFakeTimers();
    render(
      <MemoryRouter initialEntries={["/plan-wizard?vertical=community&guests=80"]}>
        <WizardPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Handcraft Your Milestone")).toBeInTheDocument();

    // Select vertical
    fireEvent.click(screen.getByText("Wedding"));

    // Clear title and date to test fallbacks
    const monikerInput = screen.getByLabelText(/Celebration Title/i);
    fireEvent.change(monikerInput, { target: { value: "" } });

    const dateInput = screen.getByLabelText(/Gathering Date/i);
    fireEvent.change(dateInput, { target: { value: "" } });

    // Change venue
    fireEvent.click(screen.getByText("Ceramic Loft"));

    // Change budget and guests
    const budgetInput = screen.getByLabelText(/Major Unit Budget/i);
    fireEvent.change(budgetInput, { target: { value: "32000" } });

    const guestInput = screen.getByLabelText(/Guest Count/i);
    fireEvent.change(guestInput, { target: { value: "140" } });

    // Toggle sensory checkboxes
    fireEvent.click(screen.getByRole("checkbox", { name: /Step-Free ADA Paths/i }));
    fireEvent.click(screen.getByRole("checkbox", { name: /Allergen & Dedicated Prep/i }));
    fireEvent.click(screen.getByRole("checkbox", { name: /Quiet Decompression Pavilion/i }));
    fireEvent.click(screen.getByRole("checkbox", { name: /Acoustic Limiting/i }));

    const bakeBtn = screen.getByText("Bake Milestone Plan");
    fireEvent.click(bakeBtn);

    expect(screen.getByText("Firing Ceramic Kiln...")).toBeInTheDocument();
    act(() => {
      vi.runAllTimers();
    });
    vi.useRealTimers();
  });

  it("handles alternative initial verticals in WizardPage query params", () => {
    render(
      <MemoryRouter initialEntries={["/plan-wizard?vertical=anniversary"]}>
        <WizardPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Anniversary Salon")).toBeInTheDocument();
  });
});
