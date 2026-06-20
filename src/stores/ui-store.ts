import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  DEFAULT_COLOR_MODE,
  DEFAULT_THEME,
  isColorMode,
  isThemeId,
  type ColorMode,
  type ThemeId,
} from "@/lib/themes";

interface UiState {
  sidebarCollapsed: boolean;
  theme: ThemeId;
  colorMode: ColorMode;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: ThemeId) => void;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      theme: DEFAULT_THEME,
      colorMode: DEFAULT_COLOR_MODE,
      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setTheme: (theme) => set({ theme }),
      setColorMode: (colorMode) => set({ colorMode }),
      toggleColorMode: () =>
        set((s) => ({
          colorMode: s.colorMode === "dark" ? "light" : "dark",
        })),
    }),
    {
      name: "pulse-ui",
      merge: (persisted, current) => {
        const saved = persisted as Partial<UiState> | undefined;
        return {
          ...current,
          ...saved,
          theme:
            saved?.theme && isThemeId(saved.theme)
              ? saved.theme
              : DEFAULT_THEME,
          colorMode:
            saved?.colorMode && isColorMode(saved.colorMode)
              ? saved.colorMode
              : DEFAULT_COLOR_MODE,
        };
      },
    }
  )
);
