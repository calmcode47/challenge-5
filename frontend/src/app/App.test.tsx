import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { App } from "./App.js";

describe("App component smoke tests", () => {
  it("renders the primary h1 heading", () => {
    render(<App />);
    const heading = screen.getByRole("heading", { level: 1, name: "Occasio" });
    expect(heading).toBeInTheDocument();
  });

  it("has zero accessibility violations according to axe", async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
