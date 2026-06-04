import { expect, test } from "@playwright/test";
import { freshUser, registerViaUI } from "./_fixtures";

test.describe("task CRUD + filters", () => {
  test("create, complete, edit, and delete a task", async ({ page }) => {
    const user = freshUser("crud");
    await registerViaUI(page, user);

    await page.goto("/tasks/new");
    await page.locator("input[name=title]").fill("Buy groceries");
    await page.locator("textarea[name=description]").fill("milk, eggs, bread");
    await page.getByRole("button", { name: /create task/i }).click();
    await expect(page).toHaveURL(/\/tasks$/);

    const row = page.locator("li", { hasText: "Buy groceries" });
    await expect(row).toBeVisible();

    await row.getByRole("checkbox").check();
    await expect(row).toContainText(/Completed/i);

    await row.getByRole("link", { name: /edit/i }).first().click();
    await page.locator("input[name=title]").fill("Buy groceries (updated)");
    await page.getByRole("button", { name: /save changes/i }).click();
    await expect(page).toHaveURL(/\/tasks$/);
    await expect(
      page.locator("li", { hasText: "Buy groceries (updated)" }),
    ).toBeVisible();

    const updatedRow = page.locator("li", { hasText: "Buy groceries (updated)" });
    await updatedRow.getByRole("button", { name: /Actions for/i }).click();
    await page.getByRole("menuitem", { name: /delete/i }).click();
    await page.getByRole("button", { name: /^delete$/i }).click();
    await expect(
      page.locator("li", { hasText: "Buy groceries (updated)" }),
    ).toHaveCount(0);
  });

  test("filter by status and search by title", async ({ page }) => {
    const user = freshUser("filter");
    await registerViaUI(page, user);

    for (const title of ["Alpha task", "Beta task", "Gamma task"]) {
      await page.goto("/tasks/new");
      await page.locator("input[name=title]").fill(title);
      await page.getByRole("button", { name: /create task/i }).click();
      await expect(page).toHaveURL(/\/tasks$/);
    }

    await page.locator('input[type="search"]').fill("Beta");
    await expect(page.locator("li", { hasText: "Beta task" })).toBeVisible();
    await expect(page.locator("li", { hasText: "Alpha task" })).toHaveCount(0);

    await page.getByRole("button", { name: /clear filters/i }).click();
    await expect(page.locator("li", { hasText: "Alpha task" })).toBeVisible();

    await expect(page.locator("li").filter({ hasText: /task$/i })).toHaveCount(3);
  });

  test("sort by priority surfaces High tasks first", async ({ page }) => {
    const user = freshUser("sort");
    await registerViaUI(page, user);

    const tasks: Array<{ title: string; priority: "Low" | "Medium" | "High" }> = [
      { title: "Low item", priority: "Low" },
      { title: "High item", priority: "High" },
      { title: "Medium item", priority: "Medium" },
    ];

    for (const t of tasks) {
      await page.goto("/tasks/new");
      await page.locator("input[name=title]").fill(t.title);
      await page.locator("select").first().selectOption(t.priority);
      await page.getByRole("button", { name: /create task/i }).click();
      await expect(page).toHaveURL(/\/tasks$/);
    }

    const sortSelect = page.locator("label:has-text('Sort by') + select, label:has-text('Sort by') select").first();
    await sortSelect.selectOption("priority");

    const firstTitle = page.locator("ul > li").first();
    await expect(firstTitle).toContainText("High item");
  });
});
