"use client";

import { useRef, useState } from "react";
import { addGlow, updateGlow, removeGlow } from "@/lib/actions/glows";
import type { GlowConfig, FloatingRenderSection } from "@/lib/db/schema";

type PersistablePatch = Partial<
  Pick<GlowConfig, "xPct" | "yPct" | "sizePct" | "blur" | "color" | "opacity">
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

export function GlowsEditor({ initialGlows }: { initialGlows: GlowConfig[] }) {
  const [glows, setGlows] = useState<GlowConfig[]>(initialGlows);
  const [error, setError] = useState<string | null>(null);

  function patchLocal(id: string, patch: PersistablePatch) {
    setGlows((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  }

  async function persist(id: string, patch: PersistablePatch) {
    try {
      await updateGlow(id, patch);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleAdd(section: FloatingRenderSection) {
    setError(null);
    try {
      const created = await addGlow(section);
      setGlows((prev) => [...prev, created]);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleDuplicate(glow: GlowConfig) {
    setError(null);
    try {
      const created = await addGlow(glow.section);
      const patch: PersistablePatch = {
        xPct: clamp(glow.xPct + 6, -20, 120),
        yPct: clamp(glow.yPct + 6, -20, 120),
        sizePct: glow.sizePct,
        blur: glow.blur,
        color: glow.color,
        opacity: glow.opacity,
      };
      const updated = await updateGlow(created.id, patch);
      setGlows((prev) => [...prev, updated]);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleRemove(id: string) {
    setGlows((prev) => prev.filter((g) => g.id !== id));
    try {
      await removeGlow(id);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="space-y-10">
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
      <p className="text-sm text-muted">
        Manchas de luz difuminadas. Arrastrá para moverlas, usá la esquina para
        agrandarlas (o el slider de tamaño), y ajustá color, difuminado y
        opacidad debajo.
      </p>
      {SECTIONS.map((section) => (
        <GlowSectionEditor
          key={section.key}
          section={section}
          glows={glows.filter((g) => g.section === section.key)}
          onAdd={() => handleAdd(section.key)}
          onDuplicate={handleDuplicate}
          onPatchLocal={patchLocal}
          onPersist={persist}
          onRemove={handleRemove}
        />
      ))}
    </div>
  );
}

function GlowSectionEditor({
  section,
  glows,
  onAdd,
  onDuplicate,
  onPatchLocal,
  onPersist,
  onRemove,
}: {
  section: { key: FloatingRenderSection; label: string; dark?: boolean };
  glows: GlowConfig[];
  onAdd: () => Promise<void>;
  onDuplicate: (glow: GlowConfig) => Promise<void>;
  onPatchLocal: (id: string, patch: PersistablePatch) => void;
  onPersist: (id: string, patch: PersistablePatch) => Promise<void>;
  onRemove: (id: string) => void;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [adding, setAdding] = useState(false);

  async function handleAdd() {
    setAdding(true);
    try {
      await onAdd();
    } finally {
      setAdding(false);
    }
  }

  function startDrag(glow: GlowConfig, e: React.PointerEvent) {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const latest = { xPct: glow.xPct, yPct: glow.yPct };

    function onMove(ev: PointerEvent) {
      const dxPct = ((ev.clientX - startX) / rect.width) * 100;
      const dyPct = ((ev.clientY - startY) / rect.height) * 100;
      latest.xPct = clamp(glow.xPct + dxPct, -20, 120);
      latest.yPct = clamp(glow.yPct + dyPct, -20, 120);
      onPatchLocal(glow.id, latest);
    }
    function onUp() {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      onPersist(glow.id, latest);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  function startResize(glow: GlowConfig, e: React.PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const startX = e.clientX;
    const latest = { sizePct: glow.sizePct };

    function onMove(ev: PointerEvent) {
      const dxPct = ((ev.clientX - startX) / rect.width) * 100;
      latest.sizePct = clamp(glow.sizePct + dxPct * 2, 4, 200);
      onPatchLocal(glow.id, latest);
    }
    function onUp() {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      onPersist(glow.id, latest);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{section.label}</h3>
        <button
          type="button"
          onClick={handleAdd}
          disabled={adding}
          className="rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted-bg disabled:opacity-50"
        >
          {adding ? "Agregando..." : "+ Agregar mancha"}
        </button>
      </div>

      <div
        ref={canvasRef}
        className={`relative mt-2 aspect-video w-full touch-none overflow-hidden rounded-lg border border-border ${
          section.dark ? "bg-dark" : "bg-muted-bg"
        }`}
      >
        {glows.map((glow) => (
          <div
            key={glow.id}
            onPointerDown={(e) => startDrag(glow, e)}
            className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-move rounded-full border border-dashed border-transparent hover:border-accent"
            style={{
              left: `${glow.xPct}%`,
              top: `${glow.yPct}%`,
              width: `${glow.sizePct}%`,
              aspectRatio: "1 / 1",
            }}
          >
            {/* Blur lives on its own layer so it never swallows the handles below. */}
            <div
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, ${glow.color}cc 0%, ${glow.color}55 45%, ${glow.color}00 72%)`,
                filter: `blur(${glow.blur}px)`,
                opacity: glow.opacity,
              }}
            />
            <div
              onPointerDown={(e) => startResize(glow, e)}
              className="absolute -right-1.5 -bottom-1.5 h-3.5 w-3.5 cursor-se-resize rounded-full bg-accent opacity-0 group-hover:opacity-100"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(glow.id);
              }}
              className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-[10px] text-white opacity-0 group-hover:opacity-100"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {glows.length > 0 && (
        <div className="mt-3 space-y-2">
          {glows.map((glow) => (
            <div
              key={glow.id}
              className="flex flex-wrap items-center gap-4 rounded-lg border border-border px-3 py-2 text-sm"
            >
              <input
                type="color"
                value={glow.color}
                onChange={(e) => {
                  onPatchLocal(glow.id, { color: e.target.value });
                  onPersist(glow.id, { color: e.target.value });
                }}
                className="h-8 w-10 cursor-pointer rounded border border-border p-1"
              />
              <label className="flex items-center gap-2">
                Tamaño
                <input
                  type="range"
                  min={4}
                  max={150}
                  value={glow.sizePct}
                  onChange={(e) => onPatchLocal(glow.id, { sizePct: Number(e.target.value) })}
                  onPointerUp={() => onPersist(glow.id, { sizePct: glow.sizePct })}
                />
              </label>
              <label className="flex items-center gap-2">
                Difuminado
                <input
                  type="range"
                  min={0}
                  max={150}
                  value={glow.blur}
                  onChange={(e) => onPatchLocal(glow.id, { blur: Number(e.target.value) })}
                  onPointerUp={() => onPersist(glow.id, { blur: glow.blur })}
                />
              </label>
              <label className="flex items-center gap-2">
                Opacidad
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={glow.opacity}
                  onChange={(e) => onPatchLocal(glow.id, { opacity: Number(e.target.value) })}
                  onPointerUp={() => onPersist(glow.id, { opacity: glow.opacity })}
                />
              </label>
              <button
                type="button"
                onClick={() => onDuplicate(glow)}
                className="ml-auto rounded-full border border-border px-2.5 py-1 text-xs hover:bg-muted-bg"
              >
                Duplicar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
