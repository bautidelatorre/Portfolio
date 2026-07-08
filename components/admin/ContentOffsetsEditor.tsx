"use client";

import { useState } from "react";
import { updateMobileContentOffset } from "@/lib/actions/content-offsets";
import type { MobileContentOffsets } from "@/lib/db/schema";

const SECTIONS: { key: keyof MobileContentOffsets; label: string }[] = [
  { key: "hero", label: "Hero" },
  { key: "about", label: "Sobre mí" },
  { key: "projects", label: "Proyectos" },
  { key: "contact", label: "Contacto" },
];

export function ContentOffsetsEditor({
  initialOffsets,
}: {
  initialOffsets: MobileContentOffsets;
}) {
  const [offsets, setOffsets] = useState<MobileContentOffsets>(initialOffsets);
  const [error, setError] = useState<string | null>(null);

  function patchLocal(section: keyof MobileContentOffsets, value: number) {
    setOffsets((prev) => ({ ...prev, [section]: value }));
  }

  async function persist(section: keyof MobileContentOffsets, value: number) {
    const result = await updateMobileContentOffset(section, value);
    if (result.error) setError(result.error);
  }

  return (
    <div className="space-y-4">
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
      <p className="text-sm text-muted">
        Subí o bajá el bloque de título/texto/botón de cada sección, solo en la versión mobile.
        No afecta la versión de escritorio.
      </p>
      <div className="space-y-3">
        {SECTIONS.map((section) => (
          <div
            key={section.key}
            className="flex flex-wrap items-center gap-4 rounded-lg border border-border px-3 py-2 text-sm"
          >
            <span className="w-24 shrink-0 font-medium">{section.label}</span>
            <input
              type="range"
              min={-160}
              max={160}
              value={offsets[section.key]}
              onChange={(e) => patchLocal(section.key, Number(e.target.value))}
              onPointerUp={() => persist(section.key, offsets[section.key])}
              className="flex-1"
            />
            <span className="w-14 shrink-0 text-right text-muted tabular-nums">
              {offsets[section.key]}px
            </span>
            <button
              type="button"
              onClick={() => {
                patchLocal(section.key, 0);
                persist(section.key, 0);
              }}
              className="rounded-full border border-border px-2.5 py-1 text-xs hover:bg-muted-bg"
            >
              Reset
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
