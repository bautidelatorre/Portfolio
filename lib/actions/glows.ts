"use server";

import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { siteSettings, type GlowConfig, type FloatingRenderSection } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

const SECTIONS: FloatingRenderSection[] = ["hero", "about", "projects", "contact"];
const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Not authorized");
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

async function getGlows(): Promise<GlowConfig[]> {
  const rows = await db
    .select({ glows: siteSettings.glows })
    .from(siteSettings)
    .where(eq(siteSettings.id, 1));
  return rows.length === 0 ? [] : rows[0].glows;
}

async function saveGlows(glows: GlowConfig[]) {
  await db
    .insert(siteSettings)
    .values({ id: 1, glows, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: siteSettings.id,
      set: { glows, updatedAt: new Date() },
    });

  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function addGlow(section: FloatingRenderSection): Promise<GlowConfig> {
  await requireAdmin();
  if (!SECTIONS.includes(section)) throw new Error("Sección inválida.");

  const glows = await getGlows();
  const next: GlowConfig = {
    id: randomUUID(),
    section,
    xPct: 70,
    yPct: 45,
    sizePct: 40,
    blur: 70,
    color: "#ff6044",
    opacity: 0.75,
  };
  await saveGlows([...glows, next]);
  return next;
}

export async function updateGlow(
  id: string,
  patch: Partial<Pick<GlowConfig, "xPct" | "yPct" | "sizePct" | "blur" | "color" | "opacity">>
): Promise<GlowConfig> {
  await requireAdmin();

  const glows = await getGlows();
  const index = glows.findIndex((g) => g.id === id);
  if (index === -1) throw new Error("No se encontró la mancha.");

  const current = glows[index];
  const next: GlowConfig = { ...current };

  if (patch.xPct !== undefined) next.xPct = clamp(patch.xPct, -50, 150);
  if (patch.yPct !== undefined) next.yPct = clamp(patch.yPct, -50, 150);
  if (patch.sizePct !== undefined) next.sizePct = clamp(patch.sizePct, 4, 200);
  if (patch.blur !== undefined) next.blur = clamp(patch.blur, 0, 200);
  if (patch.opacity !== undefined) next.opacity = clamp(patch.opacity, 0, 1);
  if (patch.color !== undefined) {
    if (!HEX_COLOR_RE.test(patch.color)) throw new Error("Color inválido. Usá el formato #rrggbb.");
    next.color = patch.color;
  }

  glows[index] = next;
  await saveGlows(glows);
  return next;
}

export async function removeGlow(id: string) {
  await requireAdmin();
  const glows = await getGlows();
  await saveGlows(glows.filter((g) => g.id !== id));
}
