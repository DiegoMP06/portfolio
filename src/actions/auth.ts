import { z } from "astro/zod";
import { defineAction } from "astro:actions";
import { createHash } from "node:crypto";
import { ensureTrustedActionRequest } from "../lib/actions";
import { nullToEmptyString } from "../lib/utils";
import { db, eq, PasswordResetToken, Session, User } from "astro:db";
import { comparePassword, hashPassword } from "../lib/password";
import {
    createSession,
    getCurrentUserFromCookies,
    clearSession,
} from "../lib/auth";
import { enforceRateLimit, getRequestIP } from "../lib/rate-limit";
import { sendPasswordResetEmail } from "../lib/mailer";

const hashResetToken = (token: string) =>
    createHash("sha256").update(token).digest("hex");

const isAllowedByRateLimit = (params: {
    keyPrefix: string;
    request: Request;
    maxRequests: number;
    windowMs: number;
}) => {
    const ip = getRequestIP(params.request);
    return enforceRateLimit({
        key: `${params.keyPrefix}:${ip}`,
        maxRequests: params.maxRequests,
        windowMs: params.windowMs,
    });
};

export const auth = {
    login: defineAction({
        accept: "json",
        input: z.object({
            email: z.preprocess(
                nullToEmptyString,
                z.email("El correo electrónico no es válido"),
            ),
            password: z.preprocess(
                nullToEmptyString,
                z.string().min(1, { message: "La contraseña es requerida" }),
            ),
        }),
        async handler(input, context) {
            ensureTrustedActionRequest(context.request);

            try {
                const loginRate = isAllowedByRateLimit({
                    keyPrefix: "auth:login",
                    request: context.request,
                    maxRequests: 10,
                    windowMs: 1000 * 60 * 10,
                });

                if (!loginRate.ok) {
                    return {
                        success: false,
                        message: "Demasiados intentos. Intenta de nuevo en unos minutos.",
                    };
                }

                const user = await db
                    .select()
                    .from(User)
                    .where(eq(User.email, input.email))
                    .get();

                if (!user) {
                    return {
                        success: false,
                        message: "Credenciales incorrectas",
                    };
                }

                const isValidPassword = await comparePassword(
                    input.password,
                    user.password,
                );

                if (!isValidPassword) {
                    return {
                        success: false,
                        message: "Credenciales incorrectas",
                    };
                }

                await createSession(context.cookies, user.id);

                return {
                    success: true,
                    message: "Sesión iniciada correctamente",
                };
            } catch {
                return {
                    success: false,
                    message: "Ocurrió un error al iniciar sesión",
                };
            }
        },
    }),

    forgotPassword: defineAction({
        accept: "json",
        input: z.object({
            email: z.preprocess(
                nullToEmptyString,
                z.email("El correo electrónico no es válido"),
            ),
        }),
        async handler(input, context) {
            ensureTrustedActionRequest(context.request);

            try {
                const forgotRate = isAllowedByRateLimit({
                    keyPrefix: "auth:forgot-password",
                    request: context.request,
                    maxRequests: 5,
                    windowMs: 1000 * 60 * 10,
                });

                if (!forgotRate.ok) {
                    return {
                        success: true,
                        message:
                            "Si el correo existe en el sistema, te enviamos instrucciones para recuperar tu cuenta.",
                    };
                }

                const user = await db
                    .select()
                    .from(User)
                    .where(eq(User.email, input.email))
                    .get();

                if (!user) {
                    return {
                        success: true,
                        message:
                            "Si el correo existe en el sistema, te enviamos instrucciones para recuperar tu cuenta.",
                    };
                }

                const token = crypto.randomUUID().replaceAll("-", "");
                const tokenHash = hashResetToken(token);
                const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

                await db.insert(PasswordResetToken).values({
                    tokenHash,
                    userId: user.id,
                    expiresAt,
                });

                const origin = new URL(context.request.url).origin;
                const appUrl = process.env.APP_URL ?? origin;
                const resetUrl = new URL("/auth/reset-password", appUrl);
                resetUrl.searchParams.set("token", token);

                await sendPasswordResetEmail({
                    to: user.email,
                    name: user.name,
                    resetUrl: resetUrl.toString(),
                });

                return {
                    success: true,
                    message:
                        "Si el correo existe en el sistema, te enviamos instrucciones para recuperar tu cuenta.",
                };
            } catch {
                return {
                    success: false,
                    message: "No fue posible enviar el correo de recuperación",
                };
            }
        },
    }),

    resetPassword: defineAction({
        accept: "json",
        input: z
            .object({
                token: z.preprocess(
                    nullToEmptyString,
                    z.string().min(1, { message: "Token inválido" }),
                ),
                password: z.preprocess(
                    nullToEmptyString,
                    z.string().min(8, {
                        message:
                            "La contraseña debe tener al menos 8 caracteres",
                    }),
                ),
                passwordConfirmation: z.preprocess(
                    nullToEmptyString,
                    z.string().min(1, { message: "Confirma tu contraseña" }),
                ),
            })
            .refine((data) => data.password === data.passwordConfirmation, {
                message: "Las contraseñas no coinciden",
                path: ["passwordConfirmation"],
            }),
        async handler(input, context) {
            ensureTrustedActionRequest(context.request);

            try {
                const resetRate = isAllowedByRateLimit({
                    keyPrefix: "auth:reset-password",
                    request: context.request,
                    maxRequests: 10,
                    windowMs: 1000 * 60 * 10,
                });

                if (!resetRate.ok) {
                    return {
                        success: false,
                        message: "Demasiados intentos. Solicita un nuevo enlace y vuelve a intentar.",
                    };
                }

                const tokenHash = hashResetToken(input.token);

                const resetToken = await db
                    .select()
                    .from(PasswordResetToken)
                    .where(eq(PasswordResetToken.tokenHash, tokenHash))
                    .get();

                if (!resetToken || resetToken.expiresAt < new Date()) {
                    return {
                        success: false,
                        message:
                            "El enlace de recuperación no es válido o ya expiró",
                    };
                }

                const hashedPassword = await hashPassword(input.password);

                await db
                    .update(User)
                    .set({ password: hashedPassword })
                    .where(eq(User.id, resetToken.userId));

                await db
                    .delete(PasswordResetToken)
                    .where(eq(PasswordResetToken.tokenHash, tokenHash));

                await db
                    .delete(Session)
                    .where(eq(Session.userId, resetToken.userId));

                return {
                    success: true,
                    message: "Tu contraseña fue actualizada correctamente",
                };
            } catch {
                return {
                    success: false,
                    message: "No fue posible restablecer la contraseña",
                };
            }
        },
    }),

    updateProfile: defineAction({
        accept: "json",
        input: z.object({
            name: z.preprocess(
                nullToEmptyString,
                z.string().min(2, { message: "El nombre es requerido" }),
            ),
            email: z.preprocess(
                nullToEmptyString,
                z.email("Ingresa un correo electrónico válido"),
            ),
        }),
        async handler(input, context) {
            ensureTrustedActionRequest(context.request);

            try {
                const user = await getCurrentUserFromCookies(context.cookies);

                if (!user) {
                    return {
                        success: false,
                        message: "Tu sesión expiró. Inicia sesión otra vez",
                    };
                }

                const existingUser = await db
                    .select()
                    .from(User)
                    .where(eq(User.email, input.email))
                    .get();

                if (existingUser && existingUser.id !== user.id) {
                    return {
                        success: false,
                        message: "Ese correo ya está en uso",
                    };
                }

                await db
                    .update(User)
                    .set({ email: input.email.trim(), name: input.name.trim() })
                    .where(eq(User.id, user.id));

                return {
                    success: true,
                    message: "Perfil actualizado correctamente",
                };
            } catch {
                return {
                    success: false,
                    message: "No fue posible actualizar tu perfil",
                };
            }
        },
    }),

    updatePassword: defineAction({
        accept: "json",
        input: z
            .object({
                currentPassword: z.preprocess(
                    nullToEmptyString,
                    z
                        .string()
                        .min(1, { message: "Ingresa tu contraseña actual" }),
                ),
                password: z.preprocess(
                    nullToEmptyString,
                    z.string().min(8, {
                        message:
                            "La nueva contraseña debe tener al menos 8 caracteres",
                    }),
                ),
                passwordConfirmation: z.preprocess(
                    nullToEmptyString,
                    z
                        .string()
                        .min(1, { message: "Confirma la nueva contraseña" }),
                ),
            })
            .refine((data) => data.password === data.passwordConfirmation, {
                message: "Las contraseñas no coinciden",
                path: ["passwordConfirmation"],
        }),
        async handler(input, context) {
            ensureTrustedActionRequest(context.request);

            try {
                const user = await getCurrentUserFromCookies(context.cookies);

                if (!user) {
                    return {
                        success: false,
                        message: "Tu sesión expiró. Inicia sesión otra vez",
                    };
                }

                const isValidPassword = await comparePassword(
                    input.currentPassword,
                    user.password,
                );

                if (!isValidPassword) {
                    return {
                        success: false,
                        message: "Tu contraseña actual no es correcta",
                    };
                }

                const hashedPassword = await hashPassword(input.password);

                await db
                    .update(User)
                    .set({ password: hashedPassword })
                    .where(eq(User.id, user.id));

                await db.delete(Session).where(eq(Session.userId, user.id));
                await createSession(context.cookies, user.id);

                return {
                    success: true,
                    message: "Contraseña actualizada correctamente",
                };
            } catch {
                return {
                    success: false,
                    message: "No fue posible actualizar tu contraseña",
                };
            }
        },
    }),

    logout: defineAction({
        accept: "json",
        input: z.object({}),
        async handler(_, context) {
            ensureTrustedActionRequest(context.request);

            await clearSession(context.cookies);

            return {
                success: true,
                message: "Sesión cerrada",
            };
        },
    }),
};
