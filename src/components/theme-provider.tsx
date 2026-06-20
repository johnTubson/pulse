import { useEffect, type ReactNode } from "react";

import { isColorMode, isThemeId } from "@/lib/themes";
import { useUiStore } from "@/stores/ui-store";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useUiStore((s) => s.theme);
  const colorMode = useUiStore((s) => s.colorMode);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.colorMode = colorMode;
  }, [theme, colorMode]);

  useEffect(() => {
    const stored = localStorage.getItem("pulse-ui");
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as {
        state?: { theme?: string; colorMode?: string };
      };
      const savedTheme = parsed.state?.theme;
      const savedColorMode = parsed.state?.colorMode;
      if (savedTheme && isThemeId(savedTheme)) {
        document.documentElement.dataset.theme = savedTheme;
      }
      if (savedColorMode && isColorMode(savedColorMode)) {
        document.documentElement.dataset.colorMode = savedColorMode;
      }
    } catch {
      // ignore malformed storage
    }
  }, []);

  return children;
}
