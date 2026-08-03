"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ALL_NAV } from "@/lib/nav";
import { PROJECTS } from "@/lib/projects";

type Item = {
  href: string;
  label: string;
  group: string;
  hint?: string;
};

const PAGES: Item[] = [
  { href: "/", label: "Home", group: "Pages" },
  ...ALL_NAV.map((link) => ({ ...link, group: "Pages" })),
];

const CASE_STUDIES: Item[] = PROJECTS.map((project) => ({
  href: `/projects/${project.slug}`,
  label: project.name,
  group: "Case studies",
  hint: project.tagline,
}));

const ALL_ITEMS = [...PAGES, ...CASE_STUDIES];

export default function CommandPalette() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  // So focus goes back where it came from on close.
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_ITEMS;
    return ALL_ITEMS.filter((item) =>
      `${item.label} ${item.hint ?? ""} ${item.group}`.toLowerCase().includes(q),
    );
  }, [query]);

  // Close on route change — navigating is the palette's whole job.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  // Global open/close shortcut.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((previous) => {
          if (!previous) restoreFocusRef.current = document.activeElement as HTMLElement;
          return !previous;
        });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      // Wait for the input to exist before focusing it.
      requestAnimationFrame(() => inputRef.current?.focus());
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }

    restoreFocusRef.current?.focus?.();
    restoreFocusRef.current = null;
  }, [open]);

  if (!open) return null;

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key === "ArrowDown" || (event.key === "Tab" && !event.shiftKey)) {
      event.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
      return;
    }

    if (event.key === "ArrowUp" || (event.key === "Tab" && event.shiftKey)) {
      event.preventDefault();
      setActive((i) =>
        results.length ? (i - 1 + results.length) % results.length : 0,
      );
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      // Click the real anchor rather than calling router.push, so the global
      // View Transitions click handler picks it up like any other link.
      itemRefs.current[active]?.click();
    }
  };

  let renderedGroup = "";

  return (
    <div
      data-print-hide
      className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]"
      onKeyDown={onKeyDown}
    >
      <button
        type="button"
        aria-label="Close command palette"
        onClick={() => setOpen(false)}
        className="absolute inset-0 h-full w-full cursor-default bg-black/50 backdrop-blur-[2px]"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="glass-blur animate-rise-in relative w-full max-w-xl overflow-hidden rounded-[16px] border border-glass-border shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
      >
        <div className="border-b border-glass-border-soft px-4">
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            role="combobox"
            aria-expanded
            aria-controls="command-palette-list"
            aria-autocomplete="list"
            placeholder="Jump to…"
            className="w-full bg-transparent py-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          />
        </div>

        <ul
          id="command-palette-list"
          role="listbox"
          className="max-h-[52vh] overflow-y-auto p-2"
        >
          {results.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-text-muted">
              Nothing matches “{query}”.
            </li>
          )}

          {results.map((item, index) => {
            const showGroup = item.group !== renderedGroup;
            renderedGroup = item.group;
            const isActive = index === active;

            return (
              <li key={item.href}>
                {showGroup && (
                  <p className="label-mono px-3 pb-2 pt-3">{item.group}</p>
                )}
                <Link
                  ref={(node) => {
                    itemRefs.current[index] = node;
                  }}
                  href={item.href}
                  role="option"
                  aria-selected={isActive}
                  tabIndex={-1}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => setOpen(false)}
                  className={`ease-smooth flex items-baseline justify-between gap-4 rounded-[10px] px-3 py-2.5 text-sm transition-colors duration-200 ${
                    isActive
                      ? "bg-white/[0.09] text-text-primary"
                      : "text-text-secondary"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.hint && (
                    <span className="truncate text-xs text-text-muted">
                      {item.hint}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-glass-border-soft px-4 py-3 font-mono text-[10px] uppercase tracking-label text-text-muted">
          <span>↑↓ Navigate</span>
          <span>↵ Open</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
}
