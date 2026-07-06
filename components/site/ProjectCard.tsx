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

export function ProjectCard({ project }: { project: Project }) {
  const cover = project.images[0];

  return (
    <Link
      href={`?project=${project.slug}`}
      scroll={false}
      className="group block overflow-hidden rounded-2xl border border-border bg-white transition hover:shadow-lg"
    >
      <div className="flex aspect-[4/3] items-center justify-center bg-muted-bg">
        {cover?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover.url}
            alt={cover.alt}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-3xl font-semibold text-muted/50">
            {initials(project.title)}
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted-bg px-3 py-1 text-xs text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="mt-3 text-lg font-medium">{project.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">
          {project.description}
        </p>
      </div>
    </Link>
  );
}
