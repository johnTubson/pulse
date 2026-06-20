import { StatusBadge } from "@/components/ui/badge";
import { Sheet } from "@/components/ui/sheet";
import { useTransaction } from "@/hooks/use-transactions";
import { formatCurrency, formatDate } from "@/lib/format";

interface TransactionDetailPanelProps {
  transactionId: string | null;
  onClose: () => void;
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <dt className="shrink-0 text-sm text-muted">{label}</dt>
      <dd className="text-right text-sm font-medium text-foreground">
        {value}
      </dd>
    </div>
  );
}

export function TransactionDetailPanel({
  transactionId,
  onClose,
}: TransactionDetailPanelProps) {
  const { data, isLoading, isError } = useTransaction(transactionId);

  return (
    <Sheet
      open={Boolean(transactionId)}
      onOpenChange={(open) => !open && onClose()}
      title="Transaction details"
      description={transactionId ?? undefined}
    >
      {isLoading && (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 rounded bg-surface-raised" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-sm text-danger">Failed to load transaction.</p>
      )}

      {data && (
        <dl className="divide-y divide-border-subtle">
          <DetailRow
            label="ID"
            value={<span className="font-mono text-xs">{data.id}</span>}
          />
          <DetailRow
            label="Reference"
            value={<span className="font-mono text-xs">{data.reference}</span>}
          />
          <DetailRow
            label="Status"
            value={<StatusBadge status={data.status} />}
          />
          <DetailRow
            label="Amount"
            value={formatCurrency(data.amount, data.currency)}
          />
          <DetailRow label="Currency" value={data.currency} />
          <DetailRow label="Customer" value={data.customerEmail} />
          <DetailRow label="Created" value={formatDate(data.createdAt)} />
          <DetailRow
            label="Settled"
            value={data.settledAt ? formatDate(data.settledAt) : "Not settled"}
          />
        </dl>
      )}
    </Sheet>
  );
}
