import { Container, Eyebrow, Grid, Heading, Section, SystemLabel } from "@/components/ui";
import { Reveal, SpatialCard, Stagger } from "@/components/motion";

export interface SystemProof {
  id: string;
  index: string;
  title: string;
  description: string;
  signal: string;
}

export interface SystemProofsProps {
  title: string;
  proofs: readonly SystemProof[];
}

/** Translates broad capability claims into three concise, inspectable proof points. */
export function SystemProofs({ proofs, title }: SystemProofsProps) {
  return (
    <Section className="relative border-t border-[var(--line)] bg-[color:rgb(5_7_6/0.72)]">
      <Container>
        <Grid>
          <div className="col-span-4 md:col-span-4">
            <Eyebrow marker="+">Verified systems</Eyebrow>
            <Reveal>
              <Heading className="mt-5" size="medium">
                {title}
              </Heading>
            </Reveal>
          </div>

          <Stagger className="col-span-4 mt-10 grid md:col-span-8 md:mt-0 md:grid-cols-3">
            {proofs.map((proof) => (
              <SpatialCard
                className="group min-h-72 border border-[var(--line)] bg-[rgb(27_33_28/0.54)] p-6 transition-colors hover:border-[var(--signal)]"
                key={proof.id}
              >
                <div className="flex items-center justify-between">
                  <SystemLabel index={proof.index}>MODULE</SystemLabel>
                  <span
                    aria-hidden="true"
                    className="text-[var(--signal)] opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    ↗
                  </span>
                </div>
                <h3 className="mb-0 mt-16 text-2xl font-medium uppercase leading-none tracking-[-0.04em]">
                  {proof.title}
                </h3>
                <p className="mb-0 mt-4 text-sm leading-relaxed text-[var(--muted)]">
                  {proof.description}
                </p>
                <p className="mb-0 mt-8 border-t border-[var(--line)] pt-3 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[var(--signal)]">
                  {proof.signal}
                </p>
              </SpatialCard>
            ))}
          </Stagger>
        </Grid>
      </Container>
    </Section>
  );
}
