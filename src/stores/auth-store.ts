import { create } from "zustand";

import type { UserRole } from "@/types";

interface AuthState {
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  isAuthenticated: false,
  login: (role) => set({ role, isAuthenticated: true }),
  logout: () => set({ role: null, isAuthenticated: false }),
}));
