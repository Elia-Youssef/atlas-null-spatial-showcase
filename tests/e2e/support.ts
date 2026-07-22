/** All statically exported routes, including the unlisted component laboratory. */
export const routes = [
  "/",
  "/work/",
  "/work/helios/",
  "/capabilities/",
  "/studio/",
  "/contact/",
  "/system/",
] as const;

/** Resolves a route against the optional GitHub project Pages prefix used in CI. */
export function routeUrl(route: (typeof routes)[number] | string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${route}`;
}
