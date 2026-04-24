import type { ActionAPIContext } from "astro:actions";
import { ActionError } from "astro:actions";

export function ensureAuth(context: ActionAPIContext) {
    if (!context.locals.currentUser) {
        throw new ActionError({
            code: "UNAUTHORIZED",
            message:
                "Acceso denegado: Solo el propietario puede realizar esta acción.",
        });
    }
}

const getAllowedOrigins = (request: Request) => {
    const allowed = new Set<string>([new URL(request.url).origin]);

    const appUrl = process.env.APP_URL;
    const siteUrl = process.env.SITE_URL;

    const extras = [appUrl, siteUrl].filter(Boolean) as string[];

    for (const value of extras) {
        try {
            allowed.add(new URL(value).origin);
        } catch {
            continue;
        }
    }

    return allowed;
};

const extractSourceOrigin = (request: Request) => {
    const origin = request.headers.get("origin");

    if (origin) {
        return origin;
    }

    const referer = request.headers.get("referer");

    if (!referer) {
        return null;
    }

    try {
        return new URL(referer).origin;
    } catch {
        return null;
    }
};

export function ensureTrustedActionRequest(request: Request) {
    const fetchSite = request.headers.get("sec-fetch-site");

    if (fetchSite && !["same-origin", "same-site", "none"].includes(fetchSite)) {
        throw new ActionError({
            code: "FORBIDDEN",
            message: "Solicitud bloqueada por política de seguridad.",
        });
    }

    const sourceOrigin = extractSourceOrigin(request);

    if (!sourceOrigin) {
        return;
    }

    const allowedOrigins = getAllowedOrigins(request);

    if (!allowedOrigins.has(sourceOrigin)) {
        throw new ActionError({
            code: "FORBIDDEN",
            message: "Origen de solicitud no permitido.",
        });
    }
}
