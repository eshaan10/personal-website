"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { smoothScrollToId } from "@/lib/scroll";

/**
 * Handles the arrive-from-another-page half of anchor navigation.
 *
 * When Stack is clicked from /projects, the router pushes "/#stack" — but the
 * section does not exist until Home renders. This runs after that render and
 * performs the scroll, using the same eased scroller as an in-page click so
 * both paths feel identical.
 *
 * Two rAFs deep: the first lands after React commits, the second after layout,
 * so the target's measured position is final.
 */
export default function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => smoothScrollToId(hash));
    });

    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [pathname]);

  return null;
}
