import type { Metadata } from "next";
import CommitFeed from "@/components/CommitFeed";
import CountUp from "@/components/CountUp";
import ProjectCard from "@/components/ProjectCard";
import ProjectsDocument from "@/components/ProjectsDocument";
import RecruiterSwitch from "@/components/RecruiterSwitch";
import { getProjectActivity } from "@/lib/github";
import { PROJECTS } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects — Eshaan Punalekar",
  description: "Things I've designed, built, and shipped.",
};

export default async function ProjectsPage() {
  const shipped = PROJECTS.filter((p) => p.tone === "shipped").length;

  // Cached hourly in lib/github.ts. Failures come back as empty structures,
  // so the page renders identically minus the stats.
  const { stats, commits } = await getProjectActivity(
    PROJECTS.map((project) => ({ slug: project.slug, url: project.repo })),
    10,
  );

  return (
    <RecruiterSwitch
      recruiter={
        <main className="relative pb-32 pt-36">
          <ProjectsDocument />
        </main>
      }
    >
      <main className="relative">
        <section className="mx-auto w-full max-w-6xl px-6 pb-32 pt-36 md:px-10">
          {/* Main column + rail. On < lg the rail drops below the grid rather
              than becoming a drawer: it's supplementary reading, and putting
              it behind a toggle on mobile would hide it from the visitors
              least likely to go looking. */}
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-14">
            <div>
              <p className="label-mono">Projects</p>

              <h1 className="mt-6 max-w-2xl text-3xl font-semibold leading-[1.12] tracking-[-0.02em] text-text-primary md:text-5xl">
                Things I&apos;ve built
              </h1>

              {/* Counted from lib/projects.ts, not hand-written, so they can't
                  drift out of sync with the grid below. */}
              <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
                <div>
                  <dt className="label-mono">Projects</dt>
                  <dd className="mt-2 font-mono text-3xl text-text-primary md:text-4xl">
                    <CountUp to={PROJECTS.length} />
                  </dd>
                </div>
                <div>
                  <dt className="label-mono">Shipped</dt>
                  <dd className="mt-2 font-mono text-3xl text-text-primary md:text-4xl">
                    <CountUp to={shipped} />
                  </dd>
                </div>
              </dl>

              <div className="mt-14 grid gap-6 sm:grid-cols-2">
                {PROJECTS.map((project) => (
                  <ProjectCard
                    key={project.slug}
                    project={project}
                    stats={stats[project.slug]}
                  />
                ))}
              </div>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <CommitFeed commits={commits} variant="rail" />
            </aside>
          </div>
        </section>
      </main>
    </RecruiterSwitch>
  );
}
