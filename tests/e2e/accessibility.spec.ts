import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { routes, routeUrl } from "./support";

test.describe("accessibility", () => {
  for (const route of routes) {
    test(`${route} has no serious accessibility violations`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(routeUrl(route), { waitUntil: "domcontentloaded" });
      await expect(page.locator("main")).toBeVisible();

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      const releaseBlockingViolations = results.violations.filter(
        (violation) => violation.impact === "critical" || violation.impact === "serious",
      );

      expect(releaseBlockingViolations).toEqual([]);
    });
  }
});

test("skip navigation moves focus to the primary content", async ({ page }) => {
  await page.goto(routeUrl("/"));
  await page.keyboard.press("Tab");

  const skipLink = page.getByRole("link", { name: /skip to content/i });
  await expect(skipLink).toBeFocused();
  await skipLink.press("Enter");

  await expect(page.locator("#main-content")).toBeFocused();
});
