"use client";

import { useState } from "react";

import { AnimatePresence, motion } from "motion/react";

import {
  Container,
  Eyebrow,
  Grid,
  Heading,
  Section,
  SystemLabel,
  mergeClasses,
} from "@/components/ui";
import { Reveal } from "@/components/motion";
import type { Capability } from "@/types";

export interface CapabilitiesOrbitProps {
  capabilities: readonly Capability[];
  onCapabilityChange?: (capability: Capability) => void;
  initialCapabilityId?: string;
}

/** Exposes capabilities as an accessible selection model mirrored by an orbital diagram. */
export function CapabilitiesOrbit({
  capabilities,
  initialCapabilityId,
  onCapabilityChange,
}: CapabilitiesOrbitProps) {
  const initialCapability =
    capabilities.find((capability) => capability.id === initialCapabilityId) ??
    capabilities[0];
  const [activeId, setActiveId] = useState(initialCapability?.id ?? "");
  const activeCapability =
    capabilities.find((capability) => capability.id === activeId) ?? initialCapability;

  function selectCapability(capability: Capability) {
    setActiveId(capability.id);
    onCapabilityChange?.(capability);
  }

  return (
    <>
      <Section className="min-h-[70svh] pt-36 md:pt-44" spacing="cinematic">
        <Container>
          <Eyebrow>02 // Capabilities</Eyebrow>
          <Reveal trigger="mount">
            <Heading as="h1" className="mt-7 max-w-6xl" size="hero">
              Tools are temporary. Capability compounds.
            </Heading>
          </Reveal>
        </Container>
      </Section>

      <Section className="border-y border-[var(--line)] bg-[rgb(5_7_6/0.62)]">
        <Container>
          <Grid className="items-stretch">
            <div
              aria-label="Capability systems"
              className="col-span-4 border-y border-[var(--line)] md:col-span-6"
              role="group"
            >
              {capabilities.map((capability) => {
                const selected = capability.id === activeCapability?.id;
                return (
                  <button
                    aria-pressed={selected}
                    className={mergeClasses(
                      "group grid w-full grid-cols-[3rem_1fr_auto] items-center gap-3 border-b border-[var(--line)] bg-transparent py-6 text-left text-[var(--paper)] transition-colors last:border-b-0 hover:text-[var(--signal)]",
                      selected && "text-[var(--signal)]",
                    )}
                    key={capability.id}
                    onClick={() => selectCapability(capability)}
                    type="button"
                  >
                    <span className="font-mono text-[0.62rem]">{capability.index}</span>
                    <span className="text-2xl font-medium uppercase tracking-[-0.04em] md:text-4xl">
                      {capability.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className={mergeClasses(
                        "mr-3 transition-transform",
                        selected ? "rotate-45" : "group-hover:rotate-45",
                      )}
                    >
                      +
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="col-span-4 mt-12 flex min-h-96 flex-col justify-between md:col-span-5 md:col-start-8 md:mt-0">
              <div className="relative mx-auto aspect-square w-full max-w-md">
                <div
                  aria-hidden="true"
                  className="absolute inset-4 rounded-full border border-[var(--line)]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-[22%] rotate-45 border border-[var(--line)]"
                />
                <motion.div
                  animate={{
                    rotate: Number.parseInt(activeCapability?.index ?? "1", 10) * 32,
                  }}
                  aria-hidden="true"
                  className="absolute inset-[12%] rounded-full border border-dashed border-[var(--signal)]"
                  transition={{ type: "spring", stiffness: 80, damping: 18 }}
                >
                  <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-[var(--signal)]" />
                </motion.div>
                <div className="absolute inset-0 grid place-items-center text-center">
                  <SystemLabel index={activeCapability?.index}>ACTIVE SYSTEM</SystemLabel>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {activeCapability ? (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    initial={{ opacity: 0, y: 12 }}
                    key={activeCapability.id}
                  >
                    <p className="m-0 text-lg leading-relaxed text-[color:rgb(242_240_232/0.72)]">
                      {activeCapability.summary}
                    </p>
                    <ul className="mb-0 mt-6 grid list-none gap-2 p-0 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-[var(--muted)]">
                      {activeCapability.details.map((detail) => (
                        <li className="flex items-center gap-2" key={detail}>
                          <span aria-hidden="true" className="text-[var(--signal)]">
                            +
                          </span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </Grid>
        </Container>
      </Section>
    </>
  );
}
