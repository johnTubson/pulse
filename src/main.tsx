import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Providers } from "@/app/providers";
import App from "@/App";

import "./index.css";

async function bootstrap() {
  const { enableMocking } = await import("@/mocks/browser");
  await enableMocking();

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Providers>
        <App />
      </Providers>
    </StrictMode>
  );
}

void bootstrap();
