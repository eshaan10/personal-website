import type { Metadata } from "next";
import ContactDocument from "@/components/ContactDocument";
import ContactForm from "@/components/ContactForm";
import GlassPanel from "@/components/GlassPanel";
import RecruiterSwitch from "@/components/RecruiterSwitch";
import { PROFILE } from "@/lib/profile";

export const metadata: Metadata = {
  title: "Contact — Eshaan Punalekar",
  description: "Get in touch.",
};

const LINKS = [
  { label: "Email", value: PROFILE.email, href: `mailto:${PROFILE.email}` },
  {
    label: "GitHub",
    value: `github.com/${PROFILE.githubHandle}`,
    href: PROFILE.github,
    external: true,
  },
  {
    label: "LinkedIn",
    value: PROFILE.linkedinHandle,
    href: PROFILE.linkedin,
    external: true,
  },
];

export default function ContactPage() {
  return (
    <RecruiterSwitch
      recruiter={
        <main className="relative pb-32 pt-36">
          <ContactDocument />
        </main>
      }
    >
      <main className="relative">
        <section className="mx-auto w-full max-w-3xl px-6 pb-32 pt-36 md:px-10">
          <p className="label-mono">Contact</p>

          <h1 className="mt-6 max-w-2xl text-3xl font-semibold leading-[1.12] tracking-[-0.02em] text-text-primary md:text-5xl">
            Let&apos;s talk
          </h1>

          <p className="mt-6 max-w-xl leading-relaxed text-text-secondary">
            Open to internships, new-grad roles, and interesting problems. Send
            a note below, or reach me directly through any of the links.
          </p>

          <div className="mt-12">
            <ContactForm />
          </div>

          <ul className="mt-12 space-y-3">
            {LINKS.map((link) => (
              <li key={link.label}>
                <GlassPanel
                  as="a"
                  href={link.href}
                  shine
                  radius="md"
                  tone="raised"
                  {...(link.external
                    ? { target: "_blank", rel: "noreferrer noopener" }
                    : {})}
                  className="ease-smooth flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 p-5 transition-colors duration-500 hover:bg-white/[0.09] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/40"
                >
                  <span className="label-mono">{link.label}</span>
                  <span className="text-sm text-text-primary">
                    {link.value}
                    {link.external ? " ↗" : ""}
                  </span>
                </GlassPanel>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </RecruiterSwitch>
  );
}
