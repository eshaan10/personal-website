import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AccentSetter from "@/components/AccentSetter";
import CaseStudyDocument from "@/components/CaseStudyDocument";
import GlassPanel from "@/components/GlassPanel";
import RecruiterSwitch from "@/components/RecruiterSwitch";
import StatusBadge from "@/components/StatusBadge";
import { PROJECTS, getProject } from "@/lib/projects";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const project = getProject(params.slug);
  if (!project) return { title: "Not found" };

  return {
    title: `${project.name} — Eshaan Punalekar`,
    description: project.description,
  };
}

function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="mt-6 space-y-4">
      {paragraphs.map((paragraph) => (
        <p
          key={paragraph.slice(0, 40)}
          className="max-w-2xl leading-relaxed text-text-secondary"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-20">
      <p className="label-mono">{eyebrow}</p>
      <h2 className="mt-4 text-2xl font-semibold tracking-[-0.01em] text-text-primary md:text-3xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) notFound();

  return (
    <RecruiterSwitch
      recruiter={
        <main className="relative pb-32 pt-36">
          <CaseStudyDocument project={project} />
        </main>
      }
    >
      <main className="relative">
        <AccentSetter accent={project.accent} />

        <article className="mx-auto w-full max-w-4xl px-6 pb-32 pt-36 md:px-10">
          <Link
            href="/projects"
            className="ease-smooth font-mono text-[11px] uppercase tracking-label text-text-secondary transition-colors duration-300 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/40"
          >
            ← All projects
          </Link>

          <header className="mt-10">
            <h1 className="text-4xl font-semibold leading-[1.08] tracking-[-0.02em] text-text-primary md:text-6xl">
              {project.name}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-text-secondary">
              {project.tagline}
            </p>
            <div className="mt-6">
              <StatusBadge project={project} />
            </div>
          </header>

          <GlassPanel radius="lg" className="mt-12 p-6 md:p-7">
            <div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-start">
              <div>
                <p className="label-mono">Stack</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-glass-border-soft px-2.5 py-1 font-mono text-[10px] uppercase tracking-label text-text-muted"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="ease-smooth inline-flex items-center gap-2 rounded-[10px] bg-text-primary px-4 py-2.5 font-mono text-[11px] uppercase tracking-label text-ink-900 transition-opacity duration-300 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/40"
                  >
                    Live site ↗
                  </a>
                )}

                <a
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="ease-smooth inline-flex items-center gap-2 rounded-[10px] border border-glass-border px-4 py-2.5 font-mono text-[11px] uppercase tracking-label text-text-primary transition-colors duration-300 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/40"
                >
                  GitHub ↗
                </a>
              </div>
            </div>
          </GlassPanel>

          <Section eyebrow="01" title="The problem">
            <Prose paragraphs={project.caseStudy.problem} />
          </Section>

          <Section eyebrow="02" title="The approach">
            <Prose paragraphs={project.caseStudy.approach} />
          </Section>

          {/* Confirmed shipped features take precedence over inferred
            architecture. Where a project has `features`, that is what ran in
            production; the architecture list is reasoning, not fact. */}
          {project.caseStudy.features &&
            project.caseStudy.features.length > 0 && (
              <Section eyebrow="03" title="What it does">
                <ul className="mt-8 space-y-px overflow-hidden rounded-glass border border-glass-border-soft">
                  {project.caseStudy.features.map((feature) => (
                    <li
                      key={feature.slice(0, 40)}
                      className="glass-blur p-5 text-sm leading-relaxed text-text-secondary md:p-6"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

          {project.caseStudy.architecture.length > 0 && (
            <Section
              eyebrow={project.caseStudy.features ? "04" : "03"}
              title="Architecture"
            >
              <dl className="mt-8 space-y-px overflow-hidden rounded-glass border border-glass-border-soft">
                {project.caseStudy.architecture.map((note) => (
                  <div
                    key={note.title}
                    className="glass-blur grid gap-2 p-5 sm:grid-cols-[220px_1fr] sm:gap-6 md:p-6"
                  >
                    <dt className="font-mono text-[11px] uppercase tracking-label text-text-primary">
                      {note.title}
                    </dt>
                    <dd className="text-sm leading-relaxed text-text-muted">
                      {note.body}
                    </dd>
                  </div>
                ))}
              </dl>
            </Section>
          )}
        </article>
      </main>
    </RecruiterSwitch>
  );
}
