import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import type { UserRole } from "../src/types";

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  analyst: "Analyst",
  support: "Support",
};

async function loginAs(page: Page, role: UserRole) {
  await page.goto("/login");
  await page
    .getByRole("radio", { name: new RegExp(ROLE_LABELS[role], "i") })
    .check();
  await page
    .getByRole("button", { name: `Continue as ${ROLE_LABELS[role]}` })
    .click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe("authentication", () => {
  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(
      page.getByRole("heading", { name: "Sign in to Pulse" })
    ).toBeVisible();
  });

  test("analyst login shows analytics nav and hides live feed", async ({
    page,
  }) => {
    await loginAs(page, "analyst");

    await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Transactions" })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Analytics" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Live Feed" })).toHaveCount(0);
  });

  test("support login shows live feed and hides analytics", async ({
    page,
  }) => {
    await loginAs(page, "support");

    await expect(page.getByRole("link", { name: "Live Feed" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Analytics" })).toHaveCount(0);
  });
});

test.describe("transactions", () => {
  test("status filter reduces matching count", async ({ page }) => {
    await loginAs(page, "analyst");
    await page.goto("/transactions");

    await expect(
      page.getByRole("heading", { name: "Transactions" })
    ).toBeVisible();

    const countText = page.getByText(/\d[\d,]* transactions? matching/);
    await expect(countText).toBeVisible({ timeout: 15_000 });
    const initialCount = await countText.textContent();

    await page.getByLabel("Status").selectOption("settled");
    await expect(countText).not.toHaveText(initialCount ?? "", {
      timeout: 15_000,
    });
    await expect(countText).toContainText("matching");
  });

  test("has no critical accessibility violations", async ({ page }) => {
    await loginAs(page, "analyst");
    await page.goto("/transactions");

    await expect(
      page.getByRole("heading", { name: "Transactions" })
    ).toBeVisible();
    await expect(page.getByLabel("Search")).toBeVisible();

    const results = await new AxeBuilder({ page })
      .disableRules(["color-contrast"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});

test.describe("live feed", () => {
  test("shows connected state and receives events", async ({ page }) => {
    await loginAs(page, "support");
    await page.goto("/live");

    await expect(
      page.getByRole("heading", { name: "Live Feed" })
    ).toBeVisible();
    await expect(page.getByText("Connected")).toBeVisible();

    await expect(page.locator(".font-mono").first()).toBeVisible({
      timeout: 15_000,
    });
  });
});
