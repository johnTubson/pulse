import { Moon, Palette, Sun } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { THEMES, THEME_IDS, type ThemeId } from "@/lib/themes";
import { useTheme } from "@/hooks/use-theme";

interface ThemeSwitcherProps {
  compact?: boolean;
}

export function ThemeSwitcher({ compact = false }: ThemeSwitcherProps) {
  const { theme, colorMode, setTheme, setColorMode } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className={cn("gap-2", compact ? "h-8 w-8 p-0" : "h-8 px-2.5")}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Change color theme"
      >
        <Palette className="h-4 w-4" />
        {!compact && (
          <span className="hidden sm:inline">{THEMES[theme].label}</span>
        )}
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            role="listbox"
            aria-label="Color themes"
            className="absolute right-0 z-50 mt-2 w-64 rounded-lg border border-border bg-surface p-2 shadow-xl"
          >
            <div className="mb-2 flex gap-1 rounded-md bg-surface-raised p-1">
              <button
                type="button"
                onClick={() => setColorMode("light")}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded px-2 py-1.5 text-xs font-medium transition-colors",
                  colorMode === "light"
                    ? "bg-surface text-foreground shadow-sm"
                    : "text-muted hover:text-foreground"
                )}
              >
                <Sun className="h-3.5 w-3.5" />
                Light
              </button>
              <button
                type="button"
                onClick={() => setColorMode("dark")}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded px-2 py-1.5 text-xs font-medium transition-colors",
                  colorMode === "dark"
                    ? "bg-surface text-foreground shadow-sm"
                    : "text-muted hover:text-foreground"
                )}
              >
                <Moon className="h-3.5 w-3.5" />
                Dark
              </button>
            </div>

            <div className="mb-2 border-b border-border-subtle" />

            {THEME_IDS.map((id) => (
              <button
                key={id}
                type="button"
                role="option"
                aria-selected={theme === id}
                onClick={() => {
                  setTheme(id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left transition-colors",
                  theme === id ? "bg-accent-muted" : "hover:bg-surface-raised"
                )}
              >
                <span
                  className="mt-0.5 h-4 w-4 shrink-0 rounded-full ring-2 ring-border"
                  style={{ backgroundColor: THEMES[id].accent }}
                />
                <span>
                  <span className="block text-sm font-medium text-foreground">
                    {THEMES[id].label}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {THEMES[id].description}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function ThemeSwatches({
  onSelect,
}: {
  onSelect?: (theme: ThemeId) => void;
}) {
  const { theme, colorMode, setTheme, setColorMode } = useTheme();

  return (
    <div className="space-y-4">
      <div className="flex gap-1 rounded-md bg-surface-raised p-1">
        <button
          type="button"
          onClick={() => setColorMode("light")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded px-3 py-2 text-sm font-medium transition-colors",
            colorMode === "light"
              ? "bg-surface text-foreground shadow-sm"
              : "text-muted hover:text-foreground"
          )}
        >
          <Sun className="h-4 w-4" />
          Light
        </button>
        <button
          type="button"
          onClick={() => setColorMode("dark")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded px-3 py-2 text-sm font-medium transition-colors",
            colorMode === "dark"
              ? "bg-surface text-foreground shadow-sm"
              : "text-muted hover:text-foreground"
          )}
        >
          <Moon className="h-4 w-4" />
          Dark
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {THEME_IDS.map((id) => (
          <div key={id} data-theme={id} data-color-mode={colorMode}>
            <button
              type="button"
              onClick={() => {
                setTheme(id);
                onSelect?.(id);
              }}
              className={cn(
                "w-full rounded-lg border p-4 text-left transition-all",
                theme === id
                  ? "border-accent ring-1 ring-accent/40"
                  : "border-border hover:border-border-subtle"
              )}
            >
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: THEMES[id].accent }}
                />
                <span className="text-sm font-medium text-foreground">
                  {THEMES[id].label}
                </span>
              </div>
              <p className="mb-3 text-xs text-muted-foreground">
                {THEMES[id].description}
              </p>
              <div className="flex gap-1.5">
                <span className="h-6 flex-1 rounded bg-accent" />
                <span className="h-6 w-8 rounded bg-success" />
                <span className="h-6 w-8 rounded bg-warning" />
                <span className="h-6 w-8 rounded bg-danger" />
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
