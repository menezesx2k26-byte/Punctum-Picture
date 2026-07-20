export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function uniqueAlbumSlug(db: D1Database, title: string): Promise<string> {
  const base = slugify(title) || "ensaio";
  let candidate = base;
  for (let attempt = 1; attempt <= 20; attempt += 1) {
    const existing = await db
      .prepare("SELECT id FROM albums WHERE slug = ? LIMIT 1")
      .bind(candidate)
      .first<{ id: string }>();
    if (!existing) {
      return candidate;
    }
    candidate = `${base}-${attempt + 1}`;
  }
  return `${base}-${crypto.randomUUID().slice(0, 8)}`;
}
