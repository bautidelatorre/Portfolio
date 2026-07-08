"use client";

import { useState } from "react";
import Image from "next/image";
import type { SiteCopy } from "@/lib/db/schema";
import { DEFAULT_SITE_COPY } from "@/lib/db/schema";

export function Nav({ copy = DEFAULT_SITE_COPY }: { copy?: SiteCopy }) {
  const [open, setOpen] = useState(false);

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
        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="rounded-full border border-border px-4 py-2 font-label text-sm font-semibold transition hover:bg-muted-bg"
          >
            {copy.navContact}
          </a>
          <button
            type="button"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border sm:hidden"
          >
            {open ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M1 1L15 15M15 1L1 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M1 4H15M1 8H15M1 12H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-border/70 px-6 py-3 font-label text-sm text-muted sm:hidden">
          <a
            href="#projects"
            onClick={() => setOpen(false)}
            className="rounded-lg px-2 py-2.5 transition hover:bg-muted-bg hover:text-foreground"
          >
            {copy.navProjects}
          </a>
          <a
            href="#about"
            onClick={() => setOpen(false)}
            className="rounded-lg px-2 py-2.5 transition hover:bg-muted-bg hover:text-foreground"
          >
            {copy.navAbout}
          </a>
        </nav>
      )}
    </header>
  );
}
