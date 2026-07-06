"use client";

import { useState, useTransition } from "react";
import { createProject, updateProject, type ProjectInput } from "@/lib/actions/projects";
import { ImageUploader, type UploadedImage } from "./ImageUploader";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProjectForm({
  projectId,
  defaultValues,
}: {
  projectId?: number;
  defaultValues?: ProjectInput;
}) {
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!defaultValues);
  const [description, setDescription] = useState(defaultValues?.description ?? "");
  const [tagsInput, setTagsInput] = useState(defaultValues?.tags.join(", ") ?? "");
  const [externalUrl, setExternalUrl] = useState(defaultValues?.externalUrl ?? "");
  const [featured, setFeatured] = useState(defaultValues?.featured ?? false);
  const [images, setImages] = useState<UploadedImage[]>(defaultValues?.images ?? []);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title || !slug || !description) {
      setError("Título, slug y descripción son obligatorios.");
      return;
    }

    const input: ProjectInput = {
      title,
      slug,
      description,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
      images,
      externalUrl: externalUrl || undefined,
      featured,
    };

    startTransition(async () => {
      try {
        if (projectId) {
          await updateProject(projectId, input);
        } else {
          await createProject(input);
        }
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      <div>
        <label className="block text-sm font-medium">Título</label>
        <input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Slug</label>
        <input
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(slugify(e.target.value));
          }}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Tags (separados por coma)</label>
        <input
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="Branding, UI/UX"
          className="mt-1 w-full rounded-lg border border-border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Link externo (opcional)</label>
        <input
          value={externalUrl}
          onChange={(e) => setExternalUrl(e.target.value)}
          placeholder="https://..."
          className="mt-1 w-full rounded-lg border border-border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Imágenes</label>
        <div className="mt-1">
          <ImageUploader images={images} onChange={setImages} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
        />
        Destacado
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background disabled:opacity-50"
      >
        {isPending ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
