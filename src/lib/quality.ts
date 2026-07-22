import type { QualityEnvironment, QualityTier } from "@/types";

/** Selects the safest render tier without hiding meaningful HTML content. */
export function resolveQualityTier(environment: QualityEnvironment): QualityTier {
  if (environment.prefersReducedMotion || !environment.webglAvailable) {
    return "static";
  }

  if (
    environment.coarsePointer ||
    environment.saveData ||
    environment.viewportWidth < 768
  ) {
    return "lite";
  }

  return "full";
}
