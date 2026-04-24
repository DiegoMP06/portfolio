import { z } from "astro/zod";
import { defineAction } from "astro:actions";
import { and, db, eq, Media } from "astro:db";
import { ensureAuth, ensureTrustedActionRequest } from "../lib/actions";
import { nullToEmptyArray, nullToEmptyString } from "../lib/utils";

export const media = {
    addImages: defineAction({
        accept: "json",
        input: z.object({
            projectId: z.preprocess(
                nullToEmptyString,
                z.number().int().positive(),
            ),
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

                const mediaInserts = input.images.map((image) => ({
                    url: image,
                    projectId: input.projectId,
                    featured: false,
                    createdAt: new Date(),
                }));

                await db.insert(Media).values(mediaInserts);

                return {
                    success: true,
                    message: "Imágenes agregadas",
                };
            } catch {
                return {
                    success: false,
                    message: "No fue posible agregar las imágenes",
                };
            }
        },
    }),

    removeImage: defineAction({
        accept: "json",
        input: z.object({
            projectId: z.preprocess(
                nullToEmptyString,
                z.number().int().positive(),
            ),
            mediaId: z.preprocess(
                nullToEmptyString,
                z.number().int().positive(),
            ),
        }),
        async handler(input, context) {
            ensureTrustedActionRequest(context.request);

            try {
                ensureAuth(context);

                const media = await db
                    .select()
                    .from(Media)
                    .where(
                        and(
                            eq(Media.id, input.mediaId),
                            eq(Media.projectId, input.projectId),
                        ),
                    )
                    .get();

                if (!media) {
                    return {
                        success: false,
                        message: "Imagen no encontrada",
                    };
                }

                if (media.featured) {
                    return {
                        success: false,
                        message:
                            "La imagen esta destacada, no puedes eliminarla",
                    };
                }

                await db.delete(Media).where(eq(Media.id, media.id));

                return {
                    success: true,
                    message: "Imagen eliminada",
                };
            } catch {
                return {
                    success: false,
                    message: "No fue posible eliminar la imagen",
                };
            }
        },
    }),

    setFeaturedImage: defineAction({
        accept: "json",
        input: z.object({
            projectId: z.preprocess(
                nullToEmptyString,
                z.number().int().positive(),
            ),
            mediaId: z.preprocess(
                nullToEmptyString,
                z.number().int().positive(),
            ),
        }),
        async handler(input, context) {
            ensureTrustedActionRequest(context.request);

            try {
                ensureAuth(context);

                const media = await db
                    .select()
                    .from(Media)
                    .where(
                        and(
                            eq(Media.id, input.mediaId),
                            eq(Media.projectId, input.projectId),
                        ),
                    )
                    .get();

                if (!media) {
                    return {
                        success: false,
                        message: "Imagen no encontrada",
                    };
                }

                if (media.featured) {
                    return {
                        success: false,
                        message: "La imagen ya esta destacada",
                    };
                }

                await db.transaction(async (tx) => {
                    await tx
                        .update(Media)
                        .set({ featured: false })
                        .where(eq(Media.projectId, input.projectId));

                    await tx
                        .update(Media)
                        .set({ featured: true })
                        .where(
                            and(
                                eq(Media.id, input.mediaId),
                                eq(Media.projectId, input.projectId),
                            ),
                        );
                });

                return {
                    success: true,
                    message: "Imagen destacada",
                };
            } catch {
                return {
                    success: false,
                    message: "No fue posible destacar la imagen",
                };
            }
        },
    }),
};
