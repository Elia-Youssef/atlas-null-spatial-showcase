"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import styles from "./navigation.module.css";

/** Fine-pointer cursor treatment that disappears for touch and reduced-motion users. */
export function CustomCursor() {
  const pointerX = useMotionValue(-100);
  const pointerY = useMotionValue(-100);
  const x = useSpring(pointerX, { damping: 26, stiffness: 360, mass: 0.32 });
  const y = useSpring(pointerY, { damping: 26, stiffness: 360, mass: 0.32 });
  const [enabled, setEnabled] = useState(false);
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateAvailability = () => {
      setEnabled(finePointer.matches && !reducedMotion.matches);
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
      const target = event.target instanceof Element ? event.target : null;
      setInteractive(Boolean(target?.closest("a, button, input, textarea, select")));
    };

    updateAvailability();
    finePointer.addEventListener("change", updateAvailability);
    reducedMotion.addEventListener("change", updateAvailability);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      finePointer.removeEventListener("change", updateAvailability);
      reducedMotion.removeEventListener("change", updateAvailability);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [pointerX, pointerY]);

  if (!enabled) {
    return null;
  }

  return (
    <motion.div
      className={styles.cursor}
      data-interactive={interactive}
      style={{ x, y }}
      aria-hidden="true"
    >
      <span />
    </motion.div>
  );
}
