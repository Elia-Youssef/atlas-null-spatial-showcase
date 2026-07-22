"use client";

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

import { mergeClasses } from "@/components/ui";

interface FieldFrameProps {
  id: string;
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

function FieldFrame({
  children,
  description,
  error,
  id,
  label,
  required,
}: FieldFrameProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="group grid gap-2 border-t border-[var(--line)] py-5 focus-within:border-[var(--signal)]">
      <label
        className="flex items-baseline justify-between gap-4 font-mono text-[0.66rem] uppercase tracking-[0.16em]"
        htmlFor={id}
      >
        <span>{label}</span>
        {required ? <span className="text-[var(--muted)]">Required</span> : null}
      </label>
      {children}
      {description ? (
        <p className="m-0 text-xs text-[var(--muted)]" id={descriptionId}>
          {description}
        </p>
      ) : null}
      {error ? (
        <p className="m-0 font-mono text-xs text-amber-300" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, description?: string, error?: string): string | undefined {
  const ids = [
    description ? `${id}-description` : null,
    error ? `${id}-error` : null,
  ].filter(Boolean);
  return ids.length > 0 ? ids.join(" ") : undefined;
}

const CONTROL_CLASSES =
  "min-h-12 w-full rounded-none border-0 bg-transparent px-0 py-2 text-lg text-[var(--paper)] outline-none placeholder:text-[color:rgb(110_119_111/0.65)] disabled:cursor-not-allowed disabled:opacity-45";

export interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
  error?: string;
}

/** Renders an accessible labelled input with linked help and error text. */
export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { className, description, error, id: providedId, label, required, ...props },
  ref,
) {
  const generatedId = useId();
  const id = providedId ?? generatedId;

  return (
    <FieldFrame
      description={description}
      error={error}
      id={id}
      label={label}
      required={required}
    >
      <input
        aria-describedby={describedBy(id, description, error)}
        aria-invalid={Boolean(error) || undefined}
        className={mergeClasses(CONTROL_CLASSES, className)}
        id={id}
        ref={ref}
        required={required}
        {...props}
      />
    </FieldFrame>
  );
});

export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  description?: string;
  error?: string;
}

/** Renders a native select so keyboard and platform interactions remain predictable. */
export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField(
    { children, className, description, error, id: providedId, label, required, ...props },
    ref,
  ) {
    const generatedId = useId();
    const id = providedId ?? generatedId;

    return (
      <FieldFrame
        description={description}
        error={error}
        id={id}
        label={label}
        required={required}
      >
        <select
          aria-describedby={describedBy(id, description, error)}
          aria-invalid={Boolean(error) || undefined}
          className={mergeClasses(CONTROL_CLASSES, "cursor-pointer", className)}
          id={id}
          ref={ref}
          required={required}
          {...props}
        >
          {children}
        </select>
      </FieldFrame>
    );
  },
);

export interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  description?: string;
  error?: string;
}

/** Renders an expanding brief field with connected validation messaging. */
export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  function TextareaField(
    { className, description, error, id: providedId, label, required, rows = 5, ...props },
    ref,
  ) {
    const generatedId = useId();
    const id = providedId ?? generatedId;

    return (
      <FieldFrame
        description={description}
        error={error}
        id={id}
        label={label}
        required={required}
      >
        <textarea
          aria-describedby={describedBy(id, description, error)}
          aria-invalid={Boolean(error) || undefined}
          className={mergeClasses(CONTROL_CLASSES, "resize-y", className)}
          id={id}
          ref={ref}
          required={required}
          rows={rows}
          {...props}
        />
      </FieldFrame>
    );
  },
);
