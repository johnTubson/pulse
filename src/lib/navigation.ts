import {
  Activity,
  BarChart3,
  LayoutDashboard,
  Radio,
  Settings,
  Wallet,
} from "lucide-react";

import type { NavItem, UserRole } from "@/types";

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: "dashboard",
    roles: ["admin", "analyst", "support"],
  },
  {
    label: "Transactions",
    path: "/transactions",
    icon: "transactions",
    roles: ["admin", "analyst", "support"],
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: "analytics",
    roles: ["admin", "analyst"],
  },
  {
    label: "Live Feed",
    path: "/live",
    icon: "live",
    roles: ["admin", "support"],
  },
  {
    label: "Settings",
    path: "/settings",
    icon: "settings",
    roles: ["admin"],
  },
  {
    label: "Components",
    path: "/docs/components",
    icon: "docs",
    roles: ["admin"],
  },
];

const iconMap = {
  dashboard: LayoutDashboard,
  transactions: Wallet,
  analytics: BarChart3,
  live: Radio,
  settings: Settings,
  docs: Activity,
} as const;

export function getNavIcon(icon: string) {
  return iconMap[icon as keyof typeof iconMap] ?? LayoutDashboard;
}

export function getNavForRole(role: UserRole): NavItem[] {
  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  analyst: "Analyst",
  support: "Support",
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  admin: "Full platform access — settings, analytics, live feed",
  analyst: "Transaction filters, exports, and analytics",
  support: "Live feed and quick transaction lookup",
};
