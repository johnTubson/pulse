import { useState } from "react";
import { Navigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { ROLE_DESCRIPTIONS, ROLE_LABELS } from "@/lib/navigation";
import { useAuthStore } from "@/stores/auth-store";
import type { UserRole } from "@/types";

const ROLES: UserRole[] = ["admin", "analyst", "support"];

export function LoginPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const login = useAuthStore((s) => s.login);
  const [selectedRole, setSelectedRole] = useState<UserRole>("analyst");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">
            Demo access
          </p>
          <h1 className="text-2xl font-bold text-foreground">
            Sign in to Pulse
          </h1>
          <p className="mt-2 text-sm text-muted">
            Select a role to explore the ops dashboard. No credentials required.
          </p>
        </div>

        <Card className="space-y-4">
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-foreground">
              Choose your role
            </legend>
            {ROLES.map((role) => (
              <label
                key={role}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors",
                  selectedRole === role
                    ? "border-accent bg-accent-muted"
                    : "border-border hover:border-border-subtle hover:bg-surface-raised"
                )}
              >
                <input
                  type="radio"
                  name="role"
                  value={role}
                  checked={selectedRole === role}
                  onChange={() => setSelectedRole(role)}
                  className="mt-0.5 accent-accent"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {ROLE_LABELS[role]}
                  </p>
                  <p className="text-xs text-muted">
                    {ROLE_DESCRIPTIONS[role]}
                  </p>
                </div>
              </label>
            ))}
          </fieldset>

          <Button className="w-full" onClick={() => login(selectedRole)}>
            Continue as {ROLE_LABELS[selectedRole]}
          </Button>
        </Card>
      </div>
    </div>
  );
}
