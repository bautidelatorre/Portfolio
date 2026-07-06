import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { ProjectGrid } from "@/components/site/ProjectGrid";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { getProjects } from "@/lib/actions/projects";
import { getSiteSettings } from "@/lib/actions/settings";
import { placeholderProjects } from "@/lib/placeholder-data";
import { Project } from "@/lib/types";
import { SectionKey } from "@/lib/db/schema";

const SECTION_RENDERERS: Record<
  SectionKey,
  (ctx: { projects: Project[]; columns: number }) => React.ReactNode
> = {
  about: () => <About key="about" />,
  projects: ({ projects, columns }) => (
    <ProjectGrid key="projects" projects={projects} columns={columns} />
  ),
  contact: () => <Contact key="contact" />,
};

export default async function Home() {
  const [projects, settings] = await Promise.all([
    getProjects(),
    getSiteSettings(),
  ]);
  const visibleProjects = projects.length > 0 ? projects : placeholderProjects;

  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        {settings.sectionOrder
          .filter((section) => section.visible)
          .map((section) =>
            SECTION_RENDERERS[section.key]({
              projects: visibleProjects,
              columns: settings.projectColumns,
            })
          )}
      </main>
      <Footer />
    </>
  );
}
