import type { Metadata } from "next";
import { ProceduralPoster } from "@/components/world";
import { componentRegistry } from "@/content";
import { SystemLab } from "@/features/system";
import { getScenePreset, withBasePath } from "@/lib";

export const metadata: Metadata = {
  title: "Component System",
  description: "The public ATLAS//NULL component and interaction laboratory.",
  robots: { index: false, follow: false },
  alternates: { canonical: withBasePath("/system/") },
};

export default function SystemPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <SystemLab
        registry={componentRegistry}
        worldExample={
          <div style={{ position: "relative", aspectRatio: "16 / 7", overflow: "hidden" }}>
            <ProceduralPoster preset={getScenePreset("system")} seed={2_026} />
          </div>
        }
      />
    </main>
  );
}
