"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export interface PointerField {
  x: number;
  y: number;
  active: boolean;
  finePointer: boolean;
}

/** Tracks normalized pointer position with a single passive window listener. */
export function usePointerField(): PointerField {
  const [field, setField] = useState<PointerField>({
    x: 0,
    y: 0,
    active: false,
    finePointer: false,
  });

  useEffect(() => {
    const pointerQuery = window.matchMedia("(pointer: fine)");

    function updatePointerCapability() {
      setField((current) => ({ ...current, finePointer: pointerQuery.matches }));
    }

    function handlePointerMove(event: PointerEvent) {
      setField({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * -2 + 1,
        active: true,
        finePointer: pointerQuery.matches,
      });
    }

    function handlePointerLeave() {
      setField((current) => ({ ...current, active: false }));
    }

    updatePointerCapability();
    pointerQuery.addEventListener("change", updatePointerCapability);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      pointerQuery.removeEventListener("change", updatePointerCapability);
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return field;
}

export interface ReducedEffectsState {
  reducedMotion: boolean;
  coarsePointer: boolean;
  narrowViewport: boolean;
  saveData: boolean;
  reduceEffects: boolean;
}

/** Combines browser preferences that should select the lighter visual experience. */
export function useReducedEffects(): ReducedEffectsState {
  const [state, setState] = useState<ReducedEffectsState>({
    reducedMotion: false,
    coarsePointer: false,
    narrowViewport: false,
    saveData: false,
    reduceEffects: false,
  });

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia("(pointer: coarse)");
    const viewportQuery = window.matchMedia("(max-width: 767px)");

    function readPreferences() {
      const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection;
      const nextState = {
        reducedMotion: motionQuery.matches,
        coarsePointer: pointerQuery.matches,
        narrowViewport: viewportQuery.matches,
        saveData: Boolean(connection?.saveData),
        reduceEffects: false,
      };
      nextState.reduceEffects =
        nextState.reducedMotion ||
        nextState.coarsePointer ||
        nextState.narrowViewport ||
        nextState.saveData;
      setState(nextState);
    }

    readPreferences();
    motionQuery.addEventListener("change", readPreferences);
    pointerQuery.addEventListener("change", readPreferences);
    viewportQuery.addEventListener("change", readPreferences);

    return () => {
      motionQuery.removeEventListener("change", readPreferences);
      pointerQuery.removeEventListener("change", readPreferences);
      viewportQuery.removeEventListener("change", readPreferences);
    };
  }, []);

  return state;
}

export interface ScrollProgressOptions {
  startOffset?: number;
  endOffset?: number;
}

/** Returns clamped progress through an element without requiring a smooth-scroll provider. */
export function useScrollProgress<TElement extends HTMLElement>(
  options: ScrollProgressOptions = {},
): { ref: RefObject<TElement | null>; progress: number } {
  const ref = useRef<TElement>(null);
  const [progress, setProgress] = useState(0);
  const { endOffset = 0, startOffset = 0 } = options;

  useEffect(() => {
    let animationFrame = 0;

    function measure() {
      const element = ref.current;
      if (!element) return;

      const bounds = element.getBoundingClientRect();
      const start = window.innerHeight - startOffset;
      const distance = window.innerHeight + bounds.height - startOffset - endOffset;
      const nextProgress = Math.min(
        1,
        Math.max(0, (start - bounds.top) / Math.max(distance, 1)),
      );
      setProgress(nextProgress);
    }

    function handleScroll() {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(measure);
    }

    measure();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [endOffset, startOffset]);

  return { ref, progress };
}
