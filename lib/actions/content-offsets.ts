"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  siteSettings,
  DEFAULT_MOBILE_CONTENT_OFFSETS,
  type MobileContentOffsets,
} from "@/lib/db/schema";
import { auth } from "@/lib/auth";

const SECTIONS: (keyof MobileContentOffsets)[] = ["hero", "about", "projects", "contact"];

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Not authorized");
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export async function updateMobileContentOffset(
  section: keyof MobileContentOffsets,
  value: number
): Promise<{ error?: string }> {
  try {
    await requireAdmin();
    if (!SECTIONS.includes(section)) return { error: "Sección inválida." };

    const rows = await db
      .select({ mobileContentOffsets: siteSettings.mobileContentOffsets })
      .from(siteSettings)
      .where(eq(siteSettings.id, 1));

    const current = rows[0]?.mobileContentOffsets ?? DEFAULT_MOBILE_CONTENT_OFFSETS;
    const next: MobileContentOffsets = { ...current, [section]: clamp(value, -160, 160) };

    await db
      .insert(siteSettings)
      .values({ id: 1, mobileContentOffsets: next, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: siteSettings.id,
        set: { mobileContentOffsets: next, updatedAt: new Date() },
      });

    revalidatePath("/");
    revalidatePath("/admin/settings");
    return {};
  } catch (err) {
    return { error: (err as Error).message };
  }
}
