/** Returns true when a pointer event should preserve the browser's native link behavior. */
export function isModifiedNavigationEvent(
  event: Pick<MouseEvent, "button" | "metaKey" | "ctrlKey" | "shiftKey" | "altKey">,
): boolean {
  return (
    event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
  );
}

/** Prefixes root-relative assets for project-based GitHub Pages deployments. */
export function withBasePath(path: string): string {
  if (!path.startsWith("/")) {
    return path;
  }

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${basePath}${path}`;
}
