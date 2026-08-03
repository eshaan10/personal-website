import { DocEntry, DocSection } from "./doc/Doc";
import { AWARDS, INVOLVEMENTS, LEADERSHIP } from "@/lib/profile";
import { TIMELINE, type TimelineEntry } from "@/lib/timeline";

/**
 * The /about timeline as a resume document.
 *
 * Regrouped by kind rather than kept in reverse-chronological order: a
 * recruiter scanning for employment history should not have to filter
 * side projects out of it line by line.
 */
const SECTIONS: { title: string; kind: TimelineEntry["kind"] }[] = [
  { title: "Work Experience", kind: "work" },
  { title: "Projects", kind: "project" },
  { title: "Education", kind: "education" },
];

export default function TimelineDocument() {
  return (
    <div className="doc-sheet">
      {SECTIONS.map((section) => {
        const entries = TIMELINE.filter((entry) => entry.kind === section.kind);
        if (entries.length === 0) return null;

        return (
          <DocSection key={section.kind} title={section.title}>
            {entries.map((entry) => (
              <DocEntry
                key={entry.id}
                title={entry.title}
                titleMeta={entry.date}
                subtitle={entry.org}
                bullets={[entry.description]}
              />
            ))}
          </DocSection>
        );
      })}

      {/* Parity with the dark /journey page, which shows these below the timeline. */}
      <DocSection title="Leadership & Involvement">
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
      </DocSection>

      <DocSection title="Awards">
        <p className="doc-inline-list">{AWARDS.join(" · ")}</p>
      </DocSection>
    </div>
  );
}
