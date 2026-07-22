import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const routes = ["", "/work", "/work/helios", "/capabilities", "/studio", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

  return routes.map((route, index) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: index === 0 ? "monthly" : "yearly",
    priority: index === 0 ? 1 : route === "/work/helios" ? 0.9 : 0.8,
  }));
}
