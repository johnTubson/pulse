import { getThemeAccent, type ThemeId } from "@/lib/themes";
import { useUiStore } from "@/stores/ui-store";

export function useTheme() {
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);

  return {
    theme,
    setTheme,
    accent: getThemeAccent(theme),
  };
}

export function useThemeAccent(theme?: ThemeId): string {
  const current = useUiStore((s) => s.theme);
  return getThemeAccent(theme ?? current);
}
