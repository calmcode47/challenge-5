import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { buildBaselinePlan } from "@occasio/shared";
import { routes } from "../../../app/router";
import { useUiStore } from "../../../state/uiStore";
import { SAMPLE_ENGINE_INPUT, SAMPLE_ENGINE_NOW } from "../sections/SmartEngineSection";

function createMockMediaQueryList(
  target: EventTarget,
  query: string,
  matches: boolean
): MediaQueryList {
  Object.assign(target, {
    matches,
    media: query,
    onchange: null,
  });
  return target as MediaQueryList;
}

describe("Landing Page Scroll-Driven Storytelling", () => {
  beforeEach(() => {
    act(() => {
      useUiStore.getState().setEffectsMode("auto");
    });
  });

  afterEach(() => {
    act(() => {
      useUiStore.getState().setEffectsMode("auto");
    });
  });

  it("renders all six section headings in hierarchical order", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/"] });
    render(<RouterProvider router={router} />);

    const h1 = await screen.findByRole("heading", {
      level: 1,
      name: /plan the day, not the spreadsheet/i,
    });
    expect(h1).toBeInTheDocument();

    const h2s = screen.getAllByRole("heading", { level: 2 });
    expect(h2s).toHaveLength(5);
    expect(h2s[0]).toHaveTextContent(/tailored to your celebration/i);
    expect(h2s[1]).toHaveTextContent(/how occasio works/i);
    expect(h2s[2]).toHaveTextContent(/smart by design/i);
    expect(h2s[3]).toHaveTextContent(/privacy & control/i);
    expect(h2s[4]).toHaveTextContent(/ready to plan your celebration/i);
  });

  it("provides correct CTA links across hero, event cards, privacy, and final CTA", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/"] });
    render(<RouterProvider router={router} />);

    await screen.findByRole("heading", { level: 1 });

    const ctaPrimaryLinks = screen.getAllByRole("link", { name: /create my plan/i });
    expect(ctaPrimaryLinks.length).toBeGreaterThanOrEqual(2);
    expect(ctaPrimaryLinks[0]).toHaveAttribute("href", "/plan/new");

    const weddingCard = screen.getByRole("link", { name: /weddings/i });
    expect(weddingCard).toHaveAttribute("href", "/plan/new?type=wedding");

    const birthdayCard = screen.getByRole("link", { name: /birthdays/i });
    expect(birthdayCard).toHaveAttribute("href", "/plan/new?type=birthday");

    const communityCard = screen.getByRole("link", { name: /community events/i });
    expect(communityCard).toHaveAttribute("href", "/plan/new?type=community");

    const privacyLink = screen.getByRole("link", { name: /read our full privacy/i });
    expect(privacyLink).toHaveAttribute("href", "/privacy");
  });

  it("handles 'See how it works' anchor click by focusing the target heading", async () => {
    const user = userEvent.setup();
    const router = createMemoryRouter(routes, { initialEntries: ["/"] });
    render(<RouterProvider router={router} />);

    const anchorLink = await screen.findByRole("link", { name: /scroll to how occasio works/i });
    const targetHeading = screen.getByRole("heading", { level: 2, name: /how occasio works/i });

    expect(targetHeading).toHaveAttribute("id", "how-it-works-heading");
    expect(targetHeading).toHaveAttribute("tabindex", "-1");

    await user.click(anchorLink);
    expect(document.activeElement).toBe(targetHeading);
  });

  it("renders live sample engine output strictly matching a direct buildBaselinePlan call", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/"] });
    render(<RouterProvider router={router} />);

    await screen.findByRole("heading", { level: 1 });

    const directPlan = buildBaselinePlan(SAMPLE_ENGINE_INPUT, SAMPLE_ENGINE_NOW);
    const liveCard = screen.getByTestId("live-engine-card");
    expect(liveCard).toBeInTheDocument();

    expect(liveCard).toHaveTextContent("$40,000.00");
    expect(liveCard).toHaveTextContent(/100% accounted for/i);

    const firstMilestone = directPlan.timeline.milestones[0];
    if (firstMilestone) {
      expect(liveCard).toHaveTextContent(firstMilestone.title);
      expect(liveCard).toHaveTextContent(`${String(firstMilestone.leadDays)} days prior`);
    }
  });

  it("ensures no canvas elements are nested inside landing page content", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/"] });
    const { container } = render(<RouterProvider router={router} />);

    await screen.findByRole("heading", { level: 1 });

    const mainElement = container.querySelector("main");
    expect(mainElement).toBeInTheDocument();
    const nestedCanvases = mainElement?.querySelectorAll("canvas") ?? [];
    expect(nestedCanvases).toHaveLength(0);
  });

  it("renders static vertical list variant when reduced motion or reduced effects is active", async () => {
    act(() => {
      useUiStore.getState().setEffectsMode("reduced");
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/"] });
    render(<RouterProvider router={router} />);

    await screen.findByRole("heading", { level: 1 });

    const reducedContainer = screen.getByTestId("how-it-works-reduced");
    expect(reducedContainer).toBeInTheDocument();
  });

  it("renders static list variant when OS media query prefers reduced motion", async () => {
    const matchMediaSpy = vi.spyOn(window, "matchMedia").mockImplementation((query: string) => {
      const isReduced = query.includes("prefers-reduced-motion");
      return createMockMediaQueryList(new EventTarget(), query, isReduced);
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/"] });
    render(<RouterProvider router={router} />);

    await screen.findByRole("heading", { level: 1 });

    const reducedContainer = screen.getByTestId("how-it-works-reduced");
    expect(reducedContainer).toBeInTheDocument();

    matchMediaSpy.mockRestore();
  });

  it("produces 0 axe accessibility violations on landing page", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/"] });
    const { container } = render(<RouterProvider router={router} />);

    await screen.findByRole("heading", { level: 1 });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
