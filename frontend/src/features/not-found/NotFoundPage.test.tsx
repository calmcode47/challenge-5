import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { NotFoundPage } from "./NotFoundPage.js";

describe("NotFoundPage", () => {
  it("renders 404 message and home link", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Uncharted Studio Room \(404\)/i)).toBeInTheDocument();
    expect(screen.getByText("Return to Studio Home")).toBeInTheDocument();
  });
});
