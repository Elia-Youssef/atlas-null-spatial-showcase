import type { ScenePreset, ScenePresetId } from "@/types";

const SCENE_PRESETS = {
  index: {
    id: "index",
    label: "Origin sphere",
    accent: "#c6ff32",
    camera: { position: [0, 0.1, 7.8], lookAt: [0.75, 0, 0], fov: 41 },
    object: {
      position: [2.15, 0.02, 0],
      rotation: [0.22, -0.3, 0.08],
      scale: 1.22,
      morph: 0.21,
      spread: 1.72,
    },
    particleCount: 68,
  },
  work: {
    id: "work",
    label: "Fractured systems stack",
    accent: "#c6ff32",
    camera: { position: [0.3, 0.1, 8.2], lookAt: [0.8, 0, 0], fov: 39 },
    object: {
      position: [1.55, -0.15, -0.25],
      rotation: [0.5, 0.42, -0.16],
      scale: 1.7,
      morph: 0.36,
      spread: 2.75,
    },
    particleCount: 108,
  },
  helios: {
    id: "helios",
    label: "Exploded infrastructure layers",
    accent: "#fff36b",
    camera: { position: [0.1, 0.25, 8.8], lookAt: [0.45, 0, 0], fov: 37 },
    object: {
      position: [1.05, -0.15, -0.4],
      rotation: [0.92, -0.15, 0.36],
      scale: 1.8,
      morph: 0.58,
      spread: 3.6,
    },
    particleCount: 132,
  },
  capabilities: {
    id: "capabilities",
    label: "Aligned orbital mechanisms",
    accent: "#c6ff32",
    camera: { position: [-0.1, 0.1, 7.9], lookAt: [0.65, 0, 0], fov: 40 },
    object: {
      position: [1.25, 0, 0],
      rotation: [0.12, 0.65, 0.62],
      scale: 1.4,
      morph: 0.09,
      spread: 2.25,
    },
    particleCount: 96,
  },
  studio: {
    id: "studio",
    label: "Flowing wireframe helix",
    accent: "#a9ffd0",
    camera: { position: [0, 0, 8.4], lookAt: [0.85, 0, 0], fov: 38 },
    object: {
      position: [1.45, 0.15, -0.3],
      rotation: [0.25, -0.82, -0.22],
      scale: 1.65,
      morph: 0.7,
      spread: 2.25,
    },
    particleCount: 116,
  },
  contact: {
    id: "contact",
    label: "Converging signal core",
    accent: "#c6ff32",
    camera: { position: [0.15, -0.05, 7.2], lookAt: [0.9, 0, 0], fov: 43 },
    object: {
      position: [1.55, 0, 0.15],
      rotation: [0.44, 0.12, -0.45],
      scale: 1.25,
      morph: 0.28,
      spread: 0.9,
    },
    particleCount: 72,
  },
  system: {
    id: "system",
    label: "Component laboratory neutral",
    accent: "#c6ff32",
    camera: { position: [0, 0, 8], lookAt: [0.7, 0, 0], fov: 40 },
    object: {
      position: [1.3, 0, 0],
      rotation: [0.36, 0.36, 0],
      scale: 1.35,
      morph: 0.12,
      spread: 1.7,
    },
    particleCount: 80,
  },
} as const satisfies Record<ScenePresetId, ScenePreset>;

/** Read-only route preset catalogue. Prefer `getScenePreset` in application code. */
export const scenePresets: Readonly<Record<ScenePresetId, ScenePreset>> = SCENE_PRESETS;

/** Returns a scene preset by stable id. */
export function getScenePreset(id: ScenePresetId): ScenePreset {
  return scenePresets[id];
}

/** Resolves a pathname to the scene it should display. Unknown routes use index. */
export function getScenePresetIdForPathname(pathname: string): ScenePresetId {
  const normalizedPath = pathname.replace(/\/$/, "") || "/";

  // Suffix checks also support static exports hosted below a GitHub Pages base path.
  if (normalizedPath.endsWith("/work/helios")) return "helios";
  if (normalizedPath.endsWith("/work")) return "work";
  if (normalizedPath.endsWith("/capabilities")) return "capabilities";
  if (normalizedPath.endsWith("/studio")) return "studio";
  if (normalizedPath.endsWith("/contact")) return "contact";
  if (normalizedPath.endsWith("/system")) return "system";

  return "index";
}
