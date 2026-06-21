import { expect, test } from "@playwright/test";

async function loginAsAdmin(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.getByRole("radio", { name: /admin/i }).check();
  await page.getByRole("button", { name: /continue as admin/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test("dashboard stays healthy after live event refetches", async ({ page }) => {
  await loginAsAdmin(page);

  await expect(page.getByText("Volume today")).toBeVisible({ timeout: 15_000 });

  // Live events fire every 3–8s and invalidate KPI queries.
  await page.waitForTimeout(20_000);

  await expect(page.getByText("Failed to load dashboard KPIs.")).toHaveCount(0);
  await expect(page.getByText("Volume today")).toBeVisible();
});

test("transactions stay healthy after live event refetches", async ({
  page,
}) => {
  await loginAsAdmin(page);
  await page.goto("/transactions");

  await expect(page.getByRole("heading", { name: "Transactions" })).toBeVisible(
    { timeout: 15_000 }
  );

  await page.waitForTimeout(20_000);

  await expect(page.getByText("Failed to load transactions.")).toHaveCount(0);
});
