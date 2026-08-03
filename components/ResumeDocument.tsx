import { DocEntry, DocHeader, DocSection } from "./doc/Doc";
import {
  AWARDS,
  COURSEWORK,
  EDUCATION,
  INVOLVEMENTS,
  LEADERSHIP,
  PROFILE,
  RESUME_PROJECTS,
  SKILLS,
  WORK_EXPERIENCE,
} from "@/lib/profile";

/**
 * The full resume, laid out with the shared document primitives.
 *
 * Rendered in three places with no per-context variants:
 *   - /resume, always
 *   - Home, when recruiter mode is on
 *   - the printed page, via the @media print rules
 */
export default function ResumeDocument() {
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

      {/* Hidden in print — a download link is meaningless on paper. */}
      <p className="mt-4 text-center print:hidden">
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noreferrer noopener"
          download="Eshaan-Punalekar-Resume.pdf"
          className="inline-flex rounded-[8px] border border-current px-4 py-2 font-mono text-[10px] uppercase tracking-label text-text-primary"
        >
          Download PDF ↓
        </a>
      </p>

      <DocSection title="Education">
        <DocEntry
          title={EDUCATION.org}
          titleMeta={EDUCATION.location}
          subtitle={EDUCATION.title}
          subtitleMeta={EDUCATION.date}
          bullets={EDUCATION.bullets}
        />
      </DocSection>

      <DocSection title="Work Experience">
        {WORK_EXPERIENCE.map((role) => (
          <DocEntry
            key={role.org}
            title={role.org}
            titleMeta={role.location}
            subtitle={role.title}
            subtitleMeta={role.date}
            bullets={role.bullets}
          />
        ))}
      </DocSection>

      <DocSection title="Projects">
        {RESUME_PROJECTS.map((project) => (
          <DocEntry
            key={project.name}
            title={project.name}
            titleMeta={project.date}
            subtitle={project.stack}
            bullets={project.bullets}
          />
        ))}
      </DocSection>

      <DocSection title="Additional">
        {LEADERSHIP.map((role) => (
          <DocEntry
            key={role.org}
            title={`${role.title} | ${role.org}`}
            titleMeta={role.date}
            bullets={role.bullets}
          />
        ))}

        {INVOLVEMENTS.map((involvement) => (
          <DocEntry
            key={involvement.name}
            title={involvement.name}
            titleMeta={involvement.date}
            subtitle={involvement.role}
            bullets={[involvement.summary]}
          />
        ))}

        <div className="doc-entry space-y-1">
          <p className="doc-inline-list">
            <span className="doc-primary">Skills: </span>
            {SKILLS.flatMap((group) => group.items).join(", ")}
          </p>
          <p className="doc-inline-list">
            <span className="doc-primary">Coursework: </span>
            {COURSEWORK.join(", ")}
          </p>
          <p className="doc-inline-list">
            <span className="doc-primary">Awards: </span>
            {AWARDS.join("; ")}
          </p>
        </div>
      </DocSection>
    </div>
  );
}
