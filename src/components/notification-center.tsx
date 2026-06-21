import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/lib/format";
import { liveEventTypeToStatus } from "@/lib/live-events";
import { useNotificationStore } from "@/stores/notification-store";
import { useFilterStore } from "@/stores/filter-store";

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const events = useNotificationStore((s) => s.events);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const clearEvents = useNotificationStore((s) => s.clearEvents);
  const setSelectedTransactionId = useFilterStore(
    (s) => s.setSelectedTransactionId
  );

  const handleOpen = () => {
    setOpen((v) => !v);
    if (!open) markAllRead();
  };

  const openTransaction = (transactionId: string) => {
    setSelectedTransactionId(transactionId);
    navigate("/transactions");
    setOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative h-8 w-8 p-0"
        onClick={handleOpen}
        aria-expanded={open}
        aria-label={`Notifications${
          unreadCount > 0 ? `, ${unreadCount} unread` : ""
        }`}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-border bg-surface shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p className="text-sm font-semibold text-foreground">
                Notifications
              </p>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={markAllRead}
                  disabled={unreadCount === 0}
                >
                  <CheckCheck className="mr-1 h-3.5 w-3.5" />
                  Read
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={clearEvents}
                  disabled={events.length === 0}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto scrollbar-thin">
              {events.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-muted">
                  No events yet. Live updates will appear here.
                </p>
              ) : (
                events.map((event) => {
                  const status = liveEventTypeToStatus(event.type);
                  return (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => openTransaction(event.transactionId)}
                      className={cn(
                        "flex w-full flex-col gap-1 border-b border-border-subtle px-4 py-3 text-left transition-colors hover:bg-surface-raised"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono text-muted">
                          {event.transactionId}
                        </span>
                        {status && <StatusBadge status={status} />}
                      </div>
                      <p className="text-sm text-foreground">{event.message}</p>
                      <div className="flex items-center justify-between text-xs text-muted">
                        <span>
                          {formatCurrency(event.amount, event.currency)}
                        </span>
                        <span>
                          {formatDistanceToNow(new Date(event.timestamp), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
