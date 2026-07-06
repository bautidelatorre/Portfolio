import { Suspense } from "react";
import { Project } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";
import { SectionHeading } from "./SectionHeading";

const COLUMN_CLASSES: Record<number, string> = {
  2: "columns-1 sm:columns-2",
  3: "columns-1 sm:columns-2 lg:columns-3",
};

export function ProjectGrid({
  projects,
  columns = 3,
}: {
  projects: Project[];
  columns?: number;
}) {
  const columnClass = COLUMN_CLASSES[columns] ?? COLUMN_CLASSES[3];

  return (
    <section
      id="proyectos"
      className="mx-auto w-full max-w-5xl px-6 py-24 sm:px-10 lg:px-16"
    >
      <SectionHeading index="02" label="Proyectos" />
      <div className={`mt-10 gap-6 ${columnClass}`}>
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i + 1} />
        ))}
      </div>

      <Suspense fallback={null}>
        <ProjectModal projects={projects} />
      </Suspense>
    </section>
  );
}
