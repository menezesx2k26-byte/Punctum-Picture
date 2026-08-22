import { describe, expect, it } from "vitest";
import {
  albumSeoDescription,
  buildAlbumMetadata,
  buildSiteMetadata,
} from "../../app/lib/metadata";
import {
  SITE_DEFAULTS,
  resolveSiteSettings,
  type PublicAlbum,
} from "../../shared/public-content";

function album(overrides: Partial<PublicAlbum> = {}): PublicAlbum {
  return {
    id: "album-1",
    slug: "historia-real",
    title: "História real",
    subtitle: "Um subtítulo",
    description: "Descrição editorial do ensaio.",
    location: null,
    shootDate: null,
    featured: true,
    publishedAt: "2026-08-22T00:00:00.000Z",
    seoTitle: null,
    seoDescription: null,
    coverImageId: "image-1",
    coverUrl: "/media/image-1/card",
    ogImageUrl: "/media/image-1/og",
    categories: [],
    images: [],
    ...overrides,
  };
}

describe("settings e metadata públicas", () => {
  it("centraliza defaults e prefere settings persistidas", () => {
    expect(resolveSiteSettings(null)).toEqual(SITE_DEFAULTS);
    expect(
      resolveSiteSettings({
        brandName: "Marca da Maria",
        tagline: "Olhar presente",
        aboutText: "Biografia configurada",
        whatsappE164: "554700000000",
        whatsappMessage: "Mensagem configurada",
        instagramUrl: "https://instagram.com/maria",
        contactEmail: "maria@example.com",
        seoTitle: "SEO configurado",
        seoDescription: "Descrição configurada",
      }),
    ).toMatchObject({
      brandName: "Marca da Maria",
      tagline: "Olhar presente",
      seoTitle: "SEO configurado",
    });
  });

  it("usa brandName e SEO do site na metadata global", () => {
    const metadata = buildSiteMetadata(
      { ...SITE_DEFAULTS, brandName: "Marca da Maria", seoTitle: "Título vivo" },
      "https://punctumpicture.com",
    );
    expect(metadata.applicationName).toBe("Marca da Maria");
    expect(metadata.title).toMatchObject({
      default: "Título vivo",
      template: "%s — Marca da Maria",
    });
    expect(metadata.openGraph).toMatchObject({ siteName: "Marca da Maria" });
  });

  it("prefere SEO do álbum e usa a capa dinâmica", () => {
    const metadata = buildAlbumMetadata(
      album({
        seoTitle: "Título SEO do ensaio",
        seoDescription: "Descrição SEO do ensaio",
      }),
      SITE_DEFAULTS,
    );
    expect(metadata.title).toBe("Título SEO do ensaio");
    expect(metadata.description).toBe("Descrição SEO do ensaio");
    expect(metadata.openGraph).toMatchObject({
      title: "Título SEO do ensaio",
      images: [{ url: "/media/image-1/og" }],
    });
  });

  it("deriva fallback SEO dos dados reais do álbum", () => {
    expect(albumSeoDescription(album())).toBe("Descrição editorial do ensaio.");
    expect(
      albumSeoDescription(
        album({ description: null, subtitle: null, seoDescription: null }),
      ),
    ).toBe("História real, ensaio fotográfico da Punctum Picture.");
  });
});
