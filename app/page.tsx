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
import { SectionKey, FloatingRenderConfig, SiteCopy } from "@/lib/db/schema";

const SECTION_RENDERERS: Record<
  SectionKey,
  (ctx: {
    projects: Project[];
    columns: number;
    floatingRenders: FloatingRenderConfig[];
    copy: SiteCopy;
  }) => React.ReactNode
> = {
  about: ({ floatingRenders, copy }) => (
    <About
      key="about"
      renders={floatingRenders.filter((r) => r.section === "about")}
      copy={copy}
    />
  ),
  projects: ({ projects, columns, floatingRenders, copy }) => (
    <ProjectGrid
      key="projects"
      projects={projects}
      columns={columns}
      renders={floatingRenders.filter((r) => r.section === "projects")}
      copy={copy}
    />
  ),
  contact: ({ floatingRenders, copy }) => (
    <Contact
      key="contact"
      renders={floatingRenders.filter((r) => r.section === "contact")}
      copy={copy}
    />
  ),
};

export default async function Home() {
  const [projects, settings] = await Promise.all([
    getProjects(),
    getSiteSettings(),
  ]);
  const visibleProjects = projects.length > 0 ? projects : placeholderProjects;

  return (
    <>
      <Nav copy={settings.siteCopy} />
      <main className="flex-1">
        <Hero
          renders={settings.floatingRenders.filter((r) => r.section === "hero")}
          glows={settings.glows.filter((g) => g.section === "hero")}
          copy={settings.siteCopy}
        />
        {settings.sectionOrder
          .filter((section) => section.visible)
          .map((section) =>
            SECTION_RENDERERS[section.key]({
              projects: visibleProjects,
              columns: settings.projectColumns,
              floatingRenders: settings.floatingRenders,
              copy: settings.siteCopy,
            })
          )}
      </main>
      <Footer copy={settings.siteCopy} />
    </>
  );
}
