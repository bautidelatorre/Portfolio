import { Suspense } from "react";
import { Project } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";
import { SectionHeading } from "./SectionHeading";
import { FloatingRender } from "./FloatingRender";
import type { FloatingRenderConfig, SiteCopy } from "@/lib/db/schema";
import { DEFAULT_SITE_COPY } from "@/lib/db/schema";

const COLUMN_CLASSES: Record<number, string> = {
  2: "grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3",
  3: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
};

export function ProjectGrid({
  projects,
  columns = 3,
  renders = [],
  copy = DEFAULT_SITE_COPY,
}: {
  projects: Project[];
  columns?: number;
  renders?: FloatingRenderConfig[];
  copy?: SiteCopy;
}) {
  const columnClass = COLUMN_CLASSES[columns] ?? COLUMN_CLASSES[3];
  const behind = renders.filter((r) => r.layer === "behind");
  const front = renders.filter((r) => r.layer === "front");

  return (
    <section
      id="projects"
      className="relative mx-auto w-full max-w-5xl overflow-hidden px-6 py-24 sm:px-10 lg:px-16 2xl:max-w-7xl 2xl:px-24"
    >
      {behind.map((r) => (
        <FloatingRender
          key={r.id}
          src={r.imageUrl}
          xPct={r.xPct}
          yPct={r.yPct}
          widthPct={r.widthPct}
          rotate={r.rotate}
          opacity={r.opacity}
          float={r.float}
        />
      ))}
      <SectionHeading index="02" label={copy.projectsLabel} />
      <div className={`mt-10 gap-6 ${columnClass}`}>
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i + 1} />
        ))}
      </div>

      <Suspense fallback={null}>
        <ProjectModal projects={projects} />
      </Suspense>
      {front.map((r) => (
        <FloatingRender
          key={r.id}
          src={r.imageUrl}
          xPct={r.xPct}
          yPct={r.yPct}
          widthPct={r.widthPct}
          rotate={r.rotate}
          opacity={r.opacity}
          float={r.float}
        />
      ))}
    </section>
  );
}
