"use client";

import {
  Component,
  useCallback,
  useEffect,
  useState,
  type ErrorInfo,
  type ReactNode,
} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import type { QualityTier, ScenePreset } from "@/types";
import { SceneObject } from "./scene-object";
import { WorldFallback } from "./world-fallback";
import { useWorld } from "./world-provider";
import styles from "./world.module.css";

/** Reasons passed to `WorldCanvas.onFallback`. */
export type WorldFallbackReason = "static-quality" | "context-lost" | "renderer-error";

/** Public configuration for the persistent WebGL stage. */
export interface WorldCanvasProps {
  className?: string;
  preset?: ScenePreset;
  quality?: QualityTier;
  paused?: boolean;
  seed?: number;
  fallback?: ReactNode;
  onReady?: () => void;
  onFallback?: (reason: WorldFallbackReason, error?: Error) => void;
}

interface WorldErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
  onError: (error: Error) => void;
}

interface WorldErrorBoundaryState {
  hasError: boolean;
}

class WorldErrorBoundary extends Component<
  WorldErrorBoundaryProps,
  WorldErrorBoundaryState
> {
  state: WorldErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): WorldErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    void errorInfo;
    this.props.onError(error);
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

interface CanvasLifecycleProps {
  onContextLost: () => void;
  onContextRestored: () => void;
}

function CanvasLifecycle({ onContextLost, onContextRestored }: CanvasLifecycleProps) {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      onContextLost();
    };

    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
    };
  }, [gl, onContextLost, onContextRestored]);

  return null;
}

interface WorldSceneProps {
  preset: ScenePreset;
  quality: QualityTier;
  paused: boolean;
  seed: number;
  cameraRevision: number;
  onContextLost: () => void;
  onContextRestored: () => void;
}

function WorldScene({
  preset,
  quality,
  paused,
  seed,
  cameraRevision,
  onContextLost,
  onContextRestored,
}: WorldSceneProps) {
  return (
    <>
      <CanvasLifecycle
        onContextLost={onContextLost}
        onContextRestored={onContextRestored}
      />
      <SceneObject
        preset={preset}
        quality={quality}
        paused={paused}
        seed={seed}
        cameraRevision={cameraRevision}
      />
      {quality === "full" ? (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.48}
            luminanceThreshold={0.58}
            luminanceSmoothing={0.34}
            mipmapBlur
          />
        </EffectComposer>
      ) : null}
    </>
  );
}

/**
 * Mounts the persistent React Three Fiber scene and its recovery surface.
 * Requires `WorldProvider`; static quality never initializes a WebGL context.
 */
export function WorldCanvas({
  className,
  preset: controlledPreset,
  quality: controlledQuality,
  paused = false,
  seed = 4_731,
  fallback,
  onReady,
  onFallback,
}: WorldCanvasProps) {
  const world = useWorld();
  const { setPreset, setQuality } = world;
  const [documentHidden, setDocumentHidden] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const preset = controlledPreset ?? world.preset;
  const quality = controlledQuality ?? world.quality;
  const isPaused = paused || world.isPaused || documentHidden || contextLost;
  const classNames = [styles.world, className].filter(Boolean).join(" ");
  const staticFallback = fallback ?? (
    <WorldFallback preset={preset} seed={seed} reason="static-quality" />
  );
  const errorFallback = fallback ?? (
    <WorldFallback preset={preset} seed={seed} reason="renderer-error" />
  );

  useEffect(() => {
    if (controlledPreset) setPreset(controlledPreset.id);
  }, [controlledPreset, setPreset]);

  useEffect(() => {
    if (controlledQuality) setQuality(controlledQuality);
  }, [controlledQuality, setQuality]);

  useEffect(() => {
    const handleVisibility = () => {
      setDocumentHidden(document.visibilityState !== "visible");
    };

    handleVisibility();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    if (quality === "static") onFallback?.("static-quality");
  }, [onFallback, quality]);

  const handleContextLost = useCallback(() => {
    setContextLost(true);
    onFallback?.("context-lost");
  }, [onFallback]);

  const handleContextRestored = useCallback(() => {
    setContextLost(false);
    onReady?.();
  }, [onReady]);

  const handleRendererError = useCallback(
    (error: Error) => {
      onFallback?.("renderer-error", error);
    },
    [onFallback],
  );

  if (quality === "static") {
    return <div className={classNames}>{staticFallback}</div>;
  }

  return (
    <div className={classNames} aria-hidden="true">
      <WorldErrorBoundary fallback={errorFallback} onError={handleRendererError}>
        <Canvas
          className={styles.canvas}
          dpr={quality === "full" ? [1, 1.5] : 1}
          frameloop={isPaused ? "never" : "always"}
          camera={{ position: preset.camera.position, fov: preset.camera.fov }}
          gl={{
            alpha: true,
            antialias: quality === "full",
            powerPreference: "high-performance",
            stencil: false,
          }}
          fallback={errorFallback}
          onCreated={({ gl }) => {
            gl.setClearColor("#050706", 0);
            onReady?.();
          }}
        >
          <WorldScene
            preset={preset}
            quality={quality}
            paused={isPaused}
            seed={seed}
            cameraRevision={world.cameraRevision}
            onContextLost={handleContextLost}
            onContextRestored={handleContextRestored}
          />
        </Canvas>
      </WorldErrorBoundary>
      <div className={styles.canvasVeil} />
      {contextLost
        ? (fallback ?? <WorldFallback preset={preset} seed={seed} reason="context-lost" />)
        : null}
    </div>
  );
}
