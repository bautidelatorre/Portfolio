"use client";

import { useState, useTransition } from "react";
import { updateSiteSettings } from "@/lib/actions/settings";
import { themePresets } from "@/lib/theme-presets";
import { MAX_CURSOR_GLOW_SIZE } from "@/lib/site-settings-constants";
import { ColorPickerField } from "./ColorPickerField";
import type { SectionConfig } from "@/lib/db/schema";

const SECTION_LABELS: Record<string, string> = {
  about: "Sobre mí",
  projects: "Proyectos",
  contact: "Contacto",
};

function relativeLuminance(hex: string): number | null {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return null;
  const rgb = [0, 2, 4].map((i) => parseInt(hex.slice(1 + i, 3 + i), 16) / 255);
  const [r, g, b] = rgb.map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastWithWhite(hex: string): number | null {
  const l = relativeLuminance(hex);
  if (l === null) return null;
  return (1.05) / (l + 0.05);
}

export function SiteSettingsForm({
  defaultValues,
}: {
  defaultValues: {
    accentColor: string;
    backgroundColor: string;
    darkColor: string;
    cursorGlowColor: string;
    cursorGlowSize: number;
    fontFamily: string;
    sectionOrder: SectionConfig[];
    projectColumns: number;
  };
}) {
  const [accentColor, setAccentColor] = useState(defaultValues.accentColor);
  const [backgroundColor, setBackgroundColor] = useState(defaultValues.backgroundColor);
  const [darkColor, setDarkColor] = useState(defaultValues.darkColor);
  const [cursorGlowColor, setCursorGlowColor] = useState(defaultValues.cursorGlowColor);
  const [cursorGlowSize, setCursorGlowSize] = useState(defaultValues.cursorGlowSize);
  const [fontFamily, setFontFamily] = useState(defaultValues.fontFamily);
  const [sectionOrder, setSectionOrder] = useState<SectionConfig[]>(defaultValues.sectionOrder);
  const [projectColumns, setProjectColumns] = useState(defaultValues.projectColumns);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const contrast = contrastWithWhite(darkColor);
  const lowContrast = contrast !== null && contrast < 4.5;

  function moveSection(index: number, direction: -1 | 1) {
    const next = [...sectionOrder];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setSectionOrder(next);
  }

  function toggleVisible(index: number) {
    const next = [...sectionOrder];
    next[index] = { ...next[index], visible: !next[index].visible };
    setSectionOrder(next);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      try {
        await updateSiteSettings({
          accentColor,
          backgroundColor,
          darkColor,
          cursorGlowColor,
          cursorGlowSize,
          fontFamily,
          sectionOrder,
          projectColumns,
        });
        setSuccess(true);
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
      {success && (
        <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
          Guardado. Revisá el sitio en otra pestaña para ver los cambios.
        </p>
      )}

      <div>
        <h2 className="text-sm font-semibold">Paletas</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {themePresets.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => {
                setAccentColor(preset.accentColor);
                setBackgroundColor(preset.backgroundColor);
                setDarkColor(preset.darkColor);
                setCursorGlowColor(preset.accentColor);
              }}
              className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm hover:bg-muted-bg"
            >
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: preset.accentColor }}
              />
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold">Colores personalizados</h2>
        <ColorPickerField label="Acento" value={accentColor} onChange={setAccentColor} />
        <ColorPickerField label="Fondo" value={backgroundColor} onChange={setBackgroundColor} />
        <ColorPickerField label="Oscuro (paneles y botones)" value={darkColor} onChange={setDarkColor} />
        <ColorPickerField
          label="Mancha que sigue al mouse"
          value={cursorGlowColor}
          onChange={setCursorGlowColor}
        />
        <div>
          <label className="flex items-center justify-between text-sm font-medium">
            <span>Tamaño de la mancha</span>
            <span className="text-muted">
              {Math.round((cursorGlowSize / MAX_CURSOR_GLOW_SIZE) * 100)}%
            </span>
          </label>
          <input
            type="range"
            min={0}
            max={MAX_CURSOR_GLOW_SIZE}
            value={cursorGlowSize}
            onChange={(e) => setCursorGlowSize(Number(e.target.value))}
            className="mt-2 w-full"
          />
        </div>
        {lowContrast && (
          <p className="text-sm text-amber-600">
            Este color puede dificultar la lectura del texto blanco en la sección
            &quot;Sobre mí&quot;.
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold">Tipografía</label>
        <p className="mt-1 text-sm text-muted">
          Escribí el nombre exacto de cualquier fuente de Google Fonts (ej: Poppins,
          Playfair Display, Space Grotesk).
        </p>
        <input
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          list="font-suggestions"
          className="mt-2 w-full rounded-lg border border-border px-3 py-2"
        />
        <datalist id="font-suggestions">
          <option value="Zalando Sans" />
          <option value="Inter" />
          <option value="Poppins" />
          <option value="Playfair Display" />
          <option value="Space Grotesk" />
          <option value="Manrope" />
          <option value="DM Sans" />
          <option value="Sora" />
        </datalist>
      </div>

      <div>
        <h2 className="text-sm font-semibold">Orden y visibilidad de secciones</h2>
        <div className="mt-2 space-y-2">
          {sectionOrder.map((section, i) => (
            <div
              key={section.key}
              className="flex items-center justify-between rounded-lg border border-border px-4 py-2"
            >
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={section.visible}
                  onChange={() => toggleVisible(i)}
                />
                {SECTION_LABELS[section.key]}
              </label>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => moveSection(i, -1)}
                  disabled={i === 0}
                  className="rounded-full border border-border px-2 py-1 text-xs disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveSection(i, 1)}
                  disabled={i === sectionOrder.length - 1}
                  className="rounded-full border border-border px-2 py-1 text-xs disabled:opacity-30"
                >
                  ↓
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold">Columnas de la grilla de proyectos</h2>
        <div className="mt-2 flex gap-4">
          {[2, 3].map((n) => (
            <label key={n} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="projectColumns"
                checked={projectColumns === n}
                onChange={() => setProjectColumns(n)}
              />
              {n} columnas
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-dark px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {isPending ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
