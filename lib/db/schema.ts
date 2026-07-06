import {
  pgTable,
  serial,
  text,
  jsonb,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  tags: text("tags").array().notNull().default([]),
  images: jsonb("images").$type<{ url: string; alt: string }[]>().notNull().default([]),
  externalUrl: text("external_url"),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type ProjectRow = typeof projects.$inferSelect;
export type NewProjectRow = typeof projects.$inferInsert;

export type SectionKey = "about" | "projects" | "contact";
export type SectionConfig = { key: SectionKey; visible: boolean };

export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  accentColor: text("accent_color").notNull().default("#ff6044"),
  backgroundColor: text("background_color").notNull().default("#ffffff"),
  darkColor: text("dark_color").notNull().default("#121212"),
  cursorGlowColor: text("cursor_glow_color").notNull().default("#ff6044"),
  fontFamily: text("font_family").notNull().default("Zalando Sans"),
  sectionOrder: jsonb("section_order")
    .$type<SectionConfig[]>()
    .notNull()
    .default([
      { key: "about", visible: true },
      { key: "projects", visible: true },
      { key: "contact", visible: true },
    ]),
  projectColumns: integer("project_columns").notNull().default(3),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type SiteSettingsRow = typeof siteSettings.$inferSelect;
