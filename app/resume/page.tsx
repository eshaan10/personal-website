import type { Metadata } from "next";
import RecruiterSwitch from "@/components/RecruiterSwitch";
import ResumeDocument from "@/components/ResumeDocument";
import ResumeGlass from "@/components/ResumeGlass";

export const metadata: Metadata = {
  title: "Resume — Eshaan Punalekar",
  description:
    "Education, work experience, projects, skills, coursework, and awards.",
};

/**
 * Three renderings of the same lib/profile.ts content:
 *
 *   - normal, on screen → <ResumeGlass />, the site's dark card aesthetic
 *   - recruiter mode    → <ResumeDocument />, flat light paper
 *   - print (either)    → <ResumeDocument />, via the @media print rules
 *
 * The print-only copy is mounted alongside the glass version rather than
 * printing the glass version stripped down. Cards, chips, and hover states
 * do not become a good one-page resume by having their colours removed —
 * printing should emit the document, whichever mode you're viewing.
 */
export default function ResumePage() {
  return (
    <RecruiterSwitch
      recruiter={
        <main className="relative pb-32 pt-36 print:pb-0 print:pt-0">
          <ResumeDocument />
        </main>
      }
    >
      <main className="relative">
        <div className="print:hidden">
          <ResumeGlass />
        </div>

        <div className="hidden print:block">
          <ResumeDocument />
        </div>
      </main>
    </RecruiterSwitch>
  );
}
