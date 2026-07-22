"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";
import { WorldCanvas, WorldProvider } from "@/components/world";
import { CustomCursor } from "./custom-cursor";
import { SiteHeader } from "./site-header";
import { TransitionLink } from "./transition-link";
import { TransitionProvider } from "./transition-provider";
import styles from "./site-shell.module.css";

export interface SiteShellProps {
  children: ReactNode;
}

function SmoothScrollController() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");

    if (reducedMotion.matches || !finePointer.matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
    });
    let animationFrame = 0;

    const update = (time: number) => {
      lenis.raf(time);
      animationFrame = window.requestAnimationFrame(update);
    };

    animationFrame = window.requestAnimationFrame(update);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      lenis.destroy();
    };
  }, []);

  return null;
}

/**
 * Persistent application surface containing navigation, route choreography,
 * progressive scrolling and the shared procedural world.
 */
export function SiteShell({ children }: SiteShellProps) {
  return (
    <WorldProvider>
      <TransitionProvider>
        <SmoothScrollController />
        <div className={styles.worldLayer}>
          <WorldCanvas />
        </div>
        <div className={styles.interfaceLayer}>
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
        <CustomCursor />
      </TransitionProvider>
    </WorldProvider>
  );
}

/** Compact global footer that keeps contact and system documentation discoverable. */
export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div>
        <span className={styles.footerBrand}>ATLAS//NULL</span>
        <p>Fictional spatial systems studio. Built as a production demonstration.</p>
      </div>
      <nav aria-label="Footer navigation">
        <TransitionLink href="/work/">Systems</TransitionLink>
        <TransitionLink href="/contact/">Signal</TransitionLink>
      </nav>
      <p className={styles.footerStatus}>
        <span aria-hidden="true" /> FIELD ONLINE · 2026
      </p>
    </footer>
  );
}
