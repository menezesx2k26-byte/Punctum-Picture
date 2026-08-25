import { siteConfigSchema, type SiteConfig } from "../../../../shared/config";

function cloneWithHero(config: SiteConfig) {
  const next = structuredClone(config);
  const hero = next.pages.home.sections.find((section) => section.type === "hero");
  if (!hero || hero.type !== "hero") {
    throw new Error("Hero da página inicial não encontrado.");
  }
  return { next, hero };
}

export function selectSiteMediaHero(config: SiteConfig, mediaId: string): SiteConfig {
  const { next, hero } = cloneWithHero(config);
  hero.heroMedia = { kind: "site-media", id: mediaId };
  hero.appearance.surface = "default";
  hero.appearance.backgroundImageId = null;
  return siteConfigSchema.parse(next);
}

export function selectPortfolioHero(config: SiteConfig, imageId: string): SiteConfig {
  const { next, hero } = cloneWithHero(config);
  hero.heroMedia = { kind: "portfolio-image", id: imageId };
  hero.appearance.surface = "photo";
  hero.appearance.backgroundImageId = imageId;
  return siteConfigSchema.parse(next);
}

export function restoreDefaultHero(config: SiteConfig): SiteConfig {
  const { next, hero } = cloneWithHero(config);
  hero.heroMedia = null;
  hero.appearance.surface = "default";
  hero.appearance.backgroundImageId = null;
  return siteConfigSchema.parse(next);
}
