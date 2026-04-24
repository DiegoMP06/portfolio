import { z } from "astro/zod";
import { defineAction } from "astro:actions";
import { db, eq, Media, Project, ProjectCategory } from "astro:db";
import { ensureAuth, ensureTrustedActionRequest } from "../lib/actions";
import { getUniqueSlug } from "../lib/slug";
import { sanitizeRichTextHtml } from "../lib/sanitize-html";
import { nullToEmptyArray, nullToEmptyString } from "../lib/utils";

const projectInputSchema = z.object({
    name: z.preprocess(
        nullToEmptyString,
        z.string().min(3, { message: "El nombre es requerido" }),
    ),
    description: z.preprocess(
        nullToEmptyString,
        z.string().min(50, { message: "Agrega una descripción más completa" }),
    ),
    content: z.preprocess(
        nullToEmptyString,
        z.string().min(50, { message: "Agrega contenido del proyecto" }),
    ),
    demoUrl: z.preprocess(
        nullToEmptyString,
        z.url({ message: "La URL de demo no es válida" }).or(z.literal("")),
    ),
    githubUrl: z.preprocess(
        nullToEmptyString,
        z.url({ message: "La URL de GitHub no es válida" }),
    ),
    stack: z.preprocess(
        nullToEmptyArray,
        z
            .array(z.string().min(1))
            .min(1, { message: "Agrega al menos una tecnología" }),
    ),
    categories: z.preprocess(
        nullToEmptyArray,
        z
            .array(z.number())
            .min(1, { message: "Agrega al menos una categoría" }),
    ),
    statusId: z.preprocess(
        nullToEmptyString,
        z
            .number({ message: "El estado es inválido" })
            .int({ message: "El estado es obligatorio" })
            .positive({ message: "El estado es inválido" }),
    ),
});

export const projects = {
    create: defineAction({
        accept: "json",
        input: projectInputSchema.extend({
            images: z.preprocess(
                nullToEmptyArray,
                z
                    .array(z.string())
                    .min(1, { message: "Agrega al menos una imagen" }),
            ),
        }),
        async handler(input, context) {
            ensureTrustedActionRequest(context.request);

            try {
                ensureAuth(context);

                const slug = await getUniqueSlug(input.name);

                await db.transaction(async (tx) => {
                    const sanitizedContent = sanitizeRichTextHtml(input.content);

                    const project = await tx
                        .insert(Project)
                        .values({
                            name: input.name.trim(),
                            slug,
                            description: input.description.trim(),
                            content: sanitizedContent,
                            demoUrl: input.demoUrl.trim() || undefined,
                            githubUrl: input.githubUrl.trim(),
                            stack: input.stack,
                            statusId: input.statusId,
                            createdAt: new Date(),
                        })
                        .returning()
                        .get();

                    const categoryInserts = input.categories.map((catId) => ({
                        projectId: project.id,
                        categoryId: catId,
                    }));

                    const mediaInserts = input.images.map((image, i) => ({
                        url: image,
                        projectId: project.id,
                        featured: i === 0,
                        createdAt: new Date(),
                    }));

                    await tx.insert(ProjectCategory).values(categoryInserts);

                    await tx.insert(Media).values(mediaInserts);
                });

                return {
                    success: true,
                    message: "Proyecto creado correctamente",
                };
            } catch {
                return {
                    success: false,
                    message: "No fue posible crear el proyecto",
                };
            }
        },
    }),

    update: defineAction({
        accept: "json",
        input: projectInputSchema.extend({
            projectId: z.preprocess(
                nullToEmptyString,
                z.number().int().positive(),
            ),
        }),
        async handler(input, context) {
            ensureTrustedActionRequest(context.request);

            try {
                ensureAuth(context);

                const project = await db
                    .select()
                    .from(Project)
                    .where(eq(Project.id, input.projectId))
                    .get();

                if (!project) {
                    return {
                        success: false,
                        message: "Proyecto no encontrado",
                    };
                }

                const slug = await getUniqueSlug(input.name, project.id);

                await db.transaction(async (tx) => {
                    const sanitizedContent = sanitizeRichTextHtml(input.content);

                    await tx
                        .update(Project)
                        .set({
                            name: input.name.trim(),
                            slug,
                            description: input.description.trim(),
                            content: sanitizedContent,
                            demoUrl: input.demoUrl.trim() || undefined,
                            githubUrl: input.githubUrl.trim(),
                            stack: input.stack,
                            statusId: input.statusId,
                            updatedAt: new Date(),
                        })
                        .where(eq(Project.id, project.id));

                    await tx
                        .delete(ProjectCategory)
                        .where(eq(ProjectCategory.projectId, project.id));

                    const categoryInserts = input.categories.map((catId) => ({
                        projectId: project.id,
                        categoryId: catId,
                    }));

                    await tx.insert(ProjectCategory).values(categoryInserts);
                });

                return {
                    success: true,
                    message: "Proyecto actualizado",
                };
            } catch {
                return {
                    success: false,
                    message: "No fue posible actualizar el proyecto",
                };
            }
        },
    }),

    remove: defineAction({
        accept: "json",
        input: z.object({
            projectId: z.preprocess(
                nullToEmptyString,
                z.number().int().positive(),
            ),
        }),
        async handler(input, context) {
            ensureTrustedActionRequest(context.request);

            try {
                ensureAuth(context);

                await db.transaction(async (tx) => {
                    await tx
                        .delete(Media)
                        .where(eq(Media.projectId, input.projectId));
                    await tx
                        .delete(ProjectCategory)
                        .where(eq(ProjectCategory.projectId, input.projectId));
                    await tx
                        .delete(Project)
                        .where(eq(Project.id, input.projectId));
                });

                return {
                    success: true,
                    message: "Proyecto eliminado",
                };
            } catch {
                return {
                    success: false,
                    message: "No fue posible eliminar el proyecto",
                };
            }
        },
    }),

    setFeaturedProject: defineAction({
        accept: "json",
        input: z.object({
            projectId: z.preprocess(
                nullToEmptyArray,
                z.number().int().positive(),
            ),
        }),
        async handler(input, context) {
            ensureTrustedActionRequest(context.request);

            try {
                ensureAuth(context);

                const project = await db
                    .select()
                    .from(Project)
                    .where(eq(Project.id, input.projectId))
                    .get();

                if (!project) {
                    return {
                        success: false,
                        message: "Proyecto no encontrado",
                    };
                }

                await db
                    .update(Project)
                    .set({ featured: !project.featured })
                    .where(eq(Project.id, input.projectId));

                return {
                    success: true,
                    message: project.featured
                        ? "Proyecto no destacado"
                        : "Proyecto destacado",
                };
            } catch {
                return {
                    success: false,
                    message: "No fue posible actualizar el proyecto",
                };
            }
        },
    }),
};
