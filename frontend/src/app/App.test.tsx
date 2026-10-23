import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { App } from "./App";

describe("App component smoke tests", () => {
  it("renders the primary landing heading and shell landmarks", async () => {
    const { container } = render(<App />);
    const heading = await screen.findByRole("heading", {
      level: 1,
      name: /plan the day/i,
    });
    expect(heading).toBeInTheDocument();

    const banner = screen.getByRole("banner");
    expect(banner).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
