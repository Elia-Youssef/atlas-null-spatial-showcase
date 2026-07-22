import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { mergeClasses } from "./utils";

type LayoutElement = "div" | "section" | "main" | "article" | "nav" | "aside";
type HeadingElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface PolymorphicLayoutProps extends ComponentPropsWithoutRef<"div"> {
  as?: LayoutElement;
}

export interface ContainerProps extends PolymorphicLayoutProps {
  /** Controls the maximum readable width while retaining the site gutter. */
  size?: "content" | "wide" | "full";
}

/** Centers page content on the shared responsive gutter. */
export function Container({
  as: Tag = "div",
  className,
  size = "wide",
  ...props
}: ContainerProps) {
  return (
    <Tag
      className={mergeClasses(
        "mx-auto w-full px-[var(--page-gutter)]",
        size === "content" && "max-w-5xl",
        size === "wide" && "max-w-[112rem]",
        size === "full" && "max-w-none",
        className,
      )}
      {...props}
    />
  );
}

export interface SectionProps extends PolymorphicLayoutProps {
  /** Applies a consistent vertical rhythm without preventing local overrides. */
  spacing?: "compact" | "default" | "cinematic";
}

/** Provides a semantic, consistently spaced page section. */
export function Section({
  as: Tag = "section",
  className,
  spacing = "default",
  ...props
}: SectionProps) {
  return (
    <Tag
      className={mergeClasses(
        spacing === "compact" && "py-12 md:py-16",
        spacing === "default" && "py-20 md:py-28",
        spacing === "cinematic" && "py-28 md:py-44",
        className,
      )}
      {...props}
    />
  );
}

export interface GridProps extends PolymorphicLayoutProps {
  columns?: 1 | 2 | 3 | 4 | 12;
  gap?: "none" | "small" | "default" | "large";
}

/** Renders the responsive layout grid used throughout the site. */
export function Grid({
  as: Tag = "div",
  className,
  columns = 12,
  gap = "default",
  ...props
}: GridProps) {
  return (
    <Tag
      className={mergeClasses(
        "grid",
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-1 md:grid-cols-2",
        columns === 3 && "grid-cols-1 md:grid-cols-3",
        columns === 4 && "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
        columns === 12 && "grid-cols-4 md:grid-cols-12",
        gap === "small" && "gap-2 md:gap-3",
        gap === "default" && "gap-4 md:gap-6",
        gap === "large" && "gap-8 md:gap-12",
        className,
      )}
      {...props}
    />
  );
}

export interface HeadingProps extends ComponentPropsWithoutRef<"h2"> {
  as?: HeadingElement;
  size?: "small" | "medium" | "large" | "hero";
  balance?: boolean;
}

/** Displays editorial headings with the ATLAS//NULL scale and tracking. */
export function Heading({
  as: Tag = "h2",
  balance = true,
  className,
  size = "large",
  ...props
}: HeadingProps) {
  return (
    <Tag
      className={mergeClasses(
        "m-0 font-medium uppercase tracking-[-0.055em]",
        balance && "text-balance",
        size === "small" && "text-2xl leading-[0.95] md:text-3xl",
        size === "medium" && "text-4xl leading-[0.9] md:text-6xl",
        size === "large" && "text-5xl leading-[0.85] md:text-8xl",
        size === "hero" && "text-[clamp(3.35rem,12.5vw,13.5rem)] leading-[0.76]",
        className,
      )}
      {...props}
    />
  );
}

export interface EyebrowProps extends ComponentPropsWithoutRef<"p"> {
  marker?: string;
}

/** Introduces a section with compact technical metadata. */
export function Eyebrow({ children, className, marker = "//", ...props }: EyebrowProps) {
  return (
    <p
      className={mergeClasses(
        "m-0 flex items-center gap-2 font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[var(--muted)]",
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="text-[var(--signal)]">
        {marker}
      </span>
      {children}
    </p>
  );
}

export interface SystemLabelProps extends ComponentPropsWithoutRef<"span"> {
  index?: string;
}

/** Labels a system, route, or coordinate using the interface mono style. */
export function SystemLabel({ children, className, index, ...props }: SystemLabelProps) {
  return (
    <span
      className={mergeClasses(
        "inline-flex items-center gap-2 font-mono text-[0.64rem] uppercase tracking-[0.16em] text-[var(--muted)]",
        className,
      )}
      {...props}
    >
      {index ? <span className="text-[var(--signal)]">{index}</span> : null}
      {children}
    </span>
  );
}

export interface StatusBadgeProps extends ComponentPropsWithoutRef<"span"> {
  status?: "online" | "standby" | "offline";
  pulse?: boolean;
}

/** Announces compact system status with both text and a non-essential visual indicator. */
export function StatusBadge({
  children,
  className,
  pulse = true,
  status = "online",
  ...props
}: StatusBadgeProps) {
  const label = children ?? status;

  return (
    <span
      className={mergeClasses(
        "inline-flex min-h-8 items-center gap-2 border border-[var(--line)] px-3 font-mono text-[0.62rem] uppercase tracking-[0.14em]",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={mergeClasses(
          "size-1.5 rounded-full",
          status === "online" && "bg-[var(--signal)]",
          status === "standby" && "bg-amber-300",
          status === "offline" && "bg-[var(--muted)]",
          pulse && status === "online" && "animate-pulse",
        )}
      />
      {label as ReactNode}
    </span>
  );
}

/** Type helper for callers building polymorphic component registries. */
export type SupportedLayoutElement = ElementType;
