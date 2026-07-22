/** Stable identifiers for the persistent world states used by public routes. */
export type ScenePresetId =
  "index" | "work" | "helios" | "capabilities" | "studio" | "contact" | "system";

/** Rendering tiers selected from user preference and device capability. */
export type QualityTier = "full" | "lite" | "static";

export type Vector3Tuple = readonly [x: number, y: number, z: number];

export interface ScenePreset {
  id: ScenePresetId;
  label: string;
  accent: string;
  camera: {
    position: Vector3Tuple;
    lookAt: Vector3Tuple;
    fov: number;
  };
  object: {
    position: Vector3Tuple;
    rotation: Vector3Tuple;
    scale: number;
    morph: number;
    spread: number;
  };
  particleCount: number;
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  code: string;
  slug: string;
  title: string;
  summary: string;
  discipline: string;
  year: string;
  href?: string;
  accent: string;
  posterVariant: "radial" | "strata" | "signal";
  metrics: readonly ProjectMetric[];
}

export interface CaseStudyChapter {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  body: string;
  metric?: ProjectMetric;
}

export interface CaseStudy {
  id: string;
  projectId: string;
  title: string;
  synopsis: string;
  chapters: readonly CaseStudyChapter[];
}

export interface Capability {
  id: string;
  index: string;
  title: string;
  summary: string;
  details: readonly string[];
  scenePreset: ScenePresetId;
}

export interface NavigationItem {
  label: string;
  href: string;
  index: string;
  scenePreset: ScenePresetId;
}

export interface TransmissionPayload {
  name: string;
  email: string;
  company?: string;
  brief: string;
  budget?: string;
  timeline?: string;
}

export interface SubmissionResult {
  success: boolean;
  message: string;
  receiptId?: string;
}

export type SubmissionAdapter = (payload: TransmissionPayload) => Promise<SubmissionResult>;

export interface ComponentSpec {
  id: string;
  name: string;
  category:
    "foundation" | "action" | "motion" | "navigation" | "world" | "form" | "feature";
  description: string;
  importPath: string;
  exports: readonly string[];
  contracts: readonly string[];
  states: readonly string[];
  accessibility: string;
}

export type TransitionPhase = "idle" | "covering" | "navigating" | "revealing";

export interface NavigateOptions {
  replace?: boolean;
  scroll?: boolean;
}

export interface TransitionController {
  phase: TransitionPhase;
  isTransitioning: boolean;
  navigate(href: string, options?: NavigateOptions): Promise<void>;
}

export interface QualityEnvironment {
  prefersReducedMotion: boolean;
  coarsePointer: boolean;
  viewportWidth: number;
  saveData: boolean;
  webglAvailable: boolean;
}

export interface WorldController {
  presetId: ScenePresetId;
  quality: QualityTier;
  setPreset(id: ScenePresetId): void;
  setQuality(tier: QualityTier | "auto"): void;
  pause(): void;
  resume(): void;
  resetCamera(): void;
}

export interface TransmissionFormHandle {
  reset(): void;
  focusFirstInvalid(): void;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  brief?: string;
}
