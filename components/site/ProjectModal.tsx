"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Project } from "@/lib/types";

export function ProjectModal({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("project");
  const project = projects.find((p) => p.slug === slug) ?? null;
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setImageIndex(0);
  }, [slug]);

  useEffect(() => {
    if (!project) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  if (!project) return null;

  function close() {
    router.push("?", { scroll: false });
  }

  const image = project.images[imageIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={close}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto border border-border bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex min-h-64 items-center justify-center bg-muted-bg">
          {image?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image.url}
              alt={image.alt}
              className="max-h-[70vh] w-full object-contain"
            />
          ) : (
            <span className="text-sm text-muted">Image coming soon</span>
          )}

          {project.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
              {project.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setImageIndex(i)}
                  className={`h-2 w-2 rounded-full ${
                    i === imageIndex ? "bg-foreground" : "bg-foreground/30"
                  }`}
                  aria-label={`View image ${i + 1}`}
                />
              ))}
            </div>
          )}

          <button
            onClick={close}
            className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg leading-none shadow"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted-bg px-3 py-1 font-label text-[11px] font-medium tracking-wide text-muted uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="mt-3 text-2xl font-medium tracking-[-0.02em]">{project.title}</h3>
          <p className="mt-3 text-muted">{project.description}</p>
          {project.externalUrl && (
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block rounded-full bg-dark px-5 py-2.5 font-label text-sm font-semibold text-white transition hover:opacity-85"
            >
              View project →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
