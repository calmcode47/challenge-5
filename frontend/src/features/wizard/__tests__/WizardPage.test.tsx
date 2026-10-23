import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { routes } from "../../../app/router";

describe("Wizard Page Query Parameter Validation", () => {
  it("renders without preselected badge when ?type is omitted", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/plan/new"] });
    render(<RouterProvider router={router} />);

    const heading = await screen.findByRole("heading", { level: 1, name: /create new/i });
    expect(heading).toBeInTheDocument();
    expect(screen.queryByText(/preselected:/i)).not.toBeInTheDocument();
  });

  it("validates and displays preselected badge for valid ?type=wedding", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/plan/new?type=wedding"] });
    render(<RouterProvider router={router} />);

    await screen.findByRole("heading", { level: 1 });
    const badge = screen.getByText(/preselected: wedding/i);
    expect(badge).toBeInTheDocument();
  });

  it("validates and displays preselected badge for valid ?type=birthday", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/plan/new?type=birthday"] });
    render(<RouterProvider router={router} />);

    await screen.findByRole("heading", { level: 1 });
    const badge = screen.getByText(/preselected: birthday/i);
    expect(badge).toBeInTheDocument();
  });

  it("validates and displays preselected badge for valid ?type=community", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/plan/new?type=community"] });
    render(<RouterProvider router={router} />);

    await screen.findByRole("heading", { level: 1 });
    const badge = screen.getByText(/preselected: community/i);
    expect(badge).toBeInTheDocument();
  });

  it("safely ignores invalid ?type=invalid_payload without crashing or displaying badge", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/plan/new?type=invalid_payload_injection"],
    });
    render(<RouterProvider router={router} />);

    await screen.findByRole("heading", { level: 1 });
    expect(screen.queryByText(/preselected:/i)).not.toBeInTheDocument();
  });

  it("produces 0 axe violations on wizard route with preselected type", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/plan/new?type=wedding"] });
    const { container } = render(<RouterProvider router={router} />);

    await screen.findByRole("heading", { level: 1 });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
