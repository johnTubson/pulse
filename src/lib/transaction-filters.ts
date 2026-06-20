import type { Currency, Transaction, TransactionStatus } from "@/types";

export interface TransactionFilters {
  status: TransactionStatus | "all";
  currency: Currency | "all";
  search: string;
  dateFrom: string;
  dateTo: string;
  sortBy: keyof Transaction;
  sortOrder: "asc" | "desc";
  page: number;
  pageSize: number;
}

export const DEFAULT_TRANSACTION_FILTERS: TransactionFilters = {
  status: "all",
  currency: "all",
  search: "",
  dateFrom: "",
  dateTo: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  page: 1,
  pageSize: 10_000,
};

const VALID_STATUSES = new Set<TransactionStatus | "all">([
  "all",
  "pending",
  "authorized",
  "settled",
  "failed",
  "reversed",
]);

const VALID_CURRENCIES = new Set<Currency | "all">([
  "all",
  "NGN",
  "USD",
  "GBP",
]);

const SORTABLE_COLUMNS = new Set<keyof Transaction>([
  "id",
  "reference",
  "amount",
  "currency",
  "status",
  "customerEmail",
  "createdAt",
  "settledAt",
]);

export function filtersToSearchParams(
  filters: Partial<TransactionFilters>
): URLSearchParams {
  const params = new URLSearchParams();
  const merged = { ...DEFAULT_TRANSACTION_FILTERS, ...filters };

  if (merged.status !== "all") params.set("status", merged.status);
  if (merged.currency !== "all") params.set("currency", merged.currency);
  if (merged.search.trim()) params.set("search", merged.search.trim());
  if (merged.dateFrom) params.set("dateFrom", merged.dateFrom);
  if (merged.dateTo) params.set("dateTo", merged.dateTo);
  if (merged.sortBy !== DEFAULT_TRANSACTION_FILTERS.sortBy) {
    params.set("sortBy", merged.sortBy);
  }
  if (merged.sortOrder !== DEFAULT_TRANSACTION_FILTERS.sortOrder) {
    params.set("sortOrder", merged.sortOrder);
  }
  params.set("page", String(merged.page));
  params.set("pageSize", String(merged.pageSize));

  return params;
}

export function searchParamsToFilters(
  params: URLSearchParams
): TransactionFilters {
  const status = params.get("status");
  const currency = params.get("currency");
  const sortBy = params.get("sortBy");

  return {
    status:
      status && VALID_STATUSES.has(status as TransactionStatus | "all")
        ? (status as TransactionStatus | "all")
        : "all",
    currency:
      currency && VALID_CURRENCIES.has(currency as Currency | "all")
        ? (currency as Currency | "all")
        : "all",
    search: params.get("search") ?? "",
    dateFrom: params.get("dateFrom") ?? "",
    dateTo: params.get("dateTo") ?? "",
    sortBy:
      sortBy && SORTABLE_COLUMNS.has(sortBy as keyof Transaction)
        ? (sortBy as keyof Transaction)
        : "createdAt",
    sortOrder: params.get("sortOrder") === "asc" ? "asc" : "desc",
    page: Math.max(1, Number(params.get("page")) || 1),
    pageSize: Math.min(
      10_000,
      Math.max(
        1,
        Number(params.get("pageSize")) || DEFAULT_TRANSACTION_FILTERS.pageSize
      )
    ),
  };
}

export function applyTransactionFilters(
  transactions: Transaction[],
  filters: TransactionFilters
): Transaction[] {
  let result = transactions;

  if (filters.status !== "all") {
    result = result.filter((t) => t.status === filters.status);
  }

  if (filters.currency !== "all") {
    result = result.filter((t) => t.currency === filters.currency);
  }

  if (filters.search.trim()) {
    const q = filters.search.trim().toLowerCase();
    result = result.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.reference.toLowerCase().includes(q) ||
        t.customerEmail.toLowerCase().includes(q)
    );
  }

  if (filters.dateFrom) {
    const from = new Date(filters.dateFrom).getTime();
    result = result.filter((t) => new Date(t.createdAt).getTime() >= from);
  }

  if (filters.dateTo) {
    const to = new Date(filters.dateTo).getTime() + 24 * 60 * 60 * 1000 - 1;
    result = result.filter((t) => new Date(t.createdAt).getTime() <= to);
  }

  result = [...result].sort((a, b) => {
    const col = filters.sortBy;
    const aVal = a[col];
    const bVal = b[col];

    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;

    const cmp =
      typeof aVal === "number" && typeof bVal === "number"
        ? aVal - bVal
        : String(aVal).localeCompare(String(bVal));

    return filters.sortOrder === "asc" ? cmp : -cmp;
  });

  return result;
}

export function paginateTransactions<T>(
  items: T[],
  page: number,
  pageSize: number
): { data: T[]; total: number; page: number; pageSize: number } {
  const total = items.length;
  const start = (page - 1) * pageSize;
  const data = items.slice(start, start + pageSize);

  return { data, total, page, pageSize };
}
