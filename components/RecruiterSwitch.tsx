"use client";

import type { ReactNode } from "react";
import { useRecruiterMode } from "./AppProviders";

/**
 * Picks between two pre-rendered subtrees.
 *
 * Both branches are built on the server and passed in as props, so the
 * document version costs no extra client JS and each page keeps its
 * recruiter layout next to its normal one — rather than every leaf component
 * carrying its own `if (recruiterMode)` branch.
 */
export default function RecruiterSwitch({
  recruiter,
  children,
}: {
  recruiter: ReactNode;
  children: ReactNode;
}) {
  const { recruiterMode } = useRecruiterMode();
  return <>{recruiterMode ? recruiter : children}</>;
}
