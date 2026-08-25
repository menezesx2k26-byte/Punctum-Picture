import { env } from "cloudflare:workers";
import { describe, expect, it } from "vitest";

describe("assets estáticos usados pelos testes de mídia", () => {
  it("expõe p001 e p005 pelo binding ASSETS", async () => {
    const p001 = await env.ASSETS.fetch(new Request("http://localhost:8787/photos/p001.jpg"));
    const p005 = await env.ASSETS.fetch(new Request("http://localhost:8787/photos/p005.jpg"));
    expect({ p001: p001.status, p005: p005.status }).toEqual({ p001: 200, p005: 200 });
  });
});
