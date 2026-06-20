import { format, parseISO } from "date-fns";

import type { Currency } from "@/types";

export function formatCurrency(amount: number, currency: Currency): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDate(iso: string): string {
  return format(parseISO(iso), "MMM d, yyyy HH:mm");
}

export function formatDateShort(iso: string): string {
  return format(parseISO(iso), "MMM d, yyyy");
}
