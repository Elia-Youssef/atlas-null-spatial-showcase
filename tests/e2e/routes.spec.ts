import { expect, test, type Page } from "@playwright/test";

import { componentRegistry } from "@/content";

import { routes, routeUrl } from "./support";

const viewportMatrix = [
  { label: "mobile", width: 375, height: 812 },
  { label: "tablet", width: 768, height: 1024 },
  { label: "desktop", width: 1440, height: 900 },
] as const;

interface RuntimeGuard {
  consoleErrors: string[];
  pageErrors: string[];
}

interface OverflowReport {
  overflow: number;
  offenders: string[];
}

function observeRuntime(page: Page): RuntimeGuard {
  const guard: RuntimeGuard = { consoleErrors: [], pageErrors: [] };

  page.on("console", (message) => {
    if (message.type() === "error") {
      guard.consoleErrors.push(message.text());
    }
  });

  page.on("pageerror", (error) => {
    guard.pageErrors.push(error.message);
  });

  return guard;
}

async function measureHorizontalOverflow(page: Page): Promise<OverflowReport> {
  return page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    const overflow = Math.max(0, document.documentElement.scrollWidth - viewportWidth);
    const offenders = Array.from(document.querySelectorAll<HTMLElement>("body *"))
      .filter((element) => {
        const bounds = element.getBoundingClientRect();
        return bounds.left < -1 || bounds.right > viewportWidth + 1;
      })
      .slice(0, 5)
      .map((element) => {
        const bounds = element.getBoundingClientRect();
        const name = element.className || element.tagName.toLowerCase();
        return `${name}: ${Math.round(bounds.left)}..${Math.round(bounds.right)}`;
      });

    return { overflow, offenders };
  });
}

test.describe("static routes", () => {
  for (const viewport of viewportMatrix) {
    for (const route of routes) {
      test(`${route} renders cleanly at ${viewport.label} width`, async ({
        page,
      }, testInfo) => {
        test.skip(
          testInfo.project.name !== "desktop",
          "The viewport matrix runs once in CI.",
        );

        await page.setViewportSize(viewport);
        const runtime = observeRuntime(page);

        const response = await page.goto(routeUrl(route), {
          waitUntil: "domcontentloaded",
        });

        expect(response?.ok(), `Expected a successful response for ${route}`).toBe(true);
        await expect(page.locator("main")).toBeVisible();
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await expect(page).toHaveTitle(/ATLAS\/{2}NULL/i);
        await page.evaluate(() => document.fonts.ready);

        const layout = await measureHorizontalOverflow(page);

        expect(
          layout.overflow,
          `Horizontal overflow on ${route} at ${viewport.width}px. Candidates: ${layout.offenders.join(" | ")}`,
        ).toBeLessThanOrEqual(1);
        expect(runtime.pageErrors, `Unhandled errors on ${route}`).toEqual([]);
        expect(runtime.consoleErrors, `Console errors on ${route}`).toEqual([]);
      });
    }
  }
});

test("the component laboratory is excluded from indexing", async ({ page }) => {
  await page.goto(routeUrl("/system/"));

  const robots = page.locator('meta[name="robots"]');
  await expect(robots).toHaveAttribute("content", /noindex/i);

  for (const spec of componentRegistry) {
    await expect(page.getByRole("heading", { level: 2, name: spec.name })).toBeVisible();
  }
});

test("the sitemap advertises public routes but not the component laboratory", async ({
  request,
}) => {
  const response = await request.get(routeUrl("/sitemap.xml"));
  expect(response.ok()).toBe(true);

  const sitemap = await response.text();
  expect(sitemap).toContain("/work/helios");
  expect(sitemap).toContain("/capabilities");
  expect(sitemap).not.toContain("/system");
});
