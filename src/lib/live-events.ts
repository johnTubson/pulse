import type { QueryClient } from "@tanstack/react-query";

import type {
  LiveEventType,
  Transaction,
  TransactionStatus,
  TransactionsResponse,
} from "@/types";

export function patchTransactionInQueryCache(
  queryClient: QueryClient,
  transactionId: string,
  transactions: readonly Transaction[]
): void {
  const updated = transactions.find(
    (transaction) => transaction.id === transactionId
  );
  if (!updated) return;

  queryClient.setQueriesData(
    { queryKey: ["transactions"] },
    (old: TransactionsResponse | undefined) => {
      if (!old) return old;

      const index = old.data.findIndex((item) => item.id === transactionId);
      if (index === -1) return old;

      const data = [...old.data];
      data[index] = { ...updated };
      return { ...old, data };
    }
  );

  queryClient.setQueryData(["transaction", transactionId], { ...updated });
}

export function liveEventTypeToStatus(type: LiveEventType): TransactionStatus {
  return type.replace("transaction.", "") as TransactionStatus;
}

export function applyLiveEventToTransaction(
  transaction: Transaction,
  type: LiveEventType,
  timestamp: string
): void {
  const status = liveEventTypeToStatus(type);
  transaction.status = status;

  if (status === "settled") {
    transaction.settledAt = timestamp;
  } else if (status !== "reversed") {
    transaction.settledAt = undefined;
  }
}
