import Link from "next/link";
import GlassPanel from "./GlassPanel";
import RepoStatsStrip from "./RepoStats";
import StatusBadge from "./StatusBadge";
import TiltCard from "./TiltCard";
import type { RepoStats } from "@/lib/github";
import type { Project } from "@/lib/projects";

/** `stats` is optional — Home renders these cards without hitting the API. */
export default function ProjectCard({
  project,
  stats,
}: {
  project: Project;
  stats?: RepoStats;
}) {
  return (
    <TiltCard className="h-full">
      <GlassPanel
        as={Link}
        href={`/projects/${project.slug}`}
        tone="raised"
        radius="lg"
        shine
        className="ease-smooth flex h-full flex-col p-6 transition-[background-color,border-color] duration-500 hover:bg-white/[0.09] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/40 md:p-7"
      >
        <h3 className="text-xl font-semibold tracking-[-0.01em] text-text-primary">
          {project.name}
        </h3>

        <p className="mt-2 text-sm text-text-secondary">{project.tagline}</p>

        {/* Its own row, not inline with the title: the real status strings run
            long ("Shipped as a web app — app store release pending") and would
            crush the heading in a three-up grid. */}
        <div className="mt-4">
          <StatusBadge project={project} />
        </div>

        <p className="mt-4 flex-1 text-sm leading-relaxed text-text-muted">
          {project.description}
        </p>

        {stats && (
          <div className="mt-5 border-t border-glass-border-soft pt-4">
            <RepoStatsStrip stats={stats} />
          </div>
        )}

        <ul className="mt-6 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-glass-border-soft px-2.5 py-1 font-mono text-[10px] uppercase tracking-label text-text-muted"
            >
              {tech}
            </li>
          ))}
        </ul>
      </GlassPanel>
    </TiltCard>
  );
}
