import type { ScenePreset, Vector3Tuple } from "@/types";

function clampProgress(progress: number): number {
  return Math.min(1, Math.max(0, progress));
}

function interpolateNumber(from: number, to: number, progress: number): number {
  return from + (to - from) * progress;
}

function interpolateVector(
  from: Vector3Tuple,
  to: Vector3Tuple,
  progress: number,
): Vector3Tuple {
  return [
    interpolateNumber(from[0], to[0], progress),
    interpolateNumber(from[1], to[1], progress),
    interpolateNumber(from[2], to[2], progress),
  ];
}

/**
 * Produces a new scene state between two immutable presets.
 * Identifying metadata changes at halfway while every visual value interpolates.
 */
export function interpolateScenePreset(
  from: ScenePreset,
  to: ScenePreset,
  progress: number,
): ScenePreset {
  const amount = clampProgress(progress);
  const metadata = amount < 0.5 ? from : to;

  return {
    id: metadata.id,
    label: metadata.label,
    accent: metadata.accent,
    camera: {
      position: interpolateVector(from.camera.position, to.camera.position, amount),
      lookAt: interpolateVector(from.camera.lookAt, to.camera.lookAt, amount),
      fov: interpolateNumber(from.camera.fov, to.camera.fov, amount),
    },
    object: {
      position: interpolateVector(from.object.position, to.object.position, amount),
      rotation: interpolateVector(from.object.rotation, to.object.rotation, amount),
      scale: interpolateNumber(from.object.scale, to.object.scale, amount),
      morph: interpolateNumber(from.object.morph, to.object.morph, amount),
      spread: interpolateNumber(from.object.spread, to.object.spread, amount),
    },
    particleCount: Math.round(
      interpolateNumber(from.particleCount, to.particleCount, amount),
    ),
  };
}
