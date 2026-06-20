import { http, HttpResponse } from "msw";

import {
  applyTransactionFilters,
  paginateTransactions,
  searchParamsToFilters,
} from "@/lib/transaction-filters";
import { generateTransactions } from "@/mocks/generate-transactions";
import type { KpiData, Transaction } from "@/types";

const mockKpis: KpiData = {
  volumeToday: 48_750_000,
  volumeCurrency: "NGN",
  successRate: 97.3,
  pendingPayouts: 127,
  volumeTrend: [32, 38, 35, 42, 45, 41, 48],
  successTrend: [96.1, 96.8, 97.0, 96.5, 97.2, 97.1, 97.3],
  pendingTrend: [142, 138, 135, 131, 129, 128, 127],
};

const allTransactions = generateTransactions();

export interface TransactionsResponse {
  data: Transaction[];
  total: number;
  page: number;
  pageSize: number;
}

export const handlers = [
  http.get("/api/kpis", () => HttpResponse.json(mockKpis)),

  http.get("/api/transactions", ({ request }) => {
    const url = new URL(request.url);
    const filters = searchParamsToFilters(url.searchParams);
    const filtered = applyTransactionFilters(allTransactions, filters);
    const result = paginateTransactions(
      filtered,
      filters.page,
      filters.pageSize
    );

    return HttpResponse.json(result satisfies TransactionsResponse);
  }),

  http.get("/api/transactions/:id", ({ params }) => {
    const transaction = allTransactions.find((t) => t.id === params.id);
    if (!transaction) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }
    return HttpResponse.json(transaction);
  }),
];

export { mockKpis, allTransactions };
