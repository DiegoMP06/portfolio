import {
    Category,
    db,
    desc,
    eq,
    inArray,
    Media,
    Project,
    ProjectCategory,
    sql,
    Status,
} from "astro:db";
import type { FormattedProject } from "../types";

export async function getAllProjects(
    limit: number = 10,
    offset: number = 0,
): Promise<FormattedProject[]> {
    const projectsBase = await db
        .select({
            project: Project,
            status: Status.name,
        })
        .from(Project)
        .innerJoin(Status, eq(Project.statusId, Status.id))
        .orderBy(desc(Project.createdAt))
        .limit(limit)
        .offset(offset)
        .all();

    const projectIds = projectsBase.map((p) => p.project.id);

    if (projectIds.length === 0) return [];

    const [allMedia, allCategories] = await Promise.all([
        db
            .select()
            .from(Media)
            .where(inArray(Media.projectId, projectIds))
            .all(),

        db
            .select({
                projectId: ProjectCategory.projectId,
                name: Category.name,
                id: Category.id,
            })
            .from(ProjectCategory)
            .innerJoin(Category, eq(ProjectCategory.categoryId, Category.id))
            .where(inArray(ProjectCategory.projectId, projectIds))
            .all(),
    ]);

    return projectsBase.map(({ project, status }) => ({
        ...project,
        status,
        media: allMedia
            .filter((m) => m.projectId === project.id)
            .map((m) => ({ url: m.url, featured: m.featured, id: m.id })),
        categories: allCategories
            .filter((c) => c.projectId === project.id)
            .map((c) => ({ id: c.id, name: c.name })),
    }));
}

export async function getProjectsCount(): Promise<number> {
    const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(Project)
        .get();

    return Number(result?.count ?? 0);
}

export const getProjectBySlug = async (slug: string) => {
    const projectsBase = await db
        .select({
            project: Project,
            status: Status.name,
        })
        .from(Project)
        .innerJoin(Status, eq(Project.statusId, Status.id))
        .where(eq(Project.slug, slug))
        .get();

    if (!projectsBase) return null;

    const project = projectsBase.project;

    const [allMedia, allCategories] = await Promise.all([
        db.select().from(Media).where(eq(Media.projectId, project.id)).all(),

        db
            .select({
                projectId: ProjectCategory.projectId,
                name: Category.name,
                id: Category.id,
            })
            .from(ProjectCategory)
            .innerJoin(Category, eq(ProjectCategory.categoryId, Category.id))
            .where(eq(ProjectCategory.projectId, project.id))
            .all(),
    ]);

    return {
        ...project,
        status: projectsBase.status,
        media: allMedia
            .filter((m) => m.projectId === project.id)
            .map((m) => ({ url: m.url, featured: m.featured, id: m.id })),
        categories: allCategories
            .filter((c) => c.projectId === project.id)
            .map((c) => ({ id: c.id, name: c.name })),
    } as FormattedProject;
};

export const getProjectById = async (id: number) => {
    const projectsBase = await db
        .select({
            project: Project,
            status: Status.name,
        })
        .from(Project)
        .innerJoin(Status, eq(Project.statusId, Status.id))
        .where(eq(Project.id, id))
        .get();

    if (!projectsBase) return null;

    const project = projectsBase.project;

    const [allMedia, allCategories] = await Promise.all([
        db.select().from(Media).where(eq(Media.projectId, project.id)).all(),

        db
            .select({
                projectId: ProjectCategory.projectId,
                name: Category.name,
                id: Category.id,
            })
            .from(ProjectCategory)
            .innerJoin(Category, eq(ProjectCategory.categoryId, Category.id))
            .where(eq(ProjectCategory.projectId, project.id))
            .all(),
    ]);

    return {
        ...project,
        status: projectsBase.status,
        media: allMedia
            .filter((m) => m.projectId === project.id)
            .map((m) => ({ url: m.url, featured: m.featured, id: m.id })),
        categories: allCategories
            .filter((c) => c.projectId === project.id)
            .map((c) => ({ id: c.id, name: c.name })),
    } as FormattedProject;
};

export async function getFeaturedProjects(
    limit: number = 6,
): Promise<FormattedProject[]> {
    const projectsBase = await db
        .select({
            project: Project,
            status: Status.name,
        })
        .from(Project)
        .where(eq(Project.featured, true))
        .innerJoin(Status, eq(Project.statusId, Status.id))
        .orderBy(desc(Project.createdAt))
        .limit(limit)
        .all();

    const projectIds = projectsBase.map((p) => p.project.id);

    if (projectIds.length === 0) return [];

    const [allMedia, allCategories] = await Promise.all([
        db
            .select()
            .from(Media)
            .where(inArray(Media.projectId, projectIds))
            .all(),

        db
            .select({
                projectId: ProjectCategory.projectId,
                name: Category.name,
                id: Category.id,
            })
            .from(ProjectCategory)
            .innerJoin(Category, eq(ProjectCategory.categoryId, Category.id))
            .where(inArray(ProjectCategory.projectId, projectIds))
            .all(),
    ]);

    return projectsBase.map(({ project, status }) => ({
        ...project,
        status,
        media: allMedia
            .filter((m) => m.projectId === project.id)
            .map((m) => ({ url: m.url, featured: m.featured, id: m.id })),
        categories: allCategories
            .filter((c) => c.projectId === project.id)
            .map((c) => ({ id: c.id, name: c.name })),
    }));
}
