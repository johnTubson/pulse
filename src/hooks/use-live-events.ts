import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { useToast } from "@/hooks/use-toast";
import { patchTransactionInQueryCache } from "@/lib/live-events";
import { useNotificationStore } from "@/stores/notification-store";
import type { LiveEventType } from "@/types";

const TOAST_VARIANTS: Partial<
  Record<LiveEventType, "success" | "warning" | "danger" | "default">
> = {
  "transaction.settled": "success",
  "transaction.failed": "danger",
  "transaction.pending": "warning",
  "transaction.reversed": "warning",
};

export function useLiveEvents() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const addEvent = useNotificationStore((s) => s.addEvent);

  useEffect(() => {
    let ws: { close: () => void } | undefined;
    let cancelled = false;

    void Promise.all([
      import("@/mocks/mock-data"),
      import("@/mocks/websocket"),
    ]).then(([{ allTransactions }, { MockWebSocket }]) => {
      if (cancelled) return;

      ws = new MockWebSocket(allTransactions, (event) => {
        addEvent(event);
        showToast({
          title: event.message,
          description: `${event.transactionId} · ${event.currency}`,
          variant: TOAST_VARIANTS[event.type] ?? "default",
        });

        patchTransactionInQueryCache(
          queryClient,
          event.transactionId,
          allTransactions
        );
      });
    });

    return () => {
      cancelled = true;
      ws?.close();
    };
  }, [addEvent, queryClient, showToast]);
}
