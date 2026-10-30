import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { axe } from "vitest-axe";
import { HomePage } from "../features/home/HomePage.js";
import { WizardPage } from "../features/wizard/WizardPage.js";
import { WorkspacePage } from "../features/workspace/WorkspacePage.js";
import { VaultPage } from "../features/vault/VaultPage.js";
import { NotFoundPage } from "../features/not-found/NotFoundPage.js";

const routes = [
  ["/", <HomePage />],
  ["/plan-wizard", <WizardPage />],
  ["/event-workspace", <WorkspacePage />],
  ["/my-plans-vault", <VaultPage />],
  ["/missing", <NotFoundPage />],
] as const;

describe("route accessibility", () => {
  it.each(routes)("has no structural accessibility violations at %s", async (path, page) => {
    const { container, unmount } = render(
      <MemoryRouter initialEntries={[path]}>{page}</MemoryRouter>
    );

    expect(
      (await axe(container, { rules: { "color-contrast": { enabled: false } } })).violations
    ).toHaveLength(0);
    unmount();
  });
});
