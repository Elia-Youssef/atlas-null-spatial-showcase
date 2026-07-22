"use client";

import {
  Children,
  useRef,
  type HTMLAttributes,
  type PointerEvent,
  type ReactNode,
} from "react";

import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from "motion/react";

import { mergeClasses } from "@/components/ui";

/** Direction from which reveal content enters. */
export type RevealDirection = "up" | "down" | "left" | "right" | "none";

/** Event that starts a reveal animation. */
export type RevealTrigger = "enter" | "mount";

const DIRECTION_OFFSET: Record<RevealDirection, { x: number; y: number }> = {
  up: { x: 0, y: 32 },
  down: { x: 0, y: -32 },
  left: { x: 32, y: 0 },
  right: { x: -32, y: 0 },
  none: { x: 0, y: 0 },
};

export interface RevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  trigger?: RevealTrigger;
  once?: boolean;
  onRevealComplete?: () => void;
}

/** Reveals semantic content on mount or viewport entry and collapses to no motion when requested. */
export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.65,
  onRevealComplete,
  once = true,
  trigger = "enter",
  ...props
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2, once });
  const shouldReduceMotion = useReducedMotion();
  const offset = shouldReduceMotion ? DIRECTION_OFFSET.none : DIRECTION_OFFSET[direction];
  const visible = trigger === "mount" || inView;

  return (
    <motion.div
      animate={visible ? { opacity: 1, x: 0, y: 0 } : undefined}
      className={className}
      // Server output must remain readable when hydration, Motion, or a browser
      // extension fails. Motion enhances position; it never owns visibility.
      initial={{ opacity: 1, ...offset }}
      onAnimationComplete={() => {
        if (visible) onRevealComplete?.();
      }}
      ref={ref}
      transition={{
        delay: shouldReduceMotion ? 0 : delay,
        duration: shouldReduceMotion ? 0 : duration,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export interface StaggerProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: ReactNode;
  interval?: number;
  initialDelay?: number;
  once?: boolean;
}

/** Coordinates a collection of child reveals without imposing visual styling. */
export function Stagger({
  children,
  className,
  initialDelay = 0,
  interval = 0.08,
  once = true,
  ...props
}: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.12, once });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={inView ? "visible" : "hidden"}
      className={className}
      initial="hidden"
      ref={ref}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: shouldReduceMotion ? 0 : initialDelay,
            staggerChildren: shouldReduceMotion ? 0 : interval,
          },
        },
      }}
      {...props}
    >
      {Children.map(children, (child) => (
        <motion.div
          variants={{
            hidden: { opacity: 1, y: shouldReduceMotion ? 0 : 22 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

export interface ParallaxLayerProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: ReactNode;
  intensity?: number;
  offset?: [number, number];
}

/** Moves a decorative layer against document scroll and remains static for reduced motion. */
export function ParallaxLayer({
  children,
  className,
  intensity = 0.15,
  offset = [48, -48],
  ...props
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [offset[0] * intensity, offset[1] * intensity],
  );

  return (
    <motion.div className={className} ref={ref} style={{ y }} {...props}>
      {children}
    </motion.div>
  );
}

export interface SpatialCardProps extends Omit<
  HTMLMotionProps<"div">,
  "children" | "onPointerLeave" | "onPointerMove"
> {
  children?: ReactNode;
  intensity?: number;
  glare?: boolean;
  disabled?: boolean;
  onPointerLeave?: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerMove?: (event: PointerEvent<HTMLDivElement>) => void;
}

/** Adds perspective tilt and a pointer-following highlight without hiding card content on touch. */
export function SpatialCard({
  children,
  className,
  disabled = false,
  glare = true,
  intensity = 8,
  onPointerLeave,
  onPointerMove,
  style,
  ...props
}: SpatialCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const rotateX = useSpring(useMotionValue(0), { stiffness: 180, damping: 22 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 180, damping: 22 });
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]) =>
      `radial-gradient(circle at ${String(x)}% ${String(y)}%, rgb(198 255 50 / 0.65), transparent 36%)`,
  );
  const staticMode = disabled || shouldReduceMotion;

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    onPointerMove?.(event);
    if (staticMode || event.pointerType === "touch") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    rotateX.set((0.5 - y) * intensity);
    rotateY.set((x - 0.5) * intensity);
    glareX.set(x * 100);
    glareY.set(y * 100);
  }

  function handlePointerLeave(event: PointerEvent<HTMLDivElement>) {
    onPointerLeave?.(event);
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(50);
  }

  return (
    <motion.div
      className={mergeClasses("relative transform-3d", className)}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      style={{
        ...style,
        rotateX: staticMode ? 0 : rotateX,
        rotateY: staticMode ? 0 : rotateY,
        transformPerspective: 900,
      }}
      {...props}
    >
      {children}
      {glare && !staticMode ? (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen transition-opacity duration-300 group-hover:opacity-25"
          style={{ background: glareBackground }}
        />
      ) : null}
    </motion.div>
  );
}

export interface PageStackProps extends HTMLAttributes<HTMLDivElement> {
  labels?: readonly string[];
  active?: boolean;
  phase?: "covering" | "revealing";
  onComplete?: () => void;
}

/** Renders the physical transition slabs used by the persistent route shell. */
export function PageStack({
  active = false,
  className,
  labels = ["ATLAS", "NULL", "SYSTEM"],
  onComplete,
  phase = "covering",
  ...props
}: PageStackProps) {
  const shouldReduceMotion = useReducedMotion();
  const visible = active && phase === "covering";

  return (
    <div
      aria-hidden="true"
      className={mergeClasses("pointer-events-none fixed inset-0 z-[90]", className)}
      {...props}
    >
      {labels.map((label, index) => (
        <motion.div
          animate={{
            clipPath: visible ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
            y: visible ? index * 8 : "4%",
          }}
          className="absolute inset-0 border-t border-[rgb(5_7_6/0.25)] bg-[var(--signal)] text-[var(--void)]"
          initial={false}
          key={label}
          onAnimationComplete={index === labels.length - 1 ? onComplete : undefined}
          style={{ zIndex: labels.length - index }}
          transition={{
            delay: shouldReduceMotion ? 0 : index * 0.07,
            duration: shouldReduceMotion ? 0 : 0.55,
            ease: [0.76, 0, 0.24, 1],
          }}
        >
          <span className="absolute bottom-5 left-[var(--page-gutter)] font-mono text-xs tracking-[0.18em]">
            0{index + 1} {"//"} {label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
