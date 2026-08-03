import Link from "next/link";
import { SECONDARY_NAV } from "@/lib/nav";
import { PROFILE } from "@/lib/profile";

const EXTERNAL = [
  { href: PROFILE.github, label: "GitHub" },
  { href: PROFILE.linkedin, label: "LinkedIn" },
];

/**
 * Secondary navigation. Now and Contact live here after the primary nav was
 * cut to four items — visible on every page and at every viewport, with no
 * click needed to reveal them.
 */
export default function Footer() {
  return (
    <footer
      data-print-hide
      className="mt-auto border-t border-glass-border-soft"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-8 gap-y-4 px-6 py-10 md:px-10">
        <p className="font-mono text-[11px] uppercase tracking-label text-text-muted">
          © {new Date().getFullYear()} {PROFILE.name}
        </p>

        <nav aria-label="Secondary">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {SECONDARY_NAV.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="ease-smooth font-mono text-[11px] uppercase tracking-label text-text-secondary transition-colors duration-300 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {EXTERNAL.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="ease-smooth font-mono text-[11px] uppercase tracking-label text-text-secondary transition-colors duration-300 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
                >
                  {link.label} ↗
                </a>
              </li>
            ))}

            <li>
              <a
                href={`mailto:${PROFILE.email}`}
                className="ease-smooth font-mono text-[11px] uppercase tracking-label text-text-primary transition-opacity duration-300 hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
              >
                Email
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
