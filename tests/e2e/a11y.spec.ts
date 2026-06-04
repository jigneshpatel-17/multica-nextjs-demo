import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { freshUser, registerViaUI } from "./_fixtures";

const a11yTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

async function scan(page: import("@playwright/test").Page) {
  return new AxeBuilder({ page }).withTags(a11yTags).analyze();
}

test.describe("a11y smoke (axe-core)", () => {
  test("/login has no serious accessibility violations", async ({ page }) => {
    await page.goto("/login");
    const r = await scan(page);
    const blocking = r.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(blocking, blocking.map((v) => v.id).join(", ")).toEqual([]);
  });

  test("/dashboard and /tasks have no serious accessibility violations", async ({ page }) => {
    const user = freshUser("a11y");
    await registerViaUI(page, user);

    const dash = await scan(page);
    const dashBlocking = dash.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(dashBlocking, dashBlocking.map((v) => v.id).join(", ")).toEqual([]);

    await page.goto("/tasks");
    const tasks = await scan(page);
    const tasksBlocking = tasks.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(tasksBlocking, tasksBlocking.map((v) => v.id).join(", ")).toEqual([]);
  });
});
