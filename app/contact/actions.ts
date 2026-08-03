"use server";

/**
 * Contact form handler.
 *
 * Chosen approach: a Next.js Server Action posting directly to Resend's REST
 * API over `fetch`.
 *
 * Why not the `resend` npm package: it's a thin wrapper over one HTTP call.
 * Adding a dependency (and its transitive tree) to save ten lines isn't worth
 * it, and CLAUDE.md says to confirm new dependencies first.
 *
 * Why not Formspree/Getform: those need the endpoint in client-side markup,
 * which means the form can be scraped and posted to directly, and submission
 * volume ends up governed by someone else's free tier.
 *
 * Why a Server Action rather than a route handler: the API key stays on the
 * server, there's no public POST endpoint to find, and it degrades sensibly
 * — the form is a real <form> with a real action, so it still submits if
 * client JS hasn't hydrated.
 */

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
  /** Field-level errors, keyed by input name. */
  fieldErrors?: Record<string, string>;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContact(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  // Hidden field: real users never fill this, bots fill everything.
  const honeypot = String(formData.get("company") ?? "").trim();

  if (honeypot) {
    // Report success to the bot rather than revealing the check exists.
    return { status: "success", message: "Thanks — your message is on its way." };
  }

  const fieldErrors: Record<string, string> = {};
  if (name.length < 2) fieldErrors.name = "Please enter your name.";
  if (!EMAIL_PATTERN.test(email))
    fieldErrors.email = "Please enter a valid email address.";
  if (message.length < 10)
    fieldErrors.message = "Please write at least a sentence or two.";
  if (message.length > 5000)
    fieldErrors.message = "That's longer than 5,000 characters.";

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please fix the fields below.",
      fieldErrors,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    // Deliberately explicit: a silent no-op here looks identical to success
    // and would quietly swallow real messages until someone noticed.
    console.error(
      "[contact] Missing env vars. Need RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL.",
    );
    return {
      status: "error",
      message:
        "The contact form isn't configured yet. Please email me directly in the meantime.",
    };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        // reply_to, so hitting Reply in the inbox goes to the sender, not to `from`.
        reply_to: email,
        subject: `Portfolio contact — ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("[contact] Resend error", response.status, detail);
      return {
        status: "error",
        message:
          "Something went wrong sending that. Please email me directly instead.",
      };
    }

    return {
      status: "success",
      message: "Thanks — your message is on its way. I'll get back to you soon.",
    };
  } catch (error) {
    console.error("[contact] Network error", error);
    return {
      status: "error",
      message:
        "Couldn't reach the mail service. Please email me directly instead.",
    };
  }
}
