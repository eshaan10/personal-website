import type { Metadata } from "next";
import GitHubContributions from "@/components/GitHubContributions";
import Image from "next/image";
import GlassPanel from "@/components/GlassPanel";
import RecruiterSwitch from "@/components/RecruiterSwitch";
import Timeline from "@/components/Timeline";
import TimelineDocument from "@/components/TimelineDocument";
import TiltCard from "@/components/TiltCard";
import { NOW_SECTIONS, NOW_UPDATED } from "@/lib/now";
import { AWARDS, INVOLVEMENTS, LEADERSHIP, PROFILE } from "@/lib/profile";
import { TIMELINE } from "@/lib/timeline";

/**
 * Soft circular edge for the headshot. `closest-side` measures the stops
 * against the circle's radius — the default `farthest-corner` would push the
 * entire fade band outside the visible crop, leaving a hard edge.
 */
const EDGE_FADE =
  "radial-gradient(circle closest-side at 50% 50%, #000 68%, rgba(0,0,0,0.55) 86%, transparent 100%)";

export const metadata: Metadata = {
  title: "Journey — Eshaan Punalekar",
  description:
    "The full story: what I'm working on now, and every role and project along the way.",
};

/**
 * The long-form counterpart to Home's compact About section: full about copy,
 * the complete timeline, and the contribution graph — which lives here only.
 * The projects page gets commit activity instead, so the two don't overlap.
 */
export default function JourneyPage() {
  return (
    <RecruiterSwitch
      recruiter={
        <main className="relative pb-32 pt-36">
          <TimelineDocument />
        </main>
      }
    >
      <main className="relative">
        <section className="mx-auto w-full max-w-5xl px-6 pb-32 pt-36 md:px-10">
          <p className="label-mono">Journey</p>

          <h1 className="mt-6 max-w-3xl text-3xl font-semibold leading-[1.12] tracking-[-0.02em] text-text-primary md:text-5xl">
            The full story.
          </h1>

          {/* Photo sits alongside the opening prose on md+, above it on
              mobile. The small top margin drops it to the cap height of the
              first line rather than the paragraph's box top, so the two read
              as one unit instead of the photo floating slightly high. */}
          <div className="mt-10 flex flex-col gap-7 md:flex-row md:items-start md:gap-8">
            <TiltCard max={8} className="shrink-0 self-start md:mt-1.5">
              <div className="relative h-32 w-36 md:h-36 md:w-36 rounded-full">
                {/* soft glow behind the circle instead of the edge-fade */}
                <div
                  className="absolute inset-0 rounded-full blur-xl"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,255,255,0.12), transparent 70%)",
                    transform: "scale(1.25)",
                  }}
                />
                <Image
                  src="/headshot.jpg"
                  alt="Eshaan Punalekar"
                  width={288}
                  height={288}
                  priority
                  sizes="144px"
                  // Full natural colour — the one deliberately warm moment on
                  // an otherwise monochrome site.
                  className="relative h-32 w-32 md:h-36 md:w-36 rounded-full object-cover
                            ring-1 ring-white/15"
                />
              </div>
            </TiltCard>

            {/* ⚠️ DRAFT COPY — my words. The facts are real; the voice is invented. */}
            <div className="max-w-2xl space-y-5 leading-relaxed text-text-secondary">
              <p>
                I&apos;m a Computer Science student at UC Irvine specialising in
                Intelligent Systems, with a minor in Innovation and
                Entrepreneurship. Most of what I build sits where machine
                learning meets a product someone actually has to use.
              </p>
              <p>
                That&apos;s taken me through four internships — credit risk
                modelling at Scienaptic AI, healthcare document pipelines at
                Shift Technology, agent infrastructure at Emergence AI, and now
                data and automation work at CliftonLarsonAllen. The common
                thread is turning messy, unstructured input into something a
                system can act on with confidence.
              </p>
              <p>
                Outside of work I ship my own things, mostly to answer questions
                I couldn&apos;t find good answers to: whether a recruiting
                platform can level the playing field, whether a prediction
                engine can be honest about its own accuracy, whether a receipt
                can track its own deadlines.
              </p>
            </div>
          </div>

          <div className="mt-20">
            <p className="label-mono">
              Right now — updated{" "}
              <span className="text-text-secondary">{NOW_UPDATED}</span>
            </p>

            {/* No panels — labels sit directly on the page with a single
                hairline between the columns, matching the Stack section. */}
            <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-0">
              {NOW_SECTIONS.map((section, index) => (
                <div
                  key={section.title}
                  className={
                    index === 0
                      ? "md:pr-12"
                      : "md:border-l md:border-glass-border-soft md:pl-12"
                  }
                >
                  <h2 className="label-mono">{section.title}</h2>
                  <ul className="mt-6 space-y-4">
                    {section.items.map((item) => (
                      <li
                        key={item.slice(0, 40)}
                        className="relative max-w-md pl-5 text-sm leading-relaxed text-text-secondary before:absolute before:left-0 before:top-[9px] before:h-1 before:w-1 before:rounded-full before:bg-text-muted"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-28">
            <p className="label-mono">The full timeline</p>
            <h2 className="mt-6 max-w-2xl text-2xl font-semibold tracking-[-0.02em] text-text-primary md:text-4xl">
              How I got here
            </h2>
            <Timeline entries={TIMELINE} className="mt-16" />
          </div>

          {/* Same content as /resume's Additional + Awards, but built from
              this page's vocabulary — mono eyebrow, glass panels, chips —
              rather than the resume document's rules-and-bullets layout. */}
          <div className="mt-28">
            <p className="label-mono">Beyond the work</p>
            <h2 className="mt-6 max-w-2xl text-2xl font-semibold tracking-[-0.02em] text-text-primary md:text-4xl">
              Leadership &amp; involvement
            </h2>

            <div className="mt-12 space-y-6">
              {LEADERSHIP.map((role) => (
                <GlassPanel
                  key={role.org}
                  radius="lg"
                  tone="raised"
                  shine
                  className="p-6 md:p-7"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <h3 className="text-lg font-semibold text-text-primary">
                      {role.org}
                    </h3>
                    <span className="font-mono text-[11px] uppercase tracking-label text-text-secondary">
                      {role.date}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">
                    {role.title}
                  </p>

                  {/* Narrative where one exists, bullets otherwise — so this
                      reads as a peer of the Gram Oorja entry below. */}
                  {role.story ? (
                    <div className="mt-6 max-w-2xl space-y-4 leading-relaxed text-text-secondary">
                      {role.story.map((paragraph) => (
                        <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                      ))}
                    </div>
                  ) : (
                    <ul className="mt-5 space-y-2.5">
                      {role.bullets.map((bullet) => (
                        <li
                          key={bullet.slice(0, 40)}
                          className="relative pl-5 text-sm leading-relaxed text-text-muted before:absolute before:left-0 before:top-[9px] before:h-1 before:w-1 before:rounded-full before:bg-text-muted"
                        >
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </GlassPanel>
              ))}

              {/* Given as narrative rather than bullets — at ~150 words it
                  needs prose measure and paragraph breaks, so it gets a
                  wider panel and body-text sizing instead of the compact
                  role-card treatment used above. */}
              {INVOLVEMENTS.map((involvement) => (
                <GlassPanel
                  key={involvement.name}
                  radius="lg"
                  tone="raised"
                  shine
                  className="p-6 md:p-8"
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

                  <div className="mt-6 max-w-2xl space-y-4 leading-relaxed text-text-secondary">
                    {involvement.story.map((paragraph) => (
                      <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                    ))}
                  </div>
                </GlassPanel>
              ))}
            </div>
          </div>

          <div className="mt-24">
            <p className="label-mono">Recognition</p>
            <h2 className="mt-6 max-w-2xl text-2xl font-semibold tracking-[-0.02em] text-text-primary md:text-4xl">
              Awards
            </h2>

            <ul className="mt-10 flex flex-wrap gap-3">
              {AWARDS.map((award) => (
                <li
                  key={award}
                  className="ease-smooth rounded-full border border-glass-border-soft px-4 py-2 font-mono text-[10px] uppercase tracking-label text-text-secondary transition-colors duration-300 hover:border-glass-border hover:text-text-primary"
                >
                  {award}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-24">
            <GitHubContributions />
          </div>

          <p className="mt-16 text-sm text-text-muted">
            Want to talk?{" "}
            <a
              href={`mailto:${PROFILE.email}`}
              className="text-text-secondary underline underline-offset-4 transition-colors duration-300 hover:text-text-primary"
            >
              {PROFILE.email}
            </a>
          </p>
        </section>
      </main>
    </RecruiterSwitch>
  );
}
