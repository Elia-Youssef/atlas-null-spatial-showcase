import { getScenePreset } from "@/lib/scene-presets";
import type { ScenePreset } from "@/types";
import { ProceduralPoster } from "./procedural-poster";
import styles from "./world.module.css";

/** Props for the non-WebGL world replacement. */
export interface WorldFallbackProps {
  preset?: ScenePreset;
  seed?: number;
  reason?: "static-quality" | "context-lost" | "renderer-error";
  className?: string;
  accessibleLabel?: string;
}

/**
 * Preserves the visual composition when realtime rendering is unavailable.
 * The reason label is visual metadata and is hidden from assistive technology.
 */
export function WorldFallback({
  preset = getScenePreset("index"),
  seed,
  reason = "static-quality",
  className,
  accessibleLabel,
}: WorldFallbackProps) {
  const classNames = [styles.fallback, className].filter(Boolean).join(" ");
  const status = {
    "static-quality": "STATIC RENDER / ACCESSIBLE MODE",
    "context-lost": "RENDER CONTEXT / RECOVERING",
    "renderer-error": "STATIC RENDER / SYSTEM FALLBACK",
  }[reason];

  return (
    <div className={classNames}>
      <ProceduralPoster preset={preset} seed={seed} accessibleLabel={accessibleLabel} />
      <span className={styles.fallbackStatus} aria-hidden="true">
        {status}
      </span>
    </div>
  );
}
