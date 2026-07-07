import Image from "next/image";
import type { SiteCopy } from "@/lib/db/schema";
import { DEFAULT_SITE_COPY } from "@/lib/db/schema";

export function Nav({ copy = DEFAULT_SITE_COPY }: { copy?: SiteCopy }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4 sm:px-10 lg:px-16 2xl:max-w-7xl 2xl:px-24">
        <a href="#" className="flex items-center">
          <Image src="/logo.png" alt="Bautista" width={100} height={202} priority className="h-12 w-auto" />
        </a>
        <nav className="hidden items-center gap-8 font-label text-sm text-muted sm:flex">
          <a href="#projects" className="transition hover:text-foreground">
            {copy.navProjects}
          </a>
          <a href="#about" className="transition hover:text-foreground">
            {copy.navAbout}
          </a>
        </nav>
        <a
          href="#contact"
          className="rounded-full border border-border px-4 py-2 font-label text-sm font-semibold transition hover:bg-muted-bg"
        >
          {copy.navContact}
        </a>
      </div>
    </header>
  );
}
