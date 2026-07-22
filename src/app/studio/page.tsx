import type { Metadata } from "next";
import {
  StudioManifesto,
  StudioProcess,
  type StudioManifestoContent,
  type StudioProcessStep,
} from "@/features/studio";
import { withBasePath } from "@/lib";

export const metadata: Metadata = {
  title: "Studio",
  description: "The principles and process behind ATLAS//NULL spatial systems.",
  alternates: { canonical: withBasePath("/studio/") },
};

const manifesto = {
  eyebrow: "03 // Studio protocol",
  title: "Clarity earns the right to spectacle.",
  statement:
    "We use motion to explain, dimension to orient, and technology to make an idea feel inevitable.",
  principles: [
    "Every visual decision must clarify the system beneath it.",
    "A prototype should test the hardest interaction first.",
    "Performance and accessibility are design materials, not cleanup tasks.",
  ],
} satisfies StudioManifestoContent;

const process = [
  {
    id: "decode",
    index: "01",
    title: "Decode",
    summary:
      "Find the behavior, audience and constraint that actually define the experience.",
    output: "Narrative model · Risk map",
  },
  {
    id: "model",
    index: "02",
    title: "Model",
    summary: "Turn the core idea into a navigable spatial and interaction system.",
    output: "Experience prototype · Motion grammar",
  },
  {
    id: "orchestrate",
    index: "03",
    title: "Orchestrate",
    summary:
      "Connect content, state, rendering and input through clear production contracts.",
    output: "Typed components · Scene architecture",
  },
  {
    id: "ship",
    index: "04",
    title: "Ship",
    summary:
      "Harden the experience across devices, preferences, fallbacks and real constraints.",
    output: "Validated release · Operating guide",
  },
] satisfies readonly StudioProcessStep[];

export default function StudioPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <StudioManifesto content={manifesto} />
      <StudioProcess steps={process} />
    </main>
  );
}
