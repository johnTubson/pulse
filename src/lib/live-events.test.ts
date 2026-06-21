import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";

import {
  applyLiveEventToTransaction,
  liveEventTypeToStatus,
  patchTransactionInQueryCache,
} from "@/lib/live-events";
import type { Transaction, TransactionsResponse } from "@/types";

const baseTransaction: Transaction = {
  id: "txn_001",
  reference: "REF-001",
  amount: 10_000,
  currency: "NGN",
  status: "pending",
  customerEmail: "user@example.com",
  createdAt: "2026-06-19T10:00:00.000Z",
};

describe("liveEventTypeToStatus", () => {
  it("maps event types to transaction statuses", () => {
    expect(liveEventTypeToStatus("transaction.settled")).toBe("settled");
    expect(liveEventTypeToStatus("transaction.failed")).toBe("failed");
  });
});

describe("applyLiveEventToTransaction", () => {
  it("updates status and settledAt when a transaction settles", () => {
    const txn = { ...baseTransaction };
    const timestamp = "2026-06-19T12:00:00.000Z";

    applyLiveEventToTransaction(txn, "transaction.settled", timestamp);

    expect(txn.status).toBe("settled");
    expect(txn.settledAt).toBe(timestamp);
  });

  it("clears settledAt for non-settled status changes", () => {
    const txn = {
      ...baseTransaction,
      status: "settled" as const,
      settledAt: "2026-06-19T11:00:00.000Z",
    };

    applyLiveEventToTransaction(
      txn,
      "transaction.failed",
      "2026-06-19T12:00:00.000Z"
    );

    expect(txn.status).toBe("failed");
    expect(txn.settledAt).toBeUndefined();
  });
});

describe("patchTransactionInQueryCache", () => {
  it("updates cached list and detail queries for a transaction", () => {
    const queryClient = new QueryClient();
    const updated: Transaction = {
      ...baseTransaction,
      status: "settled",
      settledAt: "2026-06-19T12:00:00.000Z",
    };
    const listResponse: TransactionsResponse = {
      data: [baseTransaction],
      total: 1,
      page: 1,
      pageSize: 50,
    };

    queryClient.setQueryData(["transactions", { page: 1 }], listResponse);
    queryClient.setQueryData(
      ["transaction", baseTransaction.id],
      baseTransaction
    );

    patchTransactionInQueryCache(queryClient, updated.id, [updated]);

    expect(
      queryClient.getQueryData<TransactionsResponse>([
        "transactions",
        { page: 1 },
      ])?.data[0]?.status
    ).toBe("settled");
    expect(
      queryClient.getQueryData<Transaction>(["transaction", baseTransaction.id])
        ?.status
    ).toBe("settled");
  });
});
