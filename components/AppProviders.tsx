"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MONOCHROME_ACCENT, type Accent } from "@/lib/projects";

type RecruiterContextValue = {
  recruiterMode: boolean;
  toggleRecruiterMode: () => void;
};

type AccentContextValue = {
  accent: Accent;
  setAccent: (accent: Accent | null) => void;
};

const RecruiterContext = createContext<RecruiterContextValue>({
  recruiterMode: false,
  toggleRecruiterMode: () => {},
});

const AccentContext = createContext<AccentContextValue>({
  accent: MONOCHROME_ACCENT,
  setAccent: () => {},
});

export const useRecruiterMode = () => useContext(RecruiterContext);
export const useAccent = () => useContext(AccentContext);

/**
 * Recruiter mode is intentionally in-memory only — it resets on reload, per
 * spec. Persisting it would mean a returning visitor silently gets the
 * stripped-down site with no indication why.
 *
 * The flag is mirrored onto <html data-recruiter="on"> so the CSS kill-switch
 * in globals.css can neutralise blur, shine, and animation globally, without
 * every styled component having to consume the hook. Components only read the
 * hook when the *structure* changes, not just the styling.
 */
export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [recruiterMode, setRecruiterMode] = useState(false);
  const [accent, setAccentState] = useState<Accent>(MONOCHROME_ACCENT);

  useEffect(() => {
    const root = document.documentElement;
    if (recruiterMode) root.setAttribute("data-recruiter", "on");
    else root.removeAttribute("data-recruiter");
  }, [recruiterMode]);

  const toggleRecruiterMode = useCallback(
    () => setRecruiterMode((previous) => !previous),
    [],
  );

  // `null` resets to monochrome — non-project pages call it on mount.
  const setAccent = useCallback(
    (next: Accent | null) => setAccentState(next ?? MONOCHROME_ACCENT),
    [],
  );

  const recruiterValue = useMemo(
    () => ({ recruiterMode, toggleRecruiterMode }),
    [recruiterMode, toggleRecruiterMode],
  );

  const accentValue = useMemo(() => ({ accent, setAccent }), [accent, setAccent]);

  return (
    <RecruiterContext.Provider value={recruiterValue}>
      <AccentContext.Provider value={accentValue}>
        {children}
      </AccentContext.Provider>
    </RecruiterContext.Provider>
  );
}
