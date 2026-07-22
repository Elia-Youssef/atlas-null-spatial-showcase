"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { isModifiedNavigationEvent } from "@/lib";
import { useRouteTransition } from "./transition-provider";

export interface TransitionLinkProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> {
  href: string;
  children: ReactNode;
  replace?: boolean;
  scroll?: boolean;
}

function shouldUseNativeNavigation(href: string, target?: string): boolean {
  return (
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    target === "_blank"
  );
}

/** Next.js link that opts internal navigation into the site transition controller. */
export function TransitionLink({
  href,
  children,
  replace,
  scroll,
  onClick,
  target,
  ...anchorProps
}: TransitionLinkProps) {
  const pathname = usePathname();
  const { isTransitioning, navigate } = useRouteTransition();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      shouldUseNativeNavigation(href, target) ||
      isModifiedNavigationEvent(event.nativeEvent)
    ) {
      return;
    }

    if (href === pathname || isTransitioning) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    void navigate(href, { replace, scroll });
  };

  return (
    <Link
      {...anchorProps}
      href={href}
      onClick={handleClick}
      target={target}
      aria-disabled={isTransitioning || undefined}
    >
      {children}
    </Link>
  );
}
