import { describe, expect, it } from "vitest";

import {
  applyTransactionFilters,
  filtersToSearchParams,
  searchParamsToFilters,
} from "@/lib/transaction-filters";
import {
  generateTransactions,
  TRANSACTION_COUNT,
  TRANSACTION_SEED,
} from "@/mocks/generate-transactions";
import type { Transaction } from "@/types";

describe("generateTransactions", () => {
  it("produces the expected count with a fixed seed", () => {
    const a = generateTransactions(100, TRANSACTION_SEED);
    const b = generateTransactions(100, TRANSACTION_SEED);
    expect(a).toHaveLength(100);
    expect(a).toEqual(b);
  });

  it("outputs valid transaction shapes", () => {
    const txns = generateTransactions(50, "shape-test");
    for (const txn of txns) {
      expect(txn).toMatchObject({
        id: expect.stringMatching(/^txn_\d{6}$/),
        reference: expect.stringMatching(/^REF-\d{4}-\d{5}$/),
        amount: expect.any(Number),
        currency: expect.stringMatching(/^(NGN|USD|GBP)$/),
        status: expect.stringMatching(
          /^(pending|authorized|settled|failed|reversed)$/
        ),
        customerEmail: expect.stringContaining("@"),
        createdAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
      });
    }
  });

  it("generates 10k records by default", () => {
    expect(generateTransactions()).toHaveLength(TRANSACTION_COUNT);
  });
});

describe("filter → query param mapping", () => {
  it("round-trips filters through URLSearchParams", () => {
    const filters = {
      status: "settled" as const,
      currency: "NGN" as const,
      search: "txn_000001",
      dateFrom: "2025-01-01",
      dateTo: "2025-06-01",
      sortBy: "amount" as keyof Transaction,
      sortOrder: "asc" as const,
      page: 2,
      pageSize: 50,
    };

    const params = filtersToSearchParams(filters);
    const parsed = searchParamsToFilters(params);

    expect(parsed.status).toBe("settled");
    expect(parsed.currency).toBe("NGN");
    expect(parsed.search).toBe("txn_000001");
    expect(parsed.dateFrom).toBe("2025-01-01");
    expect(parsed.dateTo).toBe("2025-06-01");
    expect(parsed.sortBy).toBe("amount");
    expect(parsed.sortOrder).toBe("asc");
    expect(parsed.page).toBe(2);
    expect(parsed.pageSize).toBe(50);
  });

  it("omits default values from search params", () => {
    const params = filtersToSearchParams({});
    expect(params.has("status")).toBe(false);
    expect(params.has("currency")).toBe(false);
    expect(params.has("search")).toBe(false);
    expect(params.get("page")).toBe("1");
    expect(params.get("pageSize")).toBe("10000");
  });

  it("filters by status and search", () => {
    const txns = generateTransactions(200, "filter-test");
    const settled = applyTransactionFilters(txns, {
      status: "settled",
      currency: "all",
      search: "",
      dateFrom: "",
      dateTo: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      page: 1,
      pageSize: 10_000,
    });

    expect(settled.every((t) => t.status === "settled")).toBe(true);
    expect(settled.length).toBeGreaterThan(0);
    expect(settled.length).toBeLessThan(txns.length);

    const first = txns[0]!;
    const bySearch = applyTransactionFilters(txns, {
      status: "all",
      currency: "all",
      search: first.id,
      dateFrom: "",
      dateTo: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      page: 1,
      pageSize: 10_000,
    });

    expect(bySearch).toHaveLength(1);
    expect(bySearch[0]?.id).toBe(first.id);
  });
});
