import { Navigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Funnel,
  FunnelChart,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAnalytics } from "@/hooks/use-analytics";
import { useThemeAccent } from "@/hooks/use-theme";
import { formatCompactNumber, formatCurrency } from "@/lib/format";
import { useAuthStore } from "@/stores/auth-store";

const PIE_COLORS = ["#2dd4bf", "#38bdf8", "#8b5cf6"];

function ChartSkeleton() {
  return <div className="h-64 animate-pulse rounded bg-surface-raised" />;
}

export function AnalyticsPage() {
  const role = useAuthStore((s) => s.role);
  const accent = useThemeAccent();
  const { data, isPending, isError } = useAnalytics();

  if (role !== "admin" && role !== "analyst") {
    return <Navigate to="/dashboard" replace />;
  }

  if (isPending && !data) {
    return (
      <div>
        <PageHeader />
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <ChartSkeleton />
          </Card>
          <Card>
            <ChartSkeleton />
          </Card>
          <Card className="lg:col-span-2">
            <ChartSkeleton />
          </Card>
        </div>
      </div>
    );
  }

  if (isError && !data) {
    return (
      <div>
        <PageHeader />
        <Card>
          <p className="text-sm text-danger">Failed to load analytics.</p>
        </Card>
      </div>
    );
  }

  const volumeData = data.volumeByDay.map((d) => ({
    ...d,
    volumeM: d.volume / 1_000_000,
  }));

  return (
    <div>
      <PageHeader />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Volume (7 days)</CardTitle>
            <CardDescription>
              Daily transaction volume in millions NGN
            </CardDescription>
          </CardHeader>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={volumeData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "var(--color-muted)", fontSize: 12 }}
                axisLine={{ stroke: "var(--color-border)" }}
              />
              <YAxis
                tick={{ fill: "var(--color-muted)", fontSize: 12 }}
                axisLine={{ stroke: "var(--color-border)" }}
                tickFormatter={(v: number) => `${v}M`}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "0.5rem",
                  color: "var(--color-foreground)",
                }}
                formatter={(value) => [
                  `${Number(value).toFixed(1)}M NGN`,
                  "Volume",
                ]}
              />
              <Bar dataKey="volumeM" fill={accent} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payout breakdown</CardTitle>
            <CardDescription>Volume by currency</CardDescription>
          </CardHeader>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data.payoutBreakdown}
                dataKey="amount"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
              >
                {data.payoutBreakdown.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "0.5rem",
                  color: "var(--color-foreground)",
                }}
                formatter={(value, _name, item) => [
                  formatCurrency(Number(value), item.payload.currency),
                  item.payload.label,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-center gap-4">
            {data.payoutBreakdown.map((item, i) => (
              <div
                key={item.currency}
                className="flex items-center gap-1.5 text-xs text-muted"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                {item.label}
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Success funnel</CardTitle>
            <CardDescription>
              Transaction progression from initiation to completion
            </CardDescription>
          </CardHeader>
          <ResponsiveContainer width="100%" height={280}>
            <FunnelChart>
              <Tooltip
                contentStyle={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "0.5rem",
                  color: "var(--color-foreground)",
                }}
                formatter={(value) => [
                  formatCompactNumber(Number(value)),
                  "Count",
                ]}
              />
              <Funnel
                dataKey="count"
                data={data.successFunnel}
                isAnimationActive
              >
                <LabelList
                  position="right"
                  fill="var(--color-foreground)"
                  stroke="none"
                  dataKey="stage"
                  fontSize={12}
                />
                {data.successFunnel.map((_, i) => (
                  <Cell
                    key={i}
                    fill={PIE_COLORS[i % PIE_COLORS.length]}
                    fillOpacity={1 - i * 0.15}
                  />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function PageHeader() {
  return (
    <div className="mb-6">
      <h1 className="text-xl font-semibold text-foreground">Analytics</h1>
      <p className="text-sm text-muted">
        Volume trends, success funnel, and payout breakdown
      </p>
    </div>
  );
}
