"use client";

import { useEffect, useState } from "react";
import BlobField from "./BlobField";
import ShaderBackground from "./ShaderBackground";
import { useAccent, useRecruiterMode } from "./AppProviders";

type Mode = "probing" | "webgl" | "css";

/**
 * Single global background instance, mounted in the root layout.
 *
 * It lives in the layout rather than per-page for one specific reason: it must
 * survive navigation. A per-page background would unmount and remount on every
 * route change, hard-cutting the colour instead of cross-fading it.
 *
 * Selection order:
 *   1. Recruiter mode  → nothing at all (ambient motion is the first thing off)
 *   2. Reduced motion  → CSS version, whose animations are already disabled
 *   3. WebGL available → shader
 *   4. Otherwise       → CSS version
 *
 * The shader can also fail *after* mounting (context loss, driver bail), so
 * `onError` demotes to CSS at runtime, not just during the initial probe.
 */
export default function Background() {
  const { accent } = useAccent();
  const { recruiterMode } = useRecruiterMode();
  const [mode, setMode] = useState<Mode>("probing");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMode("css");
      return;
    }

    // Probe on a throwaway canvas so a failure here costs nothing, then
    // release it immediately — some drivers cap simultaneous contexts.
    try {
      const probe = document.createElement("canvas");
      const gl = probe.getContext("webgl") || probe.getContext("experimental-webgl");
      if (!gl) {
        setMode("css");
        return;
      }
      (gl as WebGLRenderingContext)
        .getExtension("WEBGL_lose_context")
        ?.loseContext();
      setMode("webgl");
    } catch {
      setMode("css");
    }
  }, []);

  if (recruiterMode) return null;

  // Render the CSS version while probing: it's one frame, and showing nothing
  // would flash the bare gradient on first paint.
  if (mode === "webgl") {
    return <ShaderBackground accent={accent} onError={() => setMode("css")} />;
  }

  return <BlobField accent={accent} />;
}
