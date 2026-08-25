import { describe, expect, it } from "vitest";
import { PUNCTUM_DEFAULT_SITE_CONFIG } from "../../shared/config";
import { selectPortfolioHero, selectSiteMediaHero, restoreDefaultHero } from "../../app/admin/components/studio/hero-media";

describe("seleção de mídia do Hero no Studio", () => {
  it("seleciona uma foto enviada do celular sem depender de ensaio", () => {
    const next = selectSiteMediaHero(PUNCTUM_DEFAULT_SITE_CONFIG, "hero-phone-123");
    const hero = next.pages.home.sections.find((section) => section.type === "hero");
    if (!hero || hero.type !== "hero") throw new Error("Hero ausente");
    expect(hero.heroMedia).toEqual({ kind: "site-media", id: "hero-phone-123" });
    expect(hero.appearance.backgroundImageId).toBeNull();
    expect(hero.appearance.surface).toBe("default");
  });

  it("mantém a escolha do acervo tipada e restaura o fallback padrão", () => {
    const portfolio = selectPortfolioHero(PUNCTUM_DEFAULT_SITE_CONFIG, "photo-123");
    const portfolioHero = portfolio.pages.home.sections.find((section) => section.type === "hero");
    if (!portfolioHero || portfolioHero.type !== "hero") throw new Error("Hero ausente");
    expect(portfolioHero.heroMedia).toEqual({ kind: "portfolio-image", id: "photo-123" });
    expect(portfolioHero.appearance).toMatchObject({ surface: "photo", backgroundImageId: "photo-123" });

    const restored = restoreDefaultHero(portfolio);
    const restoredHero = restored.pages.home.sections.find((section) => section.type === "hero");
    if (!restoredHero || restoredHero.type !== "hero") throw new Error("Hero ausente");
    expect(restoredHero.heroMedia).toBeNull();
    expect(restoredHero.appearance).toMatchObject({ surface: "default", backgroundImageId: null });
  });
});
