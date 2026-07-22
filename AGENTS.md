# ATLAS//NULL Agent Instructions

This file is the canonical operating guide for coding agents working in this repository. Read it completely before changing code. Then read `docs/PROJECT_HANDOFF.md` for current implementation state and `README.md` for the human-facing overview.

## Mission

Maintain and extend a production-grade, fictional spatial-systems showcase called **ATLAS//NULL**. It is a Next.js static-export project designed to demonstrate senior UI engineering, motion design, procedural 3D, accessibility, and reusable public APIs without external runtime imagery.

The experience must feel like a coherent production website, not a collection of visual experiments.

## First Actions in a New Session

1. Read this file, `docs/PROJECT_HANDOFF.md`, and `README.md`.
2. Run `git status --short` before editing. Preserve all existing and unrelated user changes; do not reset or regenerate files to obtain a clean tree.
3. Inspect the relevant public barrel and feature boundary before adding imports.
4. Start from `npm run typecheck` for a quick health check or `npm run check` for the complete local gate.
5. When reviewing visuals, use the running application. `public/og-atlas-null.png` is marketing artwork and must not be represented as a literal browser screenshot.

## Non-Negotiable Product Rules

- Keep the locked identity: `ATLAS//NULL` and `WE ENGINEER IMPOSSIBLE INTERFACES.`
- Preserve the palette: `#050706`, `#F2F0E8`, `#C6FF32`, `#1B211C`, and the accessible muted token in `src/app/globals.css`.
- Use only local fonts, procedural WebGL, CSS geometry, gradients, and repository-owned assets.
- Do not add remote images, textures, HDRIs, runtime font requests, analytics, trackers, or third-party embeds.
- All projects, metrics, organizations, and testimonials remain clearly fictional.
- The contact form stays in demo mode unless the user explicitly authorizes a real backend. No entered data is transmitted today.
- `/system/` remains public but unlisted, excluded from the sitemap, and marked `noindex`.
- Do not create, commit to, or push a GitHub repository without explicit user authorization.

## Architecture and Import Boundaries

```text
src/
  app/                 Next.js routes, metadata, errors, sitemap, robots
  components/
    ui/                Foundations and actions
    motion/            Reveal, stagger, parallax, spatial effects
    navigation/        Persistent shell, menu, links, transition state
    world/             R3F canvas, procedural scene, shaders, fallbacks
    forms/             Fields and adapter-driven transmission form
  features/            Route-level, typed feature sections
  content/             Fictional content and component registry
  lib/                 Pure helpers and scene configuration
  types/               Shared public contracts
tests/
  unit/                Component and utility contracts
  e2e/                 Playwright route, navigation, and axe coverage
```

- Every component and feature directory exposes a deliberate `index.ts` public surface.
- Import through `@/components`, a component-family barrel, `@/features/<feature>`, `@/lib`, `@/content`, or `@/types`.
- Do not deep-import across component families or features. ESLint enforces the primary boundary patterns.
- Use named exports except for framework-required Next.js route defaults.
- Public components, hooks, functions, handles, and types require concise TSDoc.
- Keep props declarative. Imperative handles are reserved for the world controller and transmission form.
- Keep shader source, scene rendering, route presets, quality selection, and world state in separate modules.
- Prefer readable state machines and named helpers over compressed expressions or oversized effects.
- Do not introduce `any`, unexplained assertions, or magic animation values.

## Visual and Interaction Contract

- The desktop hero uses a dark technical grid, oversized left-side editorial typography, and a right-anchored fractured procedural core with orbit lines and directional shards.
- The procedural world is decorative. Meaningful content stays in semantic HTML above it.
- One `WorldCanvas` is mounted by the persistent root shell. Do not mount a competing route-level canvas.
- Route scene changes are driven by typed presets in `src/lib/scene-presets.ts`.
- The generated Open Graph image is a compositional reference, not a pixel-exact promise. Keep the live hero aligned in hierarchy, palette, and spatial balance.
- Every interactive control needs hover, focus-visible, pressed, disabled, keyboard, and touch behavior where applicable.
- Pointer-following effects must disable themselves for coarse input or reduced effects.

### Progressive Enhancement Rule

Meaningful content must never depend on animation or hydration to become visible.

- Server-rendered headings and copy must ship at visible opacity.
- Motion may animate position or enhance an already-visible state; it must not leave content at `opacity: 0` when hydration fails.
- The regression contract is covered by the `Reveal` server-markup unit test.
- Full quality uses WebGL and bloom, lite quality reduces rendering cost, and static quality uses the complete CSS procedural poster.
- The static fallback must preserve the same composition and visual weight as the realtime world.

## Navigation and World State

- Route transition phases are `idle -> covering -> navigating -> revealing -> idle`.
- Reject repeated transition requests while a transition is active.
- Preserve hashes, external links, downloads, modified clicks, new-tab behavior, history, and direct route loads.
- Keep the transition watchdog, scroll recovery, focus transfer to `<main>`, and polite title announcement intact.
- Handle visibility pause, context loss, initialization failure, and restored contexts explicitly.
- Do not remove the initial static quality tier; it prevents hydration mismatch. Capability detection upgrades it after hydration.

## Local Development

Requirements: Node.js 22 or newer and npm.

```bash
npm ci
npm run dev
```

- Root URL: `http://localhost:3000`.
- LAN URLs are supported. `next.config.ts` detects non-internal local IPv4 addresses and includes them in `allowedDevOrigins`.
- Restart the development server after changing `next.config.ts` or switching networks.
- If a LAN page shows the CSS world but missing interactivity, check browser console hydration and dev-origin errors first.
- Never edit `.next/`, `out/`, `node_modules/`, Playwright reports, or test results as source.

On this Windows machine, a truncated optional SWC binary once caused a WASM fallback warning. The local binary was repaired. If it recurs after installation, stop the dev server and reinstall dependencies; do not commit `node_modules`.

## Validation Requirements

Run the smallest relevant tests while iterating, then run the complete gate before handoff.

```bash
npm run format
npm run check
npm run test:e2e
```

`npm run check` verifies formatting, ESLint, strict TypeScript, unit tests, and the production static export.

Browser acceptance includes:

- All seven routes at 375px, 768px, and 1440px.
- Direct loads, refresh, history, modified navigation, and rapid interactions.
- Keyboard access, focus restoration, reduced motion, and static quality.
- Axe checks with no serious or critical violations.
- No console errors, hydration errors, broken internal links, remote visual requests, or horizontal overflow.
- Root hosting and a simulated GitHub Pages repository base path.

When changing a public component, update its unit contract and the `/system/` registry/example. When changing a route or navigation behavior, update Playwright coverage.

## Static Export and Deployment

- `output: "export"`, `trailingSlash: true`, and the Pages base path are required.
- `npm run build` emits the complete website to `out/`.
- Do not use server-only route handlers, runtime middleware, dynamic image optimization, or features incompatible with static export.
- `NEXT_PUBLIC_BASE_PATH` controls repository-subpath hosting.
- `NEXT_PUBLIC_SITE_URL` controls canonical and social metadata.
- Keep `.nojekyll`, the CI workflow, Pages workflow, and Dependabot configuration working.

## Handoff Expectations

Before ending a substantive implementation session:

1. Update `docs/PROJECT_HANDOFF.md` if architecture, behavior, visual direction, validation state, or known issues changed.
2. Update `README.md` when developer commands, routes, deployment, or public behavior changed.
3. Keep `CLAUDE.md` and `.github/copilot-instructions.md` as short pointers to this canonical file; do not fork the rules between agents.
4. Report tests actually run and any remaining warnings.
5. Preserve unrelated user work and leave repository publication to the user unless explicitly authorized.
