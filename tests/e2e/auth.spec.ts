import { expect, test } from "@playwright/test";
import { freshUser, loginViaUI, registerViaUI } from "./_fixtures";

test.describe("auth flows", () => {
  test("guest can register, lands on dashboard, sees welcome", async ({ page }) => {
    const user = freshUser("reg");
    await registerViaUI(page, user);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Welcome back/i);
  });

  test("registered user can log out then log back in", async ({ page }) => {
    const user = freshUser("login");
    await registerViaUI(page, user);

    await page.getByRole("button", { name: /account menu/i }).click();
    await page.getByRole("menuitem", { name: /sign out/i }).click();
    await expect(page).toHaveURL(/\/login/);

    await loginViaUI(page, user);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Welcome back/i);
  });

  test("unauthenticated visit to /tasks redirects to /login", async ({ page }) => {
    await page.goto("/tasks");
    await expect(page).toHaveURL(/\/login/);
  });

  test("login surfaces error on wrong credentials", async ({ page }) => {
    await page.goto("/login");
    await page.locator("input[name=email]").fill("nobody@example.com");
    await page.locator("input[name=password]").fill("wrongpw1");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByRole("alert").first()).toContainText(/Invalid credentials/i);
    await expect(page).toHaveURL(/\/login/);
  });
});
