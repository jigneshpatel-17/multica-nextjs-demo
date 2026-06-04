import { expect, type Page } from "@playwright/test";

export interface E2EUser {
  name: string;
  email: string;
  password: string;
}

export function freshUser(label = "user"): E2EUser {
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    name: `${label} ${stamp}`,
    email: `${label}+${stamp}@example.com`,
    password: "supersecret1",
  };
}

export async function registerViaUI(page: Page, user: E2EUser): Promise<void> {
  await page.goto("/register");
  await page.locator("input[name=name]").fill(user.name);
  await page.locator("input[name=email]").fill(user.email);
  await page.locator("input[name=password]").fill(user.password);
  await page.locator("input[name=confirmPassword]").fill(user.password);
  await page.getByRole("button", { name: /create account/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

export async function loginViaUI(page: Page, user: E2EUser): Promise<void> {
  await page.goto("/login");
  await page.locator("input[name=email]").fill(user.email);
  await page.locator("input[name=password]").fill(user.password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}
