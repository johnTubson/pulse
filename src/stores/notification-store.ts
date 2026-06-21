import { create } from "zustand";

import type { LiveEvent } from "@/types";

const MAX_EVENTS = 100;

interface NotificationState {
  events: LiveEvent[];
  unreadCount: number;
  addEvent: (event: LiveEvent) => void;
  markAllRead: () => void;
  clearEvents: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  events: [],
  unreadCount: 0,
  addEvent: (event) =>
    set((s) => ({
      events: [event, ...s.events].slice(0, MAX_EVENTS),
      unreadCount: s.unreadCount + 1,
    })),
  markAllRead: () => set({ unreadCount: 0 }),
  clearEvents: () => set({ events: [], unreadCount: 0 }),
}));
