import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { cn } from "@/lib/cn";
import { getNavForRole, getNavIcon, ROLE_LABELS } from "@/lib/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useUiStore } from "@/stores/ui-store";

export function AppShell() {
  const role = useAuthStore((s) => s.role);
  const logout = useAuthStore((s) => s.logout);
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  if (!role) return null;

  const navItems = getNavForRole(role);

  return (
    <div className="flex min-h-svh bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex flex-col border-r border-border bg-surface transition-[width] duration-200",
          sidebarCollapsed
            ? "w-[var(--sidebar-collapsed-width)]"
            : "w-[var(--sidebar-width)]"
        )}
      >
        <div
          className={cn(
            "flex h-[var(--topbar-height)] items-center border-b border-border px-3",
            sidebarCollapsed ? "justify-center" : "justify-between px-4"
          )}
        >
          {!sidebarCollapsed && (
            <div>
              <p className="text-sm font-semibold text-foreground">Pulse</p>
              <p className="text-xs text-muted-foreground">Ops Dashboard</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={toggleSidebar}
            aria-label={
              sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {navItems.map((item) => {
            const Icon = getNavIcon(item.icon);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={sidebarCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    sidebarCollapsed && "justify-center px-2",
                    isActive
                      ? "bg-accent-muted text-accent"
                      : "text-muted hover:bg-surface-raised hover:text-foreground"
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {!sidebarCollapsed && (
          <div className="border-t border-border p-4">
            <p className="text-xs text-muted-foreground">Signed in as</p>
            <p className="text-sm font-medium text-foreground">
              {ROLE_LABELS[role]}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full"
              onClick={logout}
            >
              Sign out
            </Button>
          </div>
        )}
      </aside>

      <div
        className={cn(
          "flex min-h-svh flex-1 flex-col transition-[margin] duration-200",
          sidebarCollapsed
            ? "ml-[var(--sidebar-collapsed-width)]"
            : "ml-[var(--sidebar-width)]"
        )}
      >
        <header className="sticky top-0 z-30 flex h-[var(--topbar-height)] items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-3 md:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={toggleSidebar}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <span className="text-sm font-semibold">Pulse</span>
          </div>
          <p className="hidden text-sm text-muted md:block">
            Demo mode — client-side role only, not secure
          </p>
          <div className="flex items-center gap-2">
            <ThemeSwitcher compact />
            <span className="rounded-full bg-accent-muted px-2.5 py-0.5 text-xs font-medium text-accent">
              {ROLE_LABELS[role]}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
