import { http, HttpResponse } from "msw";

import type { KpiData } from "@/types";

const mockKpis: KpiData = {
  volumeToday: 48_750_000,
  volumeCurrency: "NGN",
  successRate: 97.3,
  pendingPayouts: 127,
  volumeTrend: [32, 38, 35, 42, 45, 41, 48],
  successTrend: [96.1, 96.8, 97.0, 96.5, 97.2, 97.1, 97.3],
  pendingTrend: [142, 138, 135, 131, 129, 128, 127],
};

export const handlers = [
  http.get("/api/kpis", () => HttpResponse.json(mockKpis)),
];

export { mockKpis };
