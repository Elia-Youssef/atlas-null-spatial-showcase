"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation } from "@/content";
import { TransitionLink } from "./transition-link";
import styles from "./navigation.module.css";

/** Persistent site header with an accessible full-screen navigation system. */
export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const activeItem = navigation.find((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
  );

  return (
    <>
      <header className={styles.header}>
        <TransitionLink className={styles.brand} href="/" aria-label="ATLAS NULL home">
          <span>ATLAS</span>
          <span className={styles.signal}>{"//"}</span>
          <span>NULL</span>
        </TransitionLink>

        <div className={styles.routeStatus} aria-hidden="true">
          <span>{activeItem?.index ?? "00"}</span>
          <span>{activeItem?.label ?? "Index"}</span>
        </div>

        <button
          className={styles.menuButton}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>{menuOpen ? "Close" : "Menu"}</span>
          <span className={styles.menuGlyph} data-open={menuOpen} aria-hidden="true" />
        </button>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <NavigationOverlay pathname={pathname} onDismiss={() => setMenuOpen(false)} />
        ) : null}
      </AnimatePresence>
    </>
  );
}

export interface NavigationOverlayProps {
  pathname: string;
  onDismiss(): void;
}

/** Full-screen route index with staggered spatial entrances. */
export function NavigationOverlay({ pathname, onDismiss }: NavigationOverlayProps) {
  return (
    <motion.nav
      id="site-navigation"
      className={styles.navigationOverlay}
      aria-label="Primary navigation"
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      animate={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className={styles.menuMeta}>
        <span>NAVIGATION FIELD</span>
        <span>05 ACTIVE NODES</span>
      </div>

      <ol className={styles.menuList}>
        {navigation.map((item, index) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <motion.li
              key={item.href}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 + index * 0.07, duration: 0.5 }}
            >
              <TransitionLink
                className={styles.menuLink}
                data-active={active}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={onDismiss}
              >
                <span>{item.index}</span>
                <strong>{item.label}</strong>
                <span aria-hidden="true">↗</span>
              </TransitionLink>
            </motion.li>
          );
        })}
      </ol>

      <div className={styles.menuFooter}>
        <span>BEIRUT · 33.8938° N</span>
        <span>AVAILABLE FOR SELECT SYSTEMS</span>
      </div>
    </motion.nav>
  );
}
