import { env, exports } from "cloudflare:workers";
import { beforeAll, describe, expect, it } from "vitest";
import initMigration from "../../migrations/0001_init.sql?raw";
import settingsSeed from "../../migrations/0002_seed_settings.sql?raw";
import operationsMigration from "../../migrations/0003_operations.sql?raw";
import whatsappMigration from "../../migrations/0004_whatsapp_contact.sql?raw";
import foundationMigration from "../../migrations/0005_foundation_reconcile.sql?raw";
import editorialMigration from "../../migrations/0006_editorial_personality.sql?raw";
import versionedConfigMigration from "../../migrations/0007_site_config_versions.sql?raw";
import siteMediaMigration from "../../migrations/0008_site_media.sql?raw";

async function applySql(sql: string) {
  if (!env.DB) throw new Error("Binding DB ausente no teste");
  for (const statement of sql.split(";").map((item) => item.trim()).filter(Boolean)) {
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

describe("mídia independente do Hero", () => {
  beforeAll(async () => {
    await applySql(initMigration);
    await applySql(settingsSeed);
    await applySql(operationsMigration);
    await applySql(whatsappMigration);
    await applySql(foundationMigration);
    await applySql(editorialMigration);
    await applySql(versionedConfigMigration);
    await applySql(siteMediaMigration);
  });

  it("cria, envia, finaliza e lista Hero sem albumId", async () => {
    if (!env.ASSETS) throw new Error("Binding ASSETS ausente");
    const source = await env.ASSETS.fetch(
      new Request("http://localhost:8787/images/hero-maria.webp"),
    );
    expect(source.status).toBe(200);
    const bytes = await source.arrayBuffer();
    expect(bytes.byteLength).toBeGreaterThan(0);

    const beforeAlbums = await exports.default.fetch("http://localhost:8787/admin/api/albums");
    const beforeAlbumBody = (await beforeAlbums.json()) as { albums: unknown[] };

    const intentResponse = await exports.default.fetch(
      jsonRequest("/admin/api/site-media/intents", "POST", {
        role: "hero",
        filename: "hero-do-celular.webp",
        mimeType: "image/webp",
        sizeBytes: bytes.byteLength,
      }),
    );
    expect(intentResponse.status).toBe(201);
    const intent = (await intentResponse.json()) as {
      media: { id: string; role: "hero"; status: "pending" };
      uploadUrl: string;
      requiredHeaders: Record<string, string>;
    };
    expect(intent.media).toMatchObject({ role: "hero", status: "pending" });
    expect(intent).not.toHaveProperty("albumId");

    const upload = await exports.default.fetch(
      new Request(intent.uploadUrl, {
        method: "PUT",
        headers: {
          Origin: "http://localhost:8787",
          ...intent.requiredHeaders,
        },
        body: bytes,
      }),
    );
    expect(upload.status).toBe(200);

    const complete = await exports.default.fetch(
      jsonRequest(`/admin/api/site-media/${intent.media.id}/complete`, "POST", {}),
    );
    expect(complete.status).toBe(200);
    const completed = (await complete.json()) as {
      media: { id: string; status: string; width: number; height: number; url: string };
    };
    expect(completed.media).toMatchObject({
      id: intent.media.id,
      status: "ready",
      width: 3840,
      height: 2160,
    });
    expect(completed.media.url).toContain(intent.media.id);

    const list = await exports.default.fetch("http://localhost:8787/admin/api/site-media?role=hero");
    expect(list.status).toBe(200);
    const listed = (await list.json()) as { media: Array<{ id: string; status: string }> };
    expect(listed.media).toContainEqual(expect.objectContaining({ id: intent.media.id, status: "ready" }));

    const afterAlbums = await exports.default.fetch("http://localhost:8787/admin/api/albums");
    const afterAlbumBody = (await afterAlbums.json()) as { albums: unknown[] };
    expect(afterAlbumBody.albums).toHaveLength(beforeAlbumBody.albums.length);
  });

  it("rejeita MIME não suportado e arquivo grande antes de criar mídia", async () => {
    const badMime = await exports.default.fetch(
      jsonRequest("/admin/api/site-media/intents", "POST", {
        role: "hero",
        filename: "hero.gif",
        mimeType: "image/gif",
        sizeBytes: 1024,
      }),
    );
    expect(badMime.status).toBe(400);

    const tooLarge = await exports.default.fetch(
      jsonRequest("/admin/api/site-media/intents", "POST", {
        role: "hero",
        filename: "hero.webp",
        mimeType: "image/webp",
        sizeBytes: 26_214_401,
      }),
    );
    expect(tooLarge.status).toBe(400);
  });
});
