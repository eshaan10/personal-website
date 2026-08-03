import { DocEntry, DocSection } from "./doc/Doc";
import { PROJECTS } from "@/lib/projects";

/** The projects index as a resume document. */
export default function ProjectsDocument() {
  return (
    <div className="doc-sheet">
      <DocSection title="Projects">
        {PROJECTS.map((project) => (
          <DocEntry
            key={project.slug}
            title={project.name}
            titleMeta={project.statusLabel}
            subtitle={project.tech.join(", ")}
          >
            <ul className="doc-bullets">
              <li>{project.description}</li>
              <li>
                <a
                  href={`/projects/${project.slug}`}
                  className="underline underline-offset-2"
                >
                  Case study
                </a>
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
              </li>
            </ul>
          </DocEntry>
        ))}
      </DocSection>
    </div>
  );
}
