import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { routes } from "./router";

describe("Application routing & axe accessibility on all routes", () => {
  it("renders Landing route '/' with axe 0 violations", async () => {
    const memoryRouter = createMemoryRouter(routes, { initialEntries: ["/"] });
    const { container } = render(<RouterProvider router={memoryRouter} />);

    const heading = await screen.findByRole("heading", { level: 1, name: /plan the day/i });
    expect(heading).toBeInTheDocument();
    expect(document.title).toContain("Plan the Day");

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders Wizard route '/plan/new' with axe 0 violations", async () => {
    const memoryRouter = createMemoryRouter(routes, { initialEntries: ["/plan/new"] });
    const { container } = render(<RouterProvider router={memoryRouter} />);

    const heading = await screen.findByRole("heading", { level: 1, name: /create new/i });
    expect(heading).toBeInTheDocument();
    expect(document.title).toContain("Create New Plan");

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders Plans library route '/plans' with axe 0 violations", async () => {
    const memoryRouter = createMemoryRouter(routes, { initialEntries: ["/plans"] });
    const { container } = render(<RouterProvider router={memoryRouter} />);

    const heading = await screen.findByRole("heading", { level: 1, name: /my saved plans/i });
    expect(heading).toBeInTheDocument();
    expect(document.title).toContain("My Saved Plans");

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders Workspace route '/plan/:planId' with axe 0 violations", async () => {
    const memoryRouter = createMemoryRouter(routes, { initialEntries: ["/plan/wedding-42"] });
    const { container } = render(<RouterProvider router={memoryRouter} />);

    const heading = await screen.findByRole("heading", { level: 1, name: /plan workspace/i });
    expect(heading).toBeInTheDocument();
    expect(document.title).toContain("wedding-42");

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders Privacy route '/privacy' with axe 0 violations", async () => {
    const memoryRouter = createMemoryRouter(routes, { initialEntries: ["/privacy"] });
    const { container } = render(<RouterProvider router={memoryRouter} />);

    const heading = await screen.findByRole("heading", { level: 1, name: /privacy & security/i });
    expect(heading).toBeInTheDocument();
    expect(document.title).toContain("Privacy & Security");

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders My Data route '/my-data' with axe 0 violations", async () => {
    const memoryRouter = createMemoryRouter(routes, { initialEntries: ["/my-data"] });
    const { container } = render(<RouterProvider router={memoryRouter} />);

    const heading = await screen.findByRole("heading", { level: 1, name: /my data/i });
    expect(heading).toBeInTheDocument();
    expect(document.title).toContain("My Data");

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders 404 Not Found route '*' with axe 0 violations", async () => {
    const memoryRouter = createMemoryRouter(routes, { initialEntries: ["/nonexistent-route-xyz"] });
    const { container } = render(<RouterProvider router={memoryRouter} />);

    const heading = await screen.findByRole("heading", { level: 1, name: /page not found/i });
    expect(heading).toBeInTheDocument();
    expect(document.title).toContain("Page Not Found");

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
