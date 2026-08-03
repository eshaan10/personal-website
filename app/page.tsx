import AboutSection from "@/components/AboutSection";
import EntranceScreen from "@/components/EntranceScreen";
import HashScroll from "@/components/HashScroll";
import Hero from "@/components/Hero";
import ProjectsPreview from "@/components/ProjectsPreview";
import RecruiterSwitch from "@/components/RecruiterSwitch";
import HomeDocument from "@/components/HomeDocument";
import StackSection from "@/components/StackSection";

/**
 * Single-scroll home: hero → about → stack → projects.
 * Nav items for the three sections are anchors, handled by Nav + HashScroll.
 */
export default function HomePage() {
  return (
    <RecruiterSwitch
      recruiter={
        <main className="relative pb-32 pt-36">
          <HashScroll />
          <HomeDocument />
        </main>
      }
    >
      <main className="relative">
        <EntranceScreen />
        <HashScroll />
        <Hero />
        <AboutSection />
        <StackSection />
        <ProjectsPreview />
      </main>
    </RecruiterSwitch>
  );
}
