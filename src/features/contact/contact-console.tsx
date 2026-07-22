import type { Ref } from "react";

import { TransmissionForm, type TransmissionFormProps } from "@/components/forms";
import {
  Container,
  Eyebrow,
  Grid,
  Heading,
  Section,
  StatusBadge,
  SystemLabel,
} from "@/components/ui";
import { Reveal } from "@/components/motion";
import type { TransmissionFormHandle } from "@/types";

export interface ContactConsoleProps extends TransmissionFormProps {
  formRef?: Ref<TransmissionFormHandle>;
}

/** Composes the demo transmission form with clear static-site and privacy context. */
export function ContactConsole({ formRef, ...formProps }: ContactConsoleProps) {
  return (
    <Section className="min-h-[100svh] pt-36 md:pt-44" spacing="cinematic">
      <Container>
        <Grid>
          <div className="col-span-4 md:col-span-5">
            <div className="flex flex-wrap items-center gap-3">
              <Eyebrow>04 // Signal</Eyebrow>
              <StatusBadge>Receiver standing by</StatusBadge>
            </div>
            <Reveal trigger="mount">
              <Heading as="h1" className="mt-8" size="large">
                Transmit the impossible part.
              </Heading>
            </Reveal>
            <p className="mb-0 mt-7 max-w-lg text-lg leading-relaxed text-[color:rgb(242_240_232/0.7)]">
              Describe the state change, the audience, and what must feel inevitable. The
              system will generate a local demonstration receipt.
            </p>
            <div className="mt-12 grid max-w-lg grid-cols-2 gap-4 border-t border-[var(--line)] pt-5">
              <SystemLabel index="LCL">Browser only</SystemLabel>
              <SystemLabel index="000">Network requests</SystemLabel>
              <SystemLabel index="SIM">Response mode</SystemLabel>
              <SystemLabel index="24H">Fictional SLA</SystemLabel>
            </div>
          </div>

          <div className="col-span-4 mt-16 border border-[var(--line)] bg-[rgb(5_7_6/0.78)] p-5 md:col-span-6 md:col-start-7 md:mt-0 md:p-8">
            <div className="mb-2 flex items-center justify-between border-b border-[var(--line)] pb-5">
              <SystemLabel index="TX-01">TRANSMISSION CONSOLE</SystemLabel>
              <span aria-hidden="true" className="font-mono text-xs text-[var(--signal)]">
                ●
              </span>
            </div>
            <TransmissionForm ref={formRef} {...formProps} />
          </div>
        </Grid>
      </Container>
    </Section>
  );
}
