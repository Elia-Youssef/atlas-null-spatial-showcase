import { Container, Eyebrow, Grid, Heading, Section, SystemLabel } from "@/components/ui";
import { Reveal } from "@/components/motion";
import type { Project } from "@/types";

import { ProjectCard } from "./project-card";

export interface WorkIndexProps {
  projects: readonly Project[];
  title?: string;
  introduction?: string;
}

/** Renders the selected fictional systems as an editorial project index. */
export function WorkIndex({
  introduction = "Three speculative systems, built to demonstrate how research, interaction and realtime graphics can share one production surface.",
  projects,
  title = "Selected systems.",
}: WorkIndexProps) {
  return (
    <>
      <Section className="min-h-[72svh] pt-36 md:pt-44" spacing="cinematic">
        <Container>
          <Grid className="items-end">
            <div className="col-span-4 md:col-span-8">
              <Eyebrow>01 // Work index</Eyebrow>
              <Reveal trigger="mount">
                <Heading as="h1" className="mt-7" size="hero">
                  {title}
                </Heading>
              </Reveal>
            </div>
            <div className="col-span-4 mt-8 md:col-span-3 md:col-start-10 md:mt-0">
              <SystemLabel>FICTIONAL CONCEPT WORK</SystemLabel>
              <p className="mb-0 mt-4 text-base leading-relaxed text-[var(--muted)]">
                {introduction}
              </p>
            </div>
          </Grid>
        </Container>
      </Section>

      <Section className="border-t border-[var(--line)]" spacing="compact">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            {projects.map((project, index) => (
              <Reveal
                className={index === 0 ? "lg:col-span-2" : undefined}
                delay={(index % 2) * 0.08}
                key={project.id}
              >
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
