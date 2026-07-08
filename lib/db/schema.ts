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

export type FloatingRenderSection = "hero" | "about" | "projects" | "contact";
export type FloatingRenderLayer = "behind" | "front";
export type FloatingRenderConfig = {
  id: string;
  section: FloatingRenderSection;
  imageUrl: string;
  xPct: number;
  yPct: number;
  widthPct: number;
  rotate: number;
  opacity: number;
  layer: FloatingRenderLayer;
  float: boolean;
  mobileVisible: boolean;
  mobileXPct: number;
  mobileYPct: number;
  mobileWidthPct: number;
  mobileRotate: number;
  mobileOpacity: number;
};

export type GlowConfig = {
  id: string;
  section: FloatingRenderSection;
  xPct: number;
  yPct: number;
  sizePct: number;
  blur: number;
  color: string;
  opacity: number;
};

export type MobileContentOffsets = {
  hero: number;
  about: number;
  projects: number;
  contact: number;
};

export const DEFAULT_MOBILE_CONTENT_OFFSETS: MobileContentOffsets = {
  hero: 0,
  about: 0,
  projects: 0,
  contact: -48,
};

export type SiteCopy = {
  navProjects: string;
  navAbout: string;
  navContact: string;
  heroKicker: string;
  heroHeadline: string;
  heroSubtext: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  aboutLabel: string;
  aboutHeadline: string;
  aboutBio: string;
  projectsLabel: string;
  contactLabel: string;
  contactHeadline: string;
  footerName: string;
};

export const DEFAULT_SITE_COPY: SiteCopy = {
  navProjects: "Projects",
  navAbout: "About",
  navContact: "Contact",
  heroKicker: "Bautista",
  heroHeadline: "Product designer & visual identity.",
  heroSubtext:
    "I help brands and teams build clear products and experiences, with a focus on form and detail.",
  heroPrimaryCta: "View projects",
  heroSecondaryCta: "Contact",
  aboutLabel: "About me",
  aboutHeadline:
    "I work at the intersection of product design and brand identity, always chasing simple solutions to complex problems.",
  aboutBio:
    "It started as a kid — rearranging furniture by inches until a room finally felt right, noticing when a chair's proportions were just slightly off. That obsession with form and proportion never really left, it just found better tools. I still chase that same feeling in every product and brand I design today.",
  projectsLabel: "Projects",
  contactLabel: "Contact",
  contactHeadline: "Got a project in mind? Let's pull up a chair.",
  footerName: "Bautista",
};

export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  accentColor: text("accent_color").notNull().default("#ff6044"),
  backgroundColor: text("background_color").notNull().default("#ffffff"),
  darkColor: text("dark_color").notNull().default("#121212"),
  cursorGlowColor: text("cursor_glow_color").notNull().default("#ff6044"),
  cursorGlowSize: integer("cursor_glow_size").notNull().default(380),
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
  floatingRenders: jsonb("floating_renders")
    .$type<FloatingRenderConfig[]>()
    .notNull()
    .default([]),
  glows: jsonb("glows").$type<GlowConfig[]>().notNull().default([]),
  mobileContentOffsets: jsonb("mobile_content_offsets")
    .$type<MobileContentOffsets>()
    .notNull()
    .default(DEFAULT_MOBILE_CONTENT_OFFSETS),
  siteCopy: jsonb("site_copy")
    .$type<SiteCopy>()
    .notNull()
    .default({} as SiteCopy),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type SiteSettingsRow = typeof siteSettings.$inferSelect;
