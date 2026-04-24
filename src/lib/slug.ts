import { db, like, Project } from "astro:db";

export const slugify = (value: string) =>
    value
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-");

export const getUniqueSlug = async (name: string, projectId?: number) => {
    const baseSlug = slugify(name);

    const existingProjects = await db
        .select({ id: Project.id, slug: Project.slug })
        .from(Project)
        .where(like(Project.slug, `${baseSlug}%`));

    const conflictingSlugs = new Set(
        existingProjects
            .filter((p) => p.id !== projectId)
            .map((p) => p.slug)
    );

    if (!conflictingSlugs.has(baseSlug)) {
        return baseSlug;
    }

    let counter = 2;
    while (conflictingSlugs.has(`${baseSlug}-${counter}`)) {
        counter++;
    }

    return `${baseSlug}-${counter}`;
};
