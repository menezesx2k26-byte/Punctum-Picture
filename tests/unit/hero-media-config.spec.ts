import { describe, expect, it } from "vitest";
import { PUNCTUM_DEFAULT_SITE_CONFIG, siteConfigSchema } from "../../shared/config";

function configWithHeroMedia(heroMedia: unknown) {
  const config = structuredClone(PUNCTUM_DEFAULT_SITE_CONFIG) as typeof PUNCTUM_DEFAULT_SITE_CONFIG & {
    pages: {
      home: {
        sections: Array<Record<string, unknown>>;
      };
    };
  };
  const hero = config.pages.home.sections.find((section) => section.type === "hero");
  if (!hero) throw new Error("Hero default ausente");
  hero.heroMedia = heroMedia;
  return config;
}

describe("referência de mídia do Hero", () => {
  it("aceita mídia do site sem depender de ensaio", () => {
    const result = siteConfigSchema.safeParse(
      configWithHeroMedia({ kind: "site-media", id: "hero-1" }),
    );
    expect(result.success).toBe(true);
  });

  it("aceita referência legada tipada para foto publicada", () => {
    const result = siteConfigSchema.safeParse(
      configWithHeroMedia({ kind: "portfolio-image", id: "static-p001" }),
    );
    expect(result.success).toBe(true);
  });

  it("rejeita tipo livre de mídia do Hero", () => {
    const result = siteConfigSchema.safeParse(
      configWithHeroMedia({ kind: "remote-url", id: "https://evil.example/a.jpg" }),
    );
    expect(result.success).toBe(false);
  });
});
