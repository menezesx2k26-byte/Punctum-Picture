// Public-facing visual assets. Keep hero metadata aligned with its regression test.
// This file is part of the production deploy path; hero changes must ship with matching tests.
// Hero master is stored as a verified 3840x2160 WebP before production deployment.
const PUBLIC_VISUAL_ASSETS = {
  logo: {
    src: "/logo-punctum-transparent.png",
    alt: "",
    width: 1254,
    height: 1254,
  },
  hero: {
    src: "/images/hero-maria.webp",
    alt: "Fotógrafa em primeiro plano nas arquibancadas de um estádio",
    width: 3840,
    height: 2160,
  },
} as const;

const HERO_OBJECT_POSITIONS = {
  desktop: "45% 42%",
  mobile: "60% 38%",
} as const;

const HERO_MOBILE_STAGE_HEIGHT = "50svh" as const;

export type PublicVisualAssetRole = keyof typeof PUBLIC_VISUAL_ASSETS;
export type HeroViewport = keyof typeof HERO_OBJECT_POSITIONS;

export function getPublicVisualAsset<Role extends PublicVisualAssetRole>(
  role: Role,
): (typeof PUBLIC_VISUAL_ASSETS)[Role] {
  return PUBLIC_VISUAL_ASSETS[role];
}

export function getHeroObjectPosition<Viewport extends HeroViewport>(
  viewport: Viewport,
): (typeof HERO_OBJECT_POSITIONS)[Viewport] {
  return HERO_OBJECT_POSITIONS[viewport];
}

export function getHeroMobileStageHeight(): typeof HERO_MOBILE_STAGE_HEIGHT {
  return HERO_MOBILE_STAGE_HEIGHT;
}

export function getSiteHeaderClassName(dark: boolean): string {
  return dark
    ? "site-header dark site-header-transparent"
    : "site-header";
}
