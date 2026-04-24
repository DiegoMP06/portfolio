import { z } from "astro/zod";
import { defineAction } from "astro:actions";
import { ensureTrustedActionRequest } from "../lib/actions";
import { nullToEmptyString } from "../lib/utils";
import { sendContactEmail } from "../lib/mailer";

export const contact = {
    send: defineAction({
        accept: "json",
        input: z.object({
            name: z.preprocess(
                nullToEmptyString,
                z.string().min(1, { message: "El nombre es requerido" }),
            ),
            email: z.preprocess(
                nullToEmptyString,
                z.email("El correo electrónico no es válido"),
            ),
            subject: z.preprocess(nullToEmptyString, z.string().optional()),
            message: z.preprocess(
                nullToEmptyString,
                z.string().min(1, { message: "El mensaje es requerido" }),
            ),
        }),
        async handler(input, context) {
            ensureTrustedActionRequest(context.request);

            try {
                const { subject } = input;

                await sendContactEmail({ ...input, subject: subject || "" });

                return { success: true, message: "Mensaje enviado" };
            } catch {
                return {
                    success: false,
                    message: "No fue posible enviar el mensaje",
                };
            }
        },
    }),
};
