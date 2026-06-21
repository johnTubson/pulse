import { generateTransactions } from "@/mocks/generate-transactions";
import type { AnalyticsData, KpiData } from "@/types";

export const mockKpis: KpiData = {
  volumeToday: 48_750_000,
  volumeCurrency: "NGN",
  successRate: 97.3,
  pendingPayouts: 127,
  volumeTrend: [32, 38, 35, 42, 45, 41, 48],
  successTrend: [96.1, 96.8, 97.0, 96.5, 97.2, 97.1, 97.3],
  pendingTrend: [142, 138, 135, 131, 129, 128, 127],
};

export const allTransactions = generateTransactions();

export const mockAnalytics: AnalyticsData = {
  volumeByDay: [
    { date: "2026-06-13", label: "Jun 13", volume: 42_500_000 },
    { date: "2026-06-14", label: "Jun 14", volume: 38_200_000 },
    { date: "2026-06-15", label: "Jun 15", volume: 45_100_000 },
    { date: "2026-06-16", label: "Jun 16", volume: 51_300_000 },
    { date: "2026-06-17", label: "Jun 17", volume: 47_800_000 },
    { date: "2026-06-18", label: "Jun 18", volume: 44_600_000 },
    { date: "2026-06-19", label: "Jun 19", volume: 48_750_000 },
  ],
  successFunnel: [
    { stage: "Initiated", count: 10_000 },
    { stage: "Authorized", count: 9_420 },
    { stage: "Settled", count: 9_173 },
    { stage: "Completed", count: 9_050 },
  ],
  payoutBreakdown: [
    { currency: "NGN", amount: 312_400_000, label: "NGN" },
    { currency: "USD", amount: 1_240_000, label: "USD" },
    { currency: "GBP", amount: 890_000, label: "GBP" },
  ],
};
