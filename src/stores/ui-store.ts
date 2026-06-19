import { create } from "zustand";
import { persist } from "zustand/middleware";

import { DEFAULT_THEME, isThemeId, type ThemeId } from "@/lib/themes";

interface UiState {
  sidebarCollapsed: boolean;
  theme: ThemeId;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: ThemeId) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      theme: DEFAULT_THEME,
      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setTheme: (theme) => set({ theme }),
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
        };
      },
    }
  )
);
