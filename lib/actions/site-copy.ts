"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { siteSettings, DEFAULT_SITE_COPY, type SiteCopy } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

const FIELD_LABELS: Record<keyof SiteCopy, string> = {
  navProjects: "Nav — Projects",
  navAbout: "Nav — About",
  navContact: "Nav — Contact",
  heroKicker: "Hero — kicker",
  heroHeadline: "Hero — headline",
  heroSubtext: "Hero — subtext",
  heroPrimaryCta: "Hero — primary button",
  heroSecondaryCta: "Hero — secondary button",
  aboutLabel: "About — section label",
  aboutHeadline: "About — headline",
  aboutBio: "About — bio",
  projectsLabel: "Projects — section label",
  contactLabel: "Contact — section label",
  contactHeadline: "Contact — headline",
  footerName: "Footer — name",
};

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Not authorized");
}

export async function getSiteCopy(): Promise<SiteCopy> {
  const rows = await db
    .select({ siteCopy: siteSettings.siteCopy })
    .from(siteSettings)
    .where(eq(siteSettings.id, 1));
  if (rows.length === 0) return DEFAULT_SITE_COPY;
  return { ...DEFAULT_SITE_COPY, ...rows[0].siteCopy };
}

const MAX_LENGTH = 3000;

export async function updateSiteCopy(input: SiteCopy): Promise<{ error?: string }> {
  try {
    await requireAdmin();

    const next = { ...DEFAULT_SITE_COPY };
    for (const key of Object.keys(DEFAULT_SITE_COPY) as (keyof SiteCopy)[]) {
      const value = input[key];
      if (typeof value !== "string") {
        return { error: `Missing text for "${FIELD_LABELS[key]}".` };
      }
      const trimmed = value.trim();
      if (trimmed.length === 0) {
        return { error: `"${FIELD_LABELS[key]}" can't be empty.` };
      }
      if (trimmed.length > MAX_LENGTH) {
        return {
          error: `"${FIELD_LABELS[key]}" is too long (max ${MAX_LENGTH} characters).`,
        };
      }
      next[key] = trimmed;
    }

    await db
      .insert(siteSettings)
      .values({ id: 1, siteCopy: next, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: siteSettings.id,
        set: { siteCopy: next, updatedAt: new Date() },
      });

    revalidatePath("/");
    revalidatePath("/admin/settings");
    return {};
  } catch (err) {
    return { error: (err as Error).message };
  }
}
