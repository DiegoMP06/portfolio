import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
    const baseUrl = site?.toString().replace(/\/$/, "") ?? "";
    const sitemapUrl = baseUrl ? `${baseUrl}/sitemap.xml` : "/sitemap.xml";

    const body = [
        `User-agent: *`,
        `Allow: /`,
        `Disallow: /auth/`,
        `Disallow: /settings`,
        `Sitemap: ${sitemapUrl}`,
    ].join("\n");

    return new Response(body, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
        },
    });
};
