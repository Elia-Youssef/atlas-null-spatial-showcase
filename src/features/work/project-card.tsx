"use client";

import { useId, useState } from "react";

import { AnimatePresence, motion } from "motion/react";

import { ActionLink, Button, SystemLabel, mergeClasses } from "@/components/ui";
import { SpatialCard } from "@/components/motion";
import type { Project } from "@/types";

export interface ProjectCardProps {
  project: Project;
  priority?: boolean;
  className?: string;
}

function ProjectPoster({ project }: { project: Project }) {
  return (
    <div
      aria-hidden="true"
      className={mergeClasses(
        "relative aspect-[4/3] overflow-hidden border-b border-[var(--line)]",
        project.posterVariant === "radial" &&
          "bg-[radial-gradient(circle_at_65%_42%,rgb(198_255_50/0.7)_0_2%,transparent_3%),repeating-radial-gradient(circle_at_65%_42%,transparent_0_8%,rgb(198_255_50/0.2)_9%,transparent_10%)]",
        project.posterVariant === "strata" &&
          "bg-[repeating-linear-gradient(155deg,transparent_0_7%,rgb(242_240_232/0.16)_7.4%,transparent_8%),linear-gradient(120deg,rgb(198_255_50/0.1),transparent)]",
        project.posterVariant === "signal" &&
          "bg-[repeating-linear-gradient(90deg,transparent_0_7%,rgb(158_168_145/0.15)_7.2%,transparent_8%),repeating-linear-gradient(0deg,transparent_0_11%,rgb(198_255_50/0.11)_11.3%,transparent_12%)]",
      )}
    >
      <div className="absolute inset-[12%] rotate-6 border border-[color:var(--project-accent)] opacity-60" />
      <div className="absolute inset-[24%] -rotate-12 border border-[color:var(--project-accent)] opacity-40" />
      <span className="absolute right-4 top-4 font-mono text-[0.6rem] tracking-[0.16em] text-[var(--muted)]">
        SYNTHETIC VISUAL / {project.code}
      </span>
    </div>
  );
}

/** Displays project content as a spatial card and expands non-routed concepts in place. */
export function ProjectCard({ className, project }: ProjectCardProps) {
  const detailsId = useId();
  const [expanded, setExpanded] = useState(false);
  const style = { "--project-accent": project.accent } as React.CSSProperties;

  return (
    <SpatialCard
      className={mergeClasses(
        "group overflow-hidden border border-[var(--line)] bg-[rgb(5_7_6/0.74)] hover:border-[color:var(--project-accent)]",
        className,
      )}
      style={style}
    >
      <ProjectPoster project={project} />
      <div className="p-5 md:p-7">
        <div className="flex items-start justify-between gap-6">
          <SystemLabel index={project.code}>{project.year}</SystemLabel>
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[var(--muted)]">
            {project.discipline}
          </span>
        </div>
        <h2 className="mb-0 mt-12 max-w-xl text-3xl font-medium uppercase leading-[0.9] tracking-[-0.05em] md:text-5xl">
          {project.title}
        </h2>
        <p className="mb-0 mt-5 max-w-xl text-sm leading-relaxed text-[color:rgb(242_240_232/0.68)] md:text-base">
          {project.summary}
        </p>

        <AnimatePresence initial={false}>
          {expanded ? (
            <motion.div
              animate={{ height: "auto", opacity: 1 }}
              className="overflow-hidden"
              exit={{ height: 0, opacity: 0 }}
              id={detailsId}
              initial={{ height: 0, opacity: 0 }}
            >
              <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-[var(--line)] pt-5">
                {project.metrics.map((metric) => (
                  <div key={metric.label}>
                    <dt className="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[var(--muted)]">
                      {metric.label}
                    </dt>
                    <dd className="mb-0 ml-0 mt-2 text-2xl text-[color:var(--project-accent)]">
                      {metric.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mb-0 mt-5 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[var(--muted)]">
                Fictional concept summary // No client association
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="mt-8 flex justify-end border-t border-[var(--line)] pt-5">
          {project.href ? (
            <ActionLink href={project.href} variant="quiet">
              Open system
            </ActionLink>
          ) : (
            <Button
              aria-controls={detailsId}
              aria-expanded={expanded}
              onClick={() => setExpanded((current) => !current)}
              size="small"
              variant="quiet"
            >
              {expanded ? "Close brief" : "Inspect brief"}
            </Button>
          )}
        </div>
      </div>
    </SpatialCard>
  );
}
