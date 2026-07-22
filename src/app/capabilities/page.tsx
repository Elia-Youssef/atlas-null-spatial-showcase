import type { Metadata } from "next";
import { capabilities } from "@/content";
import { CapabilitiesOrbit } from "@/features/capabilities";
import { withBasePath } from "@/lib";

export const metadata: Metadata = {
  title: "Capabilities",
  description: "Real-time 3D, motion systems and experience engineering capability.",
  alternates: { canonical: withBasePath("/capabilities/") },
};

export default function CapabilitiesPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <CapabilitiesOrbit capabilities={capabilities} />
    </main>
  );
}
