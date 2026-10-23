import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { TabContent, Tabs, TabsList, TabTrigger } from "./Tabs";

describe("Tabs component", () => {
  it("renders tab interface conforming to WAI-ARIA pattern and passes axe", async () => {
    const { container } = render(
      <Tabs defaultValue="overview">
        <TabsList aria-label="Workspace Sections">
          <TabTrigger value="overview">Overview</TabTrigger>
          <TabTrigger value="budget">Budget</TabTrigger>
          <TabTrigger value="timeline">Timeline</TabTrigger>
        </TabsList>
        <TabContent value="overview">Overview Details</TabContent>
        <TabContent value="budget">Budget Breakdown</TabContent>
        <TabContent value="timeline">Timeline Schedule</TabContent>
      </Tabs>
    );

    const tabList = screen.getByRole("tablist", { name: "Workspace Sections" });
    expect(tabList).toBeInTheDocument();

    const overviewTab = screen.getByRole("tab", { name: "Overview" });
    expect(overviewTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Overview Details")).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("switches tab content on user click", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="overview">
        <TabsList aria-label="Sections">
          <TabTrigger value="overview">Overview</TabTrigger>
          <TabTrigger value="budget">Budget</TabTrigger>
        </TabsList>
        <TabContent value="overview">Overview Panel</TabContent>
        <TabContent value="budget">Budget Panel</TabContent>
      </Tabs>
    );

    const budgetTab = screen.getByRole("tab", { name: "Budget" });
    await user.click(budgetTab);

    expect(budgetTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Budget Panel")).toBeInTheDocument();
    expect(screen.queryByText("Overview Panel")).not.toBeInTheDocument();
  });
});
