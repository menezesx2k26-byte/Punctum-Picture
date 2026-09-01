import { LOCAL_SEO_LOCATIONS } from "../shared/local-seo";
import { envString, requireDb } from "./utils/env";

function xmlEscape(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function sitemap(env: Env): Promise<Response> {
  const db = requireDb(env);
  const origin = (envString(env, "PUBLIC_SITE_URL") ?? "https://punctumpicture.com").replace(
    /\/+$/,
    "",
  );
  const albums = await db
    .prepare(
      `SELECT slug, updated_at AS updatedAt
       FROM albums
       WHERE status = 'published' AND deleted_at IS NULL
       ORDER BY published_at DESC`,
    )
    .all<{ slug: string; updatedAt: string }>();
  const staticUrls = [
    { path: "/", changefreq: "weekly", priority: "1.0" },
    { path: "/portfolio", changefreq: "weekly", priority: "0.9" },
    { path: "/arquivo", changefreq: "weekly", priority: "0.9" },
    { path: "/fotografia", changefreq: "monthly", priority: "0.9" },
    ...LOCAL_SEO_LOCATIONS.map((location) => ({
      path: `/fotografia/${location.slug}`,
      changefreq: "monthly",
      priority: "0.8",
    })),
    { path: "/contato", changefreq: "monthly", priority: "0.8" },
  ];
  const urls = [
    ...staticUrls.map(
      (entry) =>
        `<url><loc>${xmlEscape(`${origin}${entry.path}`)}</loc><changefreq>${entry.changefreq}</changefreq><priority>${entry.priority}</priority></url>`,
    ),
    ...albums.results.map(
      (album) =>
        `<url><loc>${xmlEscape(`${origin}/ensaios/${album.slug}`)}</loc><lastmod>${xmlEscape(album.updatedAt)}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`,
    ),
  ];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`,
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}

export function robots(env: Env): Response {
  const origin = (envString(env, "PUBLIC_SITE_URL") ?? "https://punctumpicture.com").replace(
    /\/+$/,
    "",
  );
  return new Response(
    `User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: ${origin}/sitemap.xml\n`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=86400",
      },
    },
  );
}
