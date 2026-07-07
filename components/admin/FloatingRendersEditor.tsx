"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import {
  addFloatingRender,
  updateFloatingRender,
  removeFloatingRender,
} from "@/lib/actions/floating-renders";
import type { FloatingRenderConfig, FloatingRenderSection } from "@/lib/db/schema";

type PersistablePatch = Partial<
  Pick<FloatingRenderConfig, "xPct" | "yPct" | "widthPct" | "rotate" | "opacity" | "layer">
>;

const SECTIONS: { key: FloatingRenderSection; label: string; dark?: boolean }[] = [
  { key: "hero", label: "Hero" },
  { key: "about", label: "Sobre mí", dark: true },
  { key: "projects", label: "Proyectos" },
  { key: "contact", label: "Contacto" },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function FloatingRendersEditor({
  initialRenders,
}: {
  initialRenders: FloatingRenderConfig[];
}) {
  const [renders, setRenders] = useState<FloatingRenderConfig[]>(initialRenders);
  const [error, setError] = useState<string | null>(null);

  function patchLocal(id: string, patch: PersistablePatch) {
    setRenders((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  async function persist(id: string, patch: PersistablePatch) {
    try {
      await updateFloatingRender(id, patch);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleUpload(section: FloatingRenderSection, files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    try {
      const file = files[0];
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      const created = await addFloatingRender(section, blob.url);
      setRenders((prev) => [...prev, created]);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleRemove(id: string) {
    setRenders((prev) => prev.filter((r) => r.id !== id));
    try {
      await removeFloatingRender(id);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="space-y-10">
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
      <p className="text-sm text-muted">
        Vista previa aproximada de cada sección. Arrastrá una imagen para moverla,
        usá la esquina inferior derecha para cambiar el tamaño.
      </p>
      {SECTIONS.map((section) => (
        <SectionEditor
          key={section.key}
          section={section}
          renders={renders.filter((r) => r.section === section.key)}
          onUpload={(files) => handleUpload(section.key, files)}
          onPatchLocal={patchLocal}
          onPersist={persist}
          onRemove={handleRemove}
        />
      ))}
    </div>
  );
}

function SectionEditor({
  section,
  renders,
  onUpload,
  onPatchLocal,
  onPersist,
  onRemove,
}: {
  section: { key: FloatingRenderSection; label: string; dark?: boolean };
  renders: FloatingRenderConfig[];
  onUpload: (files: FileList | null) => Promise<void>;
  onPatchLocal: (id: string, patch: PersistablePatch) => void;
  onPersist: (id: string, patch: PersistablePatch) => Promise<void>;
  onRemove: (id: string) => void;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUploading(true);
    try {
      await onUpload(e.target.files);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function startDrag(render: FloatingRenderConfig, e: React.PointerEvent) {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const latest = { xPct: render.xPct, yPct: render.yPct };

    function onMove(ev: PointerEvent) {
      const dxPct = ((ev.clientX - startX) / rect.width) * 100;
      const dyPct = ((ev.clientY - startY) / rect.height) * 100;
      latest.xPct = clamp(render.xPct + dxPct, -40, 100);
      latest.yPct = clamp(render.yPct + dyPct, -40, 100);
      onPatchLocal(render.id, latest);
    }
    function onUp() {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      onPersist(render.id, latest);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  function startResize(render: FloatingRenderConfig, e: React.PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const startX = e.clientX;
    const latest = { widthPct: render.widthPct };

    function onMove(ev: PointerEvent) {
      const dxPct = ((ev.clientX - startX) / rect.width) * 100;
      latest.widthPct = clamp(render.widthPct + dxPct, 4, 140);
      onPatchLocal(render.id, latest);
    }
    function onUp() {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      onPersist(render.id, latest);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{section.label}</h3>
        <label className="cursor-pointer rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted-bg">
          {uploading ? "Subiendo..." : "+ Agregar imagen"}
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      <div
        ref={canvasRef}
        className={`relative mt-2 aspect-video w-full touch-none overflow-hidden rounded-lg border border-border ${
          section.dark ? "bg-dark" : "bg-muted-bg"
        }`}
      >
        {renders.map((render) => (
          <div
            key={render.id}
            onPointerDown={(e) => startDrag(render, e)}
            className="group absolute cursor-move border border-transparent hover:border-accent"
            style={{
              left: `${render.xPct}%`,
              top: `${render.yPct}%`,
              width: `${render.widthPct}%`,
              opacity: render.opacity,
              transform: `rotate(${render.rotate}deg)`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={render.imageUrl}
              alt=""
              draggable={false}
              className="pointer-events-none block h-auto w-full select-none"
            />
            <div
              onPointerDown={(e) => startResize(render, e)}
              className="absolute -right-1.5 -bottom-1.5 h-3.5 w-3.5 cursor-se-resize rounded-full bg-accent opacity-0 group-hover:opacity-100"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(render.id);
              }}
              className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-[10px] text-white opacity-0 group-hover:opacity-100"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {renders.length > 0 && (
        <div className="mt-3 space-y-2">
          {renders.map((render) => (
            <div
              key={render.id}
              className="flex flex-wrap items-center gap-4 rounded-lg border border-border px-3 py-2 text-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={render.imageUrl}
                alt=""
                className="h-9 w-9 rounded object-cover"
              />
              <label className="flex items-center gap-2">
                Capa
                <select
                  value={render.layer}
                  onChange={(e) => {
                    const layer = e.target.value as "behind" | "front";
                    onPatchLocal(render.id, { layer });
                    onPersist(render.id, { layer });
                  }}
                  className="rounded border border-border px-2 py-1"
                >
                  <option value="behind">Detrás del contenido</option>
                  <option value="front">Encima del contenido</option>
                </select>
              </label>
              <label className="flex items-center gap-2">
                Opacidad
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={render.opacity}
                  onChange={(e) => onPatchLocal(render.id, { opacity: Number(e.target.value) })}
                  onPointerUp={() => onPersist(render.id, { opacity: render.opacity })}
                />
              </label>
              <label className="flex items-center gap-2">
                Rotación
                <input
                  type="range"
                  min={-30}
                  max={30}
                  value={render.rotate}
                  onChange={(e) => onPatchLocal(render.id, { rotate: Number(e.target.value) })}
                  onPointerUp={() => onPersist(render.id, { rotate: render.rotate })}
                />
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
