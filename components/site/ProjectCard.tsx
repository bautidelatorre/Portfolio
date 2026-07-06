import Link from "next/link";
import { Project } from "@/lib/types";

function initials(title: string) {
  return title
    .split(" ")
    .filter((w) => w.length > 0)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cover = project.images[0];

  return (
    <Link
      href={`?project=${project.slug}`}
      scroll={false}
      className="group relative block overflow-hidden border border-border bg-white transition hover:border-accent/50"
    >
      <span className="absolute top-3 left-3 z-10 font-label text-xs font-semibold text-white/80 mix-blend-difference">
        {String(index).padStart(2, "0")}
      </span>
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-muted-bg">
        {cover?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover.url}
            alt={cover.alt}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="text-3xl font-medium tracking-[-0.02em] text-muted/50">
            {initials(project.title)}
          </span>
        )}
      </div>
      <div className="p-5">
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
        <h3 className="mt-3 text-lg font-medium tracking-[-0.02em]">{project.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">
          {project.description}
        </p>
      </div>
    </Link>
  );
}
