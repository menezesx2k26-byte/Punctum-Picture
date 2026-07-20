import { envNumber, requireDb } from "../utils/env";
import { AppError } from "../utils/errors";
import { assertRateLimit } from "../utils/rate-limit";
import { json } from "../utils/response";
import { inquirySchema, parseJson } from "../utils/validation";

type PublicAlbumRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  location: string | null;
  shootDate: string | null;
  coverImageId: string | null;
  featured: number;
  publishedAt: string | null;
};

function publicAlbum(row: PublicAlbumRow) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    description: row.description,
    location: row.location,
    shootDate: row.shootDate,
    featured: Boolean(row.featured),
    publishedAt: row.publishedAt,
    coverUrl: row.coverImageId ? `/media/${row.coverImageId}/card` : null,
  };
}

async function getSite(env: Env): Promise<Response> {
  const db = requireDb(env);
  const settings = await db
    .prepare(
      `SELECT
        brand_name AS brandName,
        tagline,
        about_text AS aboutText,
        whatsapp_e164 AS whatsappE164,
        whatsapp_message AS whatsappMessage,
        instagram_url AS instagramUrl,
        contact_email AS contactEmail,
        seo_title AS seoTitle,
        seo_description AS seoDescription
      FROM site_settings WHERE id = 1`,
    )
    .first();
  return json({ site: settings }, { headers: { "Cache-Control": "public, max-age=60" } });
}

async function getCategories(env: Env): Promise<Response> {
  const db = requireDb(env);
  const result = await db
    .prepare(
      `SELECT id, name, slug, description, sort_order AS sortOrder
       FROM categories
       WHERE is_visible = 1
       ORDER BY sort_order, name`,
    )
    .all();
  return json({ categories: result.results }, { headers: { "Cache-Control": "public, max-age=60" } });
}

async function getAlbums(url: URL, env: Env): Promise<Response> {
  const db = requireDb(env);
  const category = url.searchParams.get("category");
  const featured = url.searchParams.get("featured");
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1) || 1);
  const limit = Math.min(24, Math.max(1, Number(url.searchParams.get("limit") ?? 12) || 12));
  const offset = (page - 1) * limit;

  const where = ["a.status = 'published'", "a.deleted_at IS NULL"];
  const bindings: Array<string | number> = [];
  let categoryJoin = "";
  if (category) {
    categoryJoin =
      "INNER JOIN album_categories ac ON ac.album_id = a.id INNER JOIN categories c ON c.id = ac.category_id";
    where.push("c.slug = ?");
    bindings.push(category);
  }
  if (featured === "true") {
    where.push("a.featured = 1");
  }

  const result = await db
    .prepare(
      `SELECT DISTINCT
        a.id,
        a.slug,
        a.title,
        a.subtitle,
        a.description,
        a.location,
        a.shoot_date AS shootDate,
        a.cover_image_id AS coverImageId,
        a.featured,
        a.published_at AS publishedAt
       FROM albums a
       ${categoryJoin}
       WHERE ${where.join(" AND ")}
       ORDER BY a.featured DESC, a.sort_order, a.published_at DESC
       LIMIT ? OFFSET ?`,
    )
    .bind(...bindings, limit, offset)
    .all<PublicAlbumRow>();

  return json(
    { albums: result.results.map(publicAlbum), page, limit },
    { headers: { "Cache-Control": "public, max-age=60" } },
  );
}

async function getAlbum(slug: string, env: Env): Promise<Response> {
  const db = requireDb(env);
  const album = await db
    .prepare(
      `SELECT
        id,
        slug,
        title,
        subtitle,
        description,
        location,
        shoot_date AS shootDate,
        cover_image_id AS coverImageId,
        featured,
        published_at AS publishedAt
       FROM albums
       WHERE slug = ? AND status = 'published' AND deleted_at IS NULL`,
    )
    .bind(slug)
    .first<PublicAlbumRow>();
  if (!album) {
    throw new AppError(404, "ALBUM_NOT_FOUND", "Ensaio não encontrado.");
  }

  const [imagesResult, categoriesResult] = await Promise.all([
    db
      .prepare(
        `SELECT id, alt_text AS altText, width, height, position
         FROM images
         WHERE album_id = ? AND status = 'ready' AND deleted_at IS NULL
         ORDER BY position`,
      )
      .bind(album.id)
      .all<{ id: string; altText: string | null; width: number | null; height: number | null; position: number }>(),
    db
      .prepare(
        `SELECT c.id, c.name, c.slug
         FROM categories c
         INNER JOIN album_categories ac ON ac.category_id = c.id
         WHERE ac.album_id = ? AND c.is_visible = 1
         ORDER BY c.sort_order`,
      )
      .bind(album.id)
      .all(),
  ]);

  return json(
    {
      album: {
        ...publicAlbum(album),
        categories: categoriesResult.results,
        images: imagesResult.results.map((image) => ({
          ...image,
          url: `/media/${image.id}/gallery`,
          thumbUrl: `/media/${image.id}/thumb`,
        })),
      },
    },
    { headers: { "Cache-Control": "public, max-age=60" } },
  );
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
    return json({ ok: true, service: "punctum-picture", now: new Date().toISOString() });
  }
  if (request.method === "GET" && url.pathname === "/api/public/site") {
    return getSite(env);
  }
  if (request.method === "GET" && url.pathname === "/api/public/categories") {
    return getCategories(env);
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
