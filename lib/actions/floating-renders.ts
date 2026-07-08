"use server";

import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  siteSettings,
  type FloatingRenderConfig,
  type FloatingRenderSection,
  type FloatingRenderLayer,
} from "@/lib/db/schema";
import { auth } from "@/lib/auth";

const SECTIONS: FloatingRenderSection[] = ["hero", "about", "projects", "contact"];

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Not authorized");
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

async function getRenders(): Promise<FloatingRenderConfig[]> {
  const rows = await db
    .select({ floatingRenders: siteSettings.floatingRenders })
    .from(siteSettings)
    .where(eq(siteSettings.id, 1));
  if (rows.length === 0) return [];
  return rows[0].floatingRenders.map((r) => ({
    ...r,
    float: r.float ?? true,
    mobileVisible: r.mobileVisible ?? false,
    mobileXPct: r.mobileXPct ?? r.xPct,
    mobileYPct: r.mobileYPct ?? r.yPct,
    mobileWidthPct: r.mobileWidthPct ?? r.widthPct,
    mobileRotate: r.mobileRotate ?? r.rotate,
    mobileOpacity: r.mobileOpacity ?? r.opacity,
  }));
}

async function saveRenders(renders: FloatingRenderConfig[]) {
  await db
    .insert(siteSettings)
    .values({ id: 1, floatingRenders: renders, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: siteSettings.id,
      set: { floatingRenders: renders, updatedAt: new Date() },
    });

  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function addFloatingRender(
  section: FloatingRenderSection,
  imageUrl: string
): Promise<{ data?: FloatingRenderConfig; error?: string }> {
  try {
    await requireAdmin();
    if (!SECTIONS.includes(section)) return { error: "Sección inválida." };
    if (!imageUrl.startsWith("http")) return { error: "Imagen inválida." };

    const renders = await getRenders();
    const next: FloatingRenderConfig = {
      id: randomUUID(),
      section,
      imageUrl,
      xPct: 55,
      yPct: 15,
      widthPct: 28,
      rotate: 0,
      opacity: 0.85,
      layer: "behind",
      float: true,
      mobileVisible: false,
      mobileXPct: 55,
      mobileYPct: 15,
      mobileWidthPct: 28,
      mobileRotate: 0,
      mobileOpacity: 0.85,
    };
    await saveRenders([...renders, next]);
    return { data: next };
  } catch (err) {
    return { error: (err as Error).message };
  }
}

export async function updateFloatingRender(
  id: string,
  patch: Partial<
    Pick<
      FloatingRenderConfig,
      | "xPct"
      | "yPct"
      | "widthPct"
      | "rotate"
      | "opacity"
      | "layer"
      | "float"
      | "mobileVisible"
      | "mobileXPct"
      | "mobileYPct"
      | "mobileWidthPct"
      | "mobileRotate"
      | "mobileOpacity"
    >
  >
): Promise<{ data?: FloatingRenderConfig; error?: string }> {
  try {
    await requireAdmin();

    const renders = await getRenders();
    const index = renders.findIndex((r) => r.id === id);
    if (index === -1) return { error: "No se encontró la imagen." };

    const current = renders[index];
    const next: FloatingRenderConfig = { ...current };

    if (patch.xPct !== undefined) next.xPct = clamp(patch.xPct, -50, 150);
    if (patch.yPct !== undefined) next.yPct = clamp(patch.yPct, -50, 150);
    if (patch.widthPct !== undefined) next.widthPct = clamp(patch.widthPct, 4, 150);
    if (patch.rotate !== undefined) next.rotate = clamp(patch.rotate, -180, 180);
    if (patch.opacity !== undefined) next.opacity = clamp(patch.opacity, 0, 1);
    if (patch.layer !== undefined) {
      if (patch.layer !== "behind" && patch.layer !== "front") {
        return { error: "Capa inválida." };
      }
      next.layer = patch.layer as FloatingRenderLayer;
    }
    if (patch.float !== undefined) next.float = patch.float;
    if (patch.mobileVisible !== undefined) next.mobileVisible = patch.mobileVisible;
    if (patch.mobileXPct !== undefined) next.mobileXPct = clamp(patch.mobileXPct, -50, 150);
    if (patch.mobileYPct !== undefined) next.mobileYPct = clamp(patch.mobileYPct, -50, 150);
    if (patch.mobileWidthPct !== undefined)
      next.mobileWidthPct = clamp(patch.mobileWidthPct, 4, 150);
    if (patch.mobileRotate !== undefined) next.mobileRotate = clamp(patch.mobileRotate, -180, 180);
    if (patch.mobileOpacity !== undefined) next.mobileOpacity = clamp(patch.mobileOpacity, 0, 1);

    renders[index] = next;
    await saveRenders(renders);
    return { data: next };
  } catch (err) {
    return { error: (err as Error).message };
  }
}

export async function removeFloatingRender(id: string): Promise<{ error?: string }> {
  try {
    await requireAdmin();
    const renders = await getRenders();
    await saveRenders(renders.filter((r) => r.id !== id));
    return {};
  } catch (err) {
    return { error: (err as Error).message };
  }
}
