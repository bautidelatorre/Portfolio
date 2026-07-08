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
import {
  SectionKey,
  FloatingRenderConfig,
  SiteCopy,
  MobileContentOffsets,
} from "@/lib/db/schema";

const SECTION_RENDERERS: Record<
  SectionKey,
  (ctx: {
    projects: Project[];
    columns: number;
    floatingRenders: FloatingRenderConfig[];
    copy: SiteCopy;
    mobileOffsets: MobileContentOffsets;
  }) => React.ReactNode
> = {
  about: ({ floatingRenders, copy, mobileOffsets }) => (
    <About
      key="about"
      renders={floatingRenders.filter((r) => r.section === "about")}
      copy={copy}
      mobileOffset={mobileOffsets.about}
    />
  ),
  projects: ({ projects, columns, floatingRenders, copy, mobileOffsets }) => (
    <ProjectGrid
      key="projects"
      projects={projects}
      columns={columns}
      renders={floatingRenders.filter((r) => r.section === "projects")}
      copy={copy}
      mobileOffset={mobileOffsets.projects}
    />
  ),
  contact: ({ floatingRenders, copy, mobileOffsets }) => (
    <Contact
      key="contact"
      renders={floatingRenders.filter((r) => r.section === "contact")}
      copy={copy}
      mobileOffset={mobileOffsets.contact}
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
          mobileOffset={settings.mobileContentOffsets.hero}
        />
        {settings.sectionOrder
          .filter((section) => section.visible)
          .map((section) =>
            SECTION_RENDERERS[section.key]({
              projects: visibleProjects,
              columns: settings.projectColumns,
              floatingRenders: settings.floatingRenders,
              copy: settings.siteCopy,
              mobileOffsets: settings.mobileContentOffsets,
            })
          )}
      </main>
      <Footer copy={settings.siteCopy} />
    </>
  );
}
