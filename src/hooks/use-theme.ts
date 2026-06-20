import { getThemeAccent, type ThemeId } from "@/lib/themes";
import { useUiStore } from "@/stores/ui-store";

export function useTheme() {
  const theme = useUiStore((s) => s.theme);
  const colorMode = useUiStore((s) => s.colorMode);
  const setTheme = useUiStore((s) => s.setTheme);
  const setColorMode = useUiStore((s) => s.setColorMode);
  const toggleColorMode = useUiStore((s) => s.toggleColorMode);

  return {
    theme,
    colorMode,
    setTheme,
    setColorMode,
    toggleColorMode,
    accent: getThemeAccent(theme),
  };
}

export function useThemeAccent(theme?: ThemeId): string {
  const current = useUiStore((s) => s.theme);
  return getThemeAccent(theme ?? current);
}
