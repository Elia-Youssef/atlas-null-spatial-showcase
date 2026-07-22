"use client";

import { useEffect } from "react";

import { motion } from "motion/react";

import {
  ActionLink,
  Container,
  Eyebrow,
  Grid,
  Heading,
  Section,
  SystemLabel,
  mergeClasses,
} from "@/components/ui";
import { Reveal, useScrollProgress } from "@/components/motion";
import type { CaseStudy, CaseStudyChapter, Project } from "@/types";

export interface HeliosNarrativeProps {
  caseStudy: CaseStudy;
  project: Project;
  onChapterProgress?: (chapterId: string, progress: number) => void;
}

interface ChapterProps {
  chapter: CaseStudyChapter;
  onProgress?: (chapterId: string, progress: number) => void;
}

function Chapter({ chapter, onProgress }: ChapterProps) {
  const { progress, ref } = useScrollProgress<HTMLElement>({
    startOffset: 80,
    endOffset: 80,
  });
  const active = progress > 0.08 && progress < 0.92;

  useEffect(() => {
    onProgress?.(chapter.id, progress);
  }, [chapter.id, onProgress, progress]);

  return (
    <section
      aria-labelledby={`${chapter.id}-title`}
      className="relative flex min-h-[92svh] items-center border-t border-[var(--line)] py-24"
      ref={ref}
    >
      <Container>
        <Grid className="items-center">
          <div className="col-span-4 md:col-span-2">
            <div className="relative size-20">
              <svg aria-hidden="true" className="-rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" fill="none" r="36" stroke="var(--line)" />
                <motion.circle
                  cx="40"
                  cy="40"
                  fill="none"
                  pathLength="1"
                  r="36"
                  stroke="var(--signal)"
                  strokeDasharray="1"
                  strokeDashoffset={1 - progress}
                />
              </svg>
              <span className="absolute inset-0 grid place-items-center font-mono text-xs">
                {chapter.index}
              </span>
            </div>
          </div>

          <div className="col-span-4 mt-10 md:col-span-7 md:mt-0">
            <Eyebrow>{chapter.eyebrow}</Eyebrow>
            <Heading
              className={mergeClasses(
                "mt-6 transition-opacity duration-500",
                active ? "opacity-100" : "opacity-55",
              )}
              id={`${chapter.id}-title`}
              size="large"
            >
              {chapter.title}
            </Heading>
            <p className="mb-0 mt-8 max-w-2xl text-lg leading-relaxed text-[color:rgb(242_240_232/0.7)] md:text-xl">
              {chapter.body}
            </p>
          </div>

          {chapter.metric ? (
            <aside className="col-span-4 mt-10 border-l border-[var(--signal)] pl-5 md:col-span-2 md:col-start-11 md:mt-0">
              <strong className="block text-4xl font-medium tracking-[-0.05em] text-[var(--signal)]">
                {chapter.metric.value}
              </strong>
              <SystemLabel className="mt-2">{chapter.metric.label}</SystemLabel>
            </aside>
          ) : null}
        </Grid>
      </Container>
    </section>
  );
}

/** Tells the HELIOS case study as scroll-observable chapters backed by semantic HTML. */
export function HeliosNarrative({
  caseStudy,
  onChapterProgress,
  project,
}: HeliosNarrativeProps) {
  return (
    <article>
      <header className="relative flex min-h-[100svh] items-end overflow-hidden pb-12 pt-36">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,rgb(198_255_50/0.18),transparent_28%),linear-gradient(to_bottom,transparent_60%,var(--void))]"
        />
        <Container className="relative">
          <div className="border-b border-[var(--line)] pb-5">
            <SystemLabel index={project.code}>{project.discipline}</SystemLabel>
          </div>
          <Grid className="mt-10 items-end">
            <div className="col-span-4 md:col-span-9">
              <Reveal trigger="mount">
                <Heading as="h1" size="hero">
                  {caseStudy.title}
                </Heading>
              </Reveal>
            </div>
            <div className="col-span-4 mt-8 md:col-span-3 md:mt-0">
              <p className="m-0 text-base leading-relaxed text-[var(--muted)]">
                {caseStudy.synopsis}
              </p>
              <p className="mb-0 mt-6 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[var(--signal)]">
                Fictional concept study
              </p>
            </div>
          </Grid>
        </Container>
      </header>

      {caseStudy.chapters.map((chapter) => (
        <Chapter chapter={chapter} key={chapter.id} onProgress={onChapterProgress} />
      ))}

      <Section className="border-t border-[var(--line)] text-center" spacing="cinematic">
        <Container size="content">
          <Eyebrow className="justify-center">Next transmission</Eyebrow>
          <Heading className="mt-7" size="large">
            Build the next observable system.
          </Heading>
          <ActionLink className="mt-10" href="/contact/" variant="signal">
            Start a signal
          </ActionLink>
        </Container>
      </Section>
    </article>
  );
}
