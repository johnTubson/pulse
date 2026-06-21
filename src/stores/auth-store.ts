import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { UserRole } from "@/types";

const VALID_ROLES: UserRole[] = ["admin", "analyst", "support"];

function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && VALID_ROLES.includes(value as UserRole);
}

interface AuthState {
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: null,
      isAuthenticated: false,
      login: (role) => set({ role, isAuthenticated: true }),
      logout: () => set({ role: null, isAuthenticated: false }),
    }),
    {
      name: "pulse-auth",
      partialize: (state) => ({
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }),
      merge: (persisted, current) => {
        const saved = persisted as Partial<AuthState> | undefined;
        const role = saved?.role && isUserRole(saved.role) ? saved.role : null;

        return {
          ...current,
          role,
          isAuthenticated: Boolean(role),
        };
      },
    }
  )
);
