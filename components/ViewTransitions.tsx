"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useRecruiterMode } from "./AppProviders";

/**
 * Native View Transitions for client-side navigation. No library.
 *
 * Renders nothing — it installs one delegated click listener and intercepts
 * same-origin anchor clicks, so every existing <Link> on the site gets
 * transitions without being rewritten.
 *
 * The tricky part is timing: `startViewTransition` snapshots the DOM when its
 * callback resolves, but `router.push()` returns before React has committed
 * the new route. So the callback returns a promise that we resolve from a
 * `usePathname` effect — i.e. once the new page is actually on screen.
 *
 * Fallback is a genuine no-op: if `startViewTransition` is missing, we never
 * call preventDefault, and Next's normal client navigation runs untouched.
 */
export default function ViewTransitions() {
  const router = useRouter();
  const pathname = usePathname();
  const { recruiterMode } = useRecruiterMode();
  const resolveRef = useRef<(() => void) | null>(null);

  // Route committed — let the transition capture the new frame.
  useEffect(() => {
    resolveRef.current?.();
    resolveRef.current = null;
  }, [pathname]);

  useEffect(() => {
    if (recruiterMode) return;
    if (typeof document.startViewTransition !== "function") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onClick = (event: MouseEvent) => {
      // Leave modified clicks alone — they mean "new tab" / "download".
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor) return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      // External links and in-page anchors keep default behaviour.
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;

      event.preventDefault();

      document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            let settled = false;
            const finish = () => {
              if (settled) return;
              settled = true;
              resolveRef.current = null;
              resolve();
            };

            resolveRef.current = finish;
            router.push(`${url.pathname}${url.search}${url.hash}`);

            // Safety valve: if the route never commits (failed chunk, aborted
            // navigation), release the transition instead of leaving the page
            // frozen under a stale snapshot.
            window.setTimeout(finish, 900);
          }),
      );
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router, recruiterMode]);

  return null;
}
