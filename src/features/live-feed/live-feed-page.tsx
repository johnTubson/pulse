import { formatDistanceToNow, format } from "date-fns";
import { Radio } from "lucide-react";

import { StatusBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { liveEventTypeToStatus } from "@/lib/live-events";
import { useNotificationStore } from "@/stores/notification-store";

export function LiveFeedPage() {
  const events = useNotificationStore((s) => s.events);

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Live Feed</h1>
          <p className="text-sm text-muted">
            Real-time transaction events from the mock WebSocket
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-success/30 bg-success-muted px-3 py-1">
          <Radio className="h-3.5 w-3.5 animate-pulse text-success" />
          <span className="text-xs font-medium text-success">Connected</span>
        </div>
      </div>

      <Card className="divide-y divide-border-subtle p-0">
        {events.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Radio className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted">
              Waiting for events… new activity every 3–8 seconds.
            </p>
          </div>
        ) : (
          events.map((event) => {
            const status = liveEventTypeToStatus(event.type);
            return (
              <div
                key={event.id}
                className="flex items-start gap-4 px-4 py-4 sm:px-6"
              >
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-foreground">
                      {event.transactionId}
                    </span>
                    {status && <StatusBadge status={status} />}
                  </div>
                  <p className="mt-1 text-sm text-foreground">
                    {event.message}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {formatCurrency(event.amount, event.currency)} ·{" "}
                    {event.reference}
                  </p>
                </div>
                <div className="shrink-0 text-right text-xs text-muted">
                  <p>{format(new Date(event.timestamp), "HH:mm:ss")}</p>
                  <p>
                    {formatDistanceToNow(new Date(event.timestamp), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </Card>
    </div>
  );
}
