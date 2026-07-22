import { Container, Eyebrow, Grid, Heading, Section, SystemLabel } from "@/components/ui";
import { ParallaxLayer, Reveal } from "@/components/motion";

export interface StudioManifestoContent {
  eyebrow: string;
  title: string;
  statement: string;
  principles: readonly string[];
}

export interface StudioManifestoProps {
  content: StudioManifestoContent;
}

/** Frames the studio point of view as editorial typography rather than marketing filler. */
export function StudioManifesto({ content }: StudioManifestoProps) {
  return (
    <>
      <Section className="min-h-[85svh] pt-36 md:pt-44" spacing="cinematic">
        <Container>
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Reveal trigger="mount">
            <Heading as="h1" className="mt-7 max-w-[14ch]" size="hero">
              {content.title}
            </Heading>
          </Reveal>
        </Container>
      </Section>

      <Section
        className="border-y border-[var(--line)] bg-[rgb(27_33_28/0.38)]"
        spacing="cinematic"
      >
        <Container>
          <Grid>
            <ParallaxLayer className="col-span-4 md:col-span-8" intensity={0.4}>
              <blockquote className="m-0 text-4xl font-medium uppercase leading-[0.92] tracking-[-0.055em] md:text-7xl">
                “{content.statement}”
              </blockquote>
            </ParallaxLayer>
            <div className="col-span-4 mt-12 md:col-span-3 md:col-start-10 md:mt-0">
              <SystemLabel index="03">OPERATING PRINCIPLES</SystemLabel>
              <ol className="mb-0 mt-6 grid list-none gap-5 p-0">
                {content.principles.map((principle, index) => (
                  <li
                    className="border-t border-[var(--line)] pt-4 text-sm leading-relaxed text-[var(--muted)]"
                    key={principle}
                  >
                    <span className="mr-3 font-mono text-[0.62rem] text-[var(--signal)]">
                      0{index + 1}
                    </span>
                    {principle}
                  </li>
                ))}
              </ol>
            </div>
          </Grid>
        </Container>
      </Section>
    </>
  );
}
