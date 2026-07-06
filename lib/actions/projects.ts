"use server";

import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { projects, type ProjectRow } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { Project } from "@/lib/types";

function toProject(row: ProjectRow): Project {
  return {
    id: String(row.id),
    slug: row.slug,
    title: row.title,
    description: row.description,
    tags: row.tags,
    images: row.images,
    externalUrl: row.externalUrl ?? undefined,
    featured: row.featured,
  };
}

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Not authorized");
}

export async function getProjectRows(): Promise<ProjectRow[]> {
  return db
    .select()
    .from(projects)
    .orderBy(asc(projects.sortOrder), asc(projects.createdAt));
}

export async function getProjects(): Promise<Project[]> {
  const rows = await getProjectRows();
  return rows.map(toProject);
}

export async function getProjectById(id: number): Promise<ProjectRow | undefined> {
  const rows = await db.select().from(projects).where(eq(projects.id, id));
  return rows[0];
}

export type ProjectInput = {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  images: { url: string; alt: string }[];
  externalUrl?: string;
  featured: boolean;
};

export async function createProject(input: ProjectInput) {
  await requireAdmin();
  await db.insert(projects).values({
    title: input.title,
    slug: input.slug,
    description: input.description,
    tags: input.tags,
    images: input.images,
    externalUrl: input.externalUrl || null,
    featured: input.featured,
  });
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateProject(id: number, input: ProjectInput) {
  await requireAdmin();
  await db
    .update(projects)
    .set({
      title: input.title,
      slug: input.slug,
      description: input.description,
      tags: input.tags,
      images: input.images,
      externalUrl: input.externalUrl || null,
      featured: input.featured,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id));
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteProject(id: number) {
  await requireAdmin();
  await db.delete(projects).where(eq(projects.id, id));
  revalidatePath("/");
  revalidatePath("/admin");
}
