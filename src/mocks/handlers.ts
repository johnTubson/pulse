import { http, HttpResponse } from "msw";

import {
  applyTransactionFilters,
  paginateTransactions,
  searchParamsToFilters,
} from "@/lib/transaction-filters";
import { allTransactions, mockAnalytics, mockKpis } from "@/mocks/mock-data";
import type { Transaction } from "@/types";

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

  http.get("/api/analytics", () => HttpResponse.json(mockAnalytics)),
];

export { mockKpis, mockAnalytics, allTransactions };
