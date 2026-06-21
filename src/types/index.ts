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

export interface TransactionsResponse {
  data: Transaction[];
  total: number;
  page: number;
  pageSize: number;
}

export type LiveEventType =
  | "transaction.settled"
  | "transaction.failed"
  | "transaction.pending"
  | "transaction.authorized"
  | "transaction.reversed";

export interface LiveEvent {
  id: string;
  type: LiveEventType;
  transactionId: string;
  reference: string;
  amount: number;
  currency: Currency;
  timestamp: string;
  message: string;
}

export interface VolumeByDay {
  date: string;
  label: string;
  volume: number;
}

export interface FunnelStage {
  stage: string;
  count: number;
}

export interface PayoutBreakdown {
  currency: Currency;
  amount: number;
  label: string;
}

export interface AnalyticsData {
  volumeByDay: VolumeByDay[];
  successFunnel: FunnelStage[];
  payoutBreakdown: PayoutBreakdown[];
}
