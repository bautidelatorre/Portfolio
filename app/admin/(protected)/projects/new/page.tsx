import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold">Agregar proyecto</h1>
      <div className="mt-6">
        <ProjectForm />
      </div>
    </div>
  );
}
