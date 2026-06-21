import { Dialog } from "@/components/ui/dialog";

const SHORTCUTS = [
  { keys: ["⌘", "K"], description: "Open command palette" },
  { keys: ["?"], description: "Show keyboard shortcuts" },
  { keys: ["↑", "↓"], description: "Navigate command palette" },
  { keys: ["↵"], description: "Select command palette item" },
  { keys: ["Esc"], description: "Close dialogs and panels" },
] as const;

export function KeyboardShortcutsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Keyboard shortcuts"
      description="Quick actions available across the app"
      className="max-w-sm"
    >
      <dl className="space-y-3">
        {SHORTCUTS.map((shortcut) => (
          <div
            key={shortcut.description}
            className="flex items-center justify-between gap-4"
          >
            <dt className="text-sm text-muted">{shortcut.description}</dt>
            <dd className="flex gap-1">
              {shortcut.keys.map((key) => (
                <kbd
                  key={key}
                  className="rounded border border-border bg-surface-raised px-2 py-0.5 text-xs font-medium text-foreground"
                >
                  {key}
                </kbd>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </Dialog>
  );
}
