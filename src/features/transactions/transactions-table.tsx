import { useMemo, useRef } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { StatusBadge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { formatCurrency, formatDateShort } from "@/lib/format";
import type { Transaction } from "@/types";

const ROW_HEIGHT = 48;
const OVERSCAN = 10;

const columnHelper = createColumnHelper<Transaction>();

const columns = [
  columnHelper.accessor("id", {
    header: "ID",
    size: 140,
    cell: (info) => (
      <span className="font-mono text-xs">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("reference", {
    header: "Reference",
    size: 160,
    cell: (info) => (
      <span className="font-mono text-xs">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    size: 120,
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
  columnHelper.accessor("amount", {
    header: "Amount",
    size: 140,
    cell: (info) => (
      <span className="font-medium tabular-nums">
        {formatCurrency(info.getValue(), info.row.original.currency)}
      </span>
    ),
  }),
  columnHelper.accessor("currency", {
    header: "Currency",
    size: 90,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("customerEmail", {
    header: "Customer",
    size: 220,
    cell: (info) => (
      <span className="truncate text-muted">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("createdAt", {
    header: "Created",
    size: 150,
    cell: (info) => (
      <span className="text-muted">{formatDateShort(info.getValue())}</span>
    ),
  }),
  columnHelper.accessor("settledAt", {
    header: "Settled",
    size: 150,
    cell: (info) => {
      const val = info.getValue();
      return val ? (
        <span className="text-muted">{formatDateShort(val)}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  }),
];

interface TransactionsTableProps {
  data: Transaction[];
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  onRowClick: (transaction: Transaction) => void;
  isLoading?: boolean;
}

function SortIcon({ direction }: { direction: false | "asc" | "desc" }) {
  if (direction === "asc") return <ArrowUp className="h-3.5 w-3.5" />;
  if (direction === "desc") return <ArrowDown className="h-3.5 w-3.5" />;
  return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />;
}

export function TransactionsTable({
  data,
  sorting,
  onSortingChange,
  onRowClick,
  isLoading,
}: TransactionsTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnPinning: { left: ["id", "status", "amount"] } },
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      onSortingChange(next);
    },
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    enableColumnPinning: true,
    columnResizeMode: "onChange",
  });

  const { rows } = table.getRowModel();

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: OVERSCAN,
  });

  const virtualRows = virtualizer.getVirtualItems();
  const totalHeight = virtualizer.getTotalSize();

  const pinnedColumns = useMemo(() => new Set(["id", "status", "amount"]), []);

  const getPinStyle = (columnId: string, index: number) => {
    if (!pinnedColumns.has(columnId)) return {};

    let left = 0;
    for (let i = 0; i < index; i++) {
      const col = table.getAllColumns()[i];
      if (col && pinnedColumns.has(col.id)) {
        left += col.getSize();
      }
    }

    return {
      left,
      position: "sticky" as const,
      zIndex: 2,
    };
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div
        ref={parentRef}
        className="relative overflow-auto scrollbar-thin"
        style={{ maxHeight: "calc(100svh - 18rem)" }}
      >
        <table
          className="w-full text-sm"
          style={{ minWidth: table.getTotalSize() }}
        >
          <thead className="sticky top-0 z-10 bg-surface-raised">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-border">
                {headerGroup.headers.map((header, index) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  const pinStyle = getPinStyle(header.column.id, index);

                  return (
                    <th
                      key={header.id}
                      className={cn(
                        "h-12 bg-surface-raised px-4 text-left align-middle text-xs font-medium uppercase tracking-wider text-muted-foreground",
                        pinnedColumns.has(header.column.id) &&
                          "border-r border-border-subtle"
                      )}
                      style={{
                        width: header.getSize(),
                        minWidth: header.getSize(),
                        ...pinStyle,
                      }}
                    >
                      {canSort ? (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 hover:text-foreground"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          <SortIcon direction={sorted} />
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {virtualRows.length > 0 && (
              <tr style={{ height: virtualRows[0]?.start ?? 0 }}>
                <td colSpan={columns.length} />
              </tr>
            )}
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index]!;
              return (
                <tr
                  key={row.id}
                  className="cursor-pointer border-b border-border-subtle transition-colors hover:bg-surface-raised/50"
                  style={{ height: ROW_HEIGHT }}
                  onClick={() => onRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell, index) => {
                    const pinStyle = getPinStyle(cell.column.id, index);
                    return (
                      <td
                        key={cell.id}
                        className={cn(
                          "px-4 align-middle text-foreground",
                          pinnedColumns.has(cell.column.id) &&
                            "bg-surface border-r border-border-subtle"
                        )}
                        style={{
                          width: cell.column.getSize(),
                          minWidth: cell.column.getSize(),
                          ...pinStyle,
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {virtualRows.length > 0 && (
              <tr
                style={{
                  height: totalHeight - (virtualRows.at(-1)?.end ?? 0),
                }}
              >
                <td colSpan={columns.length} />
              </tr>
            )}
          </tbody>
        </table>

        {rows.length === 0 && (
          <div className="flex items-center justify-center py-16 text-sm text-muted">
            No transactions match your filters.
          </div>
        )}
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="space-y-0 overflow-hidden">
        <div className="h-12 animate-pulse bg-surface-raised" />
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-12 animate-pulse border-t border-border-subtle bg-surface"
            style={{ animationDelay: `${i * 50}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
