import { Suspense } from "react";
import { Project } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <section
      id="proyectos"
      className="mx-auto w-full max-w-5xl px-6 py-20 sm:px-10 lg:px-16"
    >
      <h2 className="text-sm font-medium tracking-wide text-accent uppercase">
        Proyectos
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <Suspense fallback={null}>
        <ProjectModal projects={projects} />
      </Suspense>
    </section>
  );
}
