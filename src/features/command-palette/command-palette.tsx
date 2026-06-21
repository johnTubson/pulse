import { Keyboard, PanelLeft, Search, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { getTransactions } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { getNavForRole, getNavIcon } from "@/lib/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useFilterStore } from "@/stores/filter-store";
import { useUiStore } from "@/stores/ui-store";
import type { Transaction } from "@/types";

let pendingSearchTimer: ReturnType<typeof setTimeout> | null = null;
let activeSearchRequest = 0;

function cancelPendingTransactionSearch() {
  if (pendingSearchTimer) {
    clearTimeout(pendingSearchTimer);
    pendingSearchTimer = null;
  }
  activeSearchRequest += 1;
}

function scheduleTransactionSearch(
  query: string,
  onResults: (results: Transaction[]) => void,
  onSearching: (searching: boolean) => void
) {
  cancelPendingTransactionSearch();
  const requestId = activeSearchRequest;

  pendingSearchTimer = setTimeout(async () => {
    pendingSearchTimer = null;
    onSearching(true);
    try {
      const result = await getTransactions({ search: query, pageSize: 5 });
      if (requestId === activeSearchRequest) {
        onResults(result.data);
      }
    } catch {
      if (requestId === activeSearchRequest) {
        onResults([]);
      }
    } finally {
      if (requestId === activeSearchRequest) {
        onSearching(false);
      }
    }
  }, 250);
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShowShortcuts: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  group: string;
}

export function CommandPalette({
  open,
  onOpenChange,
  onShowShortcuts,
}: CommandPaletteProps) {
  const navigate = useNavigate();
  const role = useAuthStore((s) => s.role);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const setFilters = useFilterStore((s) => s.setFilters);
  const setSelectedTransactionId = useFilterStore(
    (s) => s.setSelectedTransactionId
  );

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [txnResults, setTxnResults] = useState<Transaction[]>([]);
  const [searching, setSearching] = useState(false);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setActiveIndex(0);

    const q = value.trim();
    if (q.length < 3) {
      cancelPendingTransactionSearch();
      setTxnResults([]);
      setSearching(false);
      return;
    }

    scheduleTransactionSearch(q, setTxnResults, setSearching);
  };

  const resetPalette = () => {
    onOpenChange(false);
    setQuery("");
    setActiveIndex(0);
    setTxnResults([]);
    setSearching(false);
  };

  const selectCommand = (action: () => void) => {
    action();
    cancelPendingTransactionSearch();
    resetPalette();
  };

  const navCommands: CommandItem[] = useMemo(() => {
    if (!role) return [];
    return getNavForRole(role).map((item) => {
      const Icon = getNavIcon(item.icon);
      return {
        id: `nav-${item.path}`,
        label: item.label,
        description: `Go to ${item.label}`,
        icon: <Icon className="h-4 w-4" />,
        group: "Navigation",
        action: () => navigate(item.path),
      };
    });
  }, [role, navigate]);

  const actionCommands: CommandItem[] = useMemo(
    () => [
      {
        id: "toggle-sidebar",
        label: "Toggle sidebar",
        description: "Collapse or expand the sidebar",
        icon: <PanelLeft className="h-4 w-4" />,
        group: "Actions",
        action: toggleSidebar,
      },
      {
        id: "shortcuts",
        label: "Keyboard shortcuts",
        description: "View all shortcuts",
        icon: <Keyboard className="h-4 w-4" />,
        group: "Actions",
        action: onShowShortcuts,
      },
    ],
    [toggleSidebar, onShowShortcuts]
  );

  const txnCommands: CommandItem[] = useMemo(
    () =>
      txnResults.map((txn) => ({
        id: `txn-${txn.id}`,
        label: txn.id,
        description: `${txn.reference} · ${formatCurrency(
          txn.amount,
          txn.currency
        )}`,
        icon: <Wallet className="h-4 w-4" />,
        group: "Transactions",
        action: () => {
          setFilters({ search: txn.id });
          setSelectedTransactionId(txn.id);
          navigate("/transactions");
        },
      })),
    [txnResults, navigate, setFilters, setSelectedTransactionId]
  );

  const allCommands = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filter = (items: CommandItem[]) =>
      q
        ? items.filter(
            (item) =>
              item.label.toLowerCase().includes(q) ||
              item.description?.toLowerCase().includes(q)
          )
        : items;

    return [
      ...filter(navCommands),
      ...filter(actionCommands),
      ...(query.trim().length >= 3 ? txnCommands : []),
    ];
  }, [query, navCommands, actionCommands, txnCommands]);

  const safeActiveIndex = Math.min(
    activeIndex,
    Math.max(allCommands.length - 1, 0)
  );

  const handlePaletteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      cancelPendingTransactionSearch();
      resetPalette();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, allCommands.length - 1));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
      return;
    }

    if (e.key === "Enter" && allCommands[safeActiveIndex]) {
      e.preventDefault();
      selectCommand(allCommands[safeActiveIndex].action);
    }
  };

  if (!open) return null;

  const grouped = allCommands.reduce<Record<string, CommandItem[]>>(
    (acc, item) => {
      (acc[item.group] ??= []).push(item);
      return acc;
    },
    {}
  );

  let flatIndex = 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] p-4">
      <div
        className="absolute inset-0 bg-[var(--color-overlay)] backdrop-blur-sm"
        onClick={() => {
          cancelPendingTransactionSearch();
          resetPalette();
        }}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal
        aria-label="Command palette"
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-lg border border-border bg-surface shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handlePaletteKeyDown}
            placeholder="Search commands or transactions…"
            className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          />
          <kbd className="hidden rounded border border-border bg-surface-raised px-1.5 py-0.5 text-[10px] text-muted sm:inline">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto scrollbar-thin p-2">
          {searching && (
            <p className="px-3 py-2 text-xs text-muted">
              Searching transactions…
            </p>
          )}

          {allCommands.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted">
              {query.trim().length >= 3
                ? "No results found."
                : "Type to search commands or 3+ chars for transactions."}
            </p>
          ) : (
            Object.entries(grouped).map(([group, items]) => (
              <div key={group} className="mb-2">
                <p className="px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {group}
                </p>
                {items.map((item) => {
                  const index = flatIndex++;
                  const isActive = index === safeActiveIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectCommand(item.action)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors",
                        isActive
                          ? "bg-accent-muted text-foreground"
                          : "text-muted hover:bg-surface-raised hover:text-foreground"
                      )}
                    >
                      <span className="shrink-0 text-muted-foreground">
                        {item.icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium">
                          {item.label}
                        </span>
                        {item.description && (
                          <span className="block truncate text-xs text-muted-foreground">
                            {item.description}
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground">
          <span>↑↓ navigate · ↵ select · esc close</span>
          <span>
            <kbd className="rounded border border-border bg-surface-raised px-1 py-0.5">
              ⌘K
            </kbd>
          </span>
        </div>
      </div>
    </div>
  );
}
