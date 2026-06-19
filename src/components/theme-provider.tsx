import { useEffect, type ReactNode } from "react";

import { isThemeId } from "@/lib/themes";
import { useUiStore } from "@/stores/ui-store";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useUiStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const stored = localStorage.getItem("pulse-ui");
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as { state?: { theme?: string } };
      const savedTheme = parsed.state?.theme;
      if (savedTheme && isThemeId(savedTheme)) {
        document.documentElement.dataset.theme = savedTheme;
      }
    } catch {
      // ignore malformed storage
    }
  }, []);

  return children;
}
