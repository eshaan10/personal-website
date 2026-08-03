import type { ReactNode } from "react";

/**
 * Resume-document primitives.
 *
 * Deliberately dumb and server-rendered — they carry no theme logic of their
 * own. All three contexts (the dark /resume page, recruiter mode, and print)
 * use these exact components and differ only in which colour tokens are in
 * scope. That is what keeps recruiter mode and the print view in the same
 * document family instead of two layouts that drift apart.
 */

export function DocSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="doc-section">
      <h2 className="doc-section-title">{title}</h2>
      <div className="doc-section-body">{children}</div>
    </section>
  );
}

export function DocBullets({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="doc-bullets">
      {items.map((item) => (
        <li key={item.slice(0, 48)}>{item}</li>
      ))}
    </ul>
  );
}

/**
 * One entry: bold title left with location/date right-aligned on the same
 * line, an optional italic subtitle row beneath, then the bullet list.
 */
export function DocEntry({
  title,
  titleMeta,
  subtitle,
  subtitleMeta,
  bullets,
  children,
}: {
  title: string;
  titleMeta?: string;
  subtitle?: string;
  subtitleMeta?: string;
  bullets?: string[];
  children?: ReactNode;
}) {
  return (
    <div className="doc-entry">
      <div className="doc-row">
        <span className="doc-primary">{title}</span>
        {titleMeta && <span className="doc-meta">{titleMeta}</span>}
      </div>

      {(subtitle || subtitleMeta) && (
        <div className="doc-row">
          <span className="doc-secondary">{subtitle}</span>
          {subtitleMeta && <span className="doc-meta">{subtitleMeta}</span>}
        </div>
      )}

      {bullets && <DocBullets items={bullets} />}
      {children}
    </div>
  );
}

export function DocHeader({
  name,
  contact,
}: {
  name: string;
  contact: { label: string; href?: string }[];
}) {
  return (
    <header className="doc-entry">
      <h1 className="doc-name">{name}</h1>
      <p className="doc-contact">
        {contact.map((item, index) => (
          <span key={item.label} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden>|</span>}
            {item.href ? (
              <a href={item.href} className="print-url underline underline-offset-2">
                {item.label}
              </a>
            ) : (
              <span>{item.label}</span>
            )}
          </span>
        ))}
      </p>
    </header>
  );
}
