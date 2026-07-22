"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { resolveQualityTier } from "@/lib/quality";
import { getScenePreset, getScenePresetIdForPathname } from "@/lib/scene-presets";
import type {
  QualityEnvironment,
  QualityTier,
  ScenePreset,
  ScenePresetId,
  WorldController,
} from "@/types";

type QualitySelection = QualityTier | "auto";

interface NavigatorWithConnection extends Navigator {
  connection?: { readonly saveData?: boolean };
}

/** Extended renderer state available to world components and external controls. */
export interface WorldContextValue extends WorldController {
  preset: ScenePreset;
  isPaused: boolean;
  cameraRevision: number;
}

/** Configuration for the persistent world state owner. */
export interface WorldProviderProps {
  children: ReactNode;
  initialPresetId?: ScenePresetId;
  initialQuality?: QualitySelection;
  syncWithRoute?: boolean;
}

const WorldContext = createContext<WorldContextValue | null>(null);

function canCreateWebGLContext(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function readQualityEnvironment(): QualityEnvironment {
  const navigatorWithConnection: NavigatorWithConnection = navigator;

  return {
    prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    coarsePointer: window.matchMedia("(pointer: coarse)").matches,
    viewportWidth: window.innerWidth,
    saveData: navigatorWithConnection.connection?.saveData ?? false,
    webglAvailable: canCreateWebGLContext(),
  };
}

function resolveInitialQuality(selection: QualitySelection): QualityTier {
  // Auto mode starts at the deterministic CSS tier on both server and client.
  // Capability detection upgrades it immediately after hydration without mismatch.
  return selection === "auto" ? "static" : selection;
}

/**
 * Owns the selected scene, device quality, pause state, and imperative controller.
 * Route synchronization is enabled by default and can be disabled for laboratories.
 */
export function WorldProvider({
  children,
  initialPresetId = "index",
  initialQuality = "auto",
  syncWithRoute = true,
}: WorldProviderProps) {
  const pathname = usePathname();
  const [presetId, setPresetId] = useState<ScenePresetId>(initialPresetId);
  const [qualitySelection, setQualitySelection] =
    useState<QualitySelection>(initialQuality);
  const [quality, setResolvedQuality] = useState<QualityTier>(() =>
    resolveInitialQuality(initialQuality),
  );
  const [isPaused, setIsPaused] = useState(false);
  const [cameraRevision, setCameraRevision] = useState(0);

  useEffect(() => {
    if (syncWithRoute) {
      // The route is an external source of truth; copy it into the imperative controller.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPresetId(getScenePresetIdForPathname(pathname));
    }
  }, [pathname, syncWithRoute]);

  useEffect(() => {
    if (qualitySelection !== "auto") {
      return;
    }

    const updateQuality = () => {
      setResolvedQuality(resolveQualityTier(readQualityEnvironment()));
    };
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerCapability = window.matchMedia("(pointer: coarse)");

    updateQuality();
    window.addEventListener("resize", updateQuality, { passive: true });
    motionPreference.addEventListener("change", updateQuality);
    pointerCapability.addEventListener("change", updateQuality);

    return () => {
      window.removeEventListener("resize", updateQuality);
      motionPreference.removeEventListener("change", updateQuality);
      pointerCapability.removeEventListener("change", updateQuality);
    };
  }, [qualitySelection]);

  const setQuality = useCallback((tier: QualitySelection) => {
    setQualitySelection(tier);
    if (tier !== "auto") setResolvedQuality(tier);
  }, []);

  const resetCamera = useCallback(() => {
    setCameraRevision((revision) => revision + 1);
  }, []);

  const controller = useMemo<WorldContextValue>(
    () => ({
      presetId,
      preset: getScenePreset(presetId),
      quality,
      isPaused,
      cameraRevision,
      setPreset: setPresetId,
      setQuality,
      pause: () => setIsPaused(true),
      resume: () => setIsPaused(false),
      resetCamera,
    }),
    [cameraRevision, isPaused, presetId, quality, resetCamera, setQuality],
  );

  return <WorldContext.Provider value={controller}>{children}</WorldContext.Provider>;
}

/**
 * Returns the persistent world controller and current render state.
 * Must be used below `WorldProvider` so state never silently diverges.
 */
export function useWorld(): WorldContextValue {
  const context = useContext(WorldContext);

  if (!context) {
    throw new Error("useWorld must be used within a WorldProvider.");
  }

  return context;
}
