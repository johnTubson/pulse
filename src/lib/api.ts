import {
  filtersToSearchParams,
  type TransactionFilters,
} from "@/lib/transaction-filters";
import type { KpiData, Transaction, TransactionsResponse } from "@/types";

const API_BASE = "/api";

export async function fetchJson<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json", ...init?.headers },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export function getKpis() {
  return fetchJson<KpiData>("/kpis");
}

export function getTransactions(filters: Partial<TransactionFilters> = {}) {
  const params = filtersToSearchParams(filters);
  return fetchJson<TransactionsResponse>(`/transactions?${params}`);
}

export function getTransaction(id: string) {
  return fetchJson<Transaction>(`/transactions/${id}`);
}
