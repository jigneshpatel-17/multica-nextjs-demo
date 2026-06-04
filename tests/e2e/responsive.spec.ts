import { expect, test } from "@playwright/test";
import { freshUser, registerViaUI } from "./_fixtures";

test.describe("responsive smoke", () => {
  test("/login renders without horizontal scroll", async ({ page, viewport }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
    const width = viewport?.width ?? 0;
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(width + 1);
  });

  test("/dashboard renders for authenticated user", async ({ page, viewport }) => {
    const user = freshUser(`vp${viewport?.width ?? 0}`);
    await registerViaUI(page, user);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const width = viewport?.width ?? 0;
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(width + 1);
  });
});
