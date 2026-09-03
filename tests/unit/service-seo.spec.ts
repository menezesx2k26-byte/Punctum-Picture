import { describe, expect, it } from "vitest";
import {
  SERVICE_SEO_SERVICES,
  matchesServiceSeoAlbum,
  serviceSeoBySlug,
} from "../../shared/service-seo";

const album = (slug: string, categories: string[]) => ({
  slug,
  categories: categories.map((categorySlug) => ({
    id: `cat-${categorySlug}`,
    name: categorySlug,
    slug: categorySlug,
  })),
});

describe("service SEO", () => {
  it("mantém seis serviços com slugs estáveis", () => {
    expect(SERVICE_SEO_SERVICES.map((service) => service.slug)).toEqual([
      "retratos",
      "eventos",
      "musica-e-shows",
      "fotografia-esportiva",
      "familias",
      "fotografia-documental",
    ]);
  });

  it("encontra serviço pelo slug e rejeita slug desconhecido", () => {
    expect(serviceSeoBySlug("musica-e-shows")?.name).toBe("Música e shows");
    expect(serviceSeoBySlug("servico-inexistente")).toBeNull();
  });

  it("relaciona serviços de categoria apenas a álbuns realmente compatíveis", () => {
    const retratos = serviceSeoBySlug("retratos");
    expect(retratos).not.toBeNull();
    expect(matchesServiceSeoAlbum(album("cinema-de-domingo", ["retrato"]), retratos!)).toBe(true);
    expect(matchesServiceSeoAlbum(album("corpo-em-jogo", ["esporte"]), retratos!)).toBe(false);
  });

  it("limita Eventos aos trabalhos explicitamente sustentados pelo portfólio", () => {
    const eventos = serviceSeoBySlug("eventos");
    expect(eventos).not.toBeNull();
    expect(matchesServiceSeoAlbum(album("pequenas-celebracoes", ["familia"]), eventos!)).toBe(true);
    expect(matchesServiceSeoAlbum(album("palco-aceso", ["musica"]), eventos!)).toBe(true);
    expect(matchesServiceSeoAlbum(album("entre-nos", ["documental"]), eventos!)).toBe(true);
    expect(matchesServiceSeoAlbum(album("trabalho-generico", ["documental"]), eventos!)).toBe(false);
  });
});


describe("service SEO content contract", () => {
  it("mantém metadata única dentro das faixas do baseline SEO", () => {
    const titles = SERVICE_SEO_SERVICES.map((service) => service.seoTitle);
    const descriptions = SERVICE_SEO_SERVICES.map((service) => service.seoDescription);
    expect(new Set(titles).size).toBe(SERVICE_SEO_SERVICES.length);
    expect(new Set(descriptions).size).toBe(SERVICE_SEO_SERVICES.length);

    for (const service of SERVICE_SEO_SERVICES) {
      const renderedTitle = `${service.seoTitle} — Punctum Picture`;
      expect(renderedTitle.length).toBeGreaterThanOrEqual(50);
      expect(renderedTitle.length).toBeLessThanOrEqual(60);
      expect(service.seoDescription.length).toBeGreaterThanOrEqual(150);
      expect(service.seoDescription.length).toBeLessThanOrEqual(160);
    }
  });

  it("mantém conteúdo e imagem específicos por serviço", () => {
    for (const service of SERVICE_SEO_SERVICES) {
      expect(service.lead.length).toBeGreaterThan(90);
      expect(service.detail.length).toBeGreaterThan(120);
      expect(service.image).toMatch(/^\/photos\/p\d{3}\.jpg$/);
      expect(service.serviceType.length).toBeGreaterThan(5);
    }
  });
});
