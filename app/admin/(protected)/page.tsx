import Link from "next/link";
import { getProjectRows } from "@/lib/actions/projects";
import { ProjectTable } from "@/components/admin/ProjectTable";

export default async function AdminDashboard() {
  const projects = await getProjectRows();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Proyectos</h1>
        <Link
          href="/admin/projects/new"
          className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition hover:opacity-85"
        >
          Agregar proyecto
        </Link>
      </div>
      <div className="mt-6">
        <ProjectTable projects={projects} />
      </div>
    </div>
  );
}
