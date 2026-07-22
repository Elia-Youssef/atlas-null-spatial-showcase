import type { CSSProperties } from "react";
import { createSeededRandom } from "@/lib/random";
import { getScenePreset } from "@/lib/scene-presets";
import type { ScenePreset } from "@/types";
import styles from "./world.module.css";

interface PosterStyle extends CSSProperties {
  "--poster-accent": string;
  "--poster-rotation": string;
  "--poster-core-rotation": string;
  "--poster-scale": string;
}

interface ShardStyle extends CSSProperties {
  "--shard-angle": string;
  "--shard-length": string;
  "--shard-opacity": number;
  "--shard-distance": string;
}

/** Props for the deterministic CSS representation of a world preset. */
export interface ProceduralPosterProps {
  preset?: ScenePreset;
  seed?: number;
  className?: string;
  accessibleLabel?: string;
}

/**
 * Renders a deterministic, asset-free scene poster using CSS geometry.
 * It works without JavaScript hydration or WebGL and can be labelled as an image.
 */
export function ProceduralPoster({
  preset = getScenePreset("index"),
  seed = 4_731,
  className,
  accessibleLabel,
}: ProceduralPosterProps) {
  const random = createSeededRandom(seed);
  const posterStyle: PosterStyle = {
    "--poster-accent": preset.accent,
    "--poster-rotation": `${preset.object.rotation[2] * 70}deg`,
    "--poster-core-rotation": `${preset.object.rotation[1] * 48}deg`,
    "--poster-scale": `${0.72 + preset.object.scale * 0.18}`,
  };
  const classNames = [styles.poster, className].filter(Boolean).join(" ");
  const shards = Array.from({ length: 14 }, (_, index) => {
    const shardStyle: ShardStyle = {
      "--shard-angle": `${index * (360 / 14) + random() * 18}deg`,
      "--shard-length": `${2.4 + random() * 8}rem`,
      "--shard-opacity": 0.12 + random() * 0.46,
      "--shard-distance": `${5.4 + preset.object.spread * 2.2 + random() * 3}rem`,
    };

    return <span key={index} className={styles.posterShard} style={shardStyle} />;
  });

  return (
    <div
      className={classNames}
      style={posterStyle}
      role={accessibleLabel ? "img" : undefined}
      aria-label={accessibleLabel}
      aria-hidden={accessibleLabel ? undefined : true}
    >
      <span className={styles.posterGlow} />
      <span className={styles.posterCore} />
      {shards}
    </div>
  );
}
