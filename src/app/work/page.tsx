import type { Metadata } from "next";
import { projects } from "@/content";
import { WorkIndex } from "@/features/work";
import { withBasePath } from "@/lib";

export const metadata: Metadata = {
  title: "Selected Systems",
  description: "Fictional spatial systems by ATLAS//NULL.",
  alternates: { canonical: withBasePath("/work/") },
};

export default function WorkPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <WorkIndex projects={projects} />
    </main>
  );
}
