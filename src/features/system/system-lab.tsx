"use client";

import { useMemo, useState, type ReactNode } from "react";

import { Field, SelectField, TextareaField, TransmissionForm } from "@/components/forms";
import { Reveal, SpatialCard, Stagger } from "@/components/motion";
import {
  ActionLink,
  Button,
  Container,
  Eyebrow,
  Grid,
  Heading,
  MagneticSurface,
  Section,
  StatusBadge,
  SystemLabel,
  TextScramble,
} from "@/components/ui";
import type { ComponentSpec } from "@/types";

type ComponentCategory = ComponentSpec["category"] | "all";

export interface SystemLabProps {
  registry: readonly ComponentSpec[];
  navigationExample?: ReactNode;
  worldExample?: ReactNode;
}

interface SpecExampleProps {
  spec: ComponentSpec;
  navigationExample?: ReactNode;
  worldExample?: ReactNode;
}

function FoundationExample() {
  return (
    <div className="grid gap-6">
      <Grid columns={2}>
        <div className="border border-[var(--line)] p-4">
          <Eyebrow>Foundation eyebrow</Eyebrow>
        </div>
        <div className="border border-[var(--line)] p-4">
          <StatusBadge>Nominal</StatusBadge>
        </div>
      </Grid>
      <Heading size="medium">A readable system heading.</Heading>
      <SystemLabel index="01">Coordinate label</SystemLabel>
    </div>
  );
}

function ActionExample() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <MagneticSurface>
        <Button>Primary action</Button>
      </MagneticSurface>
      <Button variant="outline">Outline action</Button>
      <Button disabled>Disabled action</Button>
      <Button loading>Loading action</Button>
      <ActionLink href="#system-catalogue" variant="quiet">
        <TextScramble text="Action link" />
      </ActionLink>
    </div>
  );
}

function MotionExample() {
  return (
    <Stagger className="grid gap-3 sm:grid-cols-3">
      {["Reveal", "Stagger", "Spatial tilt"].map((label, index) => (
        <SpatialCard
          className="group grid aspect-[4/3] place-items-center border border-[var(--line)] bg-[var(--graphite)]"
          intensity={5}
          key={label}
        >
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--signal)]">
            0{index + 1} {"//"} {label}
          </span>
        </SpatialCard>
      ))}
    </Stagger>
  );
}

function FormExample() {
  return (
    <div className="grid gap-12">
      <div className="grid gap-x-8 md:grid-cols-2">
        <Field label="Default field" placeholder="Signal value" />
        <Field
          error="This is an example error."
          label="Error field"
          value="Invalid"
          readOnly
        />
        <SelectField defaultValue="full" label="Quality tier">
          <option value="full">Full</option>
          <option value="lite">Lite</option>
        </SelectField>
        <TextareaField
          className="md:col-span-2"
          label="Brief field"
          placeholder="Describe the system"
        />
      </div>
      <div className="border-t border-[var(--line)] pt-8">
        <SystemLabel>LIVE VALIDATION + DEMO RECEIPT</SystemLabel>
        <TransmissionForm className="mt-6" demoMode />
      </div>
    </div>
  );
}

function SpecExample({ navigationExample, spec, worldExample }: SpecExampleProps) {
  switch (spec.category) {
    case "foundation":
      return <FoundationExample />;
    case "action":
      return <ActionExample />;
    case "motion":
      return <MotionExample />;
    case "navigation":
      return (
        navigationExample ?? (
          <p className="m-0 text-sm text-[var(--muted)]">
            The persistent header above is the live navigation example.
          </p>
        )
      );
    case "world":
      return (
        worldExample ?? (
          <div className="site-grid aspect-video border border-[var(--line)] bg-[radial-gradient(circle_at_center,rgb(198_255_50/0.16),transparent_35%)]" />
        )
      );
    case "form":
      return <FormExample />;
    case "feature":
      return (
        <p className="m-0 text-sm text-[var(--muted)]">
          Feature examples are the production sections rendered across all public routes.
        </p>
      );
  }
}

/** Renders a registry-driven, noindex laboratory for public components and their states. */
export function SystemLab({ navigationExample, registry, worldExample }: SystemLabProps) {
  const [category, setCategory] = useState<ComponentCategory>("all");
  const categories = useMemo(
    () => ["all", ...new Set(registry.map((spec) => spec.category))] as ComponentCategory[],
    [registry],
  );
  const visibleSpecs =
    category === "all" ? registry : registry.filter((spec) => spec.category === category);

  return (
    <>
      <Section className="pt-36 md:pt-44" spacing="cinematic">
        <Container>
          <Eyebrow>SYS // Component laboratory</Eyebrow>
          <Reveal trigger="mount">
            <Heading as="h1" className="mt-7 max-w-6xl" size="hero">
              Production surface.
            </Heading>
          </Reveal>
          <div className="mt-10 grid gap-5 border-y border-[var(--line)] py-5 md:grid-cols-3">
            <SystemLabel index={String(registry.length).padStart(2, "0")}>
              API GROUPS
            </SystemLabel>
            <SystemLabel index="A11Y">NATIVE FIRST</SystemLabel>
            <SystemLabel index="RDX">REDUCED EFFECTS</SystemLabel>
          </div>
        </Container>
      </Section>

      <Section className="border-t border-[var(--line)]" id="system-catalogue">
        <Container>
          <div
            className="mb-12 flex flex-wrap gap-2"
            aria-label="Filter component catalogue"
          >
            {categories.map((item) => (
              <Button
                aria-pressed={category === item}
                key={item}
                onClick={() => setCategory(item)}
                size="small"
                variant={category === item ? "signal" : "outline"}
              >
                {item}
              </Button>
            ))}
          </div>

          <div className="grid gap-10">
            {visibleSpecs.map((spec) => (
              <article
                className="border border-[var(--line)] bg-[rgb(5_7_6/0.68)]"
                key={spec.id}
              >
                <header className="grid gap-5 border-b border-[var(--line)] p-5 md:grid-cols-[1fr_2fr_1fr] md:p-7">
                  <div>
                    <SystemLabel index={spec.category.slice(0, 3).toUpperCase()}>
                      PUBLIC API
                    </SystemLabel>
                    <h2 className="mb-0 mt-3 text-3xl font-medium uppercase tracking-[-0.04em]">
                      {spec.name}
                    </h2>
                  </div>
                  <p className="m-0 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
                    {spec.description}
                  </p>
                  <code className="self-start overflow-x-auto bg-[var(--graphite)] px-3 py-2 font-mono text-[0.62rem] text-[var(--signal)]">
                    import &#123; ... &#125; from &quot;{spec.importPath}&quot;
                  </code>
                </header>

                <div className="p-5 md:p-7">
                  <SpecExample
                    navigationExample={navigationExample}
                    spec={spec}
                    worldExample={worldExample}
                  />
                </div>

                <div className="grid gap-6 border-t border-[var(--line)] p-5 md:grid-cols-2 md:p-7">
                  <div>
                    <SystemLabel>PUBLIC EXPORTS</SystemLabel>
                    <ul className="mb-0 mt-3 flex list-none flex-wrap gap-2 p-0">
                      {spec.exports.map((item) => (
                        <li
                          className="border border-[var(--line)] bg-[var(--graphite)] px-2.5 py-1 font-mono text-[0.58rem] tracking-[0.04em] text-[var(--signal)]"
                          key={item}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <SystemLabel>PROP + CALLBACK CONTRACTS</SystemLabel>
                    <ul className="mb-0 mt-3 grid gap-2 pl-4 text-sm leading-relaxed text-[var(--muted)]">
                      {spec.contracts.map((contract) => (
                        <li key={contract}>{contract}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <footer className="grid gap-5 border-t border-[var(--line)] p-5 md:grid-cols-2 md:p-7">
                  <div>
                    <SystemLabel>SUPPORTED STATES</SystemLabel>
                    <ul className="mb-0 mt-3 flex list-none flex-wrap gap-2 p-0">
                      {spec.states.map((state) => (
                        <li
                          className="border border-[var(--line)] px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-[0.1em] text-[var(--muted)]"
                          key={state}
                        >
                          {state}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <SystemLabel>ACCESSIBILITY CONTRACT</SystemLabel>
                    <p className="mb-0 mt-3 text-sm leading-relaxed text-[var(--muted)]">
                      {spec.accessibility}
                    </p>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
