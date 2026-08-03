"use client";

import { useEffect } from "react";
import { useAccent } from "./AppProviders";
import type { Accent } from "@/lib/projects";

/**
 * Declares a page's ambient accent. Renders nothing.
 *
 * The background itself lives in the root layout and never unmounts, which is
 * what lets the colour cross-fade between routes instead of hard-cutting. On
 * unmount this resets to monochrome, so navigating from a project page back to
 * Home fades cleanly back to neutral.
 */
export default function AccentSetter({ accent }: { accent: Accent }) {
  const { setAccent } = useAccent();

  useEffect(() => {
    setAccent(accent);
    return () => setAccent(null);
  }, [accent, setAccent]);

  return null;
}
