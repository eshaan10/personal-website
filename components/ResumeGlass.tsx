import GlassPanel from "./GlassPanel";
import {
  AWARDS,
  COURSEWORK,
  EDUCATION,
  INVOLVEMENTS,
  LEADERSHIP,
  PROFILE,
  RESUME_PROJECTS,
  WORK_EXPERIENCE,
  type ResumeRole,
} from "@/lib/profile";
import { STACK } from "@/lib/stack";

/**
 * The dark, glass presentation of the resume — what /resume shows normally.
 *
 * Intentionally NOT the document layout. Recruiter mode already serves the
 * flat printable version; if this page rendered the same thing on a dark
 * background, the toggle would produce a near-duplicate and there would be no
 * reason to have both. Same content from lib/profile.ts, different medium:
 * cards, chips, generous spacing, mono eyebrows.
 */

function Section({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-20">
      <p className="label-mono">
        <span className="text-text-primary">{index}</span>
        <span className="mx-2 text-text-muted">//</span>
        <span>{title.toLowerCase()}</span>
      </p>
      <h2 className="mt-4 text-2xl font-semibold tracking-[-0.01em] text-text-primary md:text-3xl">
        {title}
      </h2>
      <div className="mt-8 space-y-4">{children}</div>
    </section>
  );
}

function RoleCard({ role }: { role: ResumeRole }) {
  return (
    <GlassPanel tone="raised" radius="lg" shine className="p-6 md:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="text-lg font-semibold text-text-primary">{role.org}</h3>
        <span className="font-mono text-[11px] uppercase tracking-label text-text-secondary">
          {role.date}
        </span>
      </div>

      <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="text-sm text-text-secondary">{role.title}</p>
        <span className="font-mono text-[10px] uppercase tracking-label text-text-muted">
          {role.location}
        </span>
      </div>

      <ul className="mt-5 space-y-2.5">
        {role.bullets.map((bullet) => (
          <li
            key={bullet.slice(0, 40)}
            className="relative pl-5 text-sm leading-relaxed text-text-muted before:absolute before:left-0 before:top-[9px] before:h-1 before:w-1 before:rounded-full before:bg-white/30"
          >
            {bullet}
          </li>
        ))}
      </ul>
    </GlassPanel>
  );
}

export default function ResumeGlass() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 pb-32 pt-36 md:px-10">
      <p className="label-mono">Resume</p>

      <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.02em] text-text-primary md:text-6xl">
        {PROFILE.name}
      </h1>

      <p className="mt-5 max-w-xl leading-relaxed text-text-secondary">
        {PROFILE.headline}
      </p>

      <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-label text-text-secondary">
        <span>{PROFILE.location}</span>
        <a
          href={`mailto:${PROFILE.email}`}
          className="ease-smooth transition-colors duration-300 hover:text-text-primary"
        >
          {PROFILE.email}
        </a>
        <a
          href={PROFILE.github}
          target="_blank"
          rel="noreferrer noopener"
          className="ease-smooth transition-colors duration-300 hover:text-text-primary"
        >
          GitHub ↗
        </a>
        <a
          href={PROFILE.linkedin}
          target="_blank"
          rel="noreferrer noopener"
          className="ease-smooth transition-colors duration-300 hover:text-text-primary"
        >
          LinkedIn ↗
        </a>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noreferrer noopener"
          download="Eshaan-Punalekar-Resume.pdf"
          className="ease-smooth inline-flex rounded-[10px] bg-text-primary px-5 py-3 font-mono text-[11px] uppercase tracking-label text-ink-900 transition-[transform,opacity] duration-300 hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
        >
          Download PDF ↓
        </a>
      </div>

      <p className="mt-6 text-sm text-text-muted">
        Press ⌘P / Ctrl+P for the printable one-pager, or flip{" "}
        <span className="text-text-secondary">Recruiter</span> in the nav for
        the plain-text version.
      </p>

      <Section index="01" title="Education">
        <GlassPanel tone="raised" radius="lg" shine className="p-6 md:p-7">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h3 className="text-lg font-semibold text-text-primary">
              {EDUCATION.org}
            </h3>
            <span className="font-mono text-[11px] uppercase tracking-label text-text-secondary">
              {EDUCATION.date}
            </span>
          </div>
          <p className="mt-1 text-sm text-text-secondary">{EDUCATION.title}</p>
          <p className="mt-4 text-sm text-text-muted">
            Minor: Innovation and Entrepreneurship
          </p>

          <p className="label-mono mt-7">Coursework</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {COURSEWORK.map((course) => (
              <li
                key={course}
                className="rounded-full border border-glass-border-soft px-3 py-1.5 font-mono text-[10px] uppercase tracking-label text-text-muted"
              >
                {course}
              </li>
            ))}
          </ul>
        </GlassPanel>
      </Section>

      <Section index="02" title="Experience">
        {WORK_EXPERIENCE.map((role) => (
          <RoleCard key={role.org} role={role} />
        ))}
      </Section>

      <Section index="03" title="Projects">
        {RESUME_PROJECTS.map((project) => (
          <GlassPanel
            key={project.name}
            tone="raised"
            radius="lg"
            shine
            className="p-6 md:p-7"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3 className="text-lg font-semibold text-text-primary">
                {project.name}
              </h3>
              <span className="font-mono text-[11px] uppercase tracking-label text-text-secondary">
                {project.date}
              </span>
            </div>

            <ul className="mt-5 space-y-2.5">
              {project.bullets.map((bullet) => (
                <li
                  key={bullet.slice(0, 40)}
                  className="relative pl-5 text-sm leading-relaxed text-text-muted before:absolute before:left-0 before:top-[9px] before:h-1 before:w-1 before:rounded-full before:bg-white/30"
                >
                  {bullet}
                </li>
              ))}
            </ul>

            <ul className="mt-6 flex flex-wrap gap-2">
              {project.stack.split(", ").map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-glass-border-soft px-2.5 py-1 font-mono text-[10px] uppercase tracking-label text-text-muted"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </GlassPanel>
        ))}
      </Section>

      <Section index="04" title="Skills">
        <div className="grid gap-4 sm:grid-cols-2">
          {STACK.map((category) => (
            <GlassPanel
              key={category.id}
              tone="raised"
              radius="lg"
              className="p-6"
            >
              <h3 className="border-b border-glass-border pb-3 font-mono text-[11px] uppercase tracking-label text-text-primary">
                {category.label}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <li
                    key={item.name}
                    className="rounded-full border border-glass-border-soft px-2.5 py-1 font-mono text-[10px] uppercase tracking-label text-text-muted"
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            </GlassPanel>
          ))}
        </div>
      </Section>

      <Section index="05" title="Involvement">
        {LEADERSHIP.map((role) => (
          <RoleCard key={role.org} role={role} />
        ))}

        {/* Summary line, not the full narrative — that lives on /journey,
            where there's room for it to breathe. */}
        {INVOLVEMENTS.map((involvement) => (
          <GlassPanel
            key={involvement.name}
            tone="raised"
            radius="lg"
            className="p-6 md:p-7"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3 className="text-lg font-semibold text-text-primary">
                {involvement.name}
              </h3>
              <span className="font-mono text-[11px] uppercase tracking-label text-text-secondary">
                {involvement.date}
              </span>
            </div>
            <p className="mt-1 text-sm text-text-secondary">
              {involvement.role}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-muted">
              {involvement.summary}
            </p>
          </GlassPanel>
        ))}
      </Section>

      <Section index="06" title="Awards">
        <GlassPanel tone="raised" radius="lg" className="p-6 md:p-7">
          <ul className="flex flex-wrap gap-2">
            {AWARDS.map((award) => (
              <li
                key={award}
                className="rounded-full border border-glass-border-soft px-3 py-1.5 font-mono text-[10px] uppercase tracking-label text-text-secondary"
              >
                {award}
              </li>
            ))}
          </ul>
        </GlassPanel>
      </Section>
    </div>
  );
}
