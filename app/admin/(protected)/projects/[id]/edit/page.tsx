import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/actions/projects";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(Number(id));
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold">Editar proyecto</h1>
      <div className="mt-6">
        <ProjectForm
          projectId={project.id}
          defaultValues={{
            title: project.title,
            slug: project.slug,
            description: project.description,
            tags: project.tags,
            images: project.images,
            externalUrl: project.externalUrl ?? undefined,
            featured: project.featured,
          }}
        />
      </div>
    </div>
  );
}
