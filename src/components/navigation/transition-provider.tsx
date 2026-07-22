"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { NavigateOptions, TransitionController, TransitionPhase } from "@/types";
import styles from "./navigation.module.css";

const DEFAULT_DURATION = 900;
const WATCHDOG_BUFFER = 900;

const TransitionContext = createContext<TransitionController | null>(null);

function wait(duration: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

export interface TransitionProviderProps {
  children: ReactNode;
  duration?: number;
  disabled?: boolean;
  onPhaseChange?: (phase: TransitionPhase) => void;
}

/**
 * Coordinates route navigation with the physical page-stack transition.
 * Native browser behavior remains intact for modified and external links.
 */
export function TransitionProvider({
  children,
  duration = DEFAULT_DURATION,
  disabled = false,
  onPhaseChange,
}: TransitionProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const completionRef = useRef<(() => void) | null>(null);
  const previousPathRef = useRef(pathname);
  const watchdogRef = useRef<number | null>(null);

  const completeTransition = useCallback(() => {
    setPhase("idle");
    setTargetPath(null);
    document.body.style.removeProperty("overflow");
    document.body.removeAttribute("data-transitioning");

    if (watchdogRef.current !== null) {
      window.clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
    }

    completionRef.current?.();
    completionRef.current = null;
  }, []);

  const navigate = useCallback(
    async (href: string, options: NavigateOptions = {}): Promise<void> => {
      if (phase !== "idle" || href === pathname) {
        return;
      }

      if (disabled || prefersReducedMotion) {
        if (options.replace) {
          router.replace(href, { scroll: options.scroll ?? true });
        } else {
          router.push(href, { scroll: options.scroll ?? true });
        }
        return;
      }

      const completion = new Promise<void>((resolve) => {
        completionRef.current = resolve;
      });

      setTargetPath(href);
      document.body.style.overflow = "hidden";
      document.body.setAttribute("data-transitioning", "true");
      setPhase("covering");

      watchdogRef.current = window.setTimeout(
        completeTransition,
        duration + WATCHDOG_BUFFER,
      );

      await wait(duration * 0.66);
      setPhase("navigating");

      if (options.replace) {
        router.replace(href, { scroll: false });
      } else {
        router.push(href, { scroll: false });
      }

      await completion;
    },
    [completeTransition, disabled, duration, pathname, phase, prefersReducedMotion, router],
  );

  useEffect(() => {
    onPhaseChange?.(phase);
  }, [onPhaseChange, phase]);

  useEffect(() => {
    const pathChanged = previousPathRef.current !== pathname;
    previousPathRef.current = pathname;

    if (!pathChanged || phase !== "navigating") {
      return;
    }

    setPhase("revealing");
    window.scrollTo({ top: 0, behavior: "instant" });

    const focusTimer = window.setTimeout(() => {
      const main = document.querySelector<HTMLElement>("main");
      main?.setAttribute("tabindex", "-1");
      main?.focus({ preventScroll: true });
    }, 50);

    const completionTimer = window.setTimeout(completeTransition, duration * 0.34);

    return () => {
      window.clearTimeout(focusTimer);
      window.clearTimeout(completionTimer);
    };
  }, [completeTransition, duration, pathname, phase]);

  useEffect(() => completeTransition, [completeTransition]);

  const controller = useMemo<TransitionController>(
    () => ({ phase, isTransitioning: phase !== "idle", navigate }),
    [navigate, phase],
  );

  return (
    <TransitionContext value={controller}>
      {children}
      <PageStack phase={phase} pathname={targetPath ?? pathname} />
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {phase === "revealing" ? `Opened ${pathname}` : ""}
      </p>
    </TransitionContext>
  );
}

/** Returns the active route transition controller. */
export function useRouteTransition(): TransitionController {
  const controller = useContext(TransitionContext);

  if (!controller) {
    throw new Error("useRouteTransition must be used within TransitionProvider.");
  }

  return controller;
}

interface PageStackProps {
  phase: TransitionPhase;
  pathname: string;
}

/** Decorative transition slabs that create the physical page-stack illusion. */
export function PageStack({ phase, pathname }: PageStackProps) {
  const visible = phase !== "idle";
  const routeLabel = pathname.replaceAll("/", " ").trim() || "INDEX";

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className={styles.stack}
          data-phase={phase}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-hidden="true"
        >
          {["FIELD", "SYSTEM", routeLabel].map((label, index) => (
            <motion.div
              className={styles.slab}
              key={`${label}-${index}`}
              initial={{ y: "112%", rotateX: -14, scale: 0.92 }}
              animate={
                phase === "revealing"
                  ? { y: index * -12 - 116, rotateX: 3, scale: 0.94 - index * 0.015 }
                  : { y: index * -12, rotateX: 0, scale: 1 - index * 0.015 }
              }
              exit={{
                y: "-120%",
                rotateX: 5,
                scale: 0.9,
                transition: { duration: 0.22, ease: [0.76, 0, 0.24, 1] },
              }}
              transition={{
                duration: 0.46,
                delay: index * 0.05,
                ease: [0.76, 0, 0.24, 1],
              }}
              style={{ zIndex: index + 1 }}
            >
              <span>ATLAS//NULL</span>
              <span>{label.toUpperCase()}</span>
              <span>{String(index + 1).padStart(2, "0")}</span>
            </motion.div>
          ))}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
