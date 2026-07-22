import { Container, Eyebrow, Grid, Heading, Section, SystemLabel } from "@/components/ui";
import { Reveal, Stagger } from "@/components/motion";

export interface StudioProcessStep {
  id: string;
  index: string;
  title: string;
  summary: string;
  output: string;
}

export interface StudioProcessProps {
  steps: readonly StudioProcessStep[];
}

/** Describes the delivery model as a sequential, production-oriented system. */
export function StudioProcess({ steps }: StudioProcessProps) {
  return (
    <Section spacing="cinematic">
      <Container>
        <Grid>
          <div className="col-span-4 md:col-span-4">
            <Eyebrow>Process architecture</Eyebrow>
            <Reveal>
              <Heading className="mt-6" size="medium">
                From signal to shipped system.
              </Heading>
            </Reveal>
          </div>
          <Stagger className="col-span-4 mt-12 md:col-span-8 md:mt-0">
            {steps.map((step) => (
              <article
                className="group grid border-t border-[var(--line)] py-7 lg:grid-cols-[5rem_1fr_14rem] lg:items-start"
                key={step.id}
              >
                <SystemLabel index={step.index}>PHASE</SystemLabel>
                <div>
                  <h3 className="m-0 text-3xl font-medium uppercase tracking-[-0.045em] transition-colors group-hover:text-[var(--signal)] md:text-5xl">
                    {step.title}
                  </h3>
                  <p className="mb-0 mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
                    {step.summary}
                  </p>
                </div>
                <p className="mb-0 mt-5 font-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.12em] text-[var(--muted)] lg:mt-0">
                  Output // <span className="text-[var(--paper)]">{step.output}</span>
                </p>
              </article>
            ))}
          </Stagger>
        </Grid>
      </Container>
    </Section>
  );
}
