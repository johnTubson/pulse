import { setupWorker } from "msw/browser";

import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

export async function enableMocking() {
  const enabled =
    import.meta.env.DEV || import.meta.env.VITE_ENABLE_MSW === "true";
  if (!enabled) return;

  return worker.start({
    onUnhandledRequest: "bypass",
    serviceWorker: {
      url: "/mockServiceWorker.js",
    },
  });
}
