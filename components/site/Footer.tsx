import type { SiteCopy } from "@/lib/db/schema";
import { DEFAULT_SITE_COPY } from "@/lib/db/schema";

export function Footer({ copy = DEFAULT_SITE_COPY }: { copy?: SiteCopy }) {
  return (
    <footer className="border-t border-border px-6 py-8 sm:px-10 lg:px-16 2xl:px-24">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-start justify-between gap-2 font-label text-sm text-muted sm:flex-row sm:items-center 2xl:max-w-7xl">
        <p>© {new Date().getFullYear()} {copy.footerName}</p>
        <a href="#contact" className="hover:text-foreground">
          bautidelatorre@gmail.com
        </a>
      </div>
    </footer>
  );
}
