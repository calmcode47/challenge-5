import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { DataTable, type ColumnDef } from "./DataTable";

interface MockBudgetRow {
  readonly id: string;
  readonly category: string;
  readonly allocated: string;
  readonly status: string;
}

const COLUMNS: readonly ColumnDef<MockBudgetRow>[] = [
  { key: "category", header: "Category", isRowHeader: true, sortable: true },
  { key: "allocated", header: "Allocated", sortable: true },
  { key: "status", header: "Status" },
];

const DATA: readonly MockBudgetRow[] = [
  { id: "1", category: "Catering", allocated: "$7,500", status: "On Track" },
  { id: "2", category: "Venue", allocated: "$4,500", status: "Under" },
];

describe("DataTable component", () => {
  it("renders accessible table with caption, scopes, and region landmark passing axe", async () => {
    const handleSort = vi.fn();
    const { container } = render(
      <DataTable
        caption="Budget Category Breakdown"
        columns={COLUMNS}
        data={DATA}
        keyExtractor={(row) => row.id}
        sortColumn="category"
        sortDirection="asc"
        onSort={handleSort}
      />
    );

    const region = screen.getByRole("region", { name: "Budget Category Breakdown" });
    expect(region).toBeInTheDocument();

    const table = screen.getByRole("table", { name: "Budget Category Breakdown" });
    expect(table).toBeInTheDocument();

    const cateringHeader = screen.getByRole("rowheader", { name: "Catering" });
    expect(cateringHeader).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("handles column header sort button activation", async () => {
    const handleSort = vi.fn();
    const user = userEvent.setup();

    render(
      <DataTable
        caption="Budget"
        columns={COLUMNS}
        data={DATA}
        keyExtractor={(row) => row.id}
        onSort={handleSort}
      />
    );

    const sortBtn = screen.getByRole("button", { name: /category/i });
    await user.click(sortBtn);

    expect(handleSort).toHaveBeenCalledWith("category");
  });
});
