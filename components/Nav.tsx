"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import GlassPanel from "./GlassPanel";
import { useRecruiterMode } from "./AppProviders";
import { NAV_HEIGHT, NAV_SENTINEL_ID, PRIMARY_NAV } from "@/lib/nav";
import { smoothScrollToId } from "@/lib/scroll";

export default function Nav() {
  const pathname = usePathname();
  const { recruiterMode, toggleRecruiterMode } = useRecruiterMode();
  // Pages without a hero (everything but home) start frosted; the effect
  // below corrects this on mount if a sentinel turns up.
  const [frosted, setFrosted] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById(NAV_SENTINEL_ID);

    if (!sentinel) {
      setFrosted(true);
      return;
    }

    // Flip once the hero's bottom edge passes under the bar. The negative
    // top margin shrinks the observer root by the nav's own height so the
    // change fires as the hero clears the bar, not as it clears the viewport.
    const observer = new IntersectionObserver(
      ([entry]) => setFrosted(!entry.isIntersecting),
      { rootMargin: `-${NAV_HEIGHT}px 0px 0px 0px`, threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header
      data-print-hide
      className="fixed inset-x-0 top-0 z-50"
      style={{ height: NAV_HEIGHT }}
    >
      {/* The frosted surface is its own layer so it can cross-fade.
          Animating opacity avoids transitioning backdrop-filter, which
          repaints the whole blurred region every frame. */}
      <GlassPanel
        aria-hidden
        radius="none"
        edge="bottom"
        tone="raised"
        className={`ease-smooth absolute inset-0 transition-opacity duration-500 ${
          frosted ? "opacity-100" : "opacity-0"
        }`}
      />

      <nav
        aria-label="Main"
        className="relative mx-auto flex h-full w-full max-w-5xl items-center justify-between px-6 md:px-10"
      >
        <Link
          href="/"
          className="ease-smooth font-mono text-[13px] uppercase tracking-label text-text-primary transition-opacity duration-300 hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/40"
        >
          EP
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <ul className="flex items-center gap-4 sm:gap-6">
            {PRIMARY_NAV.map((link) => {
            const [linkPath, hash] = link.href.split("#");
            const targetPath = linkPath || "/";
            const active = hash
              ? pathname === targetPath
              : pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={(event) => {
                    // Already on the page that owns the section — scroll
                    // rather than re-navigating. Otherwise fall through and
                    // let the router go Home; <HashScroll /> finishes the job.
                    if (!hash || pathname !== targetPath) return;
                    event.preventDefault();
                    smoothScrollToId(hash);
                    window.history.replaceState(null, "", link.href);
                  }}
                  aria-current={active ? "page" : undefined}
                  className={`ease-smooth text-[13px] transition-colors duration-300 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/40 sm:text-sm ${
                    active ? "text-text-primary" : "text-text-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
          </ul>

          <button
            type="button"
            onClick={toggleRecruiterMode}
            aria-pressed={recruiterMode}
            title="Strip animation and glass for a plain, scannable view"
            // Styled off colour tokens, not literal white — recruiter mode
            // repaints the site light and a white-on-white pill would vanish.
            className={`ease-smooth shrink-0 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-label transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current ${
              recruiterMode
                ? "border-current text-text-primary"
                : "border-glass-border-soft text-text-secondary hover:text-text-primary"
            }`}
          >
            {recruiterMode ? "Recruiter ✓" : "Recruiter"}
          </button>
        </div>
      </nav>
    </header>
  );
}
