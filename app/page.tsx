import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { ProjectGrid } from "@/components/site/ProjectGrid";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { getProjects } from "@/lib/actions/projects";
import { placeholderProjects } from "@/lib/placeholder-data";

export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <About />
        <ProjectGrid projects={projects.length > 0 ? projects : placeholderProjects} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
