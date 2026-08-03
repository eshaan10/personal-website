import { DocSection } from "./doc/Doc";
import { PROFILE } from "@/lib/profile";

/**
 * /contact in recruiter mode. No form: recruiter mode strips animation and
 * interactive chrome, and a plain address list is faster to act on than a
 * textarea for someone who is scanning.
 */
export default function ContactDocument() {
  const rows = [
    { label: "Email", value: PROFILE.email, href: `mailto:${PROFILE.email}` },
    {
      label: "GitHub",
      value: `github.com/${PROFILE.githubHandle}`,
      href: PROFILE.github,
    },
    {
      label: "LinkedIn",
      value: PROFILE.linkedinHandle,
      href: PROFILE.linkedin,
    },
    { label: "Location", value: PROFILE.location },
  ];

  return (
    <div className="doc-sheet">
      <DocSection title="Contact">
        <p className="doc-inline-list">
          Open to internships, new-grad roles, and interesting problems. Email
          is the fastest way to reach me.
        </p>

        <dl className="doc-entry space-y-1">
          {rows.map((row) => (
            <div key={row.label} className="doc-row">
              <dt className="doc-primary">{row.label}</dt>
              <dd className="doc-meta">
                {row.href ? (
                  <a
                    href={row.href}
                    className="print-url underline underline-offset-2"
                  >
                    {row.value}
                  </a>
                ) : (
                  row.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </DocSection>
    </div>
  );
}
