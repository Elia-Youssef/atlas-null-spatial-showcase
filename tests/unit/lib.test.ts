import { afterEach, describe, expect, it, vi } from "vitest";

import {
  createDemoReceipt,
  createSeededRandom,
  getScenePreset,
  getScenePresetIdForPathname,
  interpolateScenePreset,
  isModifiedNavigationEvent,
  resolveQualityTier,
  validateTransmission,
  withBasePath,
} from "@/lib";
import type { QualityEnvironment, TransmissionPayload } from "@/types";

const fullQualityEnvironment: QualityEnvironment = {
  prefersReducedMotion: false,
  coarsePointer: false,
  viewportWidth: 1440,
  saveData: false,
  webglAvailable: true,
};

const validTransmission: TransmissionPayload = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  company: "Analytical Engine",
  brief: "We need a spatial system for an ambitious new platform.",
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("resolveQualityTier", () => {
  it("selects full quality for a capable desktop environment", () => {
    expect(resolveQualityTier(fullQualityEnvironment)).toBe("full");
  });

  it.each([
    ["coarse pointer", { coarsePointer: true }],
    ["save-data preference", { saveData: true }],
    ["narrow viewport", { viewportWidth: 767 }],
  ] as const)("selects lite quality for %s", (_label, override) => {
    expect(resolveQualityTier({ ...fullQualityEnvironment, ...override })).toBe("lite");
  });

  it.each([
    ["reduced motion", { prefersReducedMotion: true }],
    ["missing WebGL", { webglAvailable: false }],
  ] as const)("selects static quality for %s", (_label, override) => {
    expect(resolveQualityTier({ ...fullQualityEnvironment, ...override })).toBe("static");
  });

  it("keeps the documented tablet breakpoint in full quality", () => {
    expect(resolveQualityTier({ ...fullQualityEnvironment, viewportWidth: 768 })).toBe(
      "full",
    );
  });
});

describe("createSeededRandom", () => {
  it("produces deterministic sequences inside the unit interval", () => {
    const first = createSeededRandom(42);
    const second = createSeededRandom(42);
    const firstSequence = Array.from({ length: 8 }, first);
    const secondSequence = Array.from({ length: 8 }, second);

    expect(firstSequence).toEqual(secondSequence);
    expect(firstSequence.every((value) => value >= 0 && value < 1)).toBe(true);
  });

  it("uses the seed to vary procedural output", () => {
    expect(createSeededRandom(1)()).not.toBe(createSeededRandom(2)());
  });
});

describe("scene helpers", () => {
  it("maps routes and project Pages paths to stable scene identifiers", () => {
    expect(getScenePresetIdForPathname("/")).toBe("index");
    expect(getScenePresetIdForPathname("/work/helios/")).toBe("helios");
    expect(getScenePresetIdForPathname("/atlas-null/capabilities/")).toBe("capabilities");
    expect(getScenePresetIdForPathname("/unknown/")).toBe("index");
  });

  it("clamps interpolation to immutable endpoints", () => {
    const from = getScenePreset("index");
    const to = getScenePreset("helios");
    const fromSnapshot = structuredClone(from);
    const toSnapshot = structuredClone(to);

    expect(interpolateScenePreset(from, to, -1)).toEqual(from);
    const clampedEnd = interpolateScenePreset(from, to, 2);
    expect(clampedEnd.id).toBe(to.id);
    expect(clampedEnd.object.position[1]).toBeCloseTo(to.object.position[1]);
    expect(clampedEnd.object.spread).toBeCloseTo(to.object.spread);
    expect(from).toEqual(fromSnapshot);
    expect(to).toEqual(toSnapshot);
  });

  it("interpolates visual values and changes identity at halfway", () => {
    const from = getScenePreset("index");
    const to = getScenePreset("work");
    const midpoint = interpolateScenePreset(from, to, 0.5);

    expect(midpoint.id).toBe("work");
    expect(midpoint.camera.fov).toBe((from.camera.fov + to.camera.fov) / 2);
    expect(midpoint.object.position[0]).toBe(
      (from.object.position[0] + to.object.position[0]) / 2,
    );
  });
});

describe("navigation helpers", () => {
  it("recognizes modified and non-primary navigation", () => {
    const primaryClick = {
      button: 0,
      metaKey: false,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
    };

    expect(isModifiedNavigationEvent(primaryClick)).toBe(false);
    expect(isModifiedNavigationEvent({ ...primaryClick, ctrlKey: true })).toBe(true);
    expect(isModifiedNavigationEvent({ ...primaryClick, metaKey: true })).toBe(true);
    expect(isModifiedNavigationEvent({ ...primaryClick, button: 1 })).toBe(true);
  });

  it("prefixes root-relative paths and preserves other URL forms", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/atlas-null");

    expect(withBasePath("/work/")).toBe("/atlas-null/work/");
    expect(withBasePath("https://example.com/work/")).toBe("https://example.com/work/");
    expect(withBasePath("#chapter")).toBe("#chapter");
  });
});

describe("transmission helpers", () => {
  it("accepts a complete transmission", () => {
    expect(validateTransmission(validTransmission)).toEqual({});
  });

  it("returns field-specific errors for invalid required content", () => {
    expect(
      validateTransmission({
        name: "A",
        email: "not-an-email",
        brief: "Too short",
      }),
    ).toEqual({
      name: expect.any(String),
      email: expect.any(String),
      brief: expect.any(String),
    });
  });

  it("creates stable local receipts without echoing personal data", () => {
    const first = createDemoReceipt(validTransmission);
    const second = createDemoReceipt(validTransmission);

    expect(first).toEqual(second);
    expect(first).toMatchObject({
      success: true,
      receiptId: expect.stringMatching(/^AN-[0-9A-F]{8}$/),
    });
    expect(first.message).toMatch(/no information left this browser/i);
    expect(JSON.stringify(first)).not.toContain(validTransmission.email);
  });
});
