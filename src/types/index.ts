export type UserRole = "admin" | "analyst" | "support";

export type TransactionStatus =
  | "pending"
  | "authorized"
  | "settled"
  | "failed"
  | "reversed";

export type Currency = "NGN" | "USD" | "GBP";

export interface Transaction {
  id: string;
  reference: string;
  amount: number;
  currency: Currency;
  status: TransactionStatus;
  customerEmail: string;
  createdAt: string;
  settledAt?: string;
}

export interface KpiData {
  volumeToday: number;
  volumeCurrency: Currency;
  successRate: number;
  pendingPayouts: number;
  volumeTrend: number[];
  successTrend: number[];
  pendingTrend: number[];
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles: UserRole[];
}
