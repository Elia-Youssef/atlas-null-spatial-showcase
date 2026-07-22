import type { Metadata } from "next";
import { heliosCaseStudy, projects } from "@/content";
import { HeliosNarrative } from "@/features/helios";
import { withBasePath } from "@/lib";

export const metadata: Metadata = {
  title: "HELIOS/01",
  description: "A fictional city-scale energy digital twin concept study.",
  alternates: { canonical: withBasePath("/work/helios/") },
};

const heliosProject = projects[0];

export default function HeliosPage() {
  if (!heliosProject) {
    return null;
  }

  return (
    <main id="main-content" tabIndex={-1}>
      <HeliosNarrative caseStudy={heliosCaseStudy} project={heliosProject} />
    </main>
  );
}
