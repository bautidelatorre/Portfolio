"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { deleteProject, reorderProjects } from "@/lib/actions/projects";
import { ProjectRow } from "@/lib/db/schema";

export function ProjectTable({ projects: initialProjects }: { projects: ProjectRow[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: number, title: string) {
    if (!confirm(`¿Borrar "${title}"? Esta acción no se puede deshacer.`)) return;
    startTransition(async () => {
      await deleteProject(id);
    });
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= projects.length) return;
    const next = [...projects];
    [next[index], next[target]] = [next[target], next[index]];
    setProjects(next);
    setError(null);
    startTransition(async () => {
      const result = await reorderProjects(next.map((p) => p.id));
      if (result.error) setError(result.error);
    });
  }

  if (projects.length === 0) {
    return <p className="text-sm text-muted">Todavía no agregaste ningún proyecto.</p>;
  }

  return (
    <div>
      {error && (
        <p className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted-bg text-muted">
            <tr>
              <th className="px-4 py-3"></th>
              <th className="px-4 py-3 font-medium">Proyecto</th>
              <th className="px-4 py-3 font-medium">Destacado</th>
              <th className="px-4 py-3 font-medium">Actualizado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, i) => (
              <tr key={project.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      disabled={i === 0 || isPending}
                      className="rounded-full border border-border px-2 py-1 text-xs disabled:opacity-30"
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === projects.length - 1 || isPending}
                      className="rounded-full border border-border px-2 py-1 text-xs disabled:opacity-30"
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                  </div>
                </td>
                <td className="flex items-center gap-3 px-4 py-3">
                  {project.images[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.images[0].url}
                      alt=""
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-md bg-muted-bg" />
                  )}
                  {project.title}
                </td>
                <td className="px-4 py-3">{project.featured ? "Sí" : "—"}</td>
                <td className="px-4 py-3 text-muted">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="mr-4 text-accent hover:underline"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(project.id, project.title)}
                    disabled={isPending}
                    className="text-red-600 hover:underline disabled:opacity-50"
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
