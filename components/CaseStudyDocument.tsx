import Link from "next/link";
import { DocSection } from "./doc/Doc";
import type { Project } from "@/lib/projects";

/** A project case study in recruiter mode: flat prose, no panels. */
export default function CaseStudyDocument({ project }: { project: Project }) {
  const { caseStudy } = project;

  return (
    <div className="doc-sheet">
      <p className="doc-inline-list print:hidden">
        <Link href="/projects" className="underline underline-offset-2">
          ← All projects
        </Link>
      </p>

      <h1 className="doc-name mt-4">{project.name}</h1>
      <p className="doc-contact">{project.tagline}</p>

      <DocSection title="Overview">
        <div className="doc-row">
          <span className="doc-primary">Status</span>
          <span className="doc-meta">{project.statusLabel}</span>
        </div>
        <div className="doc-row">
          <span className="doc-primary">Stack</span>
          <span className="doc-meta">{project.tech.join(", ")}</span>
        </div>
        <div className="doc-row">
          <span className="doc-primary">Links</span>
          <span className="doc-meta">
            {project.liveUrl && (
              <>
                <a
                  href={project.liveUrl}
                  className="print-url underline underline-offset-2"
                >
                  Live site
                </a>
                {" · "}
              </>
            )}
            <a
              href={project.repo}
              className="print-url underline underline-offset-2"
            >
              GitHub
            </a>
          </span>
        </div>
      </DocSection>

      <DocSection title="The problem">
        {caseStudy.problem.map((paragraph) => (
          <p key={paragraph.slice(0, 40)} className="doc-inline-list">
            {paragraph}
          </p>
        ))}
      </DocSection>

      <DocSection title="The approach">
        {caseStudy.approach.map((paragraph) => (
          <p key={paragraph.slice(0, 40)} className="doc-inline-list">
            {paragraph}
          </p>
        ))}
      </DocSection>

      {caseStudy.features && caseStudy.features.length > 0 && (
        <DocSection title="What it does">
          <ul className="doc-bullets">
            {caseStudy.features.map((feature) => (
              <li key={feature.slice(0, 40)}>{feature}</li>
            ))}
          </ul>
        </DocSection>
      )}

      {caseStudy.architecture.length > 0 && (
        <DocSection title="Architecture">
          <ul className="doc-bullets">
            {caseStudy.architecture.map((note) => (
              <li key={note.title}>
                <span className="doc-primary">{note.title} — </span>
                {note.body}
              </li>
            ))}
          </ul>
        </DocSection>
      )}
    </div>
  );
}
