import { env, exports } from "cloudflare:workers";
import { beforeAll, describe, expect, it } from "vitest";
import siteMediaMigration from "../../migrations/0008_site_media.sql?raw";

async function applySql(sql: string) {
  if (!env.DB) throw new Error("Binding DB ausente no teste");
  for (const statement of sql.split(";").map((value) => value.trim()).filter(Boolean)) {
    await env.DB.prepare(statement).run();
  }
}

function jsonRequest(path: string, method: string, body?: unknown) {
  return new Request(`http://localhost:8787${path}`, {
    method,
    headers: { "Content-Type": "application/json", Origin: "http://localhost:8787" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

describe("mídia independente do Hero", () => {
  beforeAll(async () => applySql(siteMediaMigration));

  it("cria um envio de Hero sem albumId e lista a mídia no Studio", async () => {
    const response = await exports.default.fetch(jsonRequest("/admin/api/site-media/intents", "POST", {
      filename: "hero-celular.jpg",
      mimeType: "image/jpeg",
      sizeBytes: 2_000_000,
      role: "hero",
    }));
    expect(response.status).toBe(201);
    const body = await response.json() as {
      media: { id: string; role: string; status: string };
      uploadUrl: string;
      requiredHeaders: Record<string, string>;
      albumId?: string;
    };
    expect(body.albumId).toBeUndefined();
    expect(body.media).toMatchObject({ role: "hero", status: "pending" });
    expect(body.uploadUrl).toContain(`/admin/api/site-media/${body.media.id}/direct`);
    expect(body.requiredHeaders["Content-Type"]).toBe("image/jpeg");

    const list = await exports.default.fetch("http://localhost:8787/admin/api/site-media?role=hero");
    expect(list.status).toBe(200);
    const listed = await list.json() as { media: Array<{ id: string; role: string }> };
    expect(listed.media.some((item) => item.id === body.media.id && item.role === "hero")).toBe(true);
  });

  it("rejeita tipo inválido e arquivo acima de 25 MiB", async () => {
    const invalidType = await exports.default.fetch(jsonRequest("/admin/api/site-media/intents", "POST", {
      filename: "hero.gif", mimeType: "image/gif", sizeBytes: 1000, role: "hero",
    }));
    expect(invalidType.status).toBe(400);

    const tooLarge = await exports.default.fetch(jsonRequest("/admin/api/site-media/intents", "POST", {
      filename: "hero.jpg", mimeType: "image/jpeg", sizeBytes: 26_214_401, role: "hero",
    }));
    expect(tooLarge.status).toBe(400);
  });
});
