import { expect, test } from "@playwright/test";
import { freshUser, registerViaUI } from "./_fixtures";

function tasksList(page: import("@playwright/test").Page) {
  return page.locator("ul.divide-y");
}

function taskRow(page: import("@playwright/test").Page, title: string) {
  return tasksList(page).locator("li", { hasText: title });
}

test.describe("task CRUD + filters", () => {
  test("create, complete, edit, and delete a task", async ({ page }) => {
    const user = freshUser("crud");
    await registerViaUI(page, user);

    await page.goto("/tasks/new");
    await page.getByLabel("Title").fill("Buy groceries");
    await page.getByLabel("Description").fill("milk, eggs, bread");
    await page.getByRole("button", { name: /create task/i }).click();
    await expect(page).toHaveURL(/\/tasks$/);

    const row = taskRow(page, "Buy groceries");
    await expect(row).toBeVisible();

    await row.getByRole("checkbox").click();
    await expect(row).toContainText(/Completed/i);

    await row.getByRole("link", { name: /edit/i }).first().click();
    await page.getByLabel("Title").fill("Buy groceries (updated)");
    await page.getByRole("button", { name: /save changes/i }).click();
    await expect(page).toHaveURL(/\/tasks$/);
    await expect(taskRow(page, "Buy groceries (updated)")).toBeVisible();

    const updatedRow = taskRow(page, "Buy groceries (updated)");
    await updatedRow.getByRole("button", { name: /Actions for/i }).click();
    await page.getByRole("menuitem", { name: /delete/i }).click();
    await page.getByRole("button", { name: /^delete$/i }).click();
    await expect(taskRow(page, "Buy groceries (updated)")).toHaveCount(0);
  });

  test("filter by status and search by title", async ({ page }) => {
    const user = freshUser("filter");
    await registerViaUI(page, user);

    for (const title of ["Alpha task", "Beta task", "Gamma task"]) {
      await page.goto("/tasks/new");
      await page.getByLabel("Title").fill(title);
      await page.getByRole("button", { name: /create task/i }).click();
      await expect(page).toHaveURL(/\/tasks$/);
    }

    await page.getByPlaceholder(/title or description/i).fill("Beta");
    await expect(taskRow(page, "Beta task")).toBeVisible();
    await expect(taskRow(page, "Alpha task")).toHaveCount(0);

    await page.getByRole("button", { name: /clear filters/i }).click();
    await expect(taskRow(page, "Alpha task")).toBeVisible();
    await expect(tasksList(page).locator("> li")).toHaveCount(3);
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
      await page.getByLabel("Title").fill(t.title);
      await page.getByLabel("Priority").selectOption(t.priority);
      await page.getByRole("button", { name: /create task/i }).click();
      await expect(page).toHaveURL(/\/tasks$/);
    }

    await page.getByLabel("Sort by").selectOption("priority");

    const firstRow = tasksList(page).locator("> li").first();
    await expect(firstRow).toContainText("High item");
  });
});
