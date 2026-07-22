# ATLAS//NULL Project Handoff

Last updated: 2026-07-22

## Current State

The initial production showcase is implemented and locally validated. The publication target is [`Elia-Youssef/atlas-null-spatial-showcase`](https://github.com/Elia-Youssef/atlas-null-spatial-showcase), with production delivery from `main` through GitHub Pages.

The latest complete local gate passes:

- Prettier
- ESLint
- Strict TypeScript with `noUncheckedIndexedAccess`
- 28 Vitest unit and contract tests
- Next.js static production export
- Prior Playwright and axe suites for root and simulated GitHub Pages base-path hosting

## Implemented Routes

| Route            | Feature surface                      | Notes                                                |
| ---------------- | ------------------------------------ | ---------------------------------------------------- |
| `/`              | `HomeHero`, `SystemProofs`           | Primary spatial hero and capability proof cards      |
| `/work/`         | `WorkIndex`, `ProjectCard`           | HELIOS, KINETIC, and ECHO fictional systems          |
| `/work/helios/`  | `HeliosNarrative`                    | Scroll-directed featured case study                  |
| `/capabilities/` | `CapabilitiesOrbit`                  | Interactive capability catalogue                     |
| `/studio/`       | `StudioManifesto`, `StudioProcess`   | Principles and Decode/Model/Orchestrate/Ship process |
| `/contact/`      | `ContactConsole`, `TransmissionForm` | Local demo receipt; no transmission                  |
| `/system/`       | `SystemLab`                          | Unlisted, `noindex` public API laboratory            |

## Important Files

| Concern                       | Source                                                 |
| ----------------------------- | ------------------------------------------------------ |
| Persistent application shell  | `src/components/navigation/site-shell.tsx`             |
| Transition state machine      | `src/components/navigation/transition-provider.tsx`    |
| Transition-aware links        | `src/components/navigation/transition-link.tsx`        |
| Public component surface      | `src/components/index.ts`                              |
| Motion primitives             | `src/components/motion/effects.tsx`                    |
| World state and quality       | `src/components/world/world-provider.tsx`              |
| WebGL canvas and recovery     | `src/components/world/world-canvas.tsx`                |
| Procedural scene              | `src/components/world/scene-object.tsx`                |
| Shader source                 | `src/components/world/core-shaders.ts`                 |
| Complete CSS fallback         | `src/components/world/world.module.css`                |
| Route scene presets           | `src/lib/scene-presets.ts`                             |
| Quality policy                | `src/lib/quality.ts`                                   |
| Typed fictional content       | `src/content/site.ts`                                  |
| Shared contracts              | `src/types/index.ts`                                   |
| Global tokens and base layers | `src/app/globals.css`                                  |
| System catalogue              | `src/features/system/system-lab.tsx`                   |
| GitHub Pages configuration    | `next.config.ts`, `.github/workflows/deploy-pages.yml` |

## Current Visual Direction

The hero is intentionally severe and technical:

- Near-black technical grid and fine rules.
- Large Space Grotesk headline on the left.
- Lime emphasis on `IMPOSSIBLE`.
- Right-anchored procedural core with a fractured hemisphere, dark and lime shards, orbit rings, particles, and selective bloom.
- Restrained IBM Plex Mono coordinates and system labels.
- No rounded marketing cards, stock photography, remote texture, or generic gradient-blob aesthetic.

`public/og-atlas-null.png` is generated social artwork. It informed the composition but is not a browser screenshot. When sharing progress, use a fresh screenshot of the running site and label the Open Graph image accurately.

## Render Quality Policy

`resolveQualityTier()` currently selects:

- `static` for reduced motion or unavailable WebGL.
- `lite` for coarse pointers, save-data, or viewports below 768px.
- `full` otherwise.

The provider starts in static quality during SSR and upgrades after hydration. This is intentional. The static CSS poster was upgraded to retain the full composition instead of presenting a small placeholder.

## Recent LAN and Hydration Fix

A client screenshot from `http://192.168.1.3:3000` exposed a real progressive-enhancement defect:

- The LAN origin was not allowed by the development server, so hydration did not complete.
- Motion server output left the main headline at `opacity: 0`.

The fix is now in place:

- `next.config.ts` discovers active non-internal IPv4 interfaces and adds them to `allowedDevOrigins`.
- `Reveal` and `Stagger` server output remains visible and uses motion only as enhancement.
- A unit test asserts that server-rendered reveal content does not contain `opacity: 0`.

Restart `npm run dev` after config or network changes. A hard refresh alone does not reload `next.config.ts`.

## Public API and System Lab

The supported API is available through public barrels. Representative imports:

```ts
import { Button, Reveal, SpatialCard, WorldCanvas } from "@/components";
import { ContactConsole } from "@/features/contact";
import { getScenePreset, resolveQualityTier } from "@/lib";
import type { ScenePreset, TransitionController } from "@/types";
```

The typed `componentRegistry` documents all component families, public exports, states, prop/callback contracts, and accessibility behavior. Keep `/system/` synchronized with public API changes.

## Known Constraints

- The application is a static export: no server runtime, CMS, authentication, analytics, or backend form processing.
- The contact adapter creates a deterministic local demo receipt only.
- Low-level shaders and Next.js route modules are not public API.
- Browser WebGL output will vary slightly by GPU and quality tier.
- The development server must restart after `next.config.ts` changes.
- A previously truncated Windows SWC optional binary was repaired locally. Fresh installations should use `npm ci`; never commit the repaired `node_modules` file.

## Recommended Next Steps

1. Review the running experience with the user at desktop and mobile sizes.
2. Iterate on art direction using actual browser screenshots rather than the Open Graph artwork.
3. Keep follow-up commits focused and preserve the approved local baseline.
4. Keep the GitHub Pages deployment and repository metadata aligned if the repository name or public URL changes.
5. Re-run the root and base-path Playwright suites after any substantial navigation, layout, or world change.
