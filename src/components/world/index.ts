/** Persistent world state, controller, and hook. */
export {
  WorldProvider,
  useWorld,
  type WorldContextValue,
  type WorldProviderProps,
} from "./world-provider";

/** Realtime canvas with automatic quality and recovery behavior. */
export {
  WorldCanvas,
  type WorldCanvasProps,
  type WorldFallbackReason,
} from "./world-canvas";

/** Low-level procedural scene for controlled R3F compositions. */
export { SceneObject, type SceneObjectProps } from "./scene-object";

/** CSS-only visual used for previews and resilient rendering. */
export { ProceduralPoster, type ProceduralPosterProps } from "./procedural-poster";

/** Explicit static fallback for inaccessible or failed WebGL contexts. */
export { WorldFallback, type WorldFallbackProps } from "./world-fallback";

/** Route scene catalogue and lookup helpers. */
export {
  getScenePreset,
  getScenePresetIdForPathname,
  scenePresets,
} from "@/lib/scene-presets";

/** Pure numeric interpolation between immutable route scene states. */
export { interpolateScenePreset } from "@/lib/scene-interpolation";

/** Shared public contracts consumed by controllers and scene components. */
export type {
  QualityTier,
  ScenePreset,
  ScenePresetId,
  Vector3Tuple,
  WorldController,
} from "@/types";
