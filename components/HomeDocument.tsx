import Link from "next/link";
import { DocEntry, DocHeader, DocSection } from "./doc/Doc";
import { SECTION_IDS } from "@/lib/nav";
import { NOW_SECTIONS, NOW_UPDATED } from "@/lib/now";
import { PROFILE } from "@/lib/profile";
import { PROJECTS } from "@/lib/projects";
import { STACK } from "@/lib/stack";
import { COMPACT_TIMELINE_COUNT, TIMELINE } from "@/lib/timeline";

/**
 * Home in recruiter mode.
 *
 * Mirrors the real page's structure — about, stack, projects — and carries the
 * same section ids, so the nav anchors resolve identically in both modes.
 * Without those ids, /#about and /#stack land nowhere and every nav item
 * appears to do nothing.
 */
export default function HomeDocument() {
  return (
    <div className="doc-sheet">
      <DocHeader
        name={PROFILE.name}
        contact={[
          { label: PROFILE.location },
          { label: PROFILE.email, href: `mailto:${PROFILE.email}` },
          { label: `github.com/${PROFILE.githubHandle}`, href: PROFILE.github },
          { label: PROFILE.linkedinHandle, href: PROFILE.linkedin },
        ]}
      />

      <p className="doc-inline-list mt-4 text-center">{PROFILE.headline}</p>

      <div id={SECTION_IDS.about} className="scroll-mt-28">
        <DocSection title="About">
          <p className="doc-inline-list">
            <span className="doc-primary">Right now </span>
            <span>(updated {NOW_UPDATED})</span>
          </p>

          {NOW_SECTIONS.map((section) => (
            <DocEntry key={section.title} title={section.title} bullets={section.items} />
          ))}

          <div className="doc-entry">
            <p className="doc-primary">Recently</p>
            <ul className="doc-bullets">
              {TIMELINE.slice(0, COMPACT_TIMELINE_COUNT).map((entry) => (
                <li key={entry.id}>
                  <span className="doc-primary">{entry.title}</span>
                  {" — "}
                  {entry.org} ({entry.date})
                </li>
              ))}
            </ul>
            <p className="doc-inline-list mt-2">
              <Link href="/journey" className="underline underline-offset-2">
                See full journey →
              </Link>
            </p>
          </div>
        </DocSection>
      </div>

      <div id={SECTION_IDS.stack} className="scroll-mt-28">
        <DocSection title="Technical Skills">
          {STACK.map((category) => (
            <p key={category.id} className="doc-inline-list">
              <span className="doc-primary">{category.label}: </span>
              {category.items.map((item) => item.name).join(", ")}
            </p>
          ))}
        </DocSection>
      </div>

      <div id={SECTION_IDS.projects} className="scroll-mt-28">
        <DocSection title="Projects">
          {PROJECTS.map((project) => (
            <DocEntry
              key={project.slug}
              title={project.name}
              titleMeta={project.statusLabel}
              subtitle={project.tech.join(", ")}
              bullets={[project.description]}
            >
              <p className="doc-inline-list mt-1">
                <Link
                  href={`/projects/${project.slug}`}
                  className="underline underline-offset-2"
                >
                  Case study
                </Link>
                {project.liveUrl && (
                  <>
                    {" · "}
                    <a
                      href={project.liveUrl}
                      className="print-url underline underline-offset-2"
                    >
                      Live site
                    </a>
                  </>
                )}
                {" · "}
                <a
                  href={project.repo}
                  className="print-url underline underline-offset-2"
                >
                  GitHub
                </a>
              </p>
            </DocEntry>
          ))}
        </DocSection>
      </div>
    </div>
  );
}
