import { Suspense } from "react";
import { Project } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";
import { SectionHeading } from "./SectionHeading";
import { FloatingRender } from "./FloatingRender";

const COLUMN_CLASSES: Record<number, string> = {
  2: "grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3",
  3: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
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
      className="relative mx-auto w-full max-w-5xl overflow-hidden px-6 py-24 sm:px-10 lg:px-16 2xl:max-w-7xl 2xl:px-24"
    >
      <FloatingRender
        src="/floating/chair-wire.webp"
        width={420}
        height={236}
        rotate={-4}
        duration={12}
        delay={2}
        className="top-[-4%] left-[-4%] w-[260px] sm:w-[380px]"
      />
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
