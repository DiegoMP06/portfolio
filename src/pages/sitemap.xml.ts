import type { APIRoute } from "astro";
import { db, eq, Project, Status } from "astro:db";

const escapeXml = (value: string) =>
    value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&apos;");

export const GET: APIRoute = async ({ site }) => {
    if (!site) {
        return new Response("Missing `site` configuration", { status: 500 });
    }

    const baseUrl = site.toString().replace(/\/$/, "");
    const now = new Date().toISOString();

    const projects = await db
        .select({
            slug: Project.slug,
            createdAt: Project.createdAt,
            updatedAt: Project.updatedAt,
        })
        .from(Project)
        .innerJoin(Status, eq(Project.statusId, Status.id))
        .where(eq(Status.name, "Publicado"))
        .all();

    const staticEntries = [
        `<url><loc>${baseUrl}/</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
    ];

    const projectEntries = projects.map((project) => {
        const lastmod = (project.updatedAt ?? project.createdAt).toISOString();
        return `<url><loc>${baseUrl}/projects/${escapeXml(project.slug)}</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`;
    });

    const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...staticEntries, ...projectEntries].join("\n")}\n</urlset>`;

    return new Response(body, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
        },
    });
};
