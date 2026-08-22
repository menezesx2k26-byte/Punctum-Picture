export type PublicSiteSettings = {
  brandName: string;
  tagline: string;
  aboutText: string;
  whatsappE164: string;
  whatsappMessage: string;
  instagramUrl: string | null;
  contactEmail: string | null;
  seoTitle: string;
  seoDescription: string;
};

export const SITE_DEFAULTS: PublicSiteSettings = {
  brandName: "Punctum Picture",
  tagline: "Fotografia de presença, gesto e movimento.",
  aboutText:
    "O trabalho de Maria Helena se aproxima sem invadir. Busca a textura dos lugares, a verdade dos gestos e o instante em que uma pessoa deixa de posar para simplesmente estar.",
  whatsappE164: "554797821657",
  whatsappMessage:
    "Olá Maria! vim pelo seu site, tenho interesse no seu trabalho.",
  instagramUrl: null,
  contactEmail: null,
  seoTitle: "Punctum Picture — fotografia autoral",
  seoDescription:
    "Fotografias de Maria Helena que preservam presença, gesto e movimento. Conheça o arquivo vivo da Punctum Picture.",
};

export type PublicCategory = {
  id: string;
  name: string;
  slug: string;
};

export type PublicAlbumSummary = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  location: string | null;
  shootDate: string | null;
  featured: boolean;
  publishedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  coverImageId: string | null;
  coverUrl: string | null;
  ogImageUrl: string | null;
  categories: PublicCategory[];
};

export type PublicAlbumImage = {
  id: string;
  altText: string | null;
  width: number | null;
  height: number | null;
  position: number;
  url: string;
  thumbUrl: string;
};

export type PublicAlbum = PublicAlbumSummary & {
  images: PublicAlbumImage[];
};

export type PublicArchiveImage = {
  id: string;
  altText: string | null;
  width: number | null;
  height: number | null;
  albumSlug: string;
  albumTitle: string;
  categories: PublicCategory[];
  url: string;
  thumbUrl: string;
};

export type PublicStats = {
  photoCount: number;
  albumCount: number;
  categoryCount: number;
};

type SiteSettingsRow = {
  brandName: string | null;
  tagline: string | null;
  aboutText: string | null;
  whatsappE164: string | null;
  whatsappMessage: string | null;
  instagramUrl: string | null;
  contactEmail: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

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
  seoTitle: string | null;
  seoDescription: string | null;
  categoriesJson?: string;
};

type ArchiveImageRow = {
  id: string;
  altText: string | null;
  width: number | null;
  height: number | null;
  albumSlug: string;
  albumTitle: string;
  categoriesJson: string;
};

function configuredText(value: string | null | undefined, fallback: string): string {
  const normalized = value?.trim();
  if (!normalized || normalized.startsWith("UNSPECIFIED")) return fallback;
  return normalized;
}

function optionalText(value: string | null | undefined): string | null {
  const normalized = value?.trim();
  if (!normalized || normalized.startsWith("UNSPECIFIED")) return null;
  return normalized;
}

export function resolveSiteSettings(
  row: SiteSettingsRow | null | undefined,
): PublicSiteSettings {
  return {
    brandName: configuredText(row?.brandName, SITE_DEFAULTS.brandName),
    tagline: configuredText(row?.tagline, SITE_DEFAULTS.tagline),
    aboutText: configuredText(row?.aboutText, SITE_DEFAULTS.aboutText),
    whatsappE164: configuredText(
      row?.whatsappE164,
      SITE_DEFAULTS.whatsappE164,
    ),
    whatsappMessage: configuredText(
      row?.whatsappMessage,
      SITE_DEFAULTS.whatsappMessage,
    ),
    instagramUrl: optionalText(row?.instagramUrl),
    contactEmail: optionalText(row?.contactEmail),
    seoTitle: configuredText(row?.seoTitle, SITE_DEFAULTS.seoTitle),
    seoDescription: configuredText(
      row?.seoDescription,
      SITE_DEFAULTS.seoDescription,
    ),
  };
}

function parseCategories(value: string | undefined): PublicCategory[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is PublicCategory =>
        typeof entry === "object" &&
        entry !== null &&
        typeof Reflect.get(entry, "id") === "string" &&
        typeof Reflect.get(entry, "name") === "string" &&
        typeof Reflect.get(entry, "slug") === "string",
    );
  } catch {
    return [];
  }
}

function albumFromRow(row: PublicAlbumRow): PublicAlbumSummary {
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
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    coverImageId: row.coverImageId,
    coverUrl: row.coverImageId ? `/media/${row.coverImageId}/card` : null,
    ogImageUrl: row.coverImageId ? `/media/${row.coverImageId}/og` : null,
    categories: parseCategories(row.categoriesJson),
  };
}

const PUBLIC_ALBUM_SELECT = `
  SELECT
    a.id,
    a.slug,
    a.title,
    a.subtitle,
    a.description,
    a.location,
    a.shoot_date AS shootDate,
    a.cover_image_id AS coverImageId,
    a.featured,
    a.published_at AS publishedAt,
    a.seo_title AS seoTitle,
    a.seo_description AS seoDescription,
    COALESCE((
      SELECT json_group_array(
        json_object(
          'id', ordered_categories.id,
          'name', ordered_categories.name,
          'slug', ordered_categories.slug
        )
      )
      FROM (
        SELECT category.id, category.name, category.slug
        FROM album_categories album_category
        INNER JOIN categories category ON category.id = album_category.category_id
        WHERE album_category.album_id = a.id AND category.is_visible = 1
        ORDER BY category.sort_order, category.name
      ) ordered_categories
    ), '[]') AS categoriesJson
  FROM albums a`;

export async function readPublicSiteSettings(
  db: D1Database,
): Promise<PublicSiteSettings> {
  const row = await db
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
    .first<SiteSettingsRow>();
  return resolveSiteSettings(row);
}

export async function readPublicCategories(
  db: D1Database,
): Promise<Array<PublicCategory & { description: string | null; sortOrder: number }>> {
  const result = await db
    .prepare(
      `SELECT id, name, slug, description, sort_order AS sortOrder
       FROM categories
       WHERE is_visible = 1
       ORDER BY sort_order, name`,
    )
    .all<PublicCategory & { description: string | null; sortOrder: number }>();
  return result.results;
}

export async function readPublishedAlbums(
  db: D1Database,
  options: {
    category?: string | null;
    featured?: boolean;
    page?: number;
    limit?: number;
  } = {},
): Promise<{ albums: PublicAlbumSummary[]; page: number; limit: number }> {
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.min(100, Math.max(1, options.limit ?? 12));
  const offset = (page - 1) * limit;
  const where = [
    "a.status = 'published'",
    "a.deleted_at IS NULL",
    `EXISTS (
      SELECT 1 FROM images cover
      WHERE cover.id = a.cover_image_id
        AND cover.album_id = a.id
        AND cover.status = 'ready'
        AND cover.deleted_at IS NULL
    )`,
  ];
  const bindings: Array<string | number> = [];
  let categoryJoin = "";

  if (options.category) {
    categoryJoin =
      "INNER JOIN album_categories filter_ac ON filter_ac.album_id = a.id INNER JOIN categories filter_category ON filter_category.id = filter_ac.category_id";
    where.push("filter_category.slug = ?", "filter_category.is_visible = 1");
    bindings.push(options.category);
  }
  if (options.featured) where.push("a.featured = 1");

  const result = await db
    .prepare(
      `${PUBLIC_ALBUM_SELECT}
       ${categoryJoin}
       WHERE ${where.join(" AND ")}
       ORDER BY a.featured DESC, a.sort_order, a.published_at DESC
       LIMIT ? OFFSET ?`,
    )
    .bind(...bindings, limit, offset)
    .all<PublicAlbumRow>();

  return { albums: result.results.map(albumFromRow), page, limit };
}

export async function readPublishedAlbum(
  db: D1Database,
  slug: string,
): Promise<PublicAlbum | null> {
  const row = await db
    .prepare(
      `${PUBLIC_ALBUM_SELECT}
       WHERE a.slug = ?
         AND a.status = 'published'
         AND a.deleted_at IS NULL
         AND EXISTS (
           SELECT 1 FROM images cover
           WHERE cover.id = a.cover_image_id
             AND cover.album_id = a.id
             AND cover.status = 'ready'
             AND cover.deleted_at IS NULL
         )`,
    )
    .bind(slug)
    .first<PublicAlbumRow>();
  if (!row) return null;

  const images = await db
    .prepare(
      `SELECT id, alt_text AS altText, width, height, position
       FROM images
       WHERE album_id = ? AND status = 'ready' AND deleted_at IS NULL
       ORDER BY position, created_at`,
    )
    .bind(row.id)
    .all<{
      id: string;
      altText: string | null;
      width: number | null;
      height: number | null;
      position: number;
    }>();

  return {
    ...albumFromRow(row),
    images: images.results.map((image) => ({
      ...image,
      url: `/media/${image.id}/gallery`,
      thumbUrl: `/media/${image.id}/thumb`,
    })),
  };
}

const PUBLIC_ARCHIVE_SELECT = `
  SELECT
    image.id,
    image.alt_text AS altText,
    image.width,
    image.height,
    album.slug AS albumSlug,
    album.title AS albumTitle,
    COALESCE((
      SELECT json_group_array(
        json_object(
          'id', ordered_categories.id,
          'name', ordered_categories.name,
          'slug', ordered_categories.slug
        )
      )
      FROM (
        SELECT category.id, category.name, category.slug
        FROM album_categories album_category
        INNER JOIN categories category ON category.id = album_category.category_id
        WHERE album_category.album_id = album.id AND category.is_visible = 1
        ORDER BY category.sort_order, category.name
      ) ordered_categories
    ), '[]') AS categoriesJson
  FROM images image
  INNER JOIN albums album ON album.id = image.album_id`;

function archiveImageFromRow(row: ArchiveImageRow): PublicArchiveImage {
  return {
    id: row.id,
    altText: row.altText,
    width: row.width,
    height: row.height,
    albumSlug: row.albumSlug,
    albumTitle: row.albumTitle,
    categories: parseCategories(row.categoriesJson),
    url: `/media/${row.id}/gallery`,
    thumbUrl: `/media/${row.id}/card`,
  };
}

export async function readPublishedArchive(
  db: D1Database,
): Promise<PublicArchiveImage[]> {
  const result = await db
    .prepare(
      `${PUBLIC_ARCHIVE_SELECT}
       WHERE image.status = 'ready'
         AND image.deleted_at IS NULL
         AND album.status = 'published'
         AND album.deleted_at IS NULL
       ORDER BY album.featured DESC, album.sort_order, album.published_at DESC,
         image.position, image.created_at`,
    )
    .all<ArchiveImageRow>();
  return result.results.map(archiveImageFromRow);
}

export async function readPublishedImagesById(
  db: D1Database,
  imageIds: readonly string[],
): Promise<PublicArchiveImage[]> {
  if (!imageIds.length) return [];
  const placeholders = imageIds.map(() => "?").join(",");
  const result = await db
    .prepare(
      `${PUBLIC_ARCHIVE_SELECT}
       WHERE image.id IN (${placeholders})
         AND image.status = 'ready'
         AND image.deleted_at IS NULL
         AND album.status = 'published'
         AND album.deleted_at IS NULL`,
    )
    .bind(...imageIds)
    .all<ArchiveImageRow>();
  const byId = new Map(
    result.results.map((row) => [row.id, archiveImageFromRow(row)]),
  );
  return imageIds.flatMap((id) => {
    const image = byId.get(id);
    return image ? [image] : [];
  });
}

export async function readPublicStats(db: D1Database): Promise<PublicStats> {
  const stats = await db
    .prepare(
      `SELECT
        (SELECT COUNT(*)
         FROM images image
         INNER JOIN albums album ON album.id = image.album_id
         WHERE image.status = 'ready'
           AND image.deleted_at IS NULL
           AND album.status = 'published'
           AND album.deleted_at IS NULL) AS photoCount,
        (SELECT COUNT(*)
         FROM albums album
         WHERE album.status = 'published' AND album.deleted_at IS NULL) AS albumCount,
        (SELECT COUNT(DISTINCT category.id)
         FROM categories category
         INNER JOIN album_categories album_category ON album_category.category_id = category.id
         INNER JOIN albums album ON album.id = album_category.album_id
         WHERE category.is_visible = 1
           AND album.status = 'published'
           AND album.deleted_at IS NULL) AS categoryCount`,
    )
    .first<PublicStats>();
  return stats ?? { photoCount: 0, albumCount: 0, categoryCount: 0 };
}
