import { describe, expect, it } from "vitest";

import { componentRegistry } from "@/content";
import type { ComponentSpec } from "@/types";

const publicCategories: readonly ComponentSpec["category"][] = [
  "foundation",
  "action",
  "motion",
  "navigation",
  "world",
  "form",
  "feature",
];

describe("componentRegistry", () => {
  it("documents every supported public component category", () => {
    expect(new Set(componentRegistry.map((spec) => spec.category))).toEqual(
      new Set(publicCategories),
    );
  });

  it("contains stable, unique, and usable documentation records", () => {
    const ids = componentRegistry.map((spec) => spec.id);

    expect(new Set(ids).size).toBe(ids.length);
    for (const spec of componentRegistry) {
      expect(spec.name.length).toBeGreaterThan(0);
      expect(spec.importPath).toMatch(/^@\//);
      expect(spec.states.length).toBeGreaterThan(0);
      expect(spec.accessibility.length).toBeGreaterThan(0);
    }
  });
});
