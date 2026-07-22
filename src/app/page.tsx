import type { Metadata } from "next";
import {
  HomeHero,
  SystemProofs,
  type HomeHeroContent,
  type SystemProof,
} from "@/features/home";
import { withBasePath } from "@/lib";

export const metadata: Metadata = {
  alternates: { canonical: withBasePath("/") },
};

const heroContent = {
  eyebrow: "INDEPENDENT SPATIAL SYSTEMS STUDIO · 2026",
  headline: ["WE ENGINEER", "IMPOSSIBLE", "INTERFACES."],
  introduction:
    "ATLAS//NULL builds real-time worlds and interface systems for products, places and tomorrow.",
  primaryAction: { label: "Enter selected systems", href: "/work/" },
  secondaryAction: { label: "Inspect capability", href: "/capabilities/" },
} satisfies HomeHeroContent;

const systemProofs = [
  {
    id: "proof-world",
    index: "01",
    title: "Living worlds",
    description: "Procedural environments that respond to people, information and time.",
    signal: "WebGL · Shader systems · Digital twins",
  },
  {
    id: "proof-motion",
    index: "02",
    title: "Physical motion",
    description:
      "Transitions that preserve orientation and turn state changes into choreography.",
    signal: "Motion architecture · Spatial UX",
  },
  {
    id: "proof-production",
    index: "03",
    title: "Durable systems",
    description: "Senior frontend foundations designed to carry visual ambition safely.",
    signal: "Typed APIs · Accessibility · Performance",
  },
] satisfies readonly SystemProof[];

export default function HomePage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <HomeHero content={heroContent} />
      <SystemProofs
        proofs={systemProofs}
        title="Spectacle is only useful when the system holds."
      />
    </main>
  );
}
