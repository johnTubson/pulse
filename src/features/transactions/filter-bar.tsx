import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { TransactionFilters } from "@/lib/transaction-filters";
import type { Currency, TransactionStatus } from "@/types";

interface FilterBarProps {
  filters: TransactionFilters;
  onChange: (partial: Partial<TransactionFilters>) => void;
  onReset: () => void;
  total: number;
}

const STATUS_OPTIONS: { value: TransactionStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "authorized", label: "Authorized" },
  { value: "settled", label: "Settled" },
  { value: "failed", label: "Failed" },
  { value: "reversed", label: "Reversed" },
];

const CURRENCY_OPTIONS: { value: Currency | "all"; label: string }[] = [
  { value: "all", label: "All currencies" },
  { value: "NGN", label: "NGN" },
  { value: "USD", label: "USD" },
  { value: "GBP", label: "GBP" },
];

export function FilterBar({
  filters,
  onChange,
  onReset,
  total,
}: FilterBarProps) {
  const hasActiveFilters =
    filters.status !== "all" ||
    filters.currency !== "all" ||
    filters.search.trim() !== "" ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[200px] flex-1">
          <label
            htmlFor="transaction-search"
            className="mb-1.5 block text-xs font-medium text-muted-foreground"
          >
            Search
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="transaction-search"
              placeholder="ID, reference, or email…"
              value={filters.search}
              onChange={(e) => onChange({ search: e.target.value })}
              className="pl-9"
            />
          </div>
        </div>

        <div className="w-40">
          <label
            htmlFor="transaction-status"
            className="mb-1.5 block text-xs font-medium text-muted-foreground"
          >
            Status
          </label>
          <Select
            id="transaction-status"
            value={filters.status}
            onChange={(e) =>
              onChange({
                status: e.target.value as TransactionStatus | "all",
              })
            }
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="w-36">
          <label
            htmlFor="transaction-currency"
            className="mb-1.5 block text-xs font-medium text-muted-foreground"
          >
            Currency
          </label>
          <Select
            id="transaction-currency"
            value={filters.currency}
            onChange={(e) =>
              onChange({ currency: e.target.value as Currency | "all" })
            }
          >
            {CURRENCY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="w-40">
          <label
            htmlFor="transaction-date-from"
            className="mb-1.5 block text-xs font-medium text-muted-foreground"
          >
            From
          </label>
          <Input
            id="transaction-date-from"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onChange({ dateFrom: e.target.value })}
          />
        </div>

        <div className="w-40">
          <label
            htmlFor="transaction-date-to"
            className="mb-1.5 block text-xs font-medium text-muted-foreground"
          >
            To
          </label>
          <Input
            id="transaction-date-to"
            type="date"
            value={filters.dateTo}
            onChange={(e) => onChange({ dateTo: e.target.value })}
          />
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset} className="h-9">
            <X className="mr-1 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      <p className="text-sm text-muted">
        {total.toLocaleString()} transaction{total !== 1 ? "s" : ""} matching
      </p>
    </div>
  );
}
