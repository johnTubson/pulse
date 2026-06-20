import { create } from "zustand";

import {
  DEFAULT_TRANSACTION_FILTERS,
  type TransactionFilters,
} from "@/lib/transaction-filters";

interface FilterState {
  filters: TransactionFilters;
  selectedTransactionId: string | null;
  setFilters: (partial: Partial<TransactionFilters>) => void;
  resetFilters: () => void;
  setSelectedTransactionId: (id: string | null) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  filters: DEFAULT_TRANSACTION_FILTERS,
  selectedTransactionId: null,
  setFilters: (partial) =>
    set((s) => ({
      filters: { ...s.filters, ...partial, page: partial.page ?? 1 },
    })),
  resetFilters: () =>
    set({
      filters: DEFAULT_TRANSACTION_FILTERS,
      selectedTransactionId: null,
    }),
  setSelectedTransactionId: (id) => set({ selectedTransactionId: id }),
}));
