import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import { AppShell } from "@/components/layout/app-shell";
import { LoginPage } from "@/features/auth/login-page";
import { ProtectedRoute } from "@/features/auth/protected-route";
import { PlaceholderPage } from "@/features/placeholder-page";

const DashboardPage = lazy(() =>
  import("@/features/dashboard/dashboard-page").then((m) => ({
    default: m.DashboardPage,
  }))
);

const ComponentsDocsPage = lazy(() =>
  import("@/features/docs/components-docs-page").then((m) => ({
    default: m.ComponentsDocsPage,
  }))
);

const TransactionsPage = lazy(() =>
  import("@/features/transactions/transactions-page").then((m) => ({
    default: m.TransactionsPage,
  }))
);

const AnalyticsPage = lazy(() =>
  import("@/features/analytics/analytics-page").then((m) => ({
    default: m.AnalyticsPage,
  }))
);

const LiveFeedPage = lazy(() =>
  import("@/features/live-feed/live-feed-page").then((m) => ({
    default: m.LiveFeedPage,
  }))
);

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
    </div>
  );
}

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          {
            path: "dashboard",
            element: (
              <LazyPage>
                <DashboardPage />
              </LazyPage>
            ),
          },
          {
            path: "transactions",
            element: (
              <LazyPage>
                <TransactionsPage />
              </LazyPage>
            ),
          },
          {
            path: "analytics",
            element: (
              <LazyPage>
                <AnalyticsPage />
              </LazyPage>
            ),
          },
          {
            path: "live",
            element: (
              <LazyPage>
                <LiveFeedPage />
              </LazyPage>
            ),
          },
          {
            path: "settings",
            element: (
              <PlaceholderPage
                title="Settings"
                description="Platform configuration (admin only)"
                phase={4}
              />
            ),
          },
          {
            path: "docs/components",
            element: (
              <LazyPage>
                <ComponentsDocsPage />
              </LazyPage>
            ),
          },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/dashboard" replace /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
