"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  siteSettings,
  type SiteSettingsRow,
  type SectionConfig,
} from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import googleFontsList from "@/lib/google-fonts-list.json";
import { MAX_CURSOR_GLOW_SIZE } from "@/lib/site-settings-constants";

const googleFontsSet = new Set(googleFontsList as string[]);

const DEFAULT_SETTINGS: Omit<SiteSettingsRow, "id" | "updatedAt"> = {
  accentColor: "#ff6044",
  backgroundColor: "#ffffff",
  darkColor: "#121212",
  cursorGlowColor: "#ff6044",
  cursorGlowSize: MAX_CURSOR_GLOW_SIZE,
  fontFamily: "Zalando Sans",
  sectionOrder: [
    { key: "about", visible: true },
    { key: "projects", visible: true },
    { key: "contact", visible: true },
  ],
  projectColumns: 3,
  floatingRenders: [],
};

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Not authorized");
}

export async function getSiteSettings(): Promise<
  Omit<SiteSettingsRow, "id" | "updatedAt">
> {
  const rows = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, 1));
  if (rows.length === 0) return DEFAULT_SETTINGS;
  const { id, updatedAt, ...rest } = rows[0];
  return rest;
}

export type SiteSettingsInput = {
  accentColor: string;
  backgroundColor: string;
  darkColor: string;
  cursorGlowColor: string;
  cursorGlowSize: number;
  fontFamily: string;
  sectionOrder: SectionConfig[];
  projectColumns: number;
};

const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;
const FONT_NAME_SHAPE_RE = /^[A-Za-z0-9 ]{1,60}$/;

export async function updateSiteSettings(input: SiteSettingsInput) {
  await requireAdmin();

  for (const [field, value] of [
    ["accentColor", input.accentColor],
    ["backgroundColor", input.backgroundColor],
    ["darkColor", input.darkColor],
    ["cursorGlowColor", input.cursorGlowColor],
  ] as const) {
    if (!HEX_COLOR_RE.test(value)) {
      throw new Error(`Color inválido en "${field}". Usá el formato #rrggbb.`);
    }
  }

  const fontFamily = input.fontFamily.trim();
  if (!FONT_NAME_SHAPE_RE.test(fontFamily)) {
    throw new Error("Nombre de fuente inválido.");
  }
  if (!googleFontsSet.has(fontFamily)) {
    throw new Error(`"${fontFamily}" no se encontró en Google Fonts.`);
  }

  if (![2, 3].includes(input.projectColumns)) {
    throw new Error("Cantidad de columnas inválida.");
  }

  const cursorGlowSize = Math.max(
    0,
    Math.min(MAX_CURSOR_GLOW_SIZE, Math.round(input.cursorGlowSize))
  );

  await db
    .insert(siteSettings)
    .values({
      id: 1,
      accentColor: input.accentColor,
      backgroundColor: input.backgroundColor,
      darkColor: input.darkColor,
      cursorGlowColor: input.cursorGlowColor,
      cursorGlowSize,
      fontFamily,
      sectionOrder: input.sectionOrder,
      projectColumns: input.projectColumns,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: siteSettings.id,
      set: {
        accentColor: input.accentColor,
        backgroundColor: input.backgroundColor,
        darkColor: input.darkColor,
        cursorGlowColor: input.cursorGlowColor,
        cursorGlowSize,
        fontFamily,
        sectionOrder: input.sectionOrder,
        projectColumns: input.projectColumns,
        updatedAt: new Date(),
      },
    });

  revalidatePath("/");
  revalidatePath("/admin/settings");
}
