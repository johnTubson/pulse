import { cn } from "@/lib/cn";
import type { TransactionStatus } from "@/types";

const statusStyles: Record<TransactionStatus, string> = {
  pending: "bg-warning-muted text-warning border-warning/30",
  authorized: "bg-info-muted text-info border-info/30",
  settled: "bg-success-muted text-success border-success/30",
  failed: "bg-danger-muted text-danger border-danger/30",
  reversed: "bg-surface-raised text-muted border-border",
};

const variantStyles = {
  default: "bg-accent-muted text-accent border-accent/30",
  success: "bg-success-muted text-success border-success/30",
  warning: "bg-warning-muted text-warning border-warning/30",
  danger: "bg-danger-muted text-danger border-danger/30",
  info: "bg-info-muted text-info border-info/30",
  muted: "bg-surface-raised text-muted border-border",
} as const;

export interface BadgeProps {
  children: React.ReactNode;
  status?: TransactionStatus;
  variant?: keyof typeof variantStyles;
  className?: string;
}

export function Badge({ children, status, variant, className }: BadgeProps) {
  const style = status
    ? statusStyles[status]
    : variantStyles[variant ?? "default"];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
        style,
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: TransactionStatus }) {
  return <Badge status={status}>{status}</Badge>;
}
