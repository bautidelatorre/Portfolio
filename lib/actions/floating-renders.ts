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
  return rows.length === 0 ? [] : rows[0].floatingRenders;
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
): Promise<FloatingRenderConfig> {
  await requireAdmin();
  if (!SECTIONS.includes(section)) throw new Error("Sección inválida.");
  if (!imageUrl.startsWith("http")) throw new Error("Imagen inválida.");

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
  };
  await saveRenders([...renders, next]);
  return next;
}

export async function updateFloatingRender(
  id: string,
  patch: Partial<
    Pick<FloatingRenderConfig, "xPct" | "yPct" | "widthPct" | "rotate" | "opacity" | "layer">
  >
): Promise<FloatingRenderConfig> {
  await requireAdmin();

  const renders = await getRenders();
  const index = renders.findIndex((r) => r.id === id);
  if (index === -1) throw new Error("No se encontró la imagen.");

  const current = renders[index];
  const next: FloatingRenderConfig = { ...current };

  if (patch.xPct !== undefined) next.xPct = clamp(patch.xPct, -50, 150);
  if (patch.yPct !== undefined) next.yPct = clamp(patch.yPct, -50, 150);
  if (patch.widthPct !== undefined) next.widthPct = clamp(patch.widthPct, 4, 150);
  if (patch.rotate !== undefined) next.rotate = clamp(patch.rotate, -180, 180);
  if (patch.opacity !== undefined) next.opacity = clamp(patch.opacity, 0, 1);
  if (patch.layer !== undefined) {
    if (patch.layer !== "behind" && patch.layer !== "front") {
      throw new Error("Capa inválida.");
    }
    next.layer = patch.layer as FloatingRenderLayer;
  }

  renders[index] = next;
  await saveRenders(renders);
  return next;
}

export async function removeFloatingRender(id: string) {
  await requireAdmin();
  const renders = await getRenders();
  await saveRenders(renders.filter((r) => r.id !== id));
}
