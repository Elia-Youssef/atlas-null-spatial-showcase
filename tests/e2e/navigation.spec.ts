import { expect, test, type Page, type Request } from "@playwright/test";

import { routes, routeUrl } from "./support";

const nonDocumentVisualTypes = new Set(["font", "image", "media"]);

function isUnexpectedVisualRequest(request: Request, origin: string): boolean {
  if (!nonDocumentVisualTypes.has(request.resourceType())) {
    return false;
  }

  return new URL(request.url()).origin !== origin;
}

async function internalLinks(page: Page): Promise<string[]> {
  return page.locator('a[href]:not([href^="#"])').evaluateAll((anchors) =>
    anchors
      .map((anchor) => (anchor as HTMLAnchorElement).href)
      .filter((href) => {
        const url = new URL(href);
        return url.origin === window.location.origin && !url.hash;
      }),
  );
}

async function visibleWorkLink(page: Page) {
  let workLink = page.locator('a[href$="/work/"]:visible').first();

  if ((await workLink.count()) === 0) {
    const menuButton = page.getByRole("button", { name: /menu|navigation/i }).first();
    await menuButton.click();
    workLink = page.locator('a[href$="/work/"]:visible').first();
  }

  return workLink;
}

test("primary navigation preserves browser history", async ({ page }) => {
  await page.goto(routeUrl("/"));

  const workLink = await visibleWorkLink(page);
  await expect(workLink).toBeVisible();
  await workLink.click();
  await expect(page).toHaveURL(/\/work\/$/);
  await expect(page.locator("main")).toBeVisible();

  await page.goBack({ waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("main")).toBeVisible();
});

test("all same-origin navigation targets resolve", async ({ page, request }) => {
  const links: string[] = [];

  for (const route of routes) {
    await page.goto(routeUrl(route), { waitUntil: "domcontentloaded" });
    links.push(...(await internalLinks(page)));
  }

  expect(links.length).toBeGreaterThan(0);

  for (const href of new Set(links)) {
    const response = await request.get(href);
    expect(response.ok(), `Broken internal link: ${href}`).toBe(true);
  }
});

test("the experience does not fetch external visual assets", async ({ page, baseURL }) => {
  const origin = new URL(baseURL ?? "http://127.0.0.1:3000").origin;
  const externalRequests: string[] = [];

  page.on("request", (request) => {
    if (isUnexpectedVisualRequest(request, origin)) {
      externalRequests.push(request.url());
    }
  });

  for (const route of ["/", "/work/", "/work/helios/", "/capabilities/", "/studio/"]) {
    await page.goto(routeUrl(route), { waitUntil: "domcontentloaded" });
    await expect(page.locator("main")).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
  }

  expect(externalRequests).toEqual([]);
});

test("modified navigation keeps native new-tab behavior", async ({
  page,
  context,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Desktop browser modifier contract.");

  await page.goto(routeUrl("/"));
  const workLink = await visibleWorkLink(page);

  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    workLink.click({ modifiers: [process.platform === "darwin" ? "Meta" : "Control"] }),
  ]);

  await newPage.waitForLoadState("domcontentloaded");
  await expect(newPage).toHaveURL(/\/work\/$/);
  await expect(page).toHaveURL(/\/$/);
});
