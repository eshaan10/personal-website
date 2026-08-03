"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import GlassPanel from "./GlassPanel";
import { submitContact, type ContactState } from "@/app/contact/actions";

const INITIAL: ContactState = { status: "idle", message: "" };

const fieldClass =
  "ease-smooth w-full rounded-[10px] border border-glass-border bg-white/[0.04] px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-colors duration-300 focus:border-white/35 focus:bg-white/[0.07] focus:outline-none";

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="label-mono block">
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`${name}-error`} className="mt-2 text-xs text-text-secondary">
          {error}
        </p>
      )}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="ease-smooth mt-2 inline-flex rounded-[10px] bg-text-primary px-5 py-3 text-sm font-medium text-ink-900 transition-[transform,opacity] duration-300 hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/40 disabled:pointer-events-none disabled:opacity-50"
    >
      {pending ? "Sending…" : "Send message"}
    </button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useFormState(submitContact, INITIAL);
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the fields only on success, so a failed send doesn't destroy
  // something the visitor spent time writing.
  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  return (
    <GlassPanel radius="lg" className="p-6 md:p-8">
      <form ref={formRef} action={formAction} className="space-y-6">
        <Field label="Name" name="name" error={state.fieldErrors?.name}>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            aria-invalid={Boolean(state.fieldErrors?.name)}
            aria-describedby={state.fieldErrors?.name ? "name-error" : undefined}
            className={fieldClass}
            placeholder="Your name"
          />
        </Field>

        <Field label="Email" name="email" error={state.fieldErrors?.email}>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={Boolean(state.fieldErrors?.email)}
            aria-describedby={
              state.fieldErrors?.email ? "email-error" : undefined
            }
            className={fieldClass}
            placeholder="you@example.com"
          />
        </Field>

        <Field label="Message" name="message" error={state.fieldErrors?.message}>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            aria-invalid={Boolean(state.fieldErrors?.message)}
            aria-describedby={
              state.fieldErrors?.message ? "message-error" : undefined
            }
            className={`${fieldClass} resize-y`}
            placeholder="What's on your mind?"
          />
        </Field>

        {/* Honeypot — hidden from people, irresistible to bots. Not display:none,
            which some bots detect and skip. */}
        <div
          aria-hidden
          className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
        >
          <label htmlFor="company">Company</label>
          <input id="company" name="company" type="text" tabIndex={-1} />
        </div>

        <SubmitButton />

        {/* aria-live so the outcome is announced, not just shown */}
        <div aria-live="polite" className="min-h-[1.25rem]">
          {state.status !== "idle" && state.message && (
            <p
              className={`text-sm ${
                state.status === "success"
                  ? "text-text-primary"
                  : "text-text-secondary"
              }`}
            >
              {state.status === "success" ? "✓ " : "! "}
              {state.message}
            </p>
          )}
        </div>
      </form>
    </GlassPanel>
  );
}
