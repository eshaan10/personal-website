import Link from "next/link";
import ProjectCard from "./ProjectCard";
import { SECTION_IDS } from "@/lib/nav";
import { FEATURED_PROJECTS } from "@/lib/projects";

/** Featured cards on Home; the full index (with live GitHub stats) is /projects. */
export default function ProjectsPreview() {
  return (
    <section
      id={SECTION_IDS.projects}
      className="mx-auto w-full max-w-5xl scroll-mt-28 px-6 pb-32 md:px-10"
    >
      <p className="label-mono">
        <span className="text-text-primary">03</span>
        <span className="mx-2 text-text-muted">//</span>
        <span>projects</span>
      </p>

      <h2 className="mt-6 max-w-3xl text-3xl font-semibold leading-[1.08] tracking-[-0.02em] text-text-primary md:text-5xl">
        Selected work.
      </h2>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_PROJECTS.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      <Link
        href="/projects"
        className="ease-smooth mt-14 inline-flex rounded-[10px] border border-glass-border px-5 py-3 font-mono text-[11px] uppercase tracking-label text-text-primary transition-colors duration-300 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
      >
        All projects →
      </Link>
    </section>
  );
}
