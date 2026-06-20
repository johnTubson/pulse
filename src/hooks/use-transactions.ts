import { useQuery } from "@tanstack/react-query";

import { getTransaction, getTransactions } from "@/lib/api";
import type { TransactionFilters } from "@/lib/transaction-filters";
import { useFilterStore } from "@/stores/filter-store";

export function useTransactions(overrides?: Partial<TransactionFilters>) {
  const filters = useFilterStore((s) => s.filters);
  const merged = { ...filters, ...overrides };

  return useQuery({
    queryKey: ["transactions", merged],
    queryFn: () => getTransactions(merged),
  });
}

export function useTransaction(id: string | null) {
  return useQuery({
    queryKey: ["transaction", id],
    queryFn: () => getTransaction(id!),
    enabled: Boolean(id),
  });
}
