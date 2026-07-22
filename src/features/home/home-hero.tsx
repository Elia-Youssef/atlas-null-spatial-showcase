import {
  ActionLink,
  Container,
  Eyebrow,
  Grid,
  Heading,
  MagneticSurface,
  StatusBadge,
  SystemLabel,
  TextScramble,
} from "@/components/ui";
import { ParallaxLayer, Reveal } from "@/components/motion";

export interface HomeHeroContent {
  eyebrow: string;
  headline: readonly [string, string, string];
  introduction: string;
  primaryAction: { label: string; href: string };
  secondaryAction: { label: string; href: string };
}

export interface HomeHeroProps {
  content: HomeHeroContent;
}

/** Presents the primary proposition above the persistent procedural world. */
export function HomeHero({ content }: HomeHeroProps) {
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden pb-10 pt-32 md:pb-14">
      <div aria-hidden="true" className="site-grid absolute inset-0 opacity-80" />
      <Container className="relative z-10">
        <div className="mb-8 flex items-center justify-between gap-6 border-b border-[var(--line)] pb-4">
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <StatusBadge className="hidden sm:inline-flex">World online</StatusBadge>
        </div>

        <Grid className="items-end">
          <div className="col-span-4 md:col-span-8">
            <Reveal direction="up" trigger="mount">
              <Heading
                as="h1"
                className="text-[clamp(3.35rem,9.4vw,10.8rem)] leading-[0.8]"
                size="hero"
              >
                {content.headline.map((line, index) => (
                  <span
                    className={index === 1 ? "block text-[var(--signal)]" : "block"}
                    key={line}
                  >
                    {line}
                  </span>
                ))}
              </Heading>
            </Reveal>
          </div>

          <ParallaxLayer
            className="col-span-4 mt-10 md:col-span-4 md:mt-0"
            intensity={0.35}
          >
            <SystemLabel index="00">SPATIAL SYSTEM STUDIO</SystemLabel>
            <p className="mb-0 mt-4 max-w-sm text-base leading-relaxed text-[color:rgb(242_240_232/0.72)] md:text-lg">
              {content.introduction}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <MagneticSurface>
                <ActionLink href={content.primaryAction.href} variant="signal">
                  <TextScramble text={content.primaryAction.label} />
                </ActionLink>
              </MagneticSurface>
              <ActionLink href={content.secondaryAction.href} variant="quiet">
                {content.secondaryAction.label}
              </ActionLink>
            </div>
          </ParallaxLayer>
        </Grid>

        <div className="mt-12 flex items-center justify-between border-t border-[var(--line)] pt-4 md:mt-16">
          <SystemLabel>BEIRUT // REMOTE</SystemLabel>
          <span aria-hidden="true" className="font-mono text-xs text-[var(--signal)]">
            ↓ 00—01
          </span>
        </div>
      </Container>
    </section>
  );
}
