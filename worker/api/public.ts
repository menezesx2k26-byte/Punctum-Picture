import {
  readPublicCategories,
  readPublicSiteSettings,
  readPublicStats,
  readPublishedAlbum,
  readPublishedAlbums,
  readPublishedArchive,
} from "../../shared/public-content";
import { readPublicSiteConfig } from "../../shared/site-config-storage";
import { envNumber, requireDb } from "../utils/env";
import { AppError } from "../utils/errors";
import { assertRateLimit } from "../utils/rate-limit";
import { json } from "../utils/response";
import { inquirySchema, parseJson } from "../utils/validation";

async function getSite(env: Env): Promise<Response> {
  const db = requireDb(env);
  const site = await readPublicSiteSettings(db);
  const siteConfig = await readPublicSiteConfig(db, site);
  return json(
    { site, siteConfig },
    { headers: { "Cache-Control": "no-store" } },
  );
}

async function getCategories(env: Env): Promise<Response> {
  const categories = await readPublicCategories(requireDb(env));
  return json(
    { categories },
    { headers: { "Cache-Control": "public, max-age=60" } },
  );
}

async function getStats(env: Env): Promise<Response> {
  const stats = await readPublicStats(requireDb(env));
  return json({ stats }, { headers: { "Cache-Control": "no-store" } });
}

async function getArchive(env: Env): Promise<Response> {
  const images = await readPublishedArchive(requireDb(env));
  return json({ images }, { headers: { "Cache-Control": "no-store" } });
}

async function getAlbums(url: URL, env: Env): Promise<Response> {
  const category = url.searchParams.get("category");
  const featured = url.searchParams.get("featured") === "true";
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1) || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number(url.searchParams.get("limit") ?? 12) || 12),
  );
  const result = await readPublishedAlbums(requireDb(env), {
    category,
    featured,
    page,
    limit,
  });
  return json(result, { headers: { "Cache-Control": "no-store" } });
}

async function getAlbum(slug: string, env: Env): Promise<Response> {
  const album = await readPublishedAlbum(requireDb(env), slug);
  if (!album) {
    throw new AppError(404, "ALBUM_NOT_FOUND", "Ensaio não encontrado.");
  }
  return json({ album }, { headers: { "Cache-Control": "no-store" } });
}

async function createInquiry(request: Request, env: Env): Promise<Response> {
  const db = requireDb(env);
  await assertRateLimit(
    request,
    db,
    "public-inquiry",
    envNumber(env, "CONTACT_RATE_LIMIT_MAX", 5),
    envNumber(env, "CONTACT_RATE_LIMIT_WINDOW_SECONDS", 3600),
  );
  const input = await parseJson(request, inquirySchema);
  if (input.website) {
    return json({ ok: true, inquiryId: crypto.randomUUID() }, { status: 201 });
  }

  const id = crypto.randomUUID();
  await db
    .prepare(
      `INSERT INTO inquiries (
        id, name, email, phone, instagram, service, desired_date, message, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)`,
    )
    .bind(
      id,
      input.name,
      input.email || null,
      input.phone || null,
      input.instagram || null,
      input.service || null,
      input.desiredDate || null,
      input.message,
      new Date().toISOString(),
    )
    .run();
  return json({ ok: true, inquiryId: id }, { status: 201 });
}

export async function handlePublicApi(
  request: Request,
  url: URL,
  env: Env,
): Promise<Response | null> {
  if (request.method === "GET" && url.pathname === "/api/health") {
    return json({
      ok: true,
      service: "punctum-picture",
      now: new Date().toISOString(),
    });
  }
  if (request.method === "GET" && url.pathname === "/api/public/site") {
    return getSite(env);
  }
  if (request.method === "GET" && url.pathname === "/api/public/categories") {
    return getCategories(env);
  }
  if (request.method === "GET" && url.pathname === "/api/public/stats") {
    return getStats(env);
  }
  if (request.method === "GET" && url.pathname === "/api/public/archive") {
    return getArchive(env);
  }
  if (request.method === "GET" && url.pathname === "/api/public/albums") {
    return getAlbums(url, env);
  }
  const albumMatch = url.pathname.match(/^\/api\/public\/albums\/([^/]+)$/);
  if (request.method === "GET" && albumMatch) {
    return getAlbum(decodeURIComponent(albumMatch[1]), env);
  }
  if (request.method === "POST" && url.pathname === "/api/public/inquiries") {
    return createInquiry(request, env);
  }
  return null;
}
