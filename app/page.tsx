import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { ProjectGrid } from "@/components/site/ProjectGrid";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { placeholderProjects } from "@/lib/placeholder-data";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <Hero />
        <About />
        <ProjectGrid projects={placeholderProjects} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
