import { env, exports } from "cloudflare:workers";
import { beforeAll, describe, expect, it } from "vitest";
import appMigration from "../../drizzle/0000_grey_swordsman.sql?raw";
import portfolioSeed from "../../drizzle/0001_seed_portfolio.sql?raw";
import credentialsMigration from "../../drizzle/0002_wonderful_wither.sql?raw";

async function applySql(sql: string) {
  if (!env.DB) throw new Error("Binding DB ausente no teste");
  const statements = sql
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);
  for (const statement of statements) {
    await env.DB.prepare(statement).run();
  }
}

function jsonRequest(path: string, method: string, body?: unknown) {
  return new Request(`http://localhost:8787${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Origin: "http://localhost:8787",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

describe("Worker Punctum Picture", () => {
  beforeAll(async () => {
    await applySql(appMigration);
    await applySql(portfolioSeed);
    await applySql(credentialsMigration);
  });

  it("responde o health check e dados públicos", async () => {
    const health = await exports.default.fetch("http://localhost:8787/api/health");
    expect(health.status).toBe(200);
    expect(await health.json()).toMatchObject({ ok: true, service: "punctum-picture" });

    const site = await exports.default.fetch("http://localhost:8787/api/public/site");
    expect(site.status).toBe(200);
    expect(await site.json()).toMatchObject({
      site: { brandName: "Punctum Picture" },
    });
  });

  it("disponibiliza todo o acervo existente no banco administrativo", async () => {
    if (!env.DB) throw new Error("Binding DB ausente");
    const totals = await env.DB.prepare(
      `SELECT
        (SELECT COUNT(*) FROM albums WHERE deleted_at IS NULL) AS albums,
        (SELECT COUNT(*) FROM images WHERE deleted_at IS NULL) AS images`,
    ).first<{ albums: number; images: number }>();
    expect(totals).toEqual({ albums: 14, images: 113 });

    const publicAlbums = await exports.default.fetch(
      "http://localhost:8787/api/public/albums?limit=24",
    );
    expect(publicAlbums.status).toBe(200);
    const body = (await publicAlbums.json()) as {
      albums: Array<{
        slug: string;
        categories: Array<{ id: string; name: string; slug: string }>;
      }>;
    };
    expect(body.albums).toHaveLength(13);
    const rites = body.albums.find((album) => album.slug === "ritos-de-luz");
    expect(rites?.categories.map((category) => category.slug)).toEqual([
      "documental",
    ]);

    const updateCategory = await exports.default.fetch(
      jsonRequest("/admin/api/albums/static-ritos-de-luz", "PATCH", {
        categoryIds: ["portfolio-musica"],
      }),
    );
    expect(updateCategory.status).toBe(200);

    const refreshed = await exports.default.fetch(
      "http://localhost:8787/api/public/albums?limit=100",
    );
    const refreshedBody = (await refreshed.json()) as typeof body;
    expect(
      refreshedBody.albums
        .find((album) => album.slug === "ritos-de-luz")
        ?.categories.map((category) => category.slug),
    ).toEqual(["musica"]);

    const stats = await exports.default.fetch("http://localhost:8787/api/public/stats");
    expect(stats.status).toBe(200);
    expect(await stats.json()).toMatchObject({
      stats: { photoCount: 112, albumCount: 13, categoryCount: 7 },
    });

    const archive = await exports.default.fetch("http://localhost:8787/api/public/archive");
    expect(archive.status).toBe(200);
    const archiveBody = (await archive.json()) as {
      images: Array<{
        id: string;
        albumSlug: string;
        categories: Array<{ slug: string }>;
      }>;
    };
    expect(archiveBody.images).toHaveLength(112);
    expect(archiveBody.images.every((image) => image.albumSlug)).toBe(true);
  });

  it("aceita contato e neutraliza honeypot", async () => {
    const honeypot = await exports.default.fetch(
      jsonRequest("/api/public/inquiries", "POST", {
        name: "Robô",
        message: "Mensagem que não deve ser armazenada.",
        website: "https://spam.example",
      }),
    );
    expect(honeypot.status).toBe(201);

    const valid = await exports.default.fetch(
      jsonRequest("/api/public/inquiries", "POST", {
        name: "Cliente Exemplo",
        email: "cliente@exemplo.com",
        message: "Quero orçamento para um ensaio externo.",
      }),
    );
    expect(valid.status).toBe(201);
  });

  it("executa o fluxo essencial de álbum, upload, capa, reorder e exclusão", async () => {
    const create = await exports.default.fetch(
      jsonRequest("/admin/api/albums", "POST", { title: "Ensaio de teste" }),
    );
    expect(create.status).toBe(201);
    const created = (await create.json()) as { album: { id: string } };
    const albumId = created.album.id;

    const blockedPublish = await exports.default.fetch(
      jsonRequest(`/admin/api/albums/${albumId}/publish`, "POST"),
    );
    expect(blockedPublish.status).toBe(409);

    const bytes = new Uint8Array([1, 2, 3, 4]);
    const intentResponse = await exports.default.fetch(
      jsonRequest("/admin/api/uploads/intents", "POST", {
        albumId,
        filename: "teste.jpg",
        mimeType: "image/jpeg",
        sizeBytes: bytes.byteLength,
      }),
    );
    expect(intentResponse.status).toBe(201);
    const intent = (await intentResponse.json()) as {
      intentId: string;
      imageId: string;
      uploadUrl: string;
    };

    const upload = await exports.default.fetch(
      new Request(intent.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "image/jpeg",
          Origin: "http://localhost:8787",
        },
        body: bytes,
      }),
    );
    expect(upload.status).toBe(200);

    const complete = await exports.default.fetch(
      jsonRequest(`/admin/api/uploads/${intent.intentId}/complete`, "POST", {}),
    );
    expect(complete.status).toBe(200);

    const cover = await exports.default.fetch(
      jsonRequest(`/admin/api/albums/${albumId}/cover`, "POST", {
        imageId: intent.imageId,
      }),
    );
    expect(cover.status).toBe(200);

    const reorder = await exports.default.fetch(
      jsonRequest(`/admin/api/albums/${albumId}/reorder`, "POST", {
        imageIds: [intent.imageId],
      }),
    );
    expect(reorder.status).toBe(200);

    const publish = await exports.default.fetch(
      jsonRequest(`/admin/api/albums/${albumId}/publish`, "POST"),
    );
    expect(publish.status).toBe(200);

    const remove = await exports.default.fetch(
      jsonRequest(`/admin/api/images/${intent.imageId}`, "DELETE"),
    );
    expect(remove.status).toBe(200);

    if (!env.DB) throw new Error("Binding DB ausente");
    const album = await env.DB.prepare("SELECT cover_image_id AS cover FROM albums WHERE id = ?")
      .bind(albumId)
      .first<{ cover: string | null }>();
    expect(album?.cover).toBeNull();
  });

  it("cria sessão administrativa apenas para os e-mails permitidos", async () => {
    const login = await exports.default.fetch(
      new Request("https://example.com/admin/api/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "https://example.com",
        },
        body: JSON.stringify({
          email: "menezesx2k26@gmail.com",
          password: "test-password",
        }),
      }),
    );
    expect(login.status).toBe(200);
    const cookie = login.headers.get("set-cookie")?.split(";")[0];
    expect(cookie).toMatch(/^punctum_admin_session=/);

    const current = await exports.default.fetch(
      new Request("https://example.com/admin/api/me", {
        headers: { Cookie: cookie ?? "" },
      }),
    );
    expect(current.status).toBe(200);
    expect(await current.json()).toMatchObject({
      email: "menezesx2k26@gmail.com",
      roles: ["admin"],
    });

    const rejected = await exports.default.fetch(
      new Request("https://example.com/admin/api/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "https://example.com",
        },
        body: JSON.stringify({
          email: "outra-pessoa@example.com",
          password: "test-password",
        }),
      }),
    );
    expect(rejected.status).toBe(401);

    const change = await exports.default.fetch(
      new Request("https://example.com/admin/api/session", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Origin: "https://example.com",
          Cookie: cookie ?? "",
        },
        body: JSON.stringify({
          currentPassword: "test-password",
          newPassword: "NovaSenhaDefinitiva2026!",
        }),
      }),
    );
    expect(change.status).toBe(200);
    expect(change.headers.get("set-cookie")).toContain("Max-Age=0");

    const oldPassword = await exports.default.fetch(
      new Request("https://example.com/admin/api/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "https://example.com",
        },
        body: JSON.stringify({
          email: "menezesx2k26@gmail.com",
          password: "test-password",
        }),
      }),
    );
    expect(oldPassword.status).toBe(401);

    const definitivePassword = await exports.default.fetch(
      new Request("https://example.com/admin/api/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "https://example.com",
        },
        body: JSON.stringify({
          email: "maria.helena.ifc@gmail.com",
          password: "NovaSenhaDefinitiva2026!",
        }),
      }),
    );
    expect(definitivePassword.status).toBe(200);
  });

  it("rejeita Access inválido, preset inválido e imagem ausente", async () => {
    const access = await exports.default.fetch(
      new Request("https://punctumpicture.com/admin/api/me", {
        headers: { "cf-access-jwt-assertion": "token-invalido" },
      }),
    );
    expect(access.status).toBe(403);

    const preset = await exports.default.fetch(
      "http://localhost:8787/media/inexistente/largura-arbitraria",
    );
    expect(preset.status).toBe(400);

    const image = await exports.default.fetch(
      "http://localhost:8787/media/inexistente/thumb",
    );
    expect(image.status).toBe(404);
  });
});
