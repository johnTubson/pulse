import { cn } from "@/lib/cn";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface p-4 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: CardProps) {
  return (
    <div className={cn("mb-3 flex flex-col gap-1", className)}>{children}</div>
  );
}

export function CardTitle({ children, className }: CardProps) {
  return (
    <h3 className={cn("text-sm font-medium text-muted", className)}>
      {children}
    </h3>
  );
}

export function CardValue({ children, className }: CardProps) {
  return (
    <p
      className={cn(
        "text-2xl font-semibold tracking-tight text-foreground",
        className
      )}
    >
      {children}
    </p>
  );
}

export function CardDescription({ children, className }: CardProps) {
  return (
    <p className={cn("text-xs text-muted-foreground", className)}>{children}</p>
  );
}
