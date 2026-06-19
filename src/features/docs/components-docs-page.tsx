import { useState } from "react";

import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ThemeSwatches } from "@/components/theme-switcher";
import { useToast } from "@/hooks/use-toast";
import type { TransactionStatus } from "@/types";

const SAMPLE_STATUSES: TransactionStatus[] = [
  "pending",
  "authorized",
  "settled",
  "failed",
  "reversed",
];

export function ComponentsDocsPage() {
  const { showToast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Design System</h1>
        <p className="text-sm text-muted">
          UI primitives for the Pulse ops dashboard — dark theme by default.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Color themes
        </h2>
        <p className="text-sm text-muted">
          Four accent palettes — each retints surfaces, borders, and interactive
          states. Teal is the new default; violet preserves the original purple
          look.
        </p>
        <ThemeSwatches />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Buttons
        </h2>
        <Card className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button size="sm">Small</Button>
          <Button disabled>Disabled</Button>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Form controls
        </h2>
        <Card className="grid gap-4 sm:grid-cols-2">
          <Input placeholder="Search transactions…" />
          <Select defaultValue="all">
            <option value="all">All statuses</option>
            <option value="settled">Settled</option>
            <option value="pending">Pending</option>
          </Select>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Status badges
        </h2>
        <Card className="flex flex-wrap gap-2">
          {SAMPLE_STATUSES.map((status) => (
            <StatusBadge key={status} status={status} />
          ))}
          <Badge variant="info">Info</Badge>
          <Badge variant="muted">Muted</Badge>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Table shell
        </h2>
        <Card className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono text-xs">TXN-001234</TableCell>
                <TableCell>
                  <StatusBadge status="settled" />
                </TableCell>
                <TableCell>₦125,000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-xs">TXN-001235</TableCell>
                <TableCell>
                  <StatusBadge status="pending" />
                </TableCell>
                <TableCell>₦48,500</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Overlays
        </h2>
        <Card className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => setDialogOpen(true)}>
            Open dialog
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              showToast({
                title: "Transaction settled",
                description: "TXN-001234 completed successfully",
                variant: "success",
              })
            }
          >
            Show toast
          </Button>
        </Card>
      </section>

      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Confirm action"
        description="This is a demo dialog for the design system."
      >
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setDialogOpen(false)}>Confirm</Button>
        </div>
      </Dialog>
    </div>
  );
}
