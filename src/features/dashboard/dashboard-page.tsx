import { useQuery } from "@tanstack/react-query";

import { Sparkline } from "@/components/sparkline";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardValue,
} from "@/components/ui/card";
import { useThemeAccent } from "@/hooks/use-theme";
import { getKpis } from "@/lib/api";
import {
  formatCompactNumber,
  formatCurrency,
  formatPercent,
} from "@/lib/format";

function KpiSkeleton() {
  return (
    <Card>
      <div className="animate-pulse space-y-3">
        <div className="h-4 w-24 rounded bg-surface-raised" />
        <div className="h-8 w-32 rounded bg-surface-raised" />
        <div className="h-10 rounded bg-surface-raised" />
      </div>
    </Card>
  );
}

export function DashboardPage() {
  const accent = useThemeAccent();
  const { data, isPending, isError } = useQuery({
    queryKey: ["kpis"],
    queryFn: getKpis,
  });

  if (isPending && !data) {
    return (
      <div>
        <PageHeader />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <KpiSkeleton />
          <KpiSkeleton />
          <KpiSkeleton />
        </div>
      </div>
    );
  }

  if (isError && !data) {
    return (
      <div>
        <PageHeader />
        <Card>
          <p className="text-sm text-danger">Failed to load dashboard KPIs.</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Volume today</CardTitle>
            <CardValue>
              {formatCurrency(data.volumeToday, data.volumeCurrency)}
            </CardValue>
            <CardDescription>7-day trend</CardDescription>
          </CardHeader>
          <Sparkline data={data.volumeTrend} color={accent} />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Success rate</CardTitle>
            <CardValue>{formatPercent(data.successRate)}</CardValue>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <Sparkline data={data.successTrend} color="#22c55e" />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending payouts</CardTitle>
            <CardValue>{formatCompactNumber(data.pendingPayouts)}</CardValue>
            <CardDescription>Awaiting settlement</CardDescription>
          </CardHeader>
          <Sparkline data={data.pendingTrend} color="#f59e0b" />
        </Card>
      </div>
    </div>
  );
}

function PageHeader() {
  return (
    <div className="mb-6">
      <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
      <p className="text-sm text-muted">
        Real-time overview of payment operations
      </p>
    </div>
  );
}
