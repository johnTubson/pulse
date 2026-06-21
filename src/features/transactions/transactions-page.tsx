import { useMemo } from "react";
import type { SortingState } from "@tanstack/react-table";

import { Card } from "@/components/ui/card";
import { FilterBar } from "@/features/transactions/filter-bar";
import { TransactionDetailPanel } from "@/features/transactions/transaction-detail-panel";
import { TransactionsTable } from "@/features/transactions/transactions-table";
import { useTransactions } from "@/hooks/use-transactions";
import { useFilterStore } from "@/stores/filter-store";

export function TransactionsPage() {
  const filters = useFilterStore((s) => s.filters);
  const selectedTransactionId = useFilterStore((s) => s.selectedTransactionId);
  const setFilters = useFilterStore((s) => s.setFilters);
  const resetFilters = useFilterStore((s) => s.resetFilters);
  const setSelectedTransactionId = useFilterStore(
    (s) => s.setSelectedTransactionId
  );

  const { data, isPending, isError, isFetching } = useTransactions();

  const sorting: SortingState = useMemo(
    () => [{ id: filters.sortBy, desc: filters.sortOrder === "desc" }],
    [filters.sortBy, filters.sortOrder]
  );

  const handleSortingChange = (next: SortingState) => {
    const first = next[0];
    if (!first) {
      setFilters({ sortBy: "createdAt", sortOrder: "desc" });
      return;
    }
    setFilters({
      sortBy: first.id as typeof filters.sortBy,
      sortOrder: first.desc ? "desc" : "asc",
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Transactions</h1>
        <p className="text-sm text-muted">
          Virtualized table with filters — {data?.total.toLocaleString() ?? "…"}{" "}
          total records
        </p>
      </div>

      <Card className="mb-4">
        <FilterBar
          filters={filters}
          onChange={setFilters}
          onReset={resetFilters}
          total={data?.total ?? 0}
        />
      </Card>

      {isError && !data ? (
        <Card>
          <p className="text-sm text-danger">Failed to load transactions.</p>
        </Card>
      ) : (
        <TransactionsTable
          data={data?.data ?? []}
          sorting={sorting}
          onSortingChange={handleSortingChange}
          onRowClick={(txn) => setSelectedTransactionId(txn.id)}
          isLoading={(isPending && !data) || isFetching}
        />
      )}

      <TransactionDetailPanel
        transactionId={selectedTransactionId}
        onClose={() => setSelectedTransactionId(null)}
      />
    </div>
  );
}
