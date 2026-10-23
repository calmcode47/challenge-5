import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Column definition configuration for the DataTable component.
 */
export interface ColumnDef<T> {
  readonly key: string;
  readonly header: string;
  readonly isRowHeader?: boolean;
  readonly render?: (row: T) => ReactNode;
  readonly sortable?: boolean;
}

/**
 * Props for the DataTable component.
 */
export interface DataTableProps<T> {
  /** Descriptive caption for table accessibility (M07-A15) */
  readonly caption: string;
  /** Visually hides the caption while keeping it active for screen readers */
  readonly captionHidden?: boolean;
  /** List of column specifications */
  readonly columns: readonly ColumnDef<T>[];
  /** Array of data row items */
  readonly data: readonly T[];
  /** Pure function generating unique row keys */
  readonly keyExtractor: (row: T, index: number) => string;
  /** Key of currently sorted column */
  readonly sortColumn?: string;
  /** Current active sort direction */
  readonly sortDirection?: "asc" | "desc";
  /** Callback fired when a sortable column header button is pressed */
  readonly onSort?: (columnKey: string) => void;
  /** Optional extra classes */
  readonly className?: string;
}

interface TableHeadProps<T> {
  readonly columns: readonly ColumnDef<T>[];
  readonly sortColumn?: string;
  readonly sortDirection?: "asc" | "desc";
  readonly onSort?: (columnKey: string) => void;
}

function TableHead<T>({
  columns,
  sortColumn,
  sortDirection,
  onSort,
}: TableHeadProps<T>): JSX.Element {
  return (
    <thead className="bg-[var(--color-raised)] text-xs uppercase tracking-wider text-[var(--color-muted)] border-b border-[var(--color-line)]">
      <tr>
        {columns.map((col) => (
          <th key={col.key} scope="col" className="px-4 py-3 font-semibold">
            {col.sortable && onSort ? (
              <button
                type="button"
                onClick={() => {
                  onSort(col.key);
                }}
                className="inline-flex items-center gap-1.5 hover:text-[var(--color-text)] cursor-pointer select-none focus:outline-none focus:underline"
              >
                <span>{col.header}</span>
                {sortColumn === col.key ? (
                  sortDirection === "asc" ? (
                    <ArrowUp className="h-3.5 w-3.5 text-[var(--color-accent)]" />
                  ) : (
                    <ArrowDown className="h-3.5 w-3.5 text-[var(--color-accent)]" />
                  )
                ) : (
                  <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                )}
              </button>
            ) : (
              <span>{col.header}</span>
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function TableCell<T>({ col, row }: { readonly col: ColumnDef<T>; readonly row: T }): JSX.Element {
  const content = col.render
    ? col.render(row)
    : ((row as Record<string, unknown>)[col.key] as ReactNode);
  if (col.isRowHeader) {
    return (
      <th scope="row" className="px-4 py-3 font-medium text-[var(--color-text)] whitespace-nowrap">
        {content}
      </th>
    );
  }
  return <td className="px-4 py-3 text-[var(--color-muted)] whitespace-nowrap">{content}</td>;
}

/**
 * Accessible data table supporting caption, column/row scopes, horizontal reflow regions,
 * and keyboard-accessible column sorting buttons.
 *
 * @param props - DataTableProps<T>
 * @returns JSX.Element
 */
export function DataTable<T>({
  caption,
  captionHidden = false,
  columns,
  data,
  keyExtractor,
  sortColumn,
  sortDirection,
  onSort,
  className = "",
}: DataTableProps<T>): JSX.Element {
  return (
    <div
      role="region"
      aria-label={caption}
      className={`w-full overflow-x-auto rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-surface)] ${className}`}
    >
      <table className="w-full text-left text-sm text-[var(--color-text)] border-collapse">
        <caption
          className={`p-3 text-left font-semibold text-base text-[var(--color-text)] ${captionHidden ? "sr-only" : ""}`}
        >
          {caption}
        </caption>
        <TableHead
          columns={columns}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={onSort}
        />
        <tbody className="divide-y divide-[var(--color-line)]">
          {data.map((row, idx) => (
            <tr
              key={keyExtractor(row, idx)}
              className="hover:bg-[var(--color-raised)]/50 transition-colors"
            >
              {columns.map((col) => (
                <TableCell key={col.key} col={col} row={row} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
