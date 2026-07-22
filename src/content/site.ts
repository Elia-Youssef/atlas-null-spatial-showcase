import type {
  Capability,
  CaseStudy,
  ComponentSpec,
  NavigationItem,
  Project,
} from "@/types";

export const navigation: readonly NavigationItem[] = [
  { label: "Index", href: "/", index: "00", scenePreset: "index" },
  { label: "Systems", href: "/work/", index: "01", scenePreset: "work" },
  {
    label: "Capabilities",
    href: "/capabilities/",
    index: "02",
    scenePreset: "capabilities",
  },
  { label: "Studio", href: "/studio/", index: "03", scenePreset: "studio" },
  { label: "Signal", href: "/contact/", index: "04", scenePreset: "contact" },
] as const;

export const projects: readonly Project[] = [
  {
    id: "project-helios",
    code: "HELIOS/01",
    slug: "helios",
    title: "Urban Energy Twin",
    summary:
      "A real-time operating model that turns a city's invisible energy behavior into a legible spatial system.",
    discipline: "DIGITAL TWIN · REAL-TIME 3D",
    year: "2026",
    href: "/work/helios/",
    accent: "#C6FF32",
    posterVariant: "radial",
    metrics: [
      { value: "2.4M", label: "simulated events" },
      { value: "31%", label: "faster response" },
      { value: "60 FPS", label: "live environment" },
    ],
  },
  {
    id: "project-kinetic",
    code: "KINETIC/02",
    slug: "kinetic",
    title: "Adaptive Mobility Cockpit",
    summary:
      "A multimodal control surface that composes route, vehicle and city signals around human intent.",
    discipline: "INTERFACE SYSTEM · MOBILITY",
    year: "2026",
    accent: "#F2F0E8",
    posterVariant: "strata",
    metrics: [
      { value: "18 ms", label: "input latency" },
      { value: "12", label: "mobility modes" },
    ],
  },
  {
    id: "project-echo",
    code: "ECHO/03",
    slug: "echo",
    title: "Generative Cultural Archive",
    summary:
      "An explorable memory field where millions of artifacts reorganize around each visitor's curiosity.",
    discipline: "GENERATIVE SYSTEM · CULTURE",
    year: "2025",
    accent: "#9EA891",
    posterVariant: "signal",
    metrics: [
      { value: "8.7M", label: "indexed artifacts" },
      { value: "42", label: "collection partners" },
    ],
  },
] as const;

export const heliosCaseStudy: CaseStudy = {
  id: "case-helios",
  projectId: "project-helios",
  title: "The city, made observable.",
  synopsis:
    "HELIOS is a fictional concept study for a city-scale energy interface. Every claim and metric exists solely to demonstrate the product narrative.",
  chapters: [
    {
      id: "challenge",
      index: "01",
      eyebrow: "THE CHALLENGE",
      title: "Millions of signals. No shared picture.",
      body: "Operators were moving between fragmented dashboards while demand, weather and infrastructure changed underneath them. The opportunity was not another chart—it was a common spatial language.",
      metric: { value: "14", label: "disconnected operational views" },
    },
    {
      id: "system",
      index: "02",
      eyebrow: "THE SYSTEM",
      title: "A living model of urban energy.",
      body: "We translated generation, storage and demand into a deterministic real-time scene. Layers can be isolated, compared and rewound without losing geographic context.",
      metric: { value: "2.4M", label: "events simulated per session" },
    },
    {
      id: "interface",
      index: "03",
      eyebrow: "THE INTERFACE",
      title: "From anomaly to action in one gesture.",
      body: "The interface moves from network overview to a single asset without modal clutter. Every transition preserves orientation, cause and likely downstream impact.",
      metric: { value: "18 ms", label: "median interaction latency" },
    },
    {
      id: "outcome",
      index: "04",
      eyebrow: "THE OUTCOME",
      title: "A faster shared decision surface.",
      body: "In the fictional validation scenario, teams recognized cascading risk earlier and coordinated response from the same model instead of reconciling separate tools.",
      metric: { value: "31%", label: "faster simulated response" },
    },
  ],
};

export const capabilities: readonly Capability[] = [
  {
    id: "realtime",
    index: "01",
    title: "Real-time 3D",
    summary: "High-fidelity worlds that stay responsive to people, systems and live data.",
    details: ["WebGL systems", "Procedural geometry", "Digital twins"],
    scenePreset: "capabilities",
  },
  {
    id: "motion",
    index: "02",
    title: "Motion systems",
    summary:
      "Choreography that makes complex state changes feel physical and understandable.",
    details: ["Interaction direction", "Transition architecture", "Prototyping"],
    scenePreset: "helios",
  },
  {
    id: "experience",
    index: "03",
    title: "Experience engineering",
    summary:
      "Production frontend foundations built to carry ambitious visual ideas safely.",
    details: ["Design systems", "Accessible interfaces", "Performance engineering"],
    scenePreset: "work",
  },
  {
    id: "production",
    index: "04",
    title: "Prototype to production",
    summary:
      "A continuous path from the first impossible interaction to a durable release.",
    details: ["Technical direction", "Rapid validation", "Delivery systems"],
    scenePreset: "studio",
  },
] as const;

export const componentRegistry: readonly ComponentSpec[] = [
  {
    id: "foundations",
    name: "Foundations",
    category: "foundation",
    description: "Layout, typography and system-status primitives.",
    importPath: "@/components",
    exports: [
      "Container",
      "Section",
      "Grid",
      "Heading",
      "Eyebrow",
      "SystemLabel",
      "StatusBadge",
    ],
    contracts: [
      "semantic element selection",
      "spacing and alignment",
      "class and accessible-label overrides",
    ],
    states: ["responsive", "high contrast", "semantic element"],
    accessibility: "Semantic landmarks and a predictable heading hierarchy.",
  },
  {
    id: "actions",
    name: "Actions",
    category: "action",
    description: "Buttons, links, magnetic surfaces and text feedback.",
    importPath: "@/components",
    exports: ["Button", "ActionLink", "MagneticSurface", "TextScramble"],
    contracts: [
      "typed variants and sizes",
      "disabled and loading behavior",
      "native events and optional motion",
    ],
    states: ["default", "hover", "focus", "pressed", "disabled", "loading"],
    accessibility: "Native controls with visible focus and no hover-only meaning.",
  },
  {
    id: "motion",
    name: "Motion",
    category: "motion",
    description: "Reveal, stagger, parallax and spatial card composition.",
    importPath: "@/components",
    exports: [
      "Reveal",
      "Stagger",
      "ParallaxLayer",
      "SpatialCard",
      "PageStack",
      "usePointerField",
      "useReducedEffects",
      "useScrollProgress",
    ],
    contracts: [
      "timing and intensity presets",
      "mount or viewport triggers",
      "reduced-motion overrides",
    ],
    states: ["enter", "in view", "reduced motion"],
    accessibility: "User motion preference always overrides visual choreography.",
  },
  {
    id: "navigation",
    name: "Navigation",
    category: "navigation",
    description: "Transition-aware links, header and page-stack navigation.",
    importPath: "@/components",
    exports: [
      "SiteHeader",
      "NavigationOverlay",
      "TransitionLink",
      "TransitionProvider",
      "useRouteTransition",
    ],
    contracts: [
      "typed route metadata",
      "transition phase callbacks",
      "native modified-click and history behavior",
    ],
    states: ["idle", "covering", "navigating", "revealing"],
    accessibility: "Focus is restored and route changes are announced.",
  },
  {
    id: "world",
    name: "World",
    category: "world",
    description: "Persistent procedural world and deterministic posters.",
    importPath: "@/components",
    exports: [
      "WorldCanvas",
      "WorldFallback",
      "ProceduralPoster",
      "SceneObject",
      "WorldProvider",
      "useWorld",
    ],
    contracts: [
      "preset and quality control",
      "deterministic seed",
      "readiness, pause and fallback events",
    ],
    states: ["full", "lite", "static", "context lost"],
    accessibility: "All canvas content is decorative and has an HTML equivalent.",
  },
  {
    id: "forms",
    name: "Forms",
    category: "form",
    description: "Labelled fields and the transmission form state machine.",
    importPath: "@/components",
    exports: ["Field", "SelectField", "TextareaField", "TransmissionForm"],
    contracts: [
      "controlled and uncontrolled fields",
      "injected submission adapter",
      "success, error and imperative reset callbacks",
    ],
    states: ["empty", "invalid", "submitting", "success", "failure"],
    accessibility: "Errors are linked to fields and announced without stealing context.",
  },
  {
    id: "features",
    name: "Feature sections",
    category: "feature",
    description: "Typed page-level compositions for every client-facing route.",
    importPath: "@/features/<feature>",
    exports: [
      "HomeHero",
      "SystemProofs",
      "WorkIndex",
      "ProjectCard",
      "HeliosNarrative",
      "CapabilitiesOrbit",
      "StudioManifesto",
      "StudioProcess",
      "ContactConsole",
      "SystemLab",
    ],
    contracts: [
      "typed content inputs",
      "no hidden content dependencies",
      "semantic source order and responsive composition",
    ],
    states: ["populated", "responsive", "reduced motion"],
    accessibility:
      "Sections preserve semantic headings, landmarks and readable source order.",
  },
] as const;
