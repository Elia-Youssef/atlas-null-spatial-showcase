"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type PointerEvent,
  type ReactNode,
} from "react";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type HTMLMotionProps,
} from "motion/react";

import { TransitionLink } from "@/components/navigation";

import { mergeClasses } from "./utils";

/** Supported visual treatments for button and link actions. */
export type ActionVariant = "signal" | "outline" | "quiet";

/** Shared action dimensions used by buttons and links. */
export type ActionSize = "small" | "medium" | "large";

function actionClasses(variant: ActionVariant, size: ActionSize): string {
  return mergeClasses(
    "group relative inline-flex min-h-11 items-center justify-center overflow-hidden font-mono text-[0.68rem] font-medium uppercase tracking-[0.14em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-75",
    size === "small" && "px-4 py-2.5",
    size === "medium" && "px-6 py-3.5",
    size === "large" && "min-h-14 px-8 py-4",
    variant === "signal" &&
      "atlas-action-signal border border-[var(--signal)] bg-[var(--signal)] hover:bg-transparent",
    variant === "outline" &&
      "border border-[var(--line)] bg-[rgb(5_7_6/0.3)] text-[var(--paper)] hover:border-[var(--signal)] hover:text-[var(--signal)]",
    variant === "quiet" &&
      "border-b border-[var(--line)] px-0 text-[var(--paper)] hover:border-[var(--signal)] hover:text-[var(--signal)]",
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ActionVariant;
  size?: ActionSize;
  loading?: boolean;
  leadingIcon?: ReactNode;
}

/** Renders a tactile action with explicit loading and disabled semantics. */
export function Button({
  children,
  className,
  disabled,
  leadingIcon,
  loading = false,
  size = "medium",
  type = "button",
  variant = "signal",
  ...props
}: ButtonProps) {
  return (
    <button
      aria-busy={loading || undefined}
      className={mergeClasses(actionClasses(variant, size), className)}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="mr-2 size-2 animate-pulse rounded-full bg-current"
        />
      ) : (
        leadingIcon
      )}
      <span>{loading ? "Processing" : children}</span>
      <span
        aria-hidden="true"
        className="ml-4 transition-transform duration-200 group-hover:translate-x-1"
      >
        ↗
      </span>
    </button>
  );
}

export interface ActionLinkProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> {
  href: string;
  variant?: ActionVariant;
  size?: ActionSize;
  external?: boolean;
}

/** Presents a navigation action while preserving native anchor behavior. */
export function ActionLink({
  children,
  className,
  external = false,
  href,
  size = "medium",
  variant = "outline",
  ...props
}: ActionLinkProps) {
  const isExternal =
    external || props.target === "_blank" || /^(?:https?:|mailto:|tel:)/.test(href);
  const content = (
    <>
      <span>{children}</span>
      <span
        aria-hidden="true"
        className="ml-4 transition-transform duration-200 group-hover:translate-x-1"
      >
        ↗
      </span>
    </>
  );

  if (!isExternal) {
    return (
      <TransitionLink
        className={mergeClasses(actionClasses(variant, size), className)}
        href={href}
        {...props}
      >
        {content}
      </TransitionLink>
    );
  }

  return (
    <a
      className={mergeClasses(actionClasses(variant, size), className)}
      href={href}
      rel={external ? "noreferrer" : props.rel}
      target={external ? "_blank" : props.target}
      {...props}
    >
      {content}
    </a>
  );
}

export interface MagneticSurfaceProps extends Omit<
  HTMLMotionProps<"div">,
  "children" | "onPointerLeave" | "onPointerMove"
> {
  children?: ReactNode;
  strength?: number;
  disabled?: boolean;
  onPointerLeave?: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerMove?: (event: PointerEvent<HTMLDivElement>) => void;
}

/** Adds restrained pointer attraction while leaving touch and reduced-motion input static. */
export function MagneticSurface({
  children,
  className,
  disabled = false,
  onPointerLeave,
  onPointerMove,
  strength = 18,
  style,
  ...props
}: MagneticSurfaceProps) {
  const shouldReduceMotion = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 22 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 22 });

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    onPointerMove?.(event);
    if (disabled || shouldReduceMotion || event.pointerType === "touch") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    x.set(((event.clientX - bounds.left) / bounds.width - 0.5) * strength);
    y.set(((event.clientY - bounds.top) / bounds.height - 0.5) * strength);
  }

  function handlePointerLeave(event: PointerEvent<HTMLDivElement>) {
    onPointerLeave?.(event);
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      className={className}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      style={{ ...style, x, y }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export interface TextScrambleProps extends HTMLAttributes<HTMLSpanElement> {
  text: string;
  active?: boolean;
  duration?: number;
  characters?: string;
}

/** Scrambles toward a supplied label and always exposes the final text to assistive technology. */
export function TextScramble({
  active = true,
  characters = "01/\\[]{}<>+*",
  className,
  duration = 420,
  text,
  ...props
}: TextScrambleProps) {
  const id = useId();
  const previousText = useRef(text);
  const [displayText, setDisplayText] = useState(text);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!active || shouldReduceMotion || previousText.current === text) {
      setDisplayText(text);
      previousText.current = text;
      return;
    }

    const controls = animate(0, text.length, {
      duration: duration / 1000,
      ease: "easeOut",
      onUpdate(value) {
        const settledLength = Math.floor(value);
        const scrambled = Array.from(text, (character, index) => {
          if (character === " " || index < settledLength) return character;
          return characters[Math.floor(Math.random() * characters.length)] ?? character;
        }).join("");
        setDisplayText(scrambled);
      },
      onComplete() {
        setDisplayText(text);
        previousText.current = text;
      },
    });

    return () => controls.stop();
  }, [active, characters, duration, shouldReduceMotion, text]);

  return (
    <span
      aria-labelledby={id}
      className={mergeClasses("inline-block", className)}
      {...props}
    >
      <span aria-hidden="true">{displayText}</span>
      <span className="sr-only" id={id}>
        {text}
      </span>
    </span>
  );
}
