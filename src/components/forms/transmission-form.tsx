"use client";

import { forwardRef, useImperativeHandle, useRef, useState, type FormEvent } from "react";

import { AnimatePresence, motion } from "motion/react";

import { Button, SystemLabel, mergeClasses } from "@/components/ui";
import { demoSubmissionAdapter, validateTransmission } from "@/lib";
import type {
  SubmissionAdapter,
  SubmissionResult,
  TransmissionFormHandle,
  TransmissionPayload,
  ValidationErrors,
} from "@/types";

import { Field, SelectField, TextareaField } from "./fields";

const EMPTY_PAYLOAD: TransmissionPayload = {
  name: "",
  email: "",
  company: "",
  brief: "",
  budget: "",
  timeline: "",
};

type FormStatus = "idle" | "submitting" | "success" | "error";

export interface TransmissionFormProps {
  adapter?: SubmissionAdapter;
  className?: string;
  initialValue?: Partial<TransmissionPayload>;
  demoMode?: boolean;
  onSuccess?: (result: SubmissionResult) => void;
  onError?: (message: string) => void;
}

/**
 * Collects a project brief through an injected submission adapter.
 * The default adapter is intentionally local and never transmits entered information.
 */
export const TransmissionForm = forwardRef<TransmissionFormHandle, TransmissionFormProps>(
  function TransmissionForm(
    {
      adapter = demoSubmissionAdapter,
      className,
      demoMode = true,
      initialValue,
      onError,
      onSuccess,
    },
    forwardedRef,
  ) {
    const [payload, setPayload] = useState<TransmissionPayload>({
      ...EMPTY_PAYLOAD,
      ...initialValue,
    });
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [status, setStatus] = useState<FormStatus>("idle");
    const [result, setResult] = useState<SubmissionResult | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    function reset() {
      setPayload({ ...EMPTY_PAYLOAD, ...initialValue });
      setErrors({});
      setResult(null);
      setStatus("idle");
    }

    function focusFirstInvalid() {
      const firstInvalid =
        formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']");
      firstInvalid?.focus();
    }

    useImperativeHandle(forwardedRef, () => ({ focusFirstInvalid, reset }));

    function updatePayload<Key extends keyof TransmissionPayload>(
      key: Key,
      value: TransmissionPayload[Key],
    ) {
      setPayload((current) => ({ ...current, [key]: value }));
      if (key === "name" || key === "email" || key === "brief") {
        setErrors((current) => ({ ...current, [key]: undefined }));
      }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      if (status === "submitting") return;

      const validationErrors = validateTransmission(payload);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        window.requestAnimationFrame(focusFirstInvalid);
        return;
      }

      setErrors({});
      setResult(null);
      setStatus("submitting");

      try {
        const submissionResult = await adapter(payload);
        setResult(submissionResult);

        if (submissionResult.success) {
          setStatus("success");
          onSuccess?.(submissionResult);
        } else {
          setStatus("error");
          onError?.(submissionResult.message);
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "The transmission could not be simulated.";
        setResult({ success: false, message });
        setStatus("error");
        onError?.(message);
      }
    }

    return (
      <form
        className={mergeClasses("relative", className)}
        noValidate
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <div className="grid gap-x-8 md:grid-cols-2">
          <Field
            autoComplete="name"
            error={errors.name}
            label="Your name"
            onChange={(event) => updatePayload("name", event.target.value)}
            placeholder="Ada Lovelace"
            required
            value={payload.name}
          />
          <Field
            autoComplete="email"
            error={errors.email}
            inputMode="email"
            label="Email channel"
            onChange={(event) => updatePayload("email", event.target.value)}
            placeholder="ada@example.com"
            required
            type="email"
            value={payload.email}
          />
          <Field
            autoComplete="organization"
            label="Organization"
            onChange={(event) => updatePayload("company", event.target.value)}
            placeholder="Optional"
            value={payload.company}
          />
          <SelectField
            label="Project horizon"
            onChange={(event) => updatePayload("timeline", event.target.value)}
            value={payload.timeline}
          >
            <option value="">Select a horizon</option>
            <option value="now">Now / 4 weeks</option>
            <option value="quarter">This quarter</option>
            <option value="exploring">Exploring the impossible</option>
          </SelectField>
          <SelectField
            label="Prototype envelope"
            onChange={(event) => updatePayload("budget", event.target.value)}
            value={payload.budget}
          >
            <option value="">Select a range</option>
            <option value="25-50">$25k–$50k</option>
            <option value="50-100">$50k–$100k</option>
            <option value="100+">$100k+</option>
          </SelectField>
          <div className="md:col-span-2">
            <TextareaField
              description="Minimum 20 characters. The mockup keeps this information in your browser."
              error={errors.brief}
              label="The impossible part"
              onChange={(event) => updatePayload("brief", event.target.value)}
              placeholder="What should the interface make possible?"
              required
              value={payload.brief}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-5 border-t border-[var(--line)] pt-6 sm:flex-row sm:items-center">
          <SystemLabel>
            {demoMode ? "LOCAL DEMONSTRATION · NO DATA TRANSMITTED" : "SECURE TRANSMISSION"}
          </SystemLabel>
          <Button loading={status === "submitting"} size="large" type="submit">
            Send signal
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              aria-live="polite"
              className={mergeClasses(
                "mt-6 border p-5 font-mono text-xs uppercase tracking-[0.12em]",
                result.success
                  ? "border-[var(--signal)] text-[var(--signal)]"
                  : "border-amber-300 text-amber-300",
              )}
              initial={{ opacity: 0, y: 8 }}
              key={status}
              role={result.success ? "status" : "alert"}
            >
              <p className="m-0">{result.message}</p>
              {result.receiptId ? (
                <p className="mb-0 mt-2">Receipt // {result.receiptId}</p>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </form>
    );
  },
);
