import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Joins conditional class names while resolving conflicting Tailwind utilities. */
export function mergeClasses(...values: ClassValue[]): string {
  return twMerge(clsx(values));
}
