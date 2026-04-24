import { defineMiddleware } from "astro:middleware";
import { getCurrentUserFromCookies } from "./lib/auth";

const PRIVATE_ROUTES = new Set(["/settings", "/projects", "/projects/create"]);

const normalizePathname = (pathname: string) => {
    if (pathname === "/") {
        return pathname;
    }

    return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
};

const isPrivatePath = (pathname: string) => {
    const normalizedPath = normalizePathname(pathname);

    if (PRIVATE_ROUTES.has(normalizedPath)) return true;

    return /^\/projects\/[^/]+\/edit$/.test(normalizedPath);
};

const applySecurityHeaders = (response: Response) => {
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set(
        "Permissions-Policy",
        "camera=(), microphone=(), geolocation=()",
    );

    response.headers.set(
        "Content-Security-Policy",
        [
            "default-src 'self'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
            "object-src 'none'",
            "img-src 'self' data: https: https://res.cloudinary.com",
            "font-src 'self' https://fonts.gstatic.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "script-src 'self' 'unsafe-inline' https://upload-widget.cloudinary.com https://widget.cloudinary.com",
            "connect-src 'self' https: https://api.cloudinary.com",
            "frame-src 'self' https://upload-widget.cloudinary.com https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com",
            "upgrade-insecure-requests",
        ].join("; "),
    );

    if (import.meta.env.PROD) {
        response.headers.set(
            "Strict-Transport-Security",
            "max-age=31536000; includeSubDomains; preload",
        );
    }

    return response;
};

export const onRequest = defineMiddleware(async (context, next) => {
    const { pathname } = context.url;
    const currentUser = await getCurrentUserFromCookies(context.cookies);

    if (currentUser) {
        context.locals.currentUser = {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
        };

        if (pathname.startsWith("/auth/")) {
            return applySecurityHeaders(context.redirect("/projects"));
        }
    }

    if (isPrivatePath(pathname) && !currentUser) {
        return applySecurityHeaders(context.redirect("/auth/login"));
    }

    const response = await next();
    return applySecurityHeaders(response);
});
